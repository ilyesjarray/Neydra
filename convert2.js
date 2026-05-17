const fs = require('fs');
const path = require('path');

const backupDir = 'backup/welcome';
const targetDir = 'apps/web/src/components/sectors/Legacy';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Ensure Legacy directory exists
const dirsToConvert = [
    { dir: 'about', name: 'NeydraAbout' },
    { dir: 'ail', name: 'NeydraAIL' }
];

function convertHtmlToJsx(htmlStr) {
    // Basic JSX fixes
    let jsx = htmlStr;
    
    // Replace class= with className=
    jsx = jsx.replace(/class=/g, 'className=');
    // Replace onclick= with onClick=
    jsx = jsx.replace(/onclick=/g, 'onClick=');
    // Replace onchange= with onChange=
    jsx = jsx.replace(/onchange=/g, 'onChange=');
    // Replace for= with htmlFor=
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    // Replace style="xxx" with style={{}}
    jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
        const styleRules = p1.split(';').filter(s => s.trim() !== '');
        const styleObj = styleRules.map(rule => {
            const [key, ...valueParts] = rule.split(':');
            if (!key) return '';
            const value = valueParts.join(':').trim();
            const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            return `"${camelKey}": "${value}"`;
        }).filter(s => s).join(', ');
        return `style={{ ${styleObj} }}`;
    });
    
    // Fix self-closing tags
    const tags = ['img', 'input', 'hr', 'br', 'meta', 'link'];
    tags.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
        jsx = jsx.replace(regex, `<${tag}$1 />`);
    });
    
    return jsx;
}

dirsToConvert.forEach(item => {
    const indexPath = path.join(backupDir, item.dir, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.log(`Skipping ${item.dir}, index.html not found`);
        return;
    }
    
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Extract style
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    let styleContent = '';
    if (styleMatch) {
        styleContent = styleMatch[1];
        html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/i, ''); // Remove from html
    }
    
    // Convert to JSX
    let jsxContent = convertHtmlToJsx(html);
    
    // We wrap it in a fragment, but since the original is a full HTML document,
    // let's extract just the body contents if possible, or render everything minus DOCTYPE
    jsxContent = jsxContent.replace(/<!DOCTYPE html>/gi, '');
    jsxContent = jsxContent.replace(/<html[^>]*>([\s\S]*?)<\/html>/gi, '$1');
    jsxContent = jsxContent.replace(/<head[^>]*>([\s\S]*?)<\/head>/gi, '$1');
    jsxContent = jsxContent.replace(/<body[^>]*>([\s\S]*?)<\/body>/gi, '$1');
    
    // Filter out script tags importing external JS for security/compatibility in React,
    // except specific ones if needed. For now, comment them out or convert to next/script.
    // It's safer to just dangerouslySetInnerHTML them or remove them and let the component handle it.
    // Let's just comment out standard script tags for now to avoid React parsing errors
    jsxContent = jsxContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
        return `{/* ${match.replace(/\*\//g, '* /')} */}`;
    });

    const componentCode = `'use client';
import React, { useEffect } from 'react';

export function ${item.name}() {
    return (
        <div className="neydra-legacy-container h-full w-full relative overflow-y-auto overflow-x-hidden bg-black text-white">
            <style dangerouslySetInnerHTML={{ __html: \`
                ${styleContent.replace(/`/g, '\\`')}
            \`}} />
            
            ${jsxContent}
        </div>
    );
}
`;
    
    fs.writeFileSync(path.join(targetDir, `${item.name}.tsx`), componentCode);
    console.log(`Converted ${item.name}`);
});
