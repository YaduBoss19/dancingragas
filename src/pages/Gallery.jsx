import React, { useState, useRef } from "react";
import { useAcademy } from "../context/AcademyContext";
import AnimatedSection from "../components/AnimatedSection";
import {
  Play,
  Maximize2,
  Video,
  Camera,
  Sparkles
} from "lucide-react";

function GalleryCard({ item, idx, onOpenLightbox }) {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (item.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlayingPreview(true)).catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    if (item.type === "video" && videoRef.current) {
      setIsPlayingPreview(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <AnimatedSection
      delay={idx * 60}
      className="group relative rounded-3xl overflow-hidden bg-[#151515] border border-[#B99A63]/30 aspect-[4/3] shadow-xl hover:border-[#B99A63] transition-all duration-300 cursor-pointer text-left tap-bounce select-none"
      onClick={() => onOpenLightbox(item)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Approach B: Luxury ambient blurred glow backdrop */}
      <img
        src={item.url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
        aria-hidden="true"
      />

      {/* Video for hover playback */}
      {item.type === "video" && (
        <video
          ref={videoRef}
          src={item.videoUrl || "/videos/performance.mp4"}
          poster={item.url}
          muted
          loop
          playsInline
          className={`w-full h-full object-contain bg-black/80 transition-opacity duration-500 absolute inset-0 z-10 ${
            isPlayingPreview ? "opacity-100 scale-105" : "opacity-0"
          }`}
        />
      )}

      {/* Static image (Approach B: Full uncropped view) */}
      <img
        src={item.url}
        alt={item.title}
        className={`relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transition-transform duration-700 ${
          isPlayingPreview ? "opacity-0" : "opacity-100 group-hover:scale-105"
        }`}
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/95 via-[#151515]/30 to-transparent pointer-events-none z-10" />

      {/* Top media pill */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#151515]/90 text-[#D4AF37] border border-[#B99A63]/40 backdrop-blur-md shadow-sm">
          {item.category}
        </span>

        {item.type === "video" ? (
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-600 text-white flex items-center gap-1 shadow-sm">
            {isPlayingPreview ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>Playing</span>
              </>
            ) : (
              <>
                <Video className="w-3 h-3" />
                <span>Video</span>
              </>
            )}
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
            <Camera className="w-3 h-3 text-[#B99A63]" />
            <span>Photo</span>
          </span>
        )}
      </div>

      {/* Maximize icon */}
      <div className="absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#151515]/80 group-hover:bg-[#B99A63] text-white group-hover:text-[#151515] border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 z-10">
        <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>

      {/* Play icon centered for videos when not hovering */}
      {item.type === "video" && !isPlayingPreview && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#B99A63] text-[#151515] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-[#151515] ml-0.5" />
          </div>
        </div>
      )}

      {/* Bottom Caption */}
      <div className="absolute bottom-4 left-4 right-4 sm:left-5 sm:right-5 text-white z-10">
        <h3 className="text-sm sm:text-base font-bold font-serif-luxury leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
          {item.caption}
        </p>
      </div>
    </AnimatedSection>
  );
}

export default function Gallery() {
  const { gallery, setLightboxItem } = useAcademy();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Workshops",
    "Stage Shows",
    "Music & Dance",
    "Performances",
    "Carnatic Vocal",
    "Doctor & Dancer",
    "Global Productions"
  ];

  const filteredGallery = gallery.filter((item) => {
    if (activeCategory === "All") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-x-clip bg-[#F5F0E8] text-[#151515]">
      {/* Header */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-16 bg-[#151515] text-[#F5F0E8] text-center border-b border-[#B99A63]/30">
        <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto px-4 sm:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3B0B14] border border-[#B99A63]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#B99A63]" />
            <span>Moments of Grace &amp; Melody</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif-luxury text-[#F5F0E8]">
            Performance &amp; <span className="text-[#D4AF37] italic">Gallery</span>
          </h1>
        </AnimatedSection>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <AnimatedSection animation="fade-up" className="flex items-center sm:justify-center gap-2 p-2 rounded-2xl bg-[#151515] border border-[#B99A63]/30 shadow-md max-w-3xl mx-auto overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap tap-bounce ${
                activeCategory === cat
                  ? "bg-[#B99A63] text-[#151515] shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat === "All" ? "All Moments" : cat}
            </button>
          ))}
        </AnimatedSection>
      </section>

      {/* Gallery Grid with Hover Play */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <GalleryCard
              key={item.id}
              item={item}
              idx={idx}
              onOpenLightbox={(selected) => setLightboxItem(selected)}
            />
          ))}
        </div>
      </section>

      {/* Recital Production Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-24 sm:pb-28 lg:pb-16">
        <AnimatedSection
          animation="zoom-in"
          className="p-8 sm:p-12 rounded-3xl bg-[#151515] text-[#F5F0E8] border border-[#B99A63]/30 text-center max-w-3xl mx-auto space-y-3 shadow-xl"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#B99A63]">
            Professional Stage Experience
          </span>
          <h3 className="text-xl sm:text-3xl font-bold font-serif-luxury text-[#F5F0E8]">
            Professional Theater Light, Sound & High-Res Archiving
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All stage recitals, Carnatic chamber concerts, and masterclass sessions are recorded with high-definition cinema cameras. Archival footage and master recordings are shared with students for continuous personal growth.
          </p>
        </AnimatedSection>
      </section>
    </div>
  );
}
