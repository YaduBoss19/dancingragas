import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useAcademy } from "../context/AcademyContext";

export default function DrMalavikaProfileSlideshow({
  className = "",
  aspectRatio = "aspect-[4/5]",
  showControls = true,
  autoPlay = true,
  interval = 4500,
  children
}) {
  const { siteContent } = useAcademy();

  const defaultPhotos = [
    "/images/malavika_dance_stage.jpg",
    "/images/malavika_portrait.jpg",
    "/images/malavika_dance_pose.jpg",
    "/images/malavika_vocal.jpg"
  ];

  // Get slideshow photos list from CMS, or fallback
  const rawPhotos = siteContent?.about?.profilePhotos;
  const photos = Array.isArray(rawPhotos) && rawPhotos.length > 0
    ? rawPhotos
    : [siteContent?.about?.portraitImage || defaultPhotos[0], ...defaultPhotos.slice(1)];

  const posterFallback = siteContent?.about?.posterFallbackImage || siteContent?.about?.portraitImage || defaultPhotos[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slideshow
  useEffect(() => {
    if (!autoPlay || isPaused || photos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, photos.length, interval]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-[#151515] select-none group shadow-xl ${aspectRatio} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {photos.map((photoUrl, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={photoUrl || posterFallback}
              alt={`Dr. Malavika M. Sunil - Slide ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading={idx === 0 ? "eager" : "lazy"}
              onError={(e) => {
                if (posterFallback && e.target.src !== posterFallback) {
                  e.target.src = posterFallback;
                }
              }}
            />
          </div>
        );
      })}

      {/* Ambient Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/95 via-[#151515]/30 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/40 via-transparent to-transparent pointer-events-none z-20" />

      {/* Navigation Arrows (Visible on hover on desktop, or always subtle on mobile) */}
      {showControls && photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            {photos.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(dotIdx);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  dotIdx === currentIndex
                    ? "w-4 h-1.5 bg-[#D4AF37]"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Jump to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Overlay Content / Plaque */}
      {children && (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end">
          <div className="pointer-events-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
