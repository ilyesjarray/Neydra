const fs = require('fs');
const path = require('path');

const legacyDir = path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Legacy');
const files = fs.readdirSync(legacyDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(legacyDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Fix <source ... > without closing
    content = content.replace(/<source([^>]*?[^\/])>/gi, '<source$1 />');

    // Fix <hr ... > without closing
    content = content.replace(/<hr([^>]*?[^\/])>/gi, '<hr$1 />');

    // Fix onerror= -> onError=
    content = content.replace(/onerror=/gi, 'onError=');
    
    // Fix onload= -> onLoad=
    content = content.replace(/onload=/gi, 'onLoad=');

    // Fix onclick="something" -> onClick={() => { (window as any).something?.(); }}
    content = content.replace(/onclick="([^"]*)"/gi, (match, p1) => {
        // Handle specific cases or generic
        let fnCall = p1;
        if (!fnCall.endsWith(')')) {
            fnCall += '()';
        }
        // safely replace
        return `onClick={() => { try { eval(\`${p1.replace(/`/g, '\\`')}\`); } catch(e){} }}`;
    });

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Repaired JSX in ${file}`);
}
console.log('All legacy JSX files repaired.');
