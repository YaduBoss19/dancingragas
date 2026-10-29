const fs = require('fs');
const path = require('path');

// 1. Update App.jsx
const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Remove DirectorLiveBar import
appContent = appContent.replace(/import\s*\{\s*DirectorLiveBar\s*\}\s*from\s*"\.\/components\/LiveVisualEditor";\r?\n?/, '');

// Remove <DirectorLiveBar />
appContent = appContent.replace(/<DirectorLiveBar\s*\/>\r?\n?/, '');

// Update banner text from "Director Live CMS Active" to "Directorate Suite Active"
appContent = appContent.replace(
  /<span className="font-bold tracking-wide">Director Live CMS Active<\/span>/,
  '<span className="font-bold tracking-wide">Directorate Suite Active</span>'
);
appContent = appContent.replace(
  /Return to Director Suite &rarr;/,
  'Open Directorate Suite &rarr;'
);

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('App.jsx updated successfully.');

// 2. Update LiveVisualEditor.jsx
const editorPath = path.join(__dirname, '..', 'src', 'components', 'LiveVisualEditor.jsx');
const cleanEditorContent = `import React from "react";
import { useAcademy } from "../context/AcademyContext";

/**
 * Director Live Bar has been removed as per Directorate requirements.
 * Public site remains a pristine, distraction-free luxury classical dance academy.
 */
export function DirectorLiveBar() {
  return null;
}

/**
 * Dynamic Content Text Component
 * Seamlessly renders live reactive text from siteContent with zero overhead,
 * no edit borders, and no floating overlays on the public site.
 */
export function EditableText({
  section,
  field,
  defaultValue = "",
  as: Component = "span",
  className = "",
  children,
  multiline = false
}) {
  const { siteContent } = useAcademy();
  const currentValue = siteContent?.[section]?.[field] ?? defaultValue ?? children ?? "";

  return <Component className={className}>{currentValue}</Component>;
}

/**
 * Dynamic Content Media Component (Images & Videos)
 * Seamlessly renders live reactive photos and videos from siteContent.
 * All media management and Supabase storage uploading is centralized inside the Directorate Suite.
 */
export function EditableMedia({
  section,
  field,
  defaultSrc = "",
  alt = "Academy Media",
  className = "",
  type = "image", // 'image' | 'video'
  poster = ""
}) {
  const { siteContent } = useAcademy();
  const currentSrc = siteContent?.[section]?.[field] || defaultSrc;

  if (type === "video") {
    return (
      <video
        src={currentSrc}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className={className}
      />
    );
  }

  return <img src={currentSrc} alt={alt} className={className} />;
}
`;

fs.writeFileSync(editorPath, cleanEditorContent, 'utf8');
console.log('LiveVisualEditor.jsx cleaned and simplified successfully.');
