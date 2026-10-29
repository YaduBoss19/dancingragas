const fs = require('fs');
const path = require('path');

const showcasePath = path.join(__dirname, '..', 'src', 'components', 'CinematicReelsShowcase.jsx');
let content = fs.readFileSync(showcasePath, 'utf8');

// 1. Add import
if (!content.includes('import { useAcademy }')) {
  content = content.replace(
    /import React, \{ useState, useRef, useEffect \} from "react";/,
    'import React, { useState, useRef, useEffect } from "react";\nimport { useAcademy } from "../context/AcademyContext";'
  );
}

// 2. Add useAcademy hook inside component
content = content.replace(
  /export default function CinematicReelsShowcase\(\{[\s\S]*?\}\) \{/,
  (match) => `${match}\n  const { siteContent } = useAcademy();\n  const currentWallItems = (siteContent?.instagram && siteContent.instagram.length > 0) ? siteContent.instagram : INSTAGRAM_WALL_ITEMS;`
);

// 3. Replace INSTAGRAM_WALL_ITEMS with currentWallItems in filter and count
content = content.replace(
  /const filteredWallItems = INSTAGRAM_WALL_ITEMS\.filter/,
  'const filteredWallItems = currentWallItems.filter'
);

content = content.replace(
  /All \(\{INSTAGRAM_WALL_ITEMS\.length\}\)/,
  'All ({currentWallItems.length})'
);

fs.writeFileSync(showcasePath, content, 'utf8');
console.log('CinematicReelsShowcase.jsx connected to dynamic siteContent.instagram successfully.');
