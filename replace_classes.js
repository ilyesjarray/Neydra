const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'apps', 'web', 'src'),
  path.join(__dirname, 'packages', 'ui', 'src')
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

targetDirs.forEach(dir => {
  walkDir(dir, function(filePath) {
    if (filePath.match(/\.(ts|tsx|js|jsx|css|json)$/)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let newContent = content
        .replace(/glass-v-series/g, 'neydra-glass')
        .replace(/carbon-black/g, 'neydra-black')
        .replace(/hyper-cyan/g, 'neydra-red')
        .replace(/electric-violet/g, 'neydra-dark-red')
        .replace(/neon-cyan/g, 'neon-red')
        .replace(/text-gradient-cyan/g, 'text-gradient-red')
        // Enforce strict black/red over grays
        .replace(/bg-zinc-[1-9]00/g, 'bg-neydra-black')
        .replace(/bg-gray-[1-9]00/g, 'bg-neydra-black')
        .replace(/text-zinc-400/g, 'text-white/40')
        .replace(/text-gray-400/g, 'text-white/40');
        
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated classes in:', filePath);
      }
    }
  });
});
console.log('Class replace complete.');
