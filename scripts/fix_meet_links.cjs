const fs = require("fs");
const path = require("path");

// 1. Update initialData.js
const initialDataPath = path.join(__dirname, "..", "src", "data", "initialData.js");
if (fs.existsSync(initialDataPath)) {
  let content = fs.readFileSync(initialDataPath, "utf8");
  content = content.replace(/meet\.google\.com\/dnc-ragas-live/g, "meet.google.com/new");
  content = content.replace(/meetingId:\s*"dnc-ragas-live"/g, 'meetingId: "ragas-live-room"');
  fs.writeFileSync(initialDataPath, content, "utf8");
  console.log("Updated initialData.js meet links");
}

// 2. Update AcademyContext.jsx
const contextPath = path.join(__dirname, "..", "src", "context", "AcademyContext.jsx");
if (fs.existsSync(contextPath)) {
  let content = fs.readFileSync(contextPath, "utf8");
  content = content.replace(/meet\.google\.com\/dnc-ragas-live/g, "meet.google.com/new");
  content = content.replace(/meetingId:\s*"dnc-ragas-live"/g, 'meetingId: "ragas-live-room"');
  content = content.replace(/meet\.google\.com\/dnc-carnatic-live/g, "meet.google.com/new");
  content = content.replace(/meetingId:\s*"dnc-carnatic-live"/g, 'meetingId: "carnatic-live-room"');
  fs.writeFileSync(contextPath, content, "utf8");
  console.log("Updated AcademyContext.jsx meet links");
}

// 3. Update AdminDashboard.jsx
const adminPath = path.join(__dirname, "..", "src", "pages", "AdminDashboard.jsx");
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, "utf8");
  content = content.replace(/meet\.google\.com\/dnc-ragas-live/g, "meet.google.com/new");
  content = content.replace(/dnc-ragas-live/g, "ragas-live-room");
  fs.writeFileSync(adminPath, content, "utf8");
  console.log("Updated AdminDashboard.jsx meet links");
}

// 4. Update StudentPortal.jsx
const studentPath = path.join(__dirname, "..", "src", "pages", "StudentPortal.jsx");
if (fs.existsSync(studentPath)) {
  let content = fs.readFileSync(studentPath, "utf8");
  content = content.replace(/meet\.google\.com\/dnc-ragas-live/g, "meet.google.com/new");
  content = content.replace(/dnc-ragas-live/g, "ragas-live-room");
  fs.writeFileSync(studentPath, content, "utf8");
  console.log("Updated StudentPortal.jsx meet links");
}

console.log("All invalid Google Meet slugs replaced!");
