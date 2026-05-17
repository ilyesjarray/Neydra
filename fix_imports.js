const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apps', 'web', 'src', 'components', 'sectors', 'Neural', 'OmniIntelligence.tsx');
let content = fs.readFileSync(file, 'utf-8');

// Replace duplicate lucide-react import
const lucideImportBlock = `import {
    Send, Bot, User, Brain, BookOpen,
    Briefcase, Coffee, Terminal, Zap, Shield,
    Copy, Check, Maximize2, RotateCcw, Code2,
    Sparkles, Image as ImageIcon, Video, FileJson, Search,
    FileText, BarChart, Settings2, Languages, Microscope
} from 'lucide-react';
import { cn } from '@/lib/utils';`;

// Quick fix for the lines we saw
const lines = content.split(/\r?\n/);

// Remove lines 6 to 14 (0-indexed 6 to 14 is lines 7 to 15)
// Actually we know they are around line 7.
if (lines[6].includes('import {') && lines[13].includes('} from \'lucide-react\';')) {
    lines.splice(6, 9); // Remove those 9 lines
}

fs.writeFileSync(file, lines.join('\n'), 'utf-8');
console.log('Fixed OmniIntelligence.tsx imports');
