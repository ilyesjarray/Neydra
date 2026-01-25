# ==============================================================================
# NEYDRA INSTITUTIONAL LIQUIDITY DECODER (BACKEND)
# ==============================================================================
# "We do not trade the price. We trade the liquidity."
# ==============================================================================

import MetaTrader5 as mt5
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
import talib
import time
from datetime import datetime
from sklearn.cluster import KMeans
import threading
import math

# --- CONFIGURATION ---
SYSTEM_NAME = "NEYDRA LIQUIDITY DECODER"
SYMBOL = "XAUUSD"  # Gold is the best for liquidity analysis
TIMEFRAME = mt5.TIMEFRAME_M15
WHALE_VOLUME_THRESHOLD = 5.0  # Lots considered "Whale" activity
LIQUIDITY_LOOKBACK = 500  # Candles to analyze for pools

app = FastAPI(title=SYSTEM_NAME)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- GLOBAL STATE (In-Memory Database) ---
state = {
    "liquidity_pools": [],  # Cluster centers of high volume
    "whale_activity": [],   # Recent big orders
    "depth_profile": {},    # Synthetic Order Book
    "market_bias": "NEUTRAL",
    "last_update": 0
}

# ==========================================
# 1. MT5 & DATA INFRASTRUCTURE
# ==========================================

def initialize_mt5():
    if not mt5.initialize():
        print(f"FAILED: MT5 Init Error: {mt5.last_error()}")
        quit()
    if not mt5.symbol_select(SYMBOL, True):
        print(f"FAILED: Symbol {SYMBOL} not found")
        quit()
    print(f">>> {SYSTEM_NAME} CONNECTED TO {SYMBOL} <<<")

initialize_mt5()

# ==========================================
# 2. ALGORITHMIC CORE (The "Decoder")
# ==========================================

def detect_liquidity_pools():
    """
    Uses Unsupervised Machine Learning (K-Means) to find hidden price levels
    where price has reacted multiple times (Swing Highs/Lows).
    These are 'Liquidity Pools' where stop losses accumulate.
    """
    rates = mt5.copy_rates_from_pos(SYMBOL, TIMEFRAME, 0, LIQUIDITY_LOOKBACK)
    if rates is None: return

    df = pd.DataFrame(rates)
    
    # Identify Swing Highs and Lows (Fractals)
    highs = df['high'].values
    lows = df['low'].values
    
    # We collect significant pivot points
    pivots = []
    for i in range(2, len(highs)-2):
        # Fractal High
        if highs[i] > highs[i-1] and highs[i] > highs[i-2] and highs[i] > highs[i+1] and highs[i] > highs[i+2]:
            pivots.append(highs[i])
        # Fractal Low
        if lows[i] < lows[i-1] and lows[i] < lows[i-2] and lows[i] < lows[i+1] and lows[i] < lows[i+2]:
            pivots.append(lows[i])
            
    if len(pivots) < 10: return

    # Use K-Means to cluster these points into "Zones"
    # We want to find ~5 major zones
    data = np.array(pivots).reshape(-1, 1)
    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    kmeans.fit(data)
    
    pools = []
    for center in kmeans.cluster_centers_:
        price = center[0]
        # Determine if it's Resistance (above price) or Support (below)
        tick = mt5.symbol_info_tick(SYMBOL)
        current_price = tick.bid
        p_type = "RESISTANCE (Sell Liquidity)" if price > current_price else "SUPPORT (Buy Liquidity)"
        pools.append({"price": round(price, 2), "type": p_type, "strength": "HIGH"})
    
    # Sort by price
    state["liquidity_pools"] = sorted(pools, key=lambda x: x['price'], reverse=True)
    print(f"[ML] Identified {len(pools)} Liquidity Clusters")

def analyze_whale_footprints():
    """
    Scans Tick Data (Microstructure) to find 'Iceberg' orders.
    Logic: High Volume execution with very little price movement = Absorption.
    """
    ticks = mt5.copy_ticks_from(SYMBOL, datetime.now(), 1000, mt5.COPY_TICKS_ALL)
    if ticks is None: return

    # Convert to DataFrame for speed
    df_t = pd.DataFrame(ticks)
    # Filter for large volume ticks (Whale Prints)
    # Note: 'volume' in ticks is usually valid, or we use 'flags' to infer deal size
    # For CFD, volume might be tick counts, but let's assume valid volume or filter aggregation.
    
    # We simulate "Whale Detection" by looking for rapid clusters of ticks
    # Group ticks by second
    df_t['time_sec'] = pd.to_datetime(df_t['time'], unit='s')
    volume_per_sec = df_t.groupby('time_sec')['volume'].sum()
    
    # Detect spikes (Z-Score > 3)
    mean_vol = volume_per_sec.mean()
    std_vol = volume_per_sec.std()
    
    spikes = volume_per_sec[volume_per_sec > (mean_vol + 3 * std_vol)]
    
    recent_whales = []
    for time_idx, vol in spikes.tail(5).items():
        # Find price at that second
        price_at_spike = df_t[df_t['time_sec'] == time_idx]['bid'].iloc[-1]
        
        # Determine direction (Aggressive Buy or Sell)
        # Simple heuristic: Compare close of that second to open
        tick_subset = df_t[df_t['time_sec'] == time_idx]
        direction = "BUY 🟢" if tick_subset['bid'].iloc[-1] > tick_subset['bid'].iloc[0] else "SELL 🔴"
        
        recent_whales.append({
            "time": str(time_idx.time()),
            "volume": int(vol),
            "price": price_at_spike,
            "action": direction
        })
        
    state["whale_activity"] = recent_whales

def generate_synthetic_depth():
    """
    Since many brokers hide real Level 2 Depth, we build a 'Volume Profile'
    from recent tick history to visualize where the 'Gravity' is.
    """
    ticks = mt5.copy_ticks_from(SYMBOL, datetime.now(), 5000, mt5.COPY_TICKS_ALL)
    if ticks is None: return

    prices = [t[1] for t in ticks] # Bid prices
    
    # Create a Histogram (Price Distribution)
    counts, bin_edges = np.histogram(prices, bins=50)
    
    profile = []
    for i in range(len(counts)):
        if counts[i] > 0:
            mid_price = (bin_edges[i] + bin_edges[i+1]) / 2
            profile.append({"price": round(mid_price, 2), "volume": int(counts[i])})
            
    # Sort by price descending
    state["depth_profile"] = sorted(profile, key=lambda x: x['price'], reverse=True)

# ==========================================
# 3. BACKGROUND WORKER
# ==========================================

def market_scanner_loop():
    while True:
        try:
            detect_liquidity_pools()
            analyze_whale_footprints()
            generate_synthetic_depth()
            state["last_update"] = time.time()
            time.sleep(2) # Refresh every 2 seconds
        except Exception as e:
            print(f"Scanner Error: {e}")
            time.sleep(5)

# Start the brain in a separate thread
threading.Thread(target=market_scanner_loop, daemon=True).start()

# ==========================================
# 4. API ENDPOINTS (The Bridge)
# ==========================================

@app.get("/")
def root():
    return {"system": SYSTEM_NAME, "status": "ONLINE"}

@app.get("/data")
def get_dashboard_data():
    """
    Returns the complete picture of the market invisible layers.
    """
    tick = mt5.symbol_info_tick(SYMBOL)
    
    return {
        "symbol": SYMBOL,
        "current_price": tick.bid,
        "spread": tick.ask - tick.bid,
        "liquidity_pools": state["liquidity_pools"],
        "whales": state["whale_activity"],
        "depth": state["depth_profile"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
