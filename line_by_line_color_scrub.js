const fs = require('fs');
const path = require('path');

const dirsToScan = [
    path.join(__dirname, 'apps', 'web', 'src'),
];

function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
            scrubColorsLineByLine(fullPath);
        }
    }
}

function scrubColorsLineByLine(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Hex replacements
    const hexes = [
        '#00FFF2', '#00F3FF', '#00d2ff', '#3a7bd5', '#22c55e', '#eab308', 
        '#3b82f6', '#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', 
        '#f59e0b', '#D4AF37', '#FFD700', '#00FF41', '#00FF00', '#00f3ff10'
    ];
    for (const hex of hexes) {
        const reg = new RegExp(hex, 'gi');
        content = content.replace(reg, '#ff0000');
    }

    // RGBA replacements
    const rgbas = [
        'rgba\\(0,\\s*255,\\s*242', 'rgba\\(0,\\s*243,\\s*255', 'rgba\\(212,\\s*175,\\s*55', 
        'rgba\\(251,\\s*191,\\s*36', 'rgba\\(58,\\s*123,\\s*213', 'rgba\\(16,\\s*185,\\s*129', 
        'rgba\\(245,\\s*158,\\s*11', 'rgba\\(236,\\s*72,\\s*153', 'rgba\\(59,\\s*130,\\s*246', 
        'rgba\\(0,\\s*255,\\s*65'
    ];
    for (const rgba of rgbas) {
        const reg = new RegExp(rgba, 'gi');
        content = content.replace(reg, 'rgba(255, 0, 0');
    }

    // Class replacements
    const classMap = {
        'text-neon-blue': 'text-red-500',
        'bg-neon-blue': 'bg-red-600',
        'border-neon-blue': 'border-red-500',
        'shadow-neon-blue': 'shadow-neon-red',
        'text-neydra-blue': 'text-red-500',
        'bg-neydra-blue': 'bg-red-600',
        'text-neydra-accent-gold': 'text-red-500',
        'bg-neydra-accent-gold': 'bg-red-600',
        'text-yellow-500': 'text-red-500',
        'bg-yellow-500': 'bg-red-600',
        'border-yellow-500': 'border-red-500',
        'text-green-500': 'text-red-500',
        'bg-green-500': 'bg-red-600',
        'border-green-500': 'border-red-500',
        'text-pink-500': 'text-red-500',
        'bg-pink-500': 'bg-red-600',
        'border-pink-500': 'border-red-500',
        'text-violet-500': 'text-red-500',
        'bg-violet-500': 'bg-red-600',
        'border-violet-500': 'border-red-500',
        'text-blue-500': 'text-red-500',
        'text-blue-600': 'text-red-600',
        'bg-blue-600': 'bg-red-600',
        'from-neydra-blue': 'from-red-600',
        'to-blue-600': 'to-red-600',
        'from-neon-blue': 'from-red-600',
        'border-t-neon-blue': 'border-t-red-500',
        'shadow-glow-gold': 'shadow-neon-red',
        'text-rose-300': 'text-red-300',
        'text-amber-900': 'text-red-900',
        'text-amber-600': 'text-red-600',
        'hover:bg-emerald-600': 'hover:bg-red-700',
        'bg-cyan-600': 'bg-red-600',
        'text-cyan-50': 'text-red-50',
    };

    for (const [oldClass, newClass] of Object.entries(classMap)) {
        const reg = new RegExp(oldClass, 'gi');
        content = content.replace(reg, newClass);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Line by line color scrubbed: ${path.basename(filePath)}`);
    }
}

for (const dir of dirsToScan) {
    processDirectory(dir);
}
console.log('Line by line color scrubbing complete.');
