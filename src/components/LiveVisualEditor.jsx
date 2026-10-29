import React from "react";
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
