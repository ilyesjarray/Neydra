const fs = require('fs');
const path = require('path');

const legacyDir = path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Legacy');
const files = fs.readdirSync(legacyDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(legacyDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Fix autocomplete
    content = content.replace(/autocomplete=/gi, 'autoComplete=');

    // Fix > as text inside JSX. Look for "> " at the start of a tag's content
    // Specifically fixing the log lines: <div className="log-line">> SYSTEM INITIALIZED</div>
    content = content.replace(/>>\s*SYSTEM/g, '>&gt; SYSTEM');
    content = content.replace(/>>\s*AWAITING/g, '>&gt; AWAITING');
    content = content.replace(/className="log-line">>\s*(.*?)</g, 'className="log-line">&gt; $1<');
    content = content.replace(/className="log-line">\s*>\s*(.*?)</g, 'className="log-line">&gt; $1<');
    
    // Also fix any other obvious "> text" in JSX
    content = content.replace(/>\s*>\s*([A-Z])/g, '>&gt; $1');

    // Remove ts-expect-error
    content = content.replace(/\{\/\* @ts-expect-error \*\/\}/g, '');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Final fixes applied to ${file}`);
}
console.log('All legacy files finalized.');
