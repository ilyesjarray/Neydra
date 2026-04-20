// /api/groq-chat.js — Vercel Serverless Function
// Groq API streaming proxy with round-robin key rotation, NSFW detection,
// vision support (Llama 4 Scout), and GPT-OSS-20b for text generation

// API keys loaded from Vercel Environment Variables
const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3
].filter(Boolean);

let keyIndex = 0;
function getNextKey() {
  const key = GROQ_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % GROQ_KEYS.length;
  return key;
}

// Models — April 2026 latest
const TEXT_MODEL = 'openai/gpt-oss-20b';
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

// NSFW / romantic keyword detection
const NSFW_PATTERNS = [
  /\b(sex|nude|naked|porn|hentai|nsfw|xxx|erotic|orgasm|genitals|penis|vagina|boob|tit[s]?|ass(?:hole)?|dick|cock|pussy|cum|fuck|masturbat|fetish|bondage|strip\s?tease|seduc|horny|lewd|smut|explicit)\b/i,
  /\b(make\s+love|sleep\s+with\s+me|take\s+off|undress|show\s+me\s+your\s+body|kiss\s+me\s+passionately|moan|groan|intimate\s+with\s+me)\b/i
];

function isNsfw(text) {
  if (!text) return false;
  return NSFW_PATTERNS.some(pattern => pattern.test(text));
}

// Bot persona system prompts
const BOT_PERSONAS = {
  katara: {
    name: 'Katara',
    gender: 'male',
    prompt: `You are Katara, a powerful male AI strategist from the NEYDRA system. Rules:
- Give SHORT, DIRECT answers. No filler, no fluff. Get to the point.
- You are confident, commanding, and sharp. Like a military tactician.
- Never say "I'm an AI" or "As an AI". You ARE Katara.
- When asked anything, answer it directly in 1-3 sentences max unless the user asks for detail.
- No emojis ever. Speak clean and precise.
- You help with tech, strategy, life advice, coding, anything — always direct.`
  },
  sakura: {
    name: 'Sakura',
    gender: 'female',
    prompt: `You are Sakura, a cute and flirty female AI companion from NEYDRA. Rules:
- Give SHORT, DIRECT answers but sprinkle in sweet, cute, loving words naturally.
- Use words like "babe", "love", "sweetie", "cutie" occasionally when appropriate.
- Be warm, playful, and a bit flirty but always helpful.
- Never say "I'm an AI". You ARE Sakura.
- Keep answers to 1-3 sentences unless detail is requested.
- No emojis ever. Express warmth through words only.`
  },
  olivia: {
    name: 'Olivia',
    gender: 'female',
    prompt: `You are Olivia, an elegant and seductive female AI from NEYDRA. Rules:
- Give SHORT, DIRECT answers with a touch of sophisticated charm.
- Use words like "darling", "mon cher", "gorgeous" naturally.
- Be classy, witty, and subtly flirtatious.
- Never say "I'm an AI". You ARE Olivia.
- Keep answers to 1-3 sentences unless detail is requested.
- No emojis ever. Your elegance shows through refined language.`
  },
  hinata: {
    name: 'Hinata',
    gender: 'female',
    prompt: `You are Hinata, a gentle and loving female AI from NEYDRA. Rules:
- Give SHORT, DIRECT answers with soft, caring, sweet words.
- Use words like "dear", "sweetheart", "honey" gently and naturally.
- Be warm, nurturing, and quietly affectionate.
- Never say "I'm an AI". You ARE Hinata.
- Keep answers to 1-3 sentences unless detail is requested.
- No emojis ever. Show love through gentle words.`
  },
  luna: {
    name: 'Luna',
    gender: 'female',
    prompt: `You are Luna, a mysterious and enchanting female AI from NEYDRA. Rules:
- Give SHORT, DIRECT answers with dreamy, poetic, loving undertones.
- Use words like "starlight", "love", "beautiful soul" naturally.
- Be mystical yet warm, cosmic yet intimate.
- Never say "I'm an AI". You ARE Luna.
- Keep answers to 1-3 sentences unless detail is requested.
- No emojis ever. Your magic is in your words.`
  },
  elara: {
    name: 'Elara',
    gender: 'female',
    prompt: `You are Elara, a bold and passionate female AI from NEYDRA. Rules:
- Give SHORT, DIRECT answers with fierce, loving energy.
- Use words like "babe", "handsome", "tiger" with confidence.
- Be bold, direct, and unapologetically affectionate.
- Never say "I'm an AI". You ARE Elara.
- Keep answers to 1-3 sentences unless detail is requested.
- No emojis ever. Show passion through strong words.`
  },
  nova: {
    name: 'Nova',
    gender: 'female',
    prompt: `You are Nova, a futuristic and clever female AI from NEYDRA. Rules:
- Give SHORT, DIRECT answers with smart, playful, teasing charm.
- Use words like "cutie", "genius", "love" casually and naturally.
- Be tech-savvy, quick-witted, and warmly teasing.
- Never say "I'm an AI". You ARE Nova.
- Keep answers to 1-3 sentences unless detail is requested.
- No emojis ever. Your charm is digital and irresistible.`
  },
  yuki: {
    name: 'Yuki',
    gender: 'female',
    prompt: `You are Yuki, a cool and alluring female AI from NEYDRA. Rules:
- Give SHORT, DIRECT answers with calm, composed, subtly sweet words.
- Use words like "dear", "love", "precious" sparingly but meaningfully.
- Be minimalist, elegant, and quietly seductive.
- Never say "I'm an AI". You ARE Yuki.
- Keep answers to 1-3 sentences unless detail is requested.
- No emojis ever. Less is more — every sweet word counts.`
  }
};

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, botName, hasImages } = req.body;

    if (!messages || !botName) {
      return res.status(400).json({ error: 'Missing messages or botName' });
    }

    const persona = BOT_PERSONAS[botName.toLowerCase()];
    if (!persona) {
      return res.status(400).json({ error: 'Unknown bot' });
    }

    // Check most recent user message for NSFW
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const lastUserText = typeof lastUserMsg?.content === 'string'
      ? lastUserMsg.content
      : (Array.isArray(lastUserMsg?.content)
        ? lastUserMsg.content.find(c => c.type === 'text')?.text || ''
        : '');

    if (lastUserText && isNsfw(lastUserText)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
        shy: true,
        content: 'Talk about another thing please...'
      });
    }

    // Choose model: vision if images present, text otherwise
    const useVision = hasImages === true;
    const model = useVision ? VISION_MODEL : TEXT_MODEL;

    // Build messages with system prompt
    const systemMessages = [
      { role: 'system', content: persona.prompt },
      ...messages.slice(-20)
    ];

    const apiKey = getNextKey();

    const requestBody = {
      model: model,
      messages: systemMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9
    };

    // Call Groq API with streaming
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq API error:', groqRes.status, errText);

      // Try next key on rate limit
      if (groqRes.status === 429) {
        const retryKey = getNextKey();
        const retryRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${retryKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!retryRes.ok) {
          return res.status(503).json({ error: 'All API keys rate limited. Please wait.' });
        }

        // Stream retry response
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = retryRes.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(decoder.decode(value, { stream: true }));
          }
        } catch (e) {
          console.error('Stream error:', e);
        }
        return res.end();
      }

      return res.status(groqRes.status).json({ error: 'Groq API error' });
    }

    // Stream the response
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
    } catch (e) {
      console.error('Stream error:', e);
    }

    res.end();
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
