const fs = require("fs");
const path = require("path");

function replaceColorsInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");

  // Replace muddy burgundy/maroons with sleek Midnight Navy & Obsidian Slate
  // #1E050B -> #0F172A (Deep Midnight Slate)
  // #3D0B16 -> #1E293B (Rich Slate Navy)
  // #2A0812 -> #162032 (Deep Indigo Obsidian)
  // #2D0A14 -> #0B132B (Midnight Blue)
  // #3B0B14 -> #1E293B
  // #4E0E1B -> #334155
  // #2E0913 -> #162032
  // #FBF9F5 -> #F8FAFC (Crisp Alabaster)

  const replacements = [
    [/1E050B/gi, "0F172A"],
    [/3D0B16/gi, "1E293B"],
    [/2A0812/gi, "162032"],
    [/2D0A14/gi, "0B132B"],
    [/3B0B14/gi, "1E293B"],
    [/4E0E1B/gi, "334155"],
    [/2E0913/gi, "162032"],
    [/FBF9F5/gi, "F8FAFC"]
  ];

  for (const [pattern, rep] of replacements) {
    code = code.replace(pattern, rep);
  }

  fs.writeFileSync(filePath, code, "utf8");
  console.log(`Updated colors in ${filePath}`);
}

const files = [
  path.join(__dirname, "..", "src", "pages", "StudentPortal.jsx"),
  path.join(__dirname, "..", "src", "pages", "AdminDashboard.jsx"),
  path.join(__dirname, "..", "src", "components", "AuthModal.jsx"),
  path.join(__dirname, "..", "src", "components", "FloatingTanpuraBar.jsx"),
  path.join(__dirname, "..", "src", "components", "MobileStudentNavBar.jsx"),
  path.join(__dirname, "..", "src", "components", "StickyLiveMeetPill.jsx"),
  path.join(__dirname, "..", "src", "components", "StudentProfileModal.jsx"),
  path.join(__dirname, "..", "src", "components", "TanpuraDroneWidget.jsx")
];

files.forEach(replaceColorsInFile);
console.log("Color theme elevation completed!");
