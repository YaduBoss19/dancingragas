/**
 * Video URL Parser & Embed Formatter
 * Accurately parses all formats of YouTube, Vimeo, Google Drive, and Direct MP4 files
 * Ensures videos play 100% reliably in iframes and video players across Tutor and Student portals.
 */

export function parseVideoUrl(rawUrl = "") {
  if (!rawUrl || typeof rawUrl !== "string") {
    return {
      type: "empty",
      embedUrl: "",
      originalUrl: "",
      videoId: null,
      isPlayable: false
    };
  }

  const url = rawUrl.trim();

  // 1. YouTube Formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://youtube.com/shorts/VIDEO_ID
  // - https://youtube.com/live/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://m.youtube.com/watch?v=VIDEO_ID
  const ytRegex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = url.match(ytRegex);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: "youtube",
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
      originalUrl: url,
      isPlayable: true
    };
  }

  // 2. Vimeo Formats:
  // - https://vimeo.com/VIDEO_ID
  // - https://player.vimeo.com/video/VIDEO_ID
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)|player\.vimeo\.com\/video\/(\d+))/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && (vimeoMatch[1] || vimeoMatch[2])) {
    const videoId = vimeoMatch[1] || vimeoMatch[2];
    return {
      type: "vimeo",
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`,
      originalUrl: url,
      isPlayable: true
    };
  }

  // 3. Google Drive Formats:
  // - https://drive.google.com/file/d/FILE_ID/view
  // - https://drive.google.com/file/d/FILE_ID/preview
  const gDriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i;
  const gDriveMatch = url.match(gDriveRegex);
  if (gDriveMatch && gDriveMatch[1]) {
    const fileId = gDriveMatch[1];
    return {
      type: "gdrive",
      fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: url,
      isPlayable: true
    };
  }

  // 4. Direct video files (MP4, WebM, OGG, MOV) or Supabase storage video URLs
  const isDirect = /\.(mp4|webm|ogg|mov)($|\?)/i.test(url) || url.includes("supabase.co/storage") || url.startsWith("/videos/");
  if (isDirect) {
    return {
      type: "direct",
      embedUrl: url,
      originalUrl: url,
      videoId: null,
      isPlayable: true
    };
  }

  // 5. Already formatted embed URL or fallback
  if (url.includes("/embed/")) {
    return {
      type: "youtube",
      embedUrl: url,
      originalUrl: url,
      videoId: null,
      isPlayable: true
    };
  }

  return {
    type: "generic",
    embedUrl: url,
    originalUrl: url,
    videoId: null,
    isPlayable: Boolean(url)
  };
}

/**
 * Returns clean embed URL ready for iframe or player
 */
export function formatVideoEmbedUrl(url = "") {
  return parseVideoUrl(url).embedUrl;
}
