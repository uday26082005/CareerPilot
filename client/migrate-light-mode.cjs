const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /(?<!dark:)text-white/g, replace: 'text-slate-900 dark:text-white' },
  { regex: /(?<!dark:)text-gray-400/g, replace: 'text-slate-500 dark:text-gray-400' },
  { regex: /(?<!dark:)text-gray-300/g, replace: 'text-slate-600 dark:text-gray-300' },
  { regex: /(?<!dark:)text-gray-500/g, replace: 'text-slate-400 dark:text-gray-500' },
  { regex: /(?<!dark:)bg-\[\#060816\]/g, replace: 'bg-slate-50 dark:bg-[#060816]' },
  { regex: /(?<!dark:)bg-\[\#0a0c1a\]/g, replace: 'bg-white dark:bg-[#0a0c1a]' },
  { regex: /(?<!dark:)border-white\/5(?!0)/g, replace: 'border-slate-200 dark:border-white/5' },
  { regex: /(?<!dark:)border-white\/10/g, replace: 'border-slate-200 dark:border-white/10' },
  { regex: /(?<!dark:)border-white\/20/g, replace: 'border-slate-300 dark:border-white/20' },
  { regex: /(?<!dark:)(?<!hover:)bg-white\/5(?!0)/g, replace: 'bg-slate-100 dark:bg-white/5' },
  { regex: /(?<!dark:)(?<!hover:)bg-white\/10/g, replace: 'bg-slate-200 dark:bg-white/10' },
  { regex: /(?<!dark:)(?<!hover:)bg-white\/20/g, replace: 'bg-slate-300 dark:bg-white/20' },
  { regex: /(?<!dark:)hover:bg-white\/5(?!0)/g, replace: 'hover:bg-slate-100 dark:hover:bg-white/5' },
  { regex: /(?<!dark:)hover:bg-white\/10/g, replace: 'hover:bg-slate-200 dark:hover:bg-white/10' },
  { regex: /(?<!dark:)hover:text-white/g, replace: 'hover:text-slate-900 dark:hover:text-white' },
  { regex: /(?<!dark:)bg-white\/\[0\.02\]/g, replace: 'bg-white dark:bg-white/[0.02]' },
  { regex: /(?<!dark:)bg-white\/\[0\.03\]/g, replace: 'bg-white/80 dark:bg-white/[0.03]' },
  { regex: /(?<!dark:)bg-white\/\[0\.01\]/g, replace: 'bg-slate-50 dark:bg-white/[0.01]' },
  { regex: /(?<!dark:)hover:bg-white\/\[0\.02\]/g, replace: 'hover:bg-slate-100 dark:hover:bg-white/[0.02]' },
  { regex: /(?<!dark:)hover:bg-white\/\[0\.03\]/g, replace: 'hover:bg-slate-100 dark:hover:bg-white/[0.03]' },
  { regex: /(?<!dark:)shadow-\[4px_0_24px_rgba\(0,0,0,0\.2\)\]/g, replace: 'shadow-xl dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

const targetDirs = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
];

for (const dir of targetDirs) {
  processDirectory(dir);
}

console.log('Migration completed.');
