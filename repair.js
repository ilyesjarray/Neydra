const fs = require('fs');
const path = require('path');

const shopPath = path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Legacy', 'NeydraShop.tsx');
let content = fs.readFileSync(shopPath, 'utf-8');

// Split into JSX part and JS part (the script is around line 1267)
const parts = content.split('{/* <script>');

if (parts.length === 2) {
    let jsxPart = parts[0];
    let scriptPart = parts[1];

    // Fix <source ... > without closing in JSX part
    jsxPart = jsxPart.replace(/<source([^>]*?[^\/])>/gi, '<source$1 />');

    // Fix onerror= -> onError= in JSX part
    jsxPart = jsxPart.replace(/onerror=/gi, 'onError=');

    // Fix onclick="something" -> onClick={() => { (window as any).something?.(); }} in JSX part
    jsxPart = jsxPart.replace(/onclick="([^"]*)"/gi, (match, p1) => {
        return `onClick={() => { (window as any).${p1.split('(')[0]}?.(); }}`;
    });

    content = jsxPart + '{/* <script>' + scriptPart;
    fs.writeFileSync(shopPath, content, 'utf-8');
    console.log('Fixed NeydraShop.tsx JSX part successfully.');
} else {
    console.log('Could not split NeydraShop.tsx, parts length:', parts.length);
}
