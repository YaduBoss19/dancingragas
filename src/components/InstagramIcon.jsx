import React from "react";

export default function InstagramIcon({ className = "w-5 h-5", alt = "Instagram" }) {
  return (
    <img
      src="/images/instagram_logo.webp"
      alt={alt}
      className={`object-contain inline-block rounded-xs ${className}`}
      loading="lazy"
    />
  );
}
