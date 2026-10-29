const fs = require('fs');
const path = require('path');

const ctxPath = path.join(__dirname, '..', 'src', 'context', 'AcademyContext.jsx');
let content = fs.readFileSync(ctxPath, 'utf8');

content = content.replace(/\r\n/g, '\n');

const target = `  const deleteGalleryItem = (id) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
    showToast("Gallery item deleted.", "info");
  };`;

const replacement = `  const deleteGalleryItem = (id) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
    showToast("Gallery item deleted.", "info");
  };

  const updateGalleryItem = (id, updatedData) => {
    setGallery((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    showToast("Gallery media updated successfully!", "success");
  };`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(ctxPath, content, 'utf8');
  console.log('SUCCESS: updateGalleryItem defined in AcademyContext.jsx');
} else {
  console.error('ERROR: target not found even after newline normalization');
}
