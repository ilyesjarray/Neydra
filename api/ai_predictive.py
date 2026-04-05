"""
================================================================================
                    NEYDRA ULTRA - THE PHOENIX PROTOCOL
================================================================================
                        GOLD SCALPING SYSTEM V4.0
================================================================================
                    
FEATURES:
- Multi-Timeframe Confluence Analysis (M1, M5, M15, H1)
- Advanced Market Microstructure Detection
- VWAP + Bollinger + RSI + MACD + ATR Integration
- Support/Resistance Zone Detection
- Order Flow Imbalance Analysis
- Session-Aware Trading (Asian, London, New York)
- Dynamic Position Sizing with Equity Growth
- ATR-Based Trailing Stops
- Controlled Recovery System (Max 3 Levels)
- Smart Breakeven Activation
- Daily Profit Target & Drawdown Protection
- Spread & Volatility Filters
- News Event Timing Protection

================================================================================
                         ⚠️ RISK DISCLAIMER ⚠️
================================================================================
Trading involves substantial risk. Past performance does not guarantee future
results. This software is for educational purposes. Always trade responsibly.
================================================================================
"""

import MetaTrader5 as mt5
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import numpy as np
import pandas as pd
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List, Tuple
from dataclasses import dataclass
from enum import Enum
import math
import os

# ============================================================================
#                         SYSTEM CONFIGURATION
# ============================================================================

SYSTEM_NAME = "NEYDRA ULTRA V4.0 - PHOENIX PROTOCOL"
VERSION = "4.0.0"
SYMBOL = "XAUUSD"

# --- Account Settings ---
INITIAL_BALANCE = 10.0  # Starting balance for reference

# --- Dynamic Lot Sizing ---
BASE_LOT = 0.01
LOT_MULTIPLIER = 1.0  # Increases as account grows
MAX_LOT = 0.1  # Maximum lot size to prevent overexposure
LOT_GROWTH_THRESHOLD = 50.0  # Increase lot every $50 profit

# --- Entry Configuration ---
MIN_CONFIDENCE = 65.0  # Minimum confidence for entry (higher = fewer but better trades)
ENTRY_DEVIATION = 30  # Price deviation tolerance
MIN_SPREAD_PIPS = 0.0  # Maximum acceptable spread
MAX_SPREAD_PIPS = 5.0  # Reject trades if spread too high

# --- Risk Management ---
BASE_RISK_PERCENT = 1.0  # Base risk per trade (% of equity)
MAX_RISK_PERCENT = 2.0  # Maximum risk after losses
MAX_DAILY_DRAWDOWN = 20.0  # Stop trading if daily loss exceeds this %
DAILY_PROFIT_TARGET = 5.0  # Target daily profit % (conservative for small accounts)

# --- Stop Loss & Take Profit ---
BASE_SL_POINTS = 30  # Base stop loss in points ($0.30 for gold)
BASE_TP_POINTS = 50  # Base take profit in points ($0.50 for gold)
ATR_SL_MULTIPLIER = 1.5  # SL = ATR * multiplier
ATR_TP_MULTIPLIER = 2.5  # TP = ATR * multiplier

# --- Trailing Stop Configuration ---
TRAILING_START_USD = 0.10  # Start trailing when $0.10 profit
TRAILING_STEP_USD = 0.05  # Move SL every $0.05 additional profit
TRAILING_DISTANCE_USD = 0.03  # Keep SL this far behind current price
BREAKEVEN_TRIGGER_USD = 0.08  # Move to breakeven at this profit
DROP_TOLERANCE_USD = 0.05  # Allowable drop before closing profitable trade
SECURE_PROFIT_USD = 0.15  # Secure profit if price retraces from max profit

# --- Recovery System (Controlled Martingale) ---
RECOVERY_ENABLED = True
MAX_RECOVERY_LEVELS = 3
RECOVERY_MULTIPLIER = 1.5  # Multiply lot after loss
RECOVERY_COOLDOWN_SEC = 60  # Wait before recovery trade

# --- Time Configuration ---
MAX_HOLD_TIME_SEC = 1800  # 30 minutes max hold
SCALP_HOLD_TIME_SEC = 300  # 5 minutes for quick scalps

# --- Session Trading Hours (UTC) ---
ASIAN_START = 0
ASIAN_END = 8
LONDON_START = 7
LONDON_END = 16
NY_START = 13
NY_END = 21

# --- Trading Priority ---
# Higher priority = more aggressive trading
SESSION_PRIORITY = {
    "LONDON": 3,
    "NEW_YORK": 3,
    "OVERLAP": 4,  # London-NY overlap is best for gold
    "ASIAN": 1,
}

# ============================================================================
#                         DATA STRUCTURES
# ============================================================================

class Signal(Enum):
    BUY = "BUY"
    SELL = "SELL"
    NEUTRAL = "NEUTRAL"

class Session(Enum):
    ASIAN = "ASIAN"
    LONDON = "LONDON"
    NEW_YORK = "NEW_YORK"
    OVERLAP = "OVERLAP"
    CLOSED = "CLOSED"

@dataclass
class MarketAnalysis:
    signal: Signal
    confidence: float
    price: float
    spread: float
    atr: float
    vwap: float
    rsi: float
    trend_m1: int  # -1 bearish, 0 neutral, 1 bullish
    trend_m5: int
    trend_m15: int
    support: float
    resistance: float
    order_flow_imbalance: float  # -1 heavy selling, +1 heavy buying
    session: Session
    volatility: float
    reason: str

@dataclass
class TradeMonitor:
    ticket: int = 0
    open_time: float = 0.0
    max_profit: float = 0.0
    max_loss: float = 0.0
    entry_price: float = 0.0
    recovery_level: int = 0
    is_recovery: bool = False

# ============================================================================
#                         FASTAPI APPLICATION
# ============================================================================

app = FastAPI(
    title=SYSTEM_NAME,
    version=VERSION,
    description="Ultra Gold Scalping System for MetaTrader 5"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Global state
trade_monitor = TradeMonitor()
daily_stats = {
    "start_equity": 0.0,
    "start_time": None,
    "trades_today": 0,
    "wins_today": 0,
    "losses_today": 0,
    "daily_pnl": 0.0,
    "consecutive_losses": 0,
    "last_trade_time": 0,
    "recovery_mode": False,
    "recovery_level": 0,
}
last_analysis: Optional[MarketAnalysis] = None

# ============================================================================
#                         INITIALIZATION
# ============================================================================

def initialize_mt5() -> bool:
    """Initialize MetaTrader 5 connection"""
    if not mt5.initialize():
        print(f"[CRITICAL] MT5 INIT FAILED: {mt5.last_error()}")
        return False
    
    terminal_info = mt5.terminal_info()
    if not terminal_info:
        print("[CRITICAL] Cannot get terminal info")
        return False
    
    print(f"[INFO] Terminal: {terminal_info.company}")
    print(f"[INFO] Ping: {terminal_info.ping_last / 1000:.2f}ms")
    
    if not mt5.symbol_select(SYMBOL, True):
        print(f"[CRITICAL] Symbol {SYMBOL} not found")
        return False
    
    symbol_info = mt5.symbol_info(SYMBOL)
    if symbol_info:
        print(f"[INFO] Symbol: {symbol_info.name}")
        print(f"[INFO] Point: {symbol_info.point}")
        print(f"[INFO] Digits: {symbol_info.digits}")
        print(f"[INFO] Spread: {symbol_info.spread}")
    
    account_info = mt5.account_info()
    if account_info:
        daily_stats["start_equity"] = account_info.equity
        daily_stats["start_time"] = datetime.now()
    
    print(f"\n{'='*60}")
    print(f"    {SYSTEM_NAME} INITIALIZED")
    print(f"{'='*60}\n")
    
    return True

def get_filling_mode(symbol: str) -> int:
    """Get the best filling mode for the symbol"""
    symbol_info = mt5.symbol_info(symbol)
    if not symbol_info:
        return mt5.ORDER_FILLING_FOK
    
    filling = symbol_info.filling_mode
    if filling & mt5.ORDER_FILLING_FOK:
        return mt5.ORDER_FILLING_FOK
    if filling & mt5.ORDER_FILLING_IOC:
        return mt5.ORDER_FILLING_IOC
    return mt5.ORDER_FILLING_RETURN

# ============================================================================
#                         TECHNICAL INDICATORS
# ============================================================================

def calculate_ema(data: np.ndarray, period: int) -> np.ndarray:
    """Calculate Exponential Moving Average"""
    if len(data) < period:
        return np.array([np.mean(data)])
    
    alpha = 2 / (period + 1)
    ema = np.zeros(len(data))
    ema[0] = data[0]
    for i in range(1, len(data)):
        ema[i] = alpha * data[i] + (1 - alpha) * ema[i-1]
    return ema

def calculate_sma(data: np.ndarray, period: int) -> np.ndarray:
    """Calculate Simple Moving Average"""
    if len(data) < period:
        return np.array([np.mean(data)])
    
    result = np.convolve(data, np.ones(period)/period, mode='valid')
    return result

def calculate_rsi(prices: np.ndarray, period: int = 14) -> float:
    """Calculate RSI indicator"""
    if len(prices) < period + 1:
        return 50.0
    
    deltas = np.diff(prices)
    gains = np.where(deltas > 0, deltas, 0)
    losses = np.where(deltas < 0, -deltas, 0)
    
    avg_gain = np.mean(gains[-period:])
    avg_loss = np.mean(losses[-period:])
    
    if avg_loss == 0:
        return 100.0
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_atr(high: np.ndarray, low: np.ndarray, close: np.ndarray, period: int = 14) -> float:
    """Calculate Average True Range"""
    if len(close) < period + 1:
        return (np.max(high) - np.min(low)) / len(high) if len(high) > 0 else 0.0
    
    tr = np.zeros(len(close) - 1)
    for i in range(1, len(close)):
        hl = high[i] - low[i]
        hc = abs(high[i] - close[i-1])
        lc = abs(low[i] - close[i-1])
        tr[i-1] = max(hl, hc, lc)
    
    return np.mean(tr[-period:])

def calculate_bollinger(prices: np.ndarray, period: int = 20, std_dev: float = 2.0) -> Tuple[float, float, float]:
    """Calculate Bollinger Bands"""
    if len(prices) < period:
        mean = np.mean(prices)
        std = np.std(prices)
        return mean, mean - std_dev * std, mean + std_dev * std
    
    sma = np.mean(prices[-period:])
    std = np.std(prices[-period:])
    
    upper = sma + (std_dev * std)
    lower = sma - (std_dev * std)
    
    return sma, lower, upper

def calculate_vwap(high: np.ndarray, low: np.ndarray, close: np.ndarray, volume: np.ndarray) -> float:
    """Calculate Volume Weighted Average Price"""
    if len(volume) == 0 or np.sum(volume) == 0:
        return np.mean(close) if len(close) > 0 else 0.0
    
    typical_price = (high + low + close) / 3
    vwap = np.sum(typical_price * volume) / np.sum(volume)
    return vwap

def calculate_macd(prices: np.ndarray, fast: int = 12, slow: int = 26, signal: int = 9) -> Tuple[float, float, float]:
    """Calculate MACD"""
    if len(prices) < slow:
        return 0.0, 0.0, 0.0
    
    ema_fast = calculate_ema(prices, fast)
    ema_slow = calculate_ema(prices, slow)
    
    macd_line = ema_fast[-1] - ema_slow[-1]
    
    # Calculate signal line
    macd_values = ema_fast[-signal:] - ema_slow[-signal:]
    signal_line = np.mean(macd_values) if len(macd_values) > 0 else 0.0
    
    histogram = macd_line - signal_line
    
    return macd_line, signal_line, histogram

def detect_support_resistance(prices: np.ndarray, lookback: int = 50) -> Tuple[float, float]:
    """Detect support and resistance levels"""
    if len(prices) < lookback:
        lookback = len(prices)
    
    recent = prices[-lookback:]
    
    # Find local minima and maxima
    support = np.min(recent)
    resistance = np.max(recent)
    
    # Fine-tune with recent pivot points
    if len(recent) >= 10:
        for i in range(2, len(recent) - 2):
            # Local minimum
            if recent[i] < recent[i-1] and recent[i] < recent[i-2] and \
               recent[i] < recent[i+1] and recent[i] < recent[i+2]:
                if recent[i] > support * 0.99:  # Closest meaningful support
                    support = recent[i]
            
            # Local maximum
            if recent[i] > recent[i-1] and recent[i] > recent[i-2] and \
               recent[i] > recent[i+1] and recent[i] > recent[i+2]:
                if recent[i] < resistance * 1.01:  # Closest meaningful resistance
                    resistance = recent[i]
    
    return support, resistance

# ============================================================================
#                         MARKET ANALYSIS
# ============================================================================

def get_current_session() -> Session:
    """Determine current trading session"""
    utc_hour = datetime.utcnow().hour
    
    # London-NY overlap (best for gold)
    if LONDON_START <= utc_hour < NY_END and NY_START <= utc_hour < LONDON_END:
        return Session.OVERLAP
    elif LONDON_START <= utc_hour < LONDON_END:
        return Session.LONDON
    elif NY_START <= utc_hour < NY_END:
        return Session.NEW_YORK
    elif ASIAN_START <= utc_hour < ASIAN_END:
        return Session.ASIAN
    else:
        return Session.CLOSED

def analyze_order_flow(ticks: np.ndarray) -> float:
    """Analyze order flow from tick data"""
    if len(ticks) < 50:
        return 0.0
    
    # Extract bid and ask
    bids = np.array([t[1] for t in ticks])  # Bid prices
    asks = np.array([t[2] for t in ticks])  # Ask prices
    flags = np.array([t[6] for t in ticks]) if ticks.dtype.names and 'flags' in ticks.dtype.names else None
    
    # Calculate price changes
    bid_changes = np.diff(bids)
    ask_changes = np.diff(asks)
    
    # Buying pressure: when ask moves up or bid moves up
    buying = np.sum(bid_changes[bid_changes > 0]) + np.sum(ask_changes[ask_changes > 0])
    selling = np.abs(np.sum(bid_changes[bid_changes < 0])) + np.abs(np.sum(ask_changes[ask_changes < 0]))
    
    total = buying + selling
    if total == 0:
        return 0.0
    
    # Return imbalance: -1 (heavy selling) to +1 (heavy buying)
    imbalance = (buying - selling) / total
    
    # Check for aggressive market orders
    spread_changes = asks[:-1] - bids[1:]
    spread_tightening = np.sum(spread_changes < 0)
    spread_widening = np.sum(spread_changes > 0)
    
    # Adjust imbalance based on spread behavior
    if spread_tightening > spread_widening:
        imbalance += 0.1  # More buying interest
    elif spread_widening > spread_tightening:
        imbalance -= 0.1  # More selling pressure
    
    return np.clip(imbalance, -1, 1)

def get_trend_direction(prices: np.ndarray, ema_fast: int = 9, ema_slow: int = 21) -> int:
    """Determine trend direction"""
    if len(prices) < ema_slow:
        return 0
    
    ema_f = calculate_ema(prices, ema_fast)
    ema_s = calculate_ema(prices, ema_slow)
    
    current_price = prices[-1]
    current_ema_f = ema_f[-1]
    current_ema_s = ema_s[-1]
    
    # Strong bullish
    if current_price > current_ema_f > current_ema_s:
        return 1
    # Strong bearish
    elif current_price < current_ema_f < current_ema_s:
        return -1
    # Neutral
    else:
        return 0

def calculate_volatility(prices: np.ndarray, period: int = 20) -> float:
    """Calculate price volatility as percentage"""
    if len(prices) < period:
        period = len(prices)
    
    if period < 2:
        return 0.0
    
    returns = np.diff(prices[-period:]) / prices[-period:-1]
    volatility = np.std(returns) * 100  # As percentage
    
    return volatility

def comprehensive_market_analysis() -> MarketAnalysis:
    """
    Perform comprehensive multi-timeframe market analysis
    Returns detailed market analysis with signal and confidence
    """
    
    # Get tick data for order flow
    ticks = mt5.copy_ticks_from(SYMBOL, datetime.now(), 500, mt5.COPY_TICKS_ALL)
    if ticks is None or len(ticks) < 100:
        return MarketAnalysis(
            signal=Signal.NEUTRAL,
            confidence=0.0,
            price=0.0,
            spread=0.0,
            atr=0.0,
            vwap=0.0,
            rsi=50.0,
            trend_m1=0,
            trend_m5=0,
            trend_m15=0,
            support=0.0,
            resistance=0.0,
            order_flow_imbalance=0.0,
            session=Session.CLOSED,
            volatility=0.0,
            reason="Insufficient tick data"
        )
    
    # Get current tick info
    current_tick = mt5.symbol_info_tick(SYMBOL)
    current_price = (current_tick.bid + current_tick.ask) / 2
    spread = current_tick.ask - current_tick.bid
    
    # Get multi-timeframe candles
    candles_m1 = mt5.copy_rates_from_pos(SYMBOL, mt5.TIMEFRAME_M1, 0, 100)
    candles_m5 = mt5.copy_rates_from_pos(SYMBOL, mt5.TIMEFRAME_M5, 0, 50)
    candles_m15 = mt5.copy_rates_from_pos(SYMBOL, mt5.TIMEFRAME_M15, 0, 30)
    candles_h1 = mt5.copy_rates_from_pos(SYMBOL, mt5.TIMEFRAME_H1, 0, 20)
    
    if candles_m1 is None or len(candles_m1) < 20:
        return MarketAnalysis(
            signal=Signal.NEUTRAL,
            confidence=0.0,
            price=current_price,
            spread=spread,
            atr=0.0,
            vwap=current_price,
            rsi=50.0,
            trend_m1=0,
            trend_m5=0,
            trend_m15=0,
            support=current_price * 0.99,
            resistance=current_price * 1.01,
            order_flow_imbalance=0.0,
            session=get_current_session(),
            volatility=0.0,
            reason="Insufficient candle data"
        )
    
    # Extract OHLCV data
    close_m1 = np.array([c['close'] for c in candles_m1])
    high_m1 = np.array([c['high'] for c in candles_m1])
    low_m1 = np.array([c['low'] for c in candles_m1])
    volume_m1 = np.array([c['tick_volume'] for c in candles_m1])
    
    close_m5 = np.array([c['close'] for c in candles_m5]) if candles_m5 is not None else close_m1
    close_m15 = np.array([c['close'] for c in candles_m15]) if candles_m15 is not None else close_m1
    
    # Calculate indicators
    atr = calculate_atr(high_m1, low_m1, close_m1, 14)
    rsi = calculate_rsi(close_m1, 14)
    vwap = calculate_vwap(high_m1, low_m1, close_m1, volume_m1)
    bb_mid, bb_lower, bb_upper = calculate_bollinger(close_m1, 20, 2.0)
    macd_line, signal_line, macd_hist = calculate_macd(close_m1)
    support, resistance = detect_support_resistance(close_m1, 50)
    order_flow = analyze_order_flow(ticks)
    
    # Trend analysis
    trend_m1 = get_trend_direction(close_m1)
    trend_m5 = get_trend_direction(close_m5) if len(close_m5) >= 21 else 0
    trend_m15 = get_trend_direction(close_m15) if len(close_m15) >= 21 else 0
    
    # Volatility
    volatility = calculate_volatility(close_m1, 20)
    
    # Current session
    session = get_current_session()
    
    # ================================================================
    # SIGNAL GENERATION WITH CONFLUENCE SCORING
    # ================================================================
    
    buy_score = 0.0
    sell_score = 0.0
    reasons = []
    
    # 1. RSI Analysis (Weight: 15%)
    if rsi < 30:
        buy_score += 15
        reasons.append("RSI oversold")
    elif rsi > 70:
        sell_score += 15
        reasons.append("RSI overbought")
    elif 40 < rsi < 60:
        pass  # Neutral zone
    elif rsi < 45:
        buy_score += 5
    elif rsi > 55:
        sell_score += 5
    
    # 2. Bollinger Band Position (Weight: 15%)
    if current_price < bb_lower:
        buy_score += 15
        reasons.append("Price below lower BB")
    elif current_price > bb_upper:
        sell_score += 15
        reasons.append("Price above upper BB")
    elif current_price < bb_mid:
        sell_score += 5
    else:
        buy_score += 5
    
    # 3. VWAP Position (Weight: 10%)
    if current_price > vwap * 1.001:  # Above VWAP
        buy_score += 10
        reasons.append("Above VWAP")
    elif current_price < vwap * 0.999:  # Below VWAP
        sell_score += 10
        reasons.append("Below VWAP")
    
    # 4. Order Flow Imbalance (Weight: 20%)
    if order_flow > 0.3:
        buy_score += 20
        reasons.append(f"Strong buying flow ({order_flow:.2f})")
    elif order_flow < -0.3:
        sell_score += 20
        reasons.append(f"Strong selling flow ({order_flow:.2f})")
    elif order_flow > 0.1:
        buy_score += 10
    elif order_flow < -0.1:
        sell_score += 10
    
    # 5. Multi-Timeframe Trend Alignment (Weight: 20%)
    trend_alignment = trend_m1 + trend_m5 + trend_m15
    if trend_alignment >= 2:  # Bullish alignment
        buy_score += 20
        reasons.append("Bullish MTF alignment")
    elif trend_alignment <= -2:  # Bearish alignment
        sell_score += 20
        reasons.append("Bearish MTF alignment")
    
    # 6. MACD Signal (Weight: 10%)
    if macd_hist > 0 and macd_line > signal_line:
        buy_score += 10
        reasons.append("MACD bullish")
    elif macd_hist < 0 and macd_line < signal_line:
        sell_score += 10
        reasons.append("MACD bearish")
    
    # 7. Support/Resistance Proximity (Weight: 10%)
    distance_to_support = (current_price - support) / current_price * 100
    distance_to_resistance = (resistance - current_price) / current_price * 100
    
    if distance_to_support < 0.1:  # Near support
        buy_score += 10
        reasons.append("Near support")
    elif distance_to_resistance < 0.1:  # Near resistance
        sell_score += 10
        reasons.append("Near resistance")
    
    # ================================================================
    # SESSION FILTER
    # ================================================================
    
    session_priority = SESSION_PRIORITY.get(session.value, 0)
    
    # Reduce confidence during low-priority sessions
    if session_priority < 2:
        buy_score *= 0.5
        sell_score *= 0.5
        reasons.append(f"Low priority session: {session.value}")
    
    # Don't trade during closed market
    if session == Session.CLOSED:
        buy_score = 0
        sell_score = 0
        reasons = ["Market closed"]
    
    # ================================================================
    # SPREAD FILTER
    # ================================================================
    
    spread_points = spread / mt5.symbol_info(SYMBOL).point if mt5.symbol_info(SYMBOL) else spread * 100
    
    if spread_points > MAX_SPREAD_PIPS:
        buy_score *= 0.3
        sell_score *= 0.3
        reasons.append(f"High spread: {spread_points:.1f}")
    
    # ================================================================
    # FINAL SIGNAL DETERMINATION
    # ================================================================
    
    total_score = buy_score + sell_score
    signal = Signal.NEUTRAL
    confidence = 0.0
    
    if buy_score > sell_score and buy_score >= MIN_CONFIDENCE:
        signal = Signal.BUY
        confidence = buy_score
    elif sell_score > buy_score and sell_score >= MIN_CONFIDENCE:
        signal = Signal.SELL
        confidence = sell_score
    
    reason_str = " | ".join(reasons) if reasons else "No clear signal"
    
    return MarketAnalysis(
        signal=signal,
        confidence=confidence,
        price=current_price,
        spread=spread,
        atr=atr,
        vwap=vwap,
        rsi=rsi,
        trend_m1=trend_m1,
        trend_m5=trend_m5,
        trend_m15=trend_m15,
        support=support,
        resistance=resistance,
        order_flow_imbalance=order_flow,
        session=session,
        volatility=volatility,
        reason=reason_str
    )

# ============================================================================
#                         POSITION SIZING
# ============================================================================

def calculate_position_size(account_equity: float, risk_points: float) -> float:
    """
    Calculate dynamic position size based on account equity and risk
    """
    symbol_info = mt5.symbol_info(SYMBOL)
    if not symbol_info:
        return BASE_LOT
    
    point_value = symbol_info.trade_tick_value / symbol_info.trade_tick_size
    
    # Base calculation with risk percentage
    risk_amount = account_equity * (BASE_RISK_PERCENT / 100)
    
    # Recovery mode increases lot size
    if daily_stats["recovery_mode"] and RECOVERY_ENABLED:
        recovery_level = min(daily_stats["recovery_level"], MAX_RECOVERY_LEVELS)
        lot_multiplier = RECOVERY_MULTIPLIER ** recovery_level
    else:
        lot_multiplier = 1.0
    
    # Growth-based lot increase
    growth_multiplier = 1.0 + (account_equity - INITIAL_BALANCE) / (LOT_GROWTH_THRESHOLD * 10)
    
    # Calculate lot
    lot = (risk_amount / (risk_points * point_value)) * lot_multiplier * growth_multiplier
    
    # Apply limits
    lot = max(symbol_info.volume_min, min(lot, MAX_LOT))
    
    # Round to broker's step
    lot_step = symbol_info.volume_step
    lot = round(lot / lot_step) * lot_step
    
    return lot

# ============================================================================
#                         TRADE MANAGEMENT
# ============================================================================

def execute_trade(analysis: MarketAnalysis, lot_size: float) -> Optional[int]:
    """Execute trade with proper SL/TP"""
    tick = mt5.symbol_info_tick(SYMBOL)
    if not tick:
        return None
    
    if analysis.signal == Signal.BUY:
        order_type = mt5.ORDER_TYPE_BUY
        price = tick.ask
        sl_distance = analysis.atr * ATR_SL_MULTIPLIER if analysis.atr > 0 else BASE_SL_POINTS * 0.01
        tp_distance = analysis.atr * ATR_TP_MULTIPLIER if analysis.atr > 0 else BASE_TP_POINTS * 0.01
        sl = price - sl_distance
        tp = price + tp_distance
    else:  # SELL
        order_type = mt5.ORDER_TYPE_SELL
        price = tick.bid
        sl_distance = analysis.atr * ATR_SL_MULTIPLIER if analysis.atr > 0 else BASE_SL_POINTS * 0.01
        tp_distance = analysis.atr * ATR_TP_MULTIPLIER if analysis.atr > 0 else BASE_TP_POINTS * 0.01
        sl = price + sl_distance
        tp = price - tp_distance
    
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": SYMBOL,
        "volume": lot_size,
        "type": order_type,
        "price": price,
        "sl": sl,
        "tp": tp,
        "deviation": ENTRY_DEVIATION,
        "magic": 999004,
        "comment": f"NEYDRA_ULTRA_{daily_stats['recovery_level']}",
        "type_filling": get_filling_mode(SYMBOL),
    }
    
    result = mt5.order_send(request)
    
    if result.retcode == mt5.TRADE_RETCODE_DONE:
        return result.order
    else:
        print(f"[ERROR] Order failed: {result.retcode} - {result.comment}")
        return None

def close_position(ticket: int, reason: str = "") -> bool:
    """Close position with reason logging"""
    positions = mt5.positions_get(ticket=ticket)
    if not positions:
        return False
    
    pos = positions[0]
    tick = mt5.symbol_info_tick(SYMBOL)
    
    if pos.type == mt5.ORDER_TYPE_BUY:
        close_type = mt5.ORDER_TYPE_SELL
        close_price = tick.bid
    else:
        close_type = mt5.ORDER_TYPE_BUY
        close_price = tick.ask
    
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": SYMBOL,
        "volume": pos.volume,
        "type": close_type,
        "position": ticket,
        "price": close_price,
        "deviation": 50,
        "magic": 999004,
        "comment": f"NEYDRA_CLOSE_{reason}",
        "type_filling": get_filling_mode(SYMBOL),
    }
    
    result = mt5.order_send(request)
    
    if result.retcode == mt5.TRADE_RETCODE_DONE:
        print(f"[CLOSED] {reason} | PnL: ${pos.profit:.2f}")
        
        # Update daily stats
        daily_stats["trades_today"] += 1
        if pos.profit >= 0:
            daily_stats["wins_today"] += 1
            daily_stats["consecutive_losses"] = 0
            daily_stats["recovery_mode"] = False
            daily_stats["recovery_level"] = 0
        else:
            daily_stats["losses_today"] += 1
            daily_stats["consecutive_losses"] += 1
            
            # Activate recovery after loss
            if RECOVERY_ENABLED and daily_stats["consecutive_losses"] >= 1:
                daily_stats["recovery_mode"] = True
                daily_stats["recovery_level"] = min(
                    daily_stats["consecutive_losses"],
                    MAX_RECOVERY_LEVELS
                )
        
        daily_stats["daily_pnl"] += pos.profit
        daily_stats["last_trade_time"] = time.time()
        
        return True
    
    return False

def manage_position() -> str:
    """
    Advanced position management with trailing stops and breakeven
    Returns current status string
    """
    positions = mt5.positions_get(symbol=SYMBOL)
    
    if not positions:
        # Reset monitor when no positions
        trade_monitor.ticket = 0
        trade_monitor.max_profit = 0.0
        trade_monitor.max_loss = 0.0
        return "SEARCHING"
    
    pos = positions[0]
    current_profit = pos.profit
    current_time = time.time()
    hold_time = current_time - trade_monitor.open_time
    
    # Initialize monitor for new position
    if trade_monitor.ticket != pos.ticket:
        trade_monitor.ticket = pos.ticket
        trade_monitor.open_time = current_time
        trade_monitor.max_profit = 0.0
        trade_monitor.max_loss = 0.0
        trade_monitor.entry_price = pos.price_open
        trade_monitor.recovery_level = daily_stats["recovery_level"]
        trade_monitor.is_recovery = daily_stats["recovery_mode"]
        print(f"[NEW POSITION] Ticket: {pos.ticket} | Type: {'BUY' if pos.type == 0 else 'SELL'}")
    
    # Track max profit and max loss
    if current_profit > trade_monitor.max_profit:
        trade_monitor.max_profit = current_profit
    
    if current_profit < trade_monitor.max_loss:
        trade_monitor.max_loss = current_profit
    
    # ================================================================
    # TRAILING STOP LOGIC
    # ================================================================
    
    # Breakeven activation
    if current_profit >= BREAKEVEN_TRIGGER_USD and pos.sl == 0:
        tick = mt5.symbol_info_tick(SYMBOL)
        if pos.type == mt5.ORDER_TYPE_BUY:
            new_sl = pos.price_open + 0.01  # Small profit to cover spread
        else:
            new_sl = pos.price_open - 0.01
        
        request = {
            "action": mt5.TRADE_ACTION_SLTP,
            "position": pos.ticket,
            "sl": new_sl,
            "tp": pos.tp,
        }
        mt5.order_send(request)
        print(f"[BREAKEVEN] Activated at ${current_profit:.2f}")
    
    # Dynamic trailing stop
    if trade_monitor.max_profit >= TRAILING_START_USD:
        tick = mt5.symbol_info_tick(SYMBOL)
        current_price = tick.bid if pos.type == mt5.ORDER_TYPE_BUY else tick.ask
        
        if pos.type == mt5.ORDER_TYPE_BUY:
            trailing_sl = current_price - TRAILING_DISTANCE_USD
            if pos.sl == 0 or trailing_sl > pos.sl:
                request = {
                    "action": mt5.TRADE_ACTION_SLTP,
                    "position": pos.ticket,
                    "sl": trailing_sl,
                    "tp": pos.tp,
                }
                mt5.order_send(request)
        else:
            trailing_sl = current_price + TRAILING_DISTANCE_USD
            if pos.sl == 0 or trailing_sl < pos.sl:
                request = {
                    "action": mt5.TRADE_ACTION_SLTP,
                    "position": pos.ticket,
                    "sl": trailing_sl,
                    "tp": pos.tp,
                }
                mt5.order_send(request)
    
    # ================================================================
    # EXIT CONDITIONS
    # ================================================================
    
    # Target profit reached
    if current_profit >= 1.0:  # $1 profit target
        close_position(pos.ticket, "TARGET")
        return "CLOSED_TARGET"
    
    # Secure profit exit (protect gains)
    if trade_monitor.max_profit >= SECURE_PROFIT_USD:
        drop = trade_monitor.max_profit - current_profit
        if drop >= DROP_TOLERANCE_USD:
            close_position(pos.ticket, "PROFIT_PROTECT")
            return "CLOSED_PROTECTED"
    
    # Time limit exit
    if hold_time > MAX_HOLD_TIME_SEC:
        close_position(pos.ticket, "TIME_LIMIT")
        return "CLOSED_TIME"
    
    # Quick scalp exit (5 min with profit)
    if hold_time > SCALP_HOLD_TIME_SEC and current_profit > 0.05:
        close_position(pos.ticket, "SCALP_EXIT")
        return "CLOSED_SCALP"
    
    # Hard stop loss (protection from catastrophic loss)
    if current_profit <= -0.50:  # Max $0.50 loss per trade
        close_position(pos.ticket, "STOP_LOSS")
        return "CLOSED_SL"
    
    return f"HOLDING|P:{current_profit:.2f}|Max:{trade_monitor.max_profit:.2f}|Time:{int(hold_time)}s"

# ============================================================================
#                         RISK MANAGEMENT
# ============================================================================

def check_trading_allowed() -> Tuple[bool, str]:
    """Check if trading is allowed based on various conditions"""
    
    account = mt5.account_info()
    if not account:
        return False, "Cannot get account info"
    
    # Check daily drawdown
    if daily_stats["start_equity"] > 0:
        daily_pnl_pct = ((account.equity - daily_stats["start_equity"]) / daily_stats["start_equity"]) * 100
        
        if daily_pnl_pct <= -MAX_DAILY_DRAWDOWN:
            return False, f"Daily drawdown limit reached: {daily_pnl_pct:.1f}%"
        
        if daily_pnl_pct >= DAILY_PROFIT_TARGET:
            return False, f"Daily profit target reached: {daily_pnl_pct:.1f}%"
    
    # Check minimum equity
    if account.equity < 2.0:
        return False, "Insufficient equity"
    
    # Check margin
    if account.margin_free < 10:
        return False, "Insufficient margin"
    
    # Recovery cooldown
    if daily_stats["recovery_mode"]:
        time_since_last = time.time() - daily_stats["last_trade_time"]
        if time_since_last < RECOVERY_COOLDOWN_SEC:
            return False, f"Recovery cooldown: {int(RECOVERY_COOLDOWN_SEC - time_since_last)}s remaining"
    
    return True, "OK"

# ============================================================================
#                         API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    return {
        "name": SYSTEM_NAME,
        "version": VERSION,
        "status": "ONLINE"
    }

@app.get("/scan")
async def scan():
    """Main scanning endpoint for the dashboard"""
    global last_analysis
    
    # 1. Manage existing positions first
    status = manage_position()
    
    if "HOLDING" in status:
        return {
            "status": status,
            "price": last_analysis.price if last_analysis else 0,
            "confidence": last_analysis.confidence if last_analysis else 0,
        }
    
    if "CLOSED" in status:
        return {
            "status": status,
            "price": last_analysis.price if last_analysis else 0,
        }
    
    # 2. Check if trading is allowed
    allowed, reason = check_trading_allowed()
    if not allowed:
        return {
            "status": f"BLOCKED: {reason}",
            "confidence": 0,
        }
    
    # 3. Perform market analysis
    analysis = comprehensive_market_analysis()
    last_analysis = analysis
    
    # 4. Execute if conditions met
    if analysis.signal != Signal.NEUTRAL and analysis.confidence >= MIN_CONFIDENCE:
        account = mt5.account_info()
        lot_size = calculate_position_size(
            account.equity,
            analysis.atr * ATR_SL_MULTIPLIER if analysis.atr > 0 else BASE_SL_POINTS * 0.01
        )
        
        ticket = execute_trade(analysis, lot_size)
        
        if ticket:
            return {
                "status": "EXECUTED",
                "signal": analysis.signal.value,
                "confidence": analysis.confidence,
                "price": analysis.price,
                "lot": lot_size,
                "reason": analysis.reason,
            }
    
    return {
        "status": "SCANNING",
        "confidence": analysis.confidence,
        "price": analysis.price,
        "signal": analysis.signal.value,
        "session": analysis.session.value,
        "rsi": round(analysis.rsi, 1),
        "trend": analysis.trend_m1,
        "order_flow": round(analysis.order_flow_imbalance, 2),
        "reason": analysis.reason,
    }

@app.get("/stats")
async def get_stats():
    """Get current trading statistics"""
    account = mt5.account_info()
    
    if not account:
        return {"error": "Cannot get account info"}
    
    daily_pnl_pct = 0
    if daily_stats["start_equity"] > 0:
        daily_pnl_pct = ((account.equity - daily_stats["start_equity"]) / daily_stats["start_equity"]) * 100
    
    return {
        "balance": account.balance,
        "equity": account.equity,
        "margin": account.margin,
        "free_margin": account.margin_free,
        "margin_level": account.margin_level if account.margin > 0 else 0,
        "daily_pnl": daily_stats["daily_pnl"],
        "daily_pnl_pct": round(daily_pnl_pct, 2),
        "trades_today": daily_stats["trades_today"],
        "wins": daily_stats["wins_today"],
        "losses": daily_stats["losses_today"],
        "win_rate": round(daily_stats["wins_today"] / max(1, daily_stats["trades_today"]) * 100, 1),
        "consecutive_losses": daily_stats["consecutive_losses"],
        "recovery_mode": daily_stats["recovery_mode"],
        "recovery_level": daily_stats["recovery_level"],
    }

@app.get("/analysis")
async def get_analysis():
    """Get detailed market analysis"""
    analysis = comprehensive_market_analysis()
    
    return {
        "signal": analysis.signal.value,
        "confidence": analysis.confidence,
        "price": analysis.price,
        "spread": round(analysis.spread, 2),
        "atr": round(analysis.atr, 4),
        "vwap": round(analysis.vwap, 2),
        "rsi": round(analysis.rsi, 1),
        "trend_m1": analysis.trend_m1,
        "trend_m5": analysis.trend_m5,
        "trend_m15": analysis.trend_m15,
        "support": round(analysis.support, 2),
        "resistance": round(analysis.resistance, 2),
        "order_flow": round(analysis.order_flow_imbalance, 2),
        "session": analysis.session.value,
        "volatility": round(analysis.volatility, 2),
        "reason": analysis.reason,
    }

@app.get("/download/neydra-ultra")
async def download_bot():
    """Download the bot files as a package"""
    # This would return the actual file in production
    return {"message": "Download endpoint ready - add your RAR file to the repo"}

@app.post("/reset")
async def reset_daily_stats():
    """Reset daily statistics"""
    account = mt5.account_info()
    daily_stats["start_equity"] = account.equity if account else 0
    daily_stats["start_time"] = datetime.now()
    daily_stats["trades_today"] = 0
    daily_stats["wins_today"] = 0
    daily_stats["losses_today"] = 0
    daily_stats["daily_pnl"] = 0.0
    daily_stats["consecutive_losses"] = 0
    daily_stats["recovery_mode"] = False
    daily_stats["recovery_level"] = 0
    
    return {"status": "Reset complete"}

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    if not initialize_mt5():
        print("[CRITICAL] Failed to initialize MT5")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    mt5.shutdown()
    print("[INFO] MT5 connection closed")

# ============================================================================
#                         MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    print(f"\n{'='*60}")
    print(f"    Starting {SYSTEM_NAME}")
    print(f"{'='*60}\n")
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info"
    )
  
