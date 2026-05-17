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
            annihilateColors(fullPath);
        }
    }
}

function annihilateColors(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // 1. RGBA Annihilation
    // Matches rgba(r, g, b, a)
    const rgbaRegex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,/gi;
    content = content.replace(rgbaRegex, (match, rStr, gStr, bStr) => {
        const r = parseInt(rStr, 10);
        const g = parseInt(gStr, 10);
        const b = parseInt(bStr, 10);

        // Check if already valid Red (255,0,0), Black (0,0,0), or White (255,255,255)
        if ((r === 255 && g === 0 && b === 0) || 
            (r === 0 && g === 0 && b === 0) || 
            (r === 255 && g === 255 && b === 255)) {
            return match;
        }

        // If dark background (all < 50), convert to Black (0,0,0)
        if (r < 50 && g < 50 && b < 50) {
            return 'rgba(0, 0, 0,';
        }

        // Otherwise convert to Red (255,0,0)
        return 'rgba(255, 0, 0,';
    });

    // 2. RGB Annihilation
    // Matches rgb(r, g, b)
    const rgbRegex = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi;
    content = content.replace(rgbRegex, (match, rStr, gStr, bStr) => {
        const r = parseInt(rStr, 10);
        const g = parseInt(gStr, 10);
        const b = parseInt(bStr, 10);

        if ((r === 255 && g === 0 && b === 0) || 
            (r === 0 && g === 0 && b === 0) || 
            (r === 255 && g === 255 && b === 255)) {
            return match;
        }

        if (r < 50 && g < 50 && b < 50) {
            return 'rgb(0, 0, 0)';
        }

        return 'rgb(255, 0, 0)';
    });

    // 3. Hex Annihilation
    // Matches #RRGGBB or #RGB (excluding valid red/black/white)
    // We use a regex that looks for # followed by 6 or 3 hex digits, making sure not to match inside words or invalid contexts.
    const hexRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
    content = content.replace(hexRegex, (match, hexGroup) => {
        const lower = match.toLowerCase();
        // Valid Neydra palette hexes
        if (lower === '#000000' || lower === '#000' || 
            lower === '#ffffff' || lower === '#fff' || 
            lower === '#ff0000' || lower === '#f00') {
            return match;
        }

        // Parse hex to determine if dark or accent
        let r = 0, g = 0, b = 0;
        if (hexGroup.length === 6) {
            r = parseInt(hexGroup.slice(0, 2), 16);
            g = parseInt(hexGroup.slice(2, 4), 16);
            b = parseInt(hexGroup.slice(4, 6), 16);
        } else if (hexGroup.length === 3) {
            r = parseInt(hexGroup.charAt(0) + hexGroup.charAt(0), 16);
            g = parseInt(hexGroup.charAt(1) + hexGroup.charAt(1), 16);
            b = parseInt(hexGroup.charAt(2) + hexGroup.charAt(2), 16);
        }

        if (r < 50 && g < 50 && b < 50) {
            return '#000000';
        }
        return '#ff0000';
    });

    // 4. Lingering Class & Variable Replacements
    const classMap = {
        'neydra-accent-cyan': 'neydra-accent',
        'text-neydra-blue': 'text-red-500',
        'border-neydra-blue': 'border-red-500',
        'bg-neydra-blue': 'bg-red-600',
        'shadow-neon-blue': 'shadow-neon-red',
    };

    for (const [oldClass, newClass] of Object.entries(classMap)) {
        const reg = new RegExp(oldClass, 'gi');
        content = content.replace(reg, newClass);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Deep color annihilated: ${path.basename(filePath)}`);
    }
}

for (const dir of dirsToScan) {
    processDirectory(dir);
}
console.log('Deep color annihilation complete.');
