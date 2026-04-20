// /api/pwa-manifest.js — Dynamic PWA Manifest Generator
// Returns a bot-specific manifest for PWA installation

const BOT_MAP = {
  '1': { name: 'Katara', slug: 'katara' },
  '2': { name: 'Sakura', slug: 'sakura' },
  '3': { name: 'Olivia', slug: 'olivia' },
  '4': { name: 'Hinata', slug: 'hinata' },
  '5': { name: 'Luna', slug: 'luna' },
  '6': { name: 'Elara', slug: 'elara' },
  '7': { name: 'Nova', slug: 'nova' },
  '8': { name: 'Yuki', slug: 'yuki' }
};

module.exports = function handler(req, res) {
  const botNum = req.query.bot || '1';
  const bot = BOT_MAP[botNum] || BOT_MAP['1'];

  const manifest = {
    id: `com.neydra.ai.${bot.slug}`,
    name: `NEYDRA — ${bot.name}`,
    short_name: bot.name,
    description: `${bot.name} AI Assistant — Powered by NEYDRA`,
    icons: [
      {
        src: `/assets/aiassistants/botcards/bot${botNum}card.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    start_url: `/welcome/aiassistants/${bot.slug}`,
    display: 'fullscreen',
    orientation: 'any',
    background_color: '#000000',
    theme_color: '#000000',
    categories: ['entertainment', 'social'],
    lang: 'en-US',
    dir: 'ltr'
  };

  res.setHeader('Content-Type', 'application/manifest+json');
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(manifest);
};
