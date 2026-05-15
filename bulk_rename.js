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
        .replace(/Sovereign/g, 'Neydra')
        .replace(/sovereign/g, 'neydra')
        .replace(/SOVEREIGN/g, 'NEYDRA');
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated:', filePath);
      }
    }
  });
});
console.log('Bulk replace complete.');
