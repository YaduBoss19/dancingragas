const fs = require('fs');
const path = require('path');

const clientPath = path.join(__dirname, '..', 'src', 'lib', 'supabaseClient.js');
let content = fs.readFileSync(clientPath, 'utf8');

const targetFunction = `export async function uploadMediaToBucket(bucketName, file, folder = "uploads") {
  if (!isSupabaseConfigured || !supabase) {
    // Return base64 or object URL fallback
    return {
      url: URL.createObjectURL(file),
      path: \`\${folder}/\${file.name}\`,
      error: null
    };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = \`\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}.\${fileExt}\`;
  const filePath = \`\${folder}/\${fileName}\`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) return { url: null, error };

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl, path: filePath, error: null };
}`;

const replacementFunction = `export async function uploadMediaToBucket(bucketName = "academy-media", file, folder = "uploads") {
  // Try Supabase Storage Bucket first if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name ? file.name.split(".").pop() : "jpg";
      const fileName = \`\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}.\${fileExt}\`;
      const filePath = \`\${folder}/\${fileName}\`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        return {
          url: publicUrlData.publicUrl,
          path: filePath,
          error: null,
          source: "supabase"
        };
      }
      console.warn("Supabase storage upload error, falling back to local persistent data URL:", error);
    } catch (e) {
      console.warn("Supabase storage exception, falling back:", e);
    }
  }

  // Fallback to FileReader Base64 Data URL so it is fully persistent across sessions
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result,
          path: \`\${folder}/\${file.name || "media"}\`,
          error: null,
          source: "local"
        });
      };
      reader.onerror = () => {
        resolve({
          url: URL.createObjectURL(file),
          path: \`\${folder}/\${file.name || "media"}\`,
          error: null,
          source: "objectUrl"
        });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      resolve({
        url: URL.createObjectURL(file),
        path: \`\${folder}/\${file.name || "media"}\`,
        error: null,
        source: "objectUrl"
      });
    }
  });
}`;

// Normalize line breaks before replacing
const normalize = str => str.replace(/\r\n/g, '\n');
const normalizedContent = normalize(content);
const normalizedTarget = normalize(targetFunction);

if (normalizedContent.includes(normalizedTarget)) {
  const newContent = normalizedContent.replace(normalizedTarget, replacementFunction);
  fs.writeFileSync(clientPath, newContent, 'utf8');
  console.log('supabaseClient.js updated successfully.');
} else {
  console.error('Target function not matched directly. Checking alternative match...');
  const fnRegex = /export async function uploadMediaToBucket[\s\S]*?\n\}/;
  if (fnRegex.test(content)) {
    content = content.replace(fnRegex, replacementFunction);
    fs.writeFileSync(clientPath, content, 'utf8');
    console.log('supabaseClient.js updated via regex.');
  } else {
    console.error('Failed to locate uploadMediaToBucket.');
  }
}
