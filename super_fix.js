const fs = require('fs');
const path = require('path');

const legacyDir = path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Legacy');
const files = fs.readdirSync(legacyDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(legacyDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Fix Next/Script import and usage
    // Remove import Script from 'next/script';
    content = content.replace(/import Script from 'next\/script';\r?\n/g, '');
    // Change <Script ... /> to <script ...></script>
    content = content.replace(/<Script src="([^"]+)" strategy="lazyOnload" \/>/g, '<script src="$1" defer></script>');

    // Fix React camelCase properties
    content = content.replace(/maxlength=/gi, 'maxLength=');
    content = content.replace(/inputmode=/gi, 'inputMode=');
    content = content.replace(/allowfullscreen/gi, 'allowFullScreen');

    // Fix onError="something" to onError={() => { ... }}
    content = content.replace(/onError="([^"]+)"/g, (match, p1) => {
        return `onError={() => { try { eval(\`${p1.replace(/`/g, '\\`')}\`); } catch(e){} }}`;
    });

    // Fix NeydraExchange.tsx line 578: > 
    // Just find any "> " after a tag and replace with ">&gt; "
    content = content.replace(/>\s*>\s*([A-Z])/g, '>&gt; $1');
    content = content.replace(/className="error-msg">>\s*(.*)</g, 'className="error-msg">&gt; $1<');

    // Specific fix for NeydraExchange
    if (file === 'NeydraExchange.tsx') {
        content = content.replace(/> > /g, '>&gt; ');
        content = content.replace(/>>\s*/g, '>&gt; ');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Super fixes applied to ${file}`);
}
console.log('All legacy files super-fixed.');
