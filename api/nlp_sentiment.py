# ==============================================================================
# NEYDRA ULTRA - REAL-TIME NLP SENTIMENT & VOLATILITY ENGINE (FIXED)
# ==============================================================================

import MetaTrader5 as mt5
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
import yfinance as yf
import talib
import time
import re
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor
import threading

# --- CONFIGURATION ---
SYSTEM_NAME = "NEYDRA ULTRA NLP"
WATCHLIST = [
    "GC=F", "CL=F", "^GSPC", "^DJI", "^IXIC", "EURUSD=X", "GBPUSD=X", "JPY=X", 
    "BTC-USD", "ETH-USD", "NVDA", "AAPL", "TSLA", "MSFT", "DX-Y.NYB"
]

BULLISH_KEYWORDS = [
    "surge", "jump", "rally", "record", "gain", "bull", "growth", "optimism", 
    "breakout", "strong", "beat", "higher", "positive", "stimulus", "buy", "upgrade"
]
BEARISH_KEYWORDS = [
    "crash", "plunge", "slump", "loss", "bear", "recession", "fear", "crisis", 
    "war", "inflation", "weak", "negative", "drop", "sell", "downgrade", "panic", "conflict"
]

app = FastAPI(title=SYSTEM_NAME)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- GLOBAL STATE ---
state = {
    "latest_headlines": [],     
    "global_sentiment": 0.0,    
    "volatility_forecast": 0.0, 
    "market_regime": "NEUTRAL",
    "last_update": 0
}

# ==========================================
# 1. NATIVE NLP ENGINE
# ==========================================

def clean_text(text):
    return re.sub(r'[^a-zA-Z\s]', '', text).lower()

def analyze_sentiment(text):
    cleaned = clean_text(text)
    words = cleaned.split()
    score = 0
    matches = []
    
    for word in words:
        if word in BULLISH_KEYWORDS:
            score += 1
            matches.append(word)
        elif word in BEARISH_KEYWORDS:
            score -= 1
            matches.append(word)
            
    if "record" in matches or "crash" in matches:
        score *= 1.5
        
    return score, matches

# ==========================================
# 2. NEWS AGGREGATOR
# ==========================================

def fetch_global_news():
    print(">>> SCANNING GLOBAL NEWS WIRE...")
    news_buffer = []
    
    for ticker in WATCHLIST:
        try:
            t = yf.Ticker(ticker)
            news = t.news
            if news:
                for item in news:
                    title = item.get('title', '')
                    provider = item.get('publisher', 'Unknown')
                    ts = item.get('providerPublishTime', 0)
                    
                    if (time.time() - ts) > 86400:
                        continue
                        
                    score, keywords = analyze_sentiment(title)
                    
                    news_buffer.append({
                        "time": ts,
                        "datetime": datetime.fromtimestamp(ts).strftime('%H:%M'),
                        "title": title,
                        "source": provider,
                        "ticker": ticker,
                        "score": score,
                        "keywords": keywords
                    })
        except Exception:
            continue
            
    news_buffer.sort(key=lambda x: x['time'], reverse=True)
    unique_news = {v['title']:v for v in news_buffer}.values()
    state["latest_headlines"] = list(unique_news)[:50]
    
    total_score = 0
    if state["latest_headlines"]:
        for i, article in enumerate(state["latest_headlines"]):
            weight = 1.0 / (i + 1) 
            total_score += article['score'] * weight
            
        normalized_score = np.clip(total_score * 20, -100, 100)
        state["global_sentiment"] = round(normalized_score, 2)
        
        if state["global_sentiment"] > 20: state["market_regime"] = "RISK ON (BULLISH)"
        elif state["global_sentiment"] < -20: state["market_regime"] = "RISK OFF (BEARISH)"
        else: state["market_regime"] = "CHOPPY / NEUTRAL"

# ==========================================
# 3. AI VOLATILITY PREDICTOR (FIXED)
# ==========================================

def train_volatility_model():
    """
    FIXED: Converts Pandas DataFrames to Numpy Arrays before passing to TA-Lib
    """
    try:
        # Download data
        data = yf.download("GC=F", period="1mo", interval="1h", progress=False)
        
        if data.empty: 
            return None, None

        # --- THE FIX IS HERE ---
        # 1. Force conversion to simple 1D Numpy Arrays of type float
        # .values converts to numpy, .flatten() ensures it is 1D (not a list of lists)
        high_prices = data['High'].values.flatten().astype(float)
        low_prices = data['Low'].values.flatten().astype(float)
        close_prices = data['Close'].values.flatten().astype(float)
        
        # 2. Calculate Indicators using the clean Numpy Arrays
        # We assign it back to the DataFrame for the ML model
        data['ATR'] = talib.ATR(high_prices, low_prices, close_prices, timeperiod=14)
        
        # Calculate Returns using Pandas (this is safe)
        data['Returns'] = data['Close'].pct_change()
        
        # Target: Next hour's ATR
        data['Volatility_Target'] = data['ATR'].shift(-1) 
        
        data.dropna(inplace=True)
        
        if len(data) < 10:
            return None, None

        X = data[['Returns', 'ATR', 'Volume']]
        y = data['Volatility_Target']
        
        model = RandomForestRegressor(n_estimators=50, random_state=42)
        model.fit(X, y)
        
        return model, data.tail(1)

    except Exception as e:
        print(f"Warning: Volatility Model Training Failed temporarily ({e})")
        return None, None

def predict_volatility(model, last_row):
    if model:
        try:
            prediction = model.predict(last_row[['Returns', 'ATR', 'Volume']])
            current_atr = last_row['ATR'].iloc[0]
            pred_atr = prediction[0]
            
            if current_atr == 0: return # Avoid division by zero
            
            pct_change = ((pred_atr - current_atr) / current_atr) * 100
            state["volatility_forecast"] = round(pct_change, 2)
        except Exception as e:
            print(f"Prediction Error: {e}")

# ==========================================
# 4. MAIN LOOP & API
# ==========================================

def backend_loop():
    # Initial Model Training
    vol_model, last_data = train_volatility_model()
    
    while True:
        try:
            fetch_global_news()
            
            if vol_model and last_data is not None:
                predict_volatility(vol_model, last_data)
            else:
                # Retry training if it failed initially
                vol_model, last_data = train_volatility_model()
                
            state["last_update"] = time.time()
            time.sleep(300) 
            
        except Exception as e:
            print(f"Loop Error: {e}")
            time.sleep(60)

threading.Thread(target=backend_loop, daemon=True).start()

@app.get("/ultra_data")
def get_data():
    return state

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
