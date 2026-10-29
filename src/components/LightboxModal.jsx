import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAcademy } from "../context/AcademyContext";
import { formatVideoEmbedUrl } from "../utils/videoUtils";
import { X, ChevronLeft, ChevronRight, Smartphone } from "lucide-react";

export default function LightboxModal() {
  const { lightboxItem, setLightboxItem, gallery } = useAcademy();
  const [animating, setAnimating] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentIndex = lightboxItem ? gallery.findIndex((item) => item.id === lightboxItem.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex === -1 || gallery.length === 0) return;
    setAnimating(true);
    setTimeout(() => {
      const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
      setLightboxItem(gallery[prevIndex]);
      setAnimating(false);
    }, 150);
  }, [currentIndex, gallery, setLightboxItem]);

  const handleNext = useCallback(() => {
    if (currentIndex === -1 || gallery.length === 0) return;
    setAnimating(true);
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % gallery.length;
      setLightboxItem(gallery[nextIndex]);
      setAnimating(false);
    }, 150);
  }, [currentIndex, gallery, setLightboxItem]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxItem) return;
      if (e.key === "Escape") setLightboxItem(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem, handlePrev, handleNext, setLightboxItem]);

  // Touch gesture swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext(); // swipe left -> show next
      } else {
        handlePrev(); // swipe right -> show previous
      }
    }
  };

  if (!lightboxItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setLightboxItem(null)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={() => setLightboxItem(null)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer tap-bounce"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button (hidden on touch if swiping, but visible for tap) */}
      {gallery.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all cursor-pointer tap-bounce"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {gallery.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="hidden sm:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all cursor-pointer tap-bounce"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content Container */}
      <div
        className={`max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col text-left transition-all duration-200 ${
          animating ? "opacity-40 scale-[0.98]" : "opacity-100 scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Container */}
        <div className="relative max-h-[65vh] sm:max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
          {lightboxItem.videoSrc ? (
            <video
              src={lightboxItem.videoSrc}
              controls
              autoPlay
              playsInline
              className="max-h-[65vh] sm:max-h-[70vh] w-auto max-w-full mx-auto"
            />
          ) : lightboxItem.type === "video" && lightboxItem.videoUrl ? (
            <div className="w-full aspect-video">
              <iframe
                src={formatVideoEmbedUrl(lightboxItem.videoUrl)}
                title={lightboxItem.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={lightboxItem.url}
              alt={lightboxItem.title}
              className="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain mx-auto select-none"
            />
          )}

          {/* Swipe indicator hint on mobile */}
          <div className="sm:hidden absolute bottom-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/70 text-[10px] flex items-center gap-1.5 pointer-events-none">
            <Smartphone className="w-3 h-3" />
            <span>Swipe left or right to switch</span>
          </div>
        </div>

        {/* Caption bar */}
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-900/60 text-purple-300 border border-purple-700/50">
              {lightboxItem.category}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {currentIndex + 1} of {gallery.length}
              </span>
              {/* Mobile next/prev tap controls */}
              <div className="flex sm:hidden items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-1 rounded-lg bg-slate-800 text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1 rounded-lg bg-slate-800 text-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <h3 className="text-base sm:text-xl font-bold text-white mb-1">
            {lightboxItem.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lightboxItem.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
