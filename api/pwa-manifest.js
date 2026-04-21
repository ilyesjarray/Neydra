// /api/pwa-manifest.js — Dynamic per-bot PWA manifest with proper icon sizes

const BOT_DATA = {
  1: { name: 'Katara', slug: 'katara' },
  2: { name: 'Sakura', slug: 'sakura' },
  3: { name: 'Olivia', slug: 'olivia' },
  4: { name: 'Hinata', slug: 'hinata' },
  5: { name: 'Luna', slug: 'luna' },
  6: { name: 'Elara', slug: 'elara' },
  7: { name: 'Nova', slug: 'nova' },
  8: { name: 'Yuki', slug: 'yuki' }
};

module.exports = function handler(req, res) {
  const botId = parseInt(req.query.bot) || 1;
  const bot = BOT_DATA[botId] || BOT_DATA[1];

  const manifest = {
    name: `NEYDRA — ${bot.name}`,
    short_name: bot.name,
    description: `${bot.name} AI Assistant by NEYDRA`,
    start_url: `/welcome/aiassistants/${bot.slug}`,
    display: 'standalone',
    orientation: 'any',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: `/assets/aiassistants/botcards/bot${botId}card192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: `/assets/aiassistants/botcards/bot${botId}card512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };

  res.setHeader('Content-Type', 'application/manifest+json');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).json(manifest);
};
