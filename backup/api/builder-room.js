// /api/builder-room.js — Multi-Agent Construction Pipeline
// Uses groq/compound for code generation with built-in code execution + web search
// Chains agents sequentially, each building on the previous agent's work
// Returns files as base64 ZIP

const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3
].filter(Boolean);

let activeKeyIndex = 0;
function getKey() { return GROQ_KEYS[activeKeyIndex] || GROQ_KEYS[0]; }
function nextKey() { activeKeyIndex = (activeKeyIndex + 1) % GROQ_KEYS.length; return getKey(); }

const BUILDER_MODEL = 'openai/gpt-oss-120b';

async function callGroq(messages, maxTokens = 4096) {
  let key = getKey();
  let res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: BUILDER_MODEL, messages, temperature: 0.4, max_tokens: maxTokens, top_p: 0.95 })
  });
  if (res.status === 429) {
    key = nextKey();
    res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: BUILDER_MODEL, messages, temperature: 0.4, max_tokens: maxTokens, top_p: 0.95 })
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
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: 'Missing project description' });

    // Setup SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    function sendEvent(data) {
      res.write('data: ' + JSON.stringify(data) + '\n\n');
    }

    // ═══ PHASE 1: ARCHITECT — Plan the project ═══
    sendEvent({ type: 'agent_start', agent: 1, task: 'Analyzing project requirements and planning file structure...' });

    const architectPrompt = `You are a senior software architect. Given this project request, create a detailed build plan.

PROJECT REQUEST: ${description}

Respond with ONLY a JSON object (no markdown, no backticks):
{
  "projectName": "project-name",
  "files": [
    { "filename": "filename.ext", "purpose": "what this file does", "order": 1 }
  ],
  "placeholders": [
    { "description": "what needs user intervention", "location": "which file" }
  ]
}

Keep files minimal but complete. Maximum 6 files. Include a PLACEHOLDERS.txt if there are any API keys or external config needed.`;

    const planRes = await callGroq([{ role: 'system', content: architectPrompt }], 2048);
    if (!planRes.ok) {
      sendEvent({ type: 'error', message: 'Architect agent failed. Try again.' });
      return res.end();
    }

    const planData = await planRes.json();
    const planText = planData.choices?.[0]?.message?.content || '';

    let plan;
    try {
      // Extract JSON from response
      const jsonMatch = planText.match(/\{[\s\S]*\}/);
      plan = JSON.parse(jsonMatch ? jsonMatch[0] : planText);
    } catch (e) {
      sendEvent({ type: 'error', message: 'Failed to parse build plan. Retrying...' });
      return res.end();
    }

    sendEvent({ type: 'agent_file', filename: 'BUILD_PLAN.json' });

    const generatedFiles = [];
    const fileContext = [];

    // ═══ PHASE 2: BUILDER AGENTS — Generate each file ═══
    const sortedFiles = (plan.files || []).sort((a, b) => (a.order || 0) - (b.order || 0));

    for (let i = 0; i < sortedFiles.length; i++) {
      const file = sortedFiles[i];
      const agentNum = i + 2;

      sendEvent({ type: 'agent_start', agent: agentNum, task: `Building ${file.filename} — ${file.purpose}` });

      const previousFilesContext = fileContext.length > 0
        ? '\n\nPREVIOUSLY CREATED FILES:\n' + fileContext.map(f => `--- ${f.name} ---\n${f.content.slice(0, 1500)}`).join('\n\n')
        : '';

      const builderPrompt = `You are a builder agent creating one file for a project.

PROJECT: ${description}
BUILD PLAN: ${JSON.stringify(plan)}
YOUR TASK: Create the file "${file.filename}" — ${file.purpose}
${previousFilesContext}

RULES:
- Output ONLY the raw file content. No markdown fences, no explanations.
- Make it production-ready, complete, and working.
- If something needs user config (API keys, external URLs), use a clear placeholder like __API_KEY_HERE__ and note it.
- Build on what previous agents created. Ensure compatibility.
- Write clean, professional code.`;

      const fileRes = await callGroq([{ role: 'system', content: builderPrompt }], 4096);

      if (!fileRes.ok) {
        sendEvent({ type: 'agent_file', filename: file.filename + ' (FAILED - skipped)' });
        continue;
      }

      const fileData = await fileRes.json();
      let fileContent = fileData.choices?.[0]?.message?.content || '';

      // Strip markdown fences if the model added them
      fileContent = fileContent.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();

      generatedFiles.push({ name: file.filename, content: fileContent });
      fileContext.push({ name: file.filename, content: fileContent });

      sendEvent({ type: 'agent_file', filename: file.filename });
    }

    // ═══ PHASE 3: Add PLACEHOLDERS.txt if needed ═══
    if (plan.placeholders && plan.placeholders.length > 0) {
      let placeholderContent = 'PLACEHOLDERS — Items Requiring User Configuration\n';
      placeholderContent += '='.repeat(50) + '\n\n';
      plan.placeholders.forEach((p, i) => {
        placeholderContent += `${i + 1}. ${p.description}\n   Location: ${p.location}\n\n`;
      });
      generatedFiles.push({ name: 'PLACEHOLDERS.txt', content: placeholderContent });
      sendEvent({ type: 'agent_file', filename: 'PLACEHOLDERS.txt' });
    }

    // ═══ PHASE 4: Create ZIP (using simple ZIP format in pure JS) ═══
    const zipBase64 = createSimpleZip(generatedFiles);

    sendEvent({ type: 'complete', data: zipBase64 });
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    console.error('Builder error:', err);
    try {
      res.write('data: ' + JSON.stringify({ type: 'error', message: 'Internal build error: ' + err.message }) + '\n\n');
    } catch (e) {}
    res.end();
  }
};

// Simple ZIP creator (no dependencies) — creates a valid ZIP archive in base64
function createSimpleZip(files) {
  const entries = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = Buffer.from(file.name, 'utf8');
    const contentBytes = Buffer.from(file.content, 'utf8');
    const crc = crc32(contentBytes);

    // Local file header (30 + name + content)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);  // signature
    localHeader.writeUInt16LE(20, 4);           // version needed
    localHeader.writeUInt16LE(0, 6);            // flags
    localHeader.writeUInt16LE(0, 8);            // compression (store)
    localHeader.writeUInt16LE(0, 10);           // mod time
    localHeader.writeUInt16LE(0, 12);           // mod date
    localHeader.writeUInt32LE(crc, 14);         // crc32
    localHeader.writeUInt32LE(contentBytes.length, 18); // compressed size
    localHeader.writeUInt32LE(contentBytes.length, 22); // uncompressed size
    localHeader.writeUInt16LE(nameBytes.length, 26);    // filename length
    localHeader.writeUInt16LE(0, 28);                   // extra length

    entries.push({ localHeader, nameBytes, contentBytes, crc, offset });
    offset += 30 + nameBytes.length + contentBytes.length;
  }

  // Central directory
  const centralParts = [];
  for (const entry of entries) {
    const cdHeader = Buffer.alloc(46);
    cdHeader.writeUInt32LE(0x02014b50, 0);    // signature
    cdHeader.writeUInt16LE(20, 4);             // version made by
    cdHeader.writeUInt16LE(20, 6);             // version needed
    cdHeader.writeUInt16LE(0, 8);              // flags
    cdHeader.writeUInt16LE(0, 10);             // compression
    cdHeader.writeUInt16LE(0, 12);             // mod time
    cdHeader.writeUInt16LE(0, 14);             // mod date
    cdHeader.writeUInt32LE(entry.crc, 16);     // crc32
    cdHeader.writeUInt32LE(entry.contentBytes.length, 20); // compressed
    cdHeader.writeUInt32LE(entry.contentBytes.length, 24); // uncompressed
    cdHeader.writeUInt16LE(entry.nameBytes.length, 28);    // name length
    cdHeader.writeUInt16LE(0, 30); cdHeader.writeUInt16LE(0, 32); // extra, comment
    cdHeader.writeUInt16LE(0, 34); cdHeader.writeUInt16LE(0, 36); // disk, internal attr
    cdHeader.writeUInt32LE(0, 38);             // external attr
    cdHeader.writeUInt32LE(entry.offset, 42);  // local header offset
    centralParts.push(cdHeader, entry.nameBytes);
  }

  const centralDir = Buffer.concat(centralParts);

  // End of central directory
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4); eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDir.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  // Combine all parts
  const parts = [];
  for (const entry of entries) {
    parts.push(entry.localHeader, entry.nameBytes, entry.contentBytes);
  }
  parts.push(centralDir, eocd);

  return Buffer.concat(parts).toString('base64');
}

// CRC32 implementation
function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
