const fs = require('fs');
const path = require('path');

const dirsToScan = [
    path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Legacy'),
    path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Neural'),
    path.join(__dirname, 'apps', 'web', 'src', 'app'),
    path.join(__dirname, 'apps', 'web', 'src', 'components', 'layout')
];

function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
            patchColors(fullPath);
        }
    }
}

function patchColors(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Cyan/Blue to Red
    content = content.replace(/#00d2ff/gi, '#ff0000');
    content = content.replace(/#3a7bd5/gi, '#880000');
    content = content.replace(/0,\s*210,\s*255/g, '255, 0, 0');
    content = content.replace(/58,\s*123,\s*213/g, '136, 0, 0');
    
    // Any blue, cyan text references in classes or CSS (only if obvious colors)
    content = content.replace(/rgba\(0,210,255/gi, 'rgba(255,0,0');
    content = content.replace(/rgba\(58,123,213/gi, 'rgba(136,0,0');
    
    // Replace hardcoded other colors if needed, but the user explicitly requested Red (#ff0000), Black (#000000), White (#ffffff).
    // Let's replace 'cyan' and 'blue' in classnames, e.g. text-cyan-400 -> text-red-500
    content = content.replace(/cyan-400/gi, 'red-500');
    content = content.replace(/cyan-500/gi, 'red-600');
    content = content.replace(/cyan-600/gi, 'red-700');
    content = content.replace(/blue-400/gi, 'red-500');
    content = content.replace(/blue-500/gi, 'red-600');
    content = content.replace(/blue-600/gi, 'red-700');
    content = content.replace(/emerald-400/gi, 'red-500');
    content = content.replace(/emerald-500/gi, 'red-600');
    
    // Replace bg-hyper-cyan with bg-neydra-accent
    content = content.replace(/hyper-cyan/gi, 'neydra-accent');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Patched colors in ${path.basename(filePath)}`);
    }
}

for (const dir of dirsToScan) {
    processDirectory(dir);
}
console.log('Color patching complete.');
