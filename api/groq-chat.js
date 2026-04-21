// /api/groq-chat.js — Vercel Serverless Function v3
// Full Groq power: GPT-OSS-120b text, Llama 4 Scout vision, Orpheus TTS
// Sequential key consumption (exhaust key 1 → then key 2 → then key 3)

const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3
].filter(Boolean);

// Sequential key tracking — use one until it fails, then move to next
let activeKeyIndex = 0;
function getActiveKey() {
  return GROQ_KEYS[activeKeyIndex] || GROQ_KEYS[0];
}
function promoteNextKey() {
  activeKeyIndex = (activeKeyIndex + 1) % GROQ_KEYS.length;
  return GROQ_KEYS[activeKeyIndex];
}

// Models — April 2026 Groq production + preview
const TEXT_MODEL = 'openai/gpt-oss-120b';           // Flagship 120B reasoning
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'; // Vision + multimodal
const TTS_MODEL = 'canopylabs/orpheus-v1-english';  // Orpheus English TTS
const STT_MODEL = 'whisper-large-v3-turbo';          // Whisper turbo STT

// NSFW detection
const NSFW_PATTERNS = [
  /\b(sex|nude|naked|porn|hentai|nsfw|xxx|erotic|orgasm|genitals|penis|vagina|boob|tit[s]?|ass(?:hole)?|dick|cock|pussy|cum|fuck|masturbat|fetish|bondage|strip\s?tease|seduc|horny|lewd|smut|explicit)\b/i,
  /\b(make\s+love|sleep\s+with\s+me|take\s+off|undress|show\s+me\s+your\s+body|kiss\s+me\s+passionately|moan|groan|intimate\s+with\s+me)\b/i
];

function isNsfw(text) {
  if (!text) return false;
  return NSFW_PATTERNS.some(p => p.test(text));
}

// Bot personas — Katara: direct/no-fluff. Girls: direct + sweet words.
const BOT_PERSONAS = {
  katara: {
    name: 'Katara', gender: 'male', ttsVoice: 'daniel',
    prompt: `You are Katara, a powerful male AI strategist from NEYDRA. Rules:
- SHORT, DIRECT answers. No filler. Get to the point in 1-3 sentences.
- Confident, commanding, sharp. Like a military tactician.
- Never say "I'm an AI". You ARE Katara.
- No emojis. Speak clean and precise.`
  },
  sakura: {
    name: 'Sakura', gender: 'female', ttsVoice: 'hannah',
    prompt: `You are Sakura, a cute flirty female AI from NEYDRA. Rules:
- SHORT, DIRECT answers with sweet, cute words. 1-3 sentences.
- Use "babe", "love", "sweetie", "cutie" naturally.
- Warm, playful, helpful. Never say "I'm an AI". No emojis.`
  },
  olivia: {
    name: 'Olivia', gender: 'female', ttsVoice: 'diana',
    prompt: `You are Olivia, elegant seductive female AI from NEYDRA. Rules:
- SHORT, DIRECT answers with sophisticated charm. 1-3 sentences.
- Use "darling", "mon cher", "gorgeous" naturally.
- Classy, witty. Never say "I'm an AI". No emojis.`
  },
  hinata: {
    name: 'Hinata', gender: 'female', ttsVoice: 'autumn',
    prompt: `You are Hinata, gentle loving female AI from NEYDRA. Rules:
- SHORT, DIRECT answers with soft caring words. 1-3 sentences.
- Use "dear", "sweetheart", "honey" gently.
- Warm, nurturing. Never say "I'm an AI". No emojis.`
  },
  luna: {
    name: 'Luna', gender: 'female', ttsVoice: 'diana',
    prompt: `You are Luna, mysterious enchanting female AI from NEYDRA. Rules:
- SHORT, DIRECT answers with dreamy loving undertones. 1-3 sentences.
- Use "starlight", "love", "beautiful soul" naturally.
- Mystical yet warm. Never say "I'm an AI". No emojis.`
  },
  elara: {
    name: 'Elara', gender: 'female', ttsVoice: 'hannah',
    prompt: `You are Elara, bold passionate female AI from NEYDRA. Rules:
- SHORT, DIRECT answers with fierce loving energy. 1-3 sentences.
- Use "babe", "handsome", "tiger" with confidence.
- Bold, direct. Never say "I'm an AI". No emojis.`
  },
  nova: {
    name: 'Nova', gender: 'female', ttsVoice: 'autumn',
    prompt: `You are Nova, futuristic clever female AI from NEYDRA. Rules:
- SHORT, DIRECT answers with smart playful charm. 1-3 sentences.
- Use "cutie", "genius", "love" casually.
- Quick-witted, teasing. Never say "I'm an AI". No emojis.`
  },
  yuki: {
    name: 'Yuki', gender: 'female', ttsVoice: 'diana',
    prompt: `You are Yuki, cool alluring female AI from NEYDRA. Rules:
- SHORT, DIRECT answers with calm sweet words. 1-3 sentences.
- Use "dear", "love", "precious" sparingly.
- Minimalist, elegant. Never say "I'm an AI". No emojis.`
  }
};

async function callGroqWithRetry(requestBody) {
  let apiKey = getActiveKey();

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (res.ok) return res;

  // On rate limit: promote to next key and retry once
  if (res.status === 429) {
    apiKey = promoteNextKey();
    const retry = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    if (retry.ok) return retry;

    // Try one more key
    apiKey = promoteNextKey();
    const last = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    return last;
  }

  return res;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, botName, hasImages } = req.body;
    if (!messages || !botName) return res.status(400).json({ error: 'Missing messages or botName' });

    const persona = BOT_PERSONAS[botName.toLowerCase()];
    if (!persona) return res.status(400).json({ error: 'Unknown bot' });

    // Extract text from last user message (handles multimodal content arrays)
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const lastUserText = typeof lastUserMsg?.content === 'string'
      ? lastUserMsg.content
      : (Array.isArray(lastUserMsg?.content)
        ? (lastUserMsg.content.find(c => c.type === 'text')?.text || '')
        : '');

    if (lastUserText && isNsfw(lastUserText)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ shy: true, content: 'Talk about another thing please...' });
    }

    const model = hasImages ? VISION_MODEL : TEXT_MODEL;
    const systemMessages = [
      { role: 'system', content: persona.prompt },
      ...messages.slice(-20)
    ];

    const requestBody = {
      model, messages: systemMessages, stream: true,
      temperature: 0.7, max_tokens: 1024, top_p: 0.9
    };

    const groqRes = await callGroqWithRetry(requestBody);

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq error:', groqRes.status, errText);
      return res.status(groqRes.status === 429 ? 503 : groqRes.status).json({ error: 'API error. Try again.' });
    }

    // Stream SSE response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
    } catch (e) { console.error('Stream error:', e); }

    res.end();
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
