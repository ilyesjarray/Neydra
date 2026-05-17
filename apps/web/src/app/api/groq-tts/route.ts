// /api/groq-tts — Next.js App Router: Orpheus TTS via Groq
// Converts text to speech using canopylabs/orpheus-v1-english
// Returns WAV audio binary

import { NextRequest, NextResponse } from 'next/server';

const GROQ_KEYS = [
  process.env.GROQ_API_KEY,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
].filter(Boolean) as string[];

let activeKeyIndex = 0;
function getKey() { return GROQ_KEYS[activeKeyIndex] || GROQ_KEYS[0]; }
function nextKey() { activeKeyIndex = (activeKeyIndex + 1) % GROQ_KEYS.length; return getKey(); }

const VALID_VOICES = ['autumn', 'diana', 'hannah', 'austin', 'daniel', 'troy'];

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const selectedVoice = VALID_VOICES.includes(voice) ? voice : 'hannah';
    const cleanText = text.slice(0, 195);

    let apiKey = getKey();

    let ttsRes = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'canopylabs/orpheus-v1-english',
        input: cleanText,
        voice: selectedVoice,
        response_format: 'wav',
      }),
    });

    // Retry on rate limit with next key
    if (!ttsRes.ok && ttsRes.status === 429) {
      apiKey = nextKey();
      ttsRes = await fetch('https://api.groq.com/openai/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'canopylabs/orpheus-v1-english',
          input: cleanText,
          voice: selectedVoice,
          response_format: 'wav',
        }),
      });
    }

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.error('TTS error:', ttsRes.status, errText);
      return NextResponse.json({ error: 'TTS generation failed' }, { status: ttsRes.status });
    }

    const audioBuffer = await ttsRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('TTS handler error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
