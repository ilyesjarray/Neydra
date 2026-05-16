import { NextRequest } from 'next/server';

const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3
].filter(Boolean) as string[];

let activeKeyIndex = 0;
function getKey() { return GROQ_KEYS[activeKeyIndex] || GROQ_KEYS[0]; }
function nextKey() { activeKeyIndex = (activeKeyIndex + 1) % GROQ_KEYS.length; return getKey(); }

const VALID_VOICES = ['autumn', 'diana', 'hannah', 'austin', 'daniel', 'troy'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voice } = body;

    if (!text) return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 });

    const selectedVoice = VALID_VOICES.includes(voice) ? voice : 'hannah';
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
      return new Response(JSON.stringify({ error: 'TTS generation failed' }), { status: ttsRes.status });
    }

    return new Response(ttsRes.body, {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('TTS handler error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
