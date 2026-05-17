const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Legacy');

function restoreApis() {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        if (!file.endsWith('.tsx')) continue;
        const fullPath = path.join(dirPath, file);
        let content = fs.readFileSync(fullPath, 'utf-8');
        let original = content;

        // Restore Supabase
        content = content.replace(/\{\/\* <script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2"><\/script> \*\/\}/g, '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" defer></script>');
        
        // Restore EmailJS
        content = content.replace(/\{\/\* <script type="text\/javascript" src="https:\/\/cdn\.jsdelivr\.net\/npm\/@emailjs\/browser@3\/dist\/email\.min\.js"><\/script> \*\/\}/g, '<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js" defer></script>');
        content = content.replace(/\{\/\* <script type="text\/javascript" src="https:\/\/cdn\.emailjs\.com\/dist\/email\.min\.js"><\/script> \*\/\}/g, '<script src="https://cdn.emailjs.com/dist/email.min.js" defer></script>');

        // Restore EmailJS init blocks
        content = content.replace(/\{\/\* <script type="text\/javascript">\s*\([\s\S]*?emailjs\.init\("MQKyFZlDIBIMySsjM"\);[\s\S]*?<\/script> \*\/\}/g, '<script dangerouslySetInnerHTML={{ __html: `(function () { emailjs.init("MQKyFZlDIBIMySsjM"); })();` }} />');
        content = content.replace(/\{\/\* <script type="text\/javascript">\s*emailjs\.init\("MQKyFZlDIBIMySsjM"\);\s*<\/script> \*\/\}/g, '<script dangerouslySetInnerHTML={{ __html: `emailjs.init("MQKyFZlDIBIMySsjM");` }} />');


        if (content !== original) {
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Restored APIs in ${file}`);
        }
    }
}

restoreApis();
