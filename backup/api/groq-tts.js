// /api/groq-tts.js — Vercel Serverless: Orpheus TTS via Groq
// Converts text to speech using canopylabs/orpheus-v1-english
// Returns WAV audio binary

const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3
].filter(Boolean);

let activeKeyIndex = 0;
function getKey() { return GROQ_KEYS[activeKeyIndex] || GROQ_KEYS[0]; }
function nextKey() { activeKeyIndex = (activeKeyIndex + 1) % GROQ_KEYS.length; return getKey(); }

const VALID_VOICES = ['autumn', 'diana', 'hannah', 'austin', 'daniel', 'troy'];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text, voice } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });

    const selectedVoice = VALID_VOICES.includes(voice) ? voice : 'hannah';

    // Orpheus has 200 char limit per request — truncate if needed
    const cleanText = text.slice(0, 195);

    let apiKey = getKey();

    let ttsRes = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'canopylabs/orpheus-v1-english',
        input: cleanText,
        voice: selectedVoice,
        response_format: 'wav'
      })
    });

    // Retry on rate limit with next key
    if (!ttsRes.ok && ttsRes.status === 429) {
      apiKey = nextKey();
      ttsRes = await fetch('https://api.groq.com/openai/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'canopylabs/orpheus-v1-english',
          input: cleanText,
          voice: selectedVoice,
          response_format: 'wav'
        })
      });
    }

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.error('TTS error:', ttsRes.status, errText);
      return res.status(ttsRes.status).json({ error: 'TTS generation failed' });
    }

    // Pipe audio binary back to client
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'no-cache');

    const reader = ttsRes.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    } catch (e) { console.error('TTS stream error:', e); }

    res.end();
  } catch (err) {
    console.error('TTS handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
