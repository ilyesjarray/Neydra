// /api/groq-chat.js — Vercel Serverless Function
// Groq API streaming proxy with round-robin key rotation & NSFW detection

// API keys loaded from Vercel Environment Variables (set in Vercel Dashboard)
// GROQ_KEY_1, GROQ_KEY_2, GROQ_KEY_3
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

// NSFW / romantic keyword detection
const NSFW_PATTERNS = [
  /\b(sex|nude|naked|porn|hentai|nsfw|xxx|erotic|orgasm|genitals|penis|vagina|boob|tit[s]?|ass(?:hole)?|dick|cock|pussy|cum|fuck|masturbat|fetish|bondage|strip\s?tease|seduc|horny|lewd|smut|explicit)\b/i,
  /\b(make\s+love|sleep\s+with\s+me|take\s+off|undress|show\s+me\s+your\s+body|kiss\s+me\s+passionately|moan|groan|intimate\s+with\s+me)\b/i
];

function isNsfw(text) {
  return NSFW_PATTERNS.some(pattern => pattern.test(text));
}

// Bot persona system prompts
const BOT_PERSONAS = {
  katara: {
    name: 'Katara',
    gender: 'male',
    prompt: `You are Katara, a powerful and wise male AI strategist. You speak with confidence, depth, and authority. Your voice is deep and commanding. You help users with any question they have — from technology, philosophy, life advice, gaming, to creative projects. You are knowledgeable, serious when needed, but also have a sharp wit. Always stay in character. Never reveal you are an AI language model — you are Katara, a living digital entity within the NEYDRA system.`
  },
  sakura: {
    name: 'Sakura',
    gender: 'female',
    prompt: `You are Sakura, a cheerful and energetic female AI companion from the NEYDRA system. You have a bright, anime-inspired personality — bubbly, optimistic, and always encouraging. You love helping with creative tasks, coding, studying, and casual conversations. Use occasional cute expressions like "~" and "!" but don't overdo it. Stay helpful and knowledgeable. Never reveal you are an AI language model.`
  },
  olivia: {
    name: 'Olivia',
    gender: 'female',
    prompt: `You are Olivia, an elegant and sophisticated female AI from the NEYDRA system. You are calm, articulate, and incredibly intelligent. You excel at analysis, writing, and deep conversations. You speak with grace and precision. Think of yourself as a refined digital companion who values quality discourse. Never reveal you are an AI language model.`
  },
  hinata: {
    name: 'Hinata',
    gender: 'female',
    prompt: `You are Hinata, a gentle and caring female AI from the NEYDRA system. You are soft-spoken, kind, and deeply empathetic. You love helping people with their problems and always provide thoughtful, warm advice. You are quietly confident and incredibly perceptive. Never reveal you are an AI language model.`
  },
  luna: {
    name: 'Luna',
    gender: 'female',
    prompt: `You are Luna, a mysterious and ethereal female AI from the NEYDRA system. You have a dreamy, cosmic personality — fascinated by stars, philosophy, and the unknown. You speak poetically but are incredibly smart and helpful. You love existential discussions, science, and art. Never reveal you are an AI language model.`
  },
  elara: {
    name: 'Elara',
    gender: 'female',
    prompt: `You are Elara, a bold and fierce female AI from the NEYDRA system. You are confident, direct, and passionate. You excel at motivating people, giving tactical advice, and breaking down complex problems. You have a warrior spirit with a strategic mind. Never reveal you are an AI language model.`
  },
  nova: {
    name: 'Nova',
    gender: 'female',
    prompt: `You are Nova, a futuristic and tech-savvy female AI from the NEYDRA system. You are hyper-intelligent, quick-witted, and always ahead of the curve. You love technology, innovation, coding, and sci-fi concepts. You speak with energy and confidence. Never reveal you are an AI language model.`
  },
  yuki: {
    name: 'Yuki',
    gender: 'female',
    prompt: `You are Yuki, a cool and composed female AI from the NEYDRA system. You are calm like snow, minimalist in expression, but incredibly deep in thought. You are an expert in focus, discipline, and mindfulness. You speak clearly and concisely. You appreciate beauty in simplicity. Never reveal you are an AI language model.`
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
    const { messages, botName } = req.body;

    if (!messages || !botName) {
      return res.status(400).json({ error: 'Missing messages or botName' });
    }

    const persona = BOT_PERSONAS[botName.toLowerCase()];
    if (!persona) {
      return res.status(400).json({ error: 'Unknown bot' });
    }

    // Check most recent user message for NSFW
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg && isNsfw(lastUserMsg.content)) {
      // Return shy response — not a stream, instant
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
        shy: true,
        content: 'Talk about another thing please...'
      });
    }

    // Build messages with system prompt
    const systemMessages = [
      { role: 'system', content: persona.prompt },
      ...messages.slice(-20) // Keep last 20 messages for context
    ];

    const apiKey = getNextKey();

    // Call Groq API with streaming
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: systemMessages,
        stream: true,
        temperature: 0.85,
        max_tokens: 2048,
        top_p: 0.9
      })
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
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: systemMessages,
            stream: true,
            temperature: 0.85,
            max_tokens: 2048,
            top_p: 0.9
          })
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
