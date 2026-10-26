/**
 * Client-Side Browser Image Compressor & Optimizer
 * Compresses phone/desktop photos on-the-fly before uploading to cloud storage.
 * Ensures fast upload speeds, zero crash on mobile, and optimal CDN bandwidth.
 */

export async function compressImageFile(file, maxWidth = 1920, quality = 0.86) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Selected file is not an image.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Downscale proportionally if larger than maxWidth
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context 2D not supported"));
          return;
        }

        // Draw image with smooth interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Image compression failed."));
              return;
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const compressedFile = new File([blob], cleanFileName, {
              type: "image/jpeg",
              lastModified: Date.now()
            });

            const dataUrl = canvas.toDataURL("image/jpeg", quality);

            resolve({
              file: compressedFile,
              blob,
              dataUrl,
              width,
              height,
              originalSize: file.size,
              compressedSize: blob.size,
              reductionPct: Math.round(((file.size - blob.size) / file.size) * 100)
            });
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to decode image."));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}
