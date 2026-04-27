// /api/pwa-manifest.js — Dynamic per-model PWA manifest

const MODEL_DATA = {
  1: { name: 'Friend', slug: 'friend', icon: 'friendcard' },
  2: { name: 'Professor', slug: 'professor', icon: 'professorcard' },
  3: { name: 'Builder', slug: 'builder', icon: 'buildercard' }
};

module.exports = function handler(req, res) {
  const modelId = parseInt(req.query.bot) || 1;
  const model = MODEL_DATA[modelId] || MODEL_DATA[1];

  const manifest = {
    name: `NEYDRA — ${model.name}`,
    short_name: model.name,
    description: `${model.name} AI Assistant by NEYDRA`,
    start_url: `/welcome/aiassistants/${model.slug}`,
    display: 'standalone',
    orientation: 'any',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: `/assets/aiassistants/botcards/${model.icon}.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: `/assets/aiassistants/botcards/${model.icon}.png`,
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
