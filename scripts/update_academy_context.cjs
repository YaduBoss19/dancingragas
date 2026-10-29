const fs = require('fs');
const path = require('path');

const contextPath = path.join(__dirname, '..', 'src', 'context', 'AcademyContext.jsx');
let content = fs.readFileSync(contextPath, 'utf8');

// 1. Add updateGalleryItem definition if not present
if (!content.includes('const updateGalleryItem =')) {
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

  content = content.replace(target, replacement);
}

// 2. Update isAdminLoggedIn check in Provider value
content = content.replace(
  /isAdminLoggedIn:\s*isAdminLoggedIn\s*\|\|\s*userRole\s*===\s*"admin",/,
  'isAdminLoggedIn: isAdminLoggedIn || userRole === "admin" || userRole === "tutor",'
);

// 3. Export updateGalleryItem in Provider value
if (!content.includes('updateGalleryItem,')) {
  content = content.replace(
    /deleteGalleryItem,/,
    'deleteGalleryItem,\n        updateGalleryItem,'
  );
}

fs.writeFileSync(contextPath, content, 'utf8');
console.log('AcademyContext.jsx updated with updateGalleryItem and tutor role support.');
