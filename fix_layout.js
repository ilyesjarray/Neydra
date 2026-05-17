const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Legacy');

function fixLayout() {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        if (!file.endsWith('.tsx')) continue;
        const fullPath = path.join(dirPath, file);
        let content = fs.readFileSync(fullPath, 'utf-8');
        let original = content;

        content = content.replace(/className="neydra-legacy-container h-full/g, 'className="neydra-legacy-container flex-1 h-full');

        if (content !== original) {
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Fixed layout in ${file}`);
        }
    }
}

fixLayout();
