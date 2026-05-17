const fs = require('fs');
const path = require('path');

const legacyDir = path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Legacy');
const publicDir = path.join(__dirname, 'apps', 'web', 'public');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const files = fs.readdirSync(legacyDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(legacyDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Find the commented script block
    // Looking for: {/* <script> ... </script> */}
    const scriptRegex = /\{\/\*\s*<script>([\s\S]*?)<\/script>\s*\*\/\}/i;
    const match = content.match(scriptRegex);

    if (match) {
        const scriptBody = match[1];
        const scriptName = file.replace('.tsx', '.js').toLowerCase();
        const scriptPath = path.join(publicDir, scriptName);
        
        // Save the script to public/
        fs.writeFileSync(scriptPath, scriptBody, 'utf-8');
        console.log(`Extracted script from ${file} to public/${scriptName}`);

        // Add import Script from 'next/script'; if not present
        if (!content.includes("import Script from 'next/script'")) {
            // Find a good place to insert import, e.g. after 'use client';
            content = content.replace(/'use client';\r?\n/, "'use client';\nimport Script from 'next/script';\n");
        }

        // Replace the block with Next.js Script component
        const nextScriptTag = `<Script src="/${scriptName}" strategy="lazyOnload" />`;
        content = content.replace(scriptRegex, nextScriptTag);

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${file} to use next/script`);
    } else {
        // Also check if there's a raw script tag that isn't commented
        const rawRegex = /<script>([\s\S]*?)<\/script>/i;
        const rawMatch = content.match(rawRegex);
        if (rawMatch) {
            const scriptBody = rawMatch[1];
            const scriptName = file.replace('.tsx', '.js').toLowerCase();
            const scriptPath = path.join(publicDir, scriptName);
            
            fs.writeFileSync(scriptPath, scriptBody, 'utf-8');
            console.log(`Extracted raw script from ${file} to public/${scriptName}`);

            if (!content.includes("import Script from 'next/script'")) {
                content = content.replace(/'use client';\r?\n/, "'use client';\nimport Script from 'next/script';\n");
            }

            const nextScriptTag = `<Script src="/${scriptName}" strategy="lazyOnload" />`;
            content = content.replace(rawRegex, nextScriptTag);

            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Updated ${file} to use next/script`);
        }
    }
}
console.log('Script extraction complete!');
