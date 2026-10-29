const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'generate_full_admin_dashboard.cjs');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Replace single-backslash \n in template literal with double-backslash \\n
scriptContent = scriptContent.replace(
  /\.join\("\\n"\)/g,
  '.join("\\\\n")'
);
scriptContent = scriptContent.replace(
  /\.split\("\\n"\)/g,
  '.split("\\\\n")'
);
scriptContent = scriptContent.replace(
  /Module 1: Basic Adavus\\nModule 2: Hastha Mudras\\nModule 3: Tala & Laya Precision/g,
  'Module 1: Basic Adavus\\\\nModule 2: Hastha Mudras\\\\nModule 3: Tala & Laya Precision'
);
scriptContent = scriptContent.replace(
  /Module 1: Basic Adavus\\nModule 2: Hastha Mudras/g,
  'Module 1: Basic Adavus\\\\nModule 2: Hastha Mudras'
);

fs.writeFileSync(scriptPath, scriptContent, 'utf8');
console.log('generate_full_admin_dashboard.cjs updated with double-escaped newlines.');
