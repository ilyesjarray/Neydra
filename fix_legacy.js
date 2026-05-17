const fs = require('fs');
const path = require('path');

const legacyDir = path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Legacy');

if (!fs.existsSync(legacyDir)) {
    console.error('Directory not found:', legacyDir);
    process.exit(1);
}

const files = fs.readdirSync(legacyDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(legacyDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Fix HTML Comments inside JSX
    content = content.replace(/<!--(.*?)-->/g, '{/*$1*/}');
    
    // Fix charSet
    content = content.replace(/charset="UTF-8"/gi, 'charSet="UTF-8"');
    
    // Fix http-equiv
    content = content.replace(/http-equiv=/gi, 'httpEquiv=');

    // Fix <br> without self closing
    content = content.replace(/<br>/gi, '<br />');

    // Fix empty style dangerouslySetInnerHTML where backticks break or something
    // The previous error was because the HTML comments were in the JSX.
    // The replace /<!--(.*?)-->/g will fix them.

    // Some unclosed inputs
    content = content.replace(/<input([^>]*?[^\/])>/gi, '<input$1 />');

    // Some unclosed imgs
    content = content.replace(/<img([^>]*?[^\/])>/gi, '<img$1 />');

    // Fix class= to className= (just in case convert.js missed it inside JSX)
    // Wait, let's be careful with string replacement. We only want outside the style tag.
    // We already handled class to className in convert2.js.

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed ${file}`);
}

console.log('All legacy files fixed!');
