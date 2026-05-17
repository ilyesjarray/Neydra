const fs = require('fs');
const path = require('path');

const dirsToScan = [
    path.join(__dirname, 'apps', 'web', 'src', 'components'),
    path.join(__dirname, 'apps', 'web', 'src', 'app'),
];

function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
            patchColorsDeep(fullPath);
        }
    }
}

function patchColorsDeep(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Replace cyan hexes
    content = content.replace(/#00FFF2/gi, '#ff0000');
    content = content.replace(/#00d2ff/gi, '#ff0000');
    content = content.replace(/rgba\(0,\s*255,\s*242/gi, 'rgba(255,0,0');
    
    // Replace class name colors
    content = content.replace(/purple-400/gi, 'red-500');
    content = content.replace(/purple-500/gi, 'red-600');
    content = content.replace(/amber-400/gi, 'red-500');
    content = content.replace(/amber-500/gi, 'red-600');
    content = content.replace(/rose-400/gi, 'red-500');
    content = content.replace(/rose-500/gi, 'red-600');
    content = content.replace(/emerald-400/gi, 'red-500');
    content = content.replace(/emerald-500/gi, 'red-600');
    content = content.replace(/cyan-400/gi, 'red-500');
    content = content.replace(/cyan-500/gi, 'red-600');
    content = content.replace(/blue-400/gi, 'red-500');
    content = content.replace(/blue-500/gi, 'red-600');
    
    // Replace custom variables
    content = content.replace(/hyper-cyan/gi, 'neydra-accent');
    content = content.replace(/neon-cyan/gi, 'neon-red');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Deep patched colors in ${path.basename(filePath)}`);
    }
}

for (const dir of dirsToScan) {
    processDirectory(dir);
}
console.log('Deep color patching complete.');
