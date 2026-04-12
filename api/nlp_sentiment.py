#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
                    NEYDRA ULTRA NLP BACKEND
================================================================================
        Real-Time Global Sentiment Analysis Engine
                  "RED PROTOCOL ACTIVATED"
================================================================================

REQUIREMENTS:
- pip install fastapi uvicorn feedparser vaderSentiment pandas

USAGE:
1. Run: python ultra_nlp_backend.py
2. Open RT-NLP-SA.html in browser
================================================================================
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import feedparser
import time
import re
import asyncio
import threading
import random

# NLP Specific Imports
try:
    from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
    NLP_AVAILABLE = True
except ImportError:
    NLP_AVAILABLE = False
    print("[WARNING] vaderSentiment not installed. Run: pip install vaderSentiment")

# ============================================================================
#                         CONFIGURATION
# ============================================================================

SYSTEM_NAME = "NEYDRA ULTRA NLP"
VERSION = "1.0.0"

# RSS Feeds for Global Financial News
RSS_FEEDS = [
    "https://www.reuters.com/feed/business",
    "https://www.investing.com/rss/news.rss",
    "https://www.forexlive.com/feed",
    "https://www.coindesk.com/arc/outboundfeeds/rss/",
    "https://cointelegraph.com/rss",
    "https://www.cnbc.com/id/10000664/device/rss/rss.html",
    "https://www.zerohedge.com/fullrss2.xml",
    "https://www.bloomberg.com/feed/podcast/bloomberg-markets.xml",
]

# Keywords to track for the "KEYWORDS" panel
TRACKED_KEYWORDS = [
    "FED", "ECB", "INFLATION", "RATES", "GOLD", "XAUUSD", "BITCOIN", "BTC",
    "OIL", "WAR", "GDP", "EMPLOYMENT", "JOBS", "RECESSION", "RALLY", "CRASH",
    "BULL", "BEAR", "CHINA", "USA", "DOLLAR", "EUR", "YEN", "YIELD"
]

# ============================================================================
#                         DATA STRUCTURES
# ============================================================================

class NewsItem(BaseModel):
    datetime: str
    source: str
    title: str
    score: float
    ticker: str
    keywords: List[str]

class UltraData(BaseModel):
    global_sentiment: float
    market_regime: str
    volatility_forecast: float
    latest_headlines: List[NewsItem]

# ============================================================================
#                         FASTAPI APPLICATION
# ============================================================================

app = FastAPI(title=SYSTEM_NAME, version=VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL STATE ---
state = {
    "global_sentiment": 0.0,
    "market_regime": "INITIALIZING",
    "volatility_forecast": 0.0,
    "latest_headlines": [],
    "last_update": 0
}

# Initialize NLP Analyzer
analyzer = SentimentIntensityAnalyzer() if NLP_AVAILABLE else None

# ============================================================================
#                         NLP ENGINE CORE
# ============================================================================

def clean_html(raw_html):
    """Remove HTML tags from string"""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

def analyze_sentiment(text):
    """Analyze text sentiment using VADER"""
    if not NLP_AVAILABLE:
        # Fallback random if library missing
        return random.uniform(-1, 1)
    
    vs = analyzer.polarity_scores(text)
    # VADER compound score ranges from -1 (Most Negative) to +1 (Most Positive)
    return vs['compound']

def extract_keywords(text):
    """Extract relevant keywords from text"""
    found_keywords = []
    text_upper = text.upper()
    for kw in TRACKED_KEYWORDS:
        if kw in text_upper:
            found_keywords.append(kw)
    return list(set(found_keywords)) # Unique keywords

def determine_market_regime(sentiment_score):
    """Determine market regime based on aggregate sentiment"""
    if sentiment_score > 0.4:
        return "EXTREME GREED"
    elif sentiment_score > 0.15:
        return "BULLISH TREND"
    elif sentiment_score > 0.05:
        return "OPTIMISM"
    elif sentiment_score < -0.4:
        return "EXTREME FEAR"
    elif sentiment_score < -0.15:
        return "BEARISH TREND"
    elif sentiment_score < -0.05:
        return "CAUTION"
    else:
        return "NEUTRAL / CONSOLIDATION"

def map_ticker(title, source):
    """Infer ticker symbol from content"""
    title_upper = title.upper()
    if "GOLD" in title_upper or "XAU" in title_upper:
        return "XAUUSD"
    if "BITCOIN" in title_upper or "BTC" in title_upper:
        return "BTCUSD"
    if "OIL" in title_upper or "CRUDE" in title_upper:
        return "USOIL"
    if "EUR" in title_upper or "EURO" in title_upper:
        return "EURUSD"
    if "STOCK" in title_upper or "S&P" in title_upper or "DOW" in title_upper:
        return "SPX500"
    if "DOLLAR" in title_upper or "DXY" in title_upper:
        return "DXY"
    if "ETHEREUM" in title_upper or "ETH" in title_upper:
        return "ETHUSD"
    
    # Default based on source type
    if "COIN" in source.upper() or "CRYPTO" in source.upper():
        return "CRYPTO"
    
    return "GLOBAL"

def process_news():
    """Fetch and process news from RSS feeds"""
    global state
    all_headlines = []
    total_sentiment = 0.0
    count = 0
    
    print(f"[{SYSTEM_NAME}] Updating news feed...")
    
    for url in RSS_FEEDS:
        try:
            feed = feedparser.parse(url)
            source_name = feed.feed.get("title", url.split("//")[1].split("/")[0])
            
            for entry in feed.entries[:10]: # Top 10 per feed
                title = entry.get("title", "No Title")
                description = entry.get("description", "")
                content = clean_html(title + " " + description)
                
                # Analyze
                score = analyze_sentiment(content)
                total_sentiment += score
                count += 1
                
                # Extract Data
                kw = extract_keywords(content)
                ticker = map_ticker(title, source_name)
                
                # Time formatting
                published = entry.get("published_parsed", entry.get("updated_parsed", None))
                if published:
                    dt = datetime(*published[:6])
                    time_str = dt.strftime("%H:%M")
                else:
                    time_str = datetime.now().strftime("%H:%M")
                
                item = {
                    "datetime": time_str,
                    "source": source_name[:20], # Truncate long names
                    "title": title[:100] + "..." if len(title) > 100 else title,
                    "score": round(score, 2),
                    "ticker": ticker,
                    "keywords": kw
                }
                all_headlines.append(item)
                
        except Exception as e:
            # Silent fail for individual feeds
            continue

    # Sort by absolute score (most impactful news first)
    all_headlines.sort(key=lambda x: abs(x['score']), reverse=True)
    
    # Calculate Global Sentiment
    if count > 0:
        avg_sentiment = total_sentiment / count
    else:
        avg_sentiment = 0.0
    
    # Determine Regime
    regime = determine_market_regime(avg_sentiment)
    
    # Simulate Volatility Forecast (Based on sentiment divergence or random for demo)
    # In real scenario, this would be ATR or VIX analysis
    volatility = round(random.uniform(-3.5, 6.5), 2) 
    if abs(avg_sentiment) > 0.3:
        volatility = round(random.uniform(4.0, 9.0), 2) # High sentiment = high vol
    
    # Update State
    state["global_sentiment"] = round(avg_sentiment, 3)
    state["market_regime"] = regime
    state["volatility_forecast"] = volatility
    state["latest_headlines"] = all_headlines[:50] # Keep top 50
    state["last_update"] = time.time()
    
    print(f"[{SYSTEM_NAME}] Processed {count} articles. Global Sentiment: {avg_sentiment:.2f}")

def background_processor():
    """Background thread to process news every 60 seconds"""
    while True:
        try:
            process_news()
        except Exception as e:
            print(f"[ERROR] Background Processor: {e}")
        time.sleep(60) # Update every minute

# Start Background Thread
threading.Thread(target=background_processor, daemon=True).start()

# ============================================================================
#                         API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    return {
        "name": SYSTEM_NAME,
        "version": VERSION,
        "status": "ONLINE",
        "nlp_engine": "VADER" if NLP_AVAILABLE else "SIMULATION"
    }

@app.get("/ultra_data", response_model=UltraData)
async def get_ultra_data():
    """Main endpoint for the NLP Dashboard"""
    return state

if __name__ == "__main__":
    print(f"\n{'='*60}")
    print(f"    Starting {SYSTEM_NAME}")
    print(f"    'We trade the news, not the price.'")
    print(f"{'='*60}\n")
    
    print("╔════════════════════════════════════════════════════════╗")
    print("║           LOCALTUNNEL CONNECTION GUIDE                 ║")
    print("╠════════════════════════════════════════════════════════╣")
    print("║ 1. Install Node.js (if not installed)                  ║")
    print("║ 2. Open NEW terminal: npx localtunnel --port 8000      ║")
    print("║ 3. Copy the URL (e.g: https://xx.loca.lt)              ║")
    print("║ 4. Paste URL in HTML Dashboard connection box.         ║")
    print("╚════════════════════════════════════════════════════════╝")
    print("\n[INFO] Starting API Server on port 8000...\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)