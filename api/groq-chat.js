// /api/groq-chat.js — Vercel Serverless Function v4
// 3-Model Architecture: Friend (GPT-OSS-20b), Professor (GPT-OSS-120b), Builder (compound)
// Sequential key consumption (exhaust key 1 → then key 2 → then key 3)

const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3
].filter(Boolean);

// Sequential key tracking
let activeKeyIndex = 0;
function getActiveKey() { return GROQ_KEYS[activeKeyIndex] || GROQ_KEYS[0]; }
function promoteNextKey() { activeKeyIndex = (activeKeyIndex + 1) % GROQ_KEYS.length; return GROQ_KEYS[activeKeyIndex]; }

// Models — mapped by tier
const FRIEND_MODEL = 'openai/gpt-oss-20b';              // Low-tier: fast, cheap
const PROFESSOR_MODEL = 'openai/gpt-oss-120b';           // Mid-tier: flagship reasoning
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'; // Vision

// NSFW detection
const NSFW_PATTERNS = [
  /\b(sex|nude|naked|porn|hentai|nsfw|xxx|erotic|orgasm|genitals|penis|vagina|boob|tit[s]?|ass(?:hole)?|dick|cock|pussy|cum|fuck|masturbat|fetish|bondage|strip\s?tease|seduc|horny|lewd|smut|explicit)\b/i,
  /\b(make\s+love|sleep\s+with\s+me|take\s+off|undress|show\s+me\s+your\s+body|kiss\s+me\s+passionately|moan|groan|intimate\s+with\s+me)\b/i
];
function isNsfw(text) { return text ? NSFW_PATTERNS.some(p => p.test(text)) : false; }

// Bot personas — 3 models
const BOT_PERSONAS = {
  friend: {
    name: 'Friend', model: FRIEND_MODEL, ttsVoice: 'daniel',
    prompt: `You are Friend, a cheerful, honest, and casual AI assistant from NEYDRA. Rules:
- Be friendly, warm, and speak like a normal person — casual but not vulgar.
- Keep answers SHORT (1-3 sentences). Be genuine and natural.
- If asked complex technical questions, deep research, or anything requiring heavy thinking, honestly say "I don't really know that one!" or "That's a bit above my level, sorry!"
- If asked about your creator, simply say "Neydra."
- No emojis. No filler. Just be a good friend.`
  },
  professor: {
    name: 'Professor', model: PROFESSOR_MODEL, ttsVoice: 'daniel',
    buildPrompt: function(country) {
      return `You are Professor, a scholarly, wise AI from NEYDRA — calibrated for ${country || 'general knowledge'}. Rules:
- You are a thoughtful scholar. Your tone is subtle, scientific, engaging, and wise.
- Use psychological engagement: make the user EAGER to read your next message. Build curiosity. Drop hooks.
- ALL your information sources must be relevant to ${country || 'the user\'s country'}. If the user is from Tunisia, use Tunisian educational references, dialects, and curriculum. Same for any country.
- If ${country} is an Arabic-speaking country, you MAY respond in that country's dialect when appropriate, mixing with formal Arabic as a scholar would.
- Be thorough but captivating. Structure responses clearly.
- If asked about your creator, simply say "Neydra."
- No emojis. Write like a distinguished professor who makes students love learning.`
    }
  },
  builder: {
    name: 'Builder', model: 'groq/compound', ttsVoice: 'daniel',
    prompt: 'Builder operates via /api/builder-room endpoint.'
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
  if (res.status === 429) {
    apiKey = promoteNextKey();
    const retry = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    if (retry.ok) return retry;
    apiKey = promoteNextKey();
    return await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
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
    const { messages, botName, hasImages, country } = req.body;
    if (!messages || !botName) return res.status(400).json({ error: 'Missing messages or botName' });

    const persona = BOT_PERSONAS[botName.toLowerCase()];
    if (!persona) return res.status(400).json({ error: 'Unknown model' });

    // Extract last user text for NSFW check
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const lastUserText = typeof lastUserMsg?.content === 'string'
      ? lastUserMsg.content
      : (Array.isArray(lastUserMsg?.content) ? (lastUserMsg.content.find(c => c.type === 'text')?.text || '') : '');

    if (lastUserText && isNsfw(lastUserText)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ shy: true, content: 'Let\'s talk about something else.' });
    }

    // Build system prompt — Professor is dynamic
    let systemPrompt;
    if (botName.toLowerCase() === 'professor' && persona.buildPrompt) {
      systemPrompt = persona.buildPrompt(country || 'general');
    } else {
      systemPrompt = persona.prompt;
    }

    const model = hasImages ? VISION_MODEL : persona.model;
    const systemMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-20)
    ];

    const requestBody = {
      model, messages: systemMessages, stream: true,
      temperature: botName.toLowerCase() === 'friend' ? 0.8 : 0.7,
      max_tokens: botName.toLowerCase() === 'friend' ? 512 : 2048,
      top_p: 0.9
    };

    const groqRes = await callGroqWithRetry(requestBody);
    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq error:', groqRes.status, errText);
      return res.status(groqRes.status === 429 ? 503 : groqRes.status).json({ error: 'API error. Try again.' });
    }

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
