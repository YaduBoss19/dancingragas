import React, { useState, useRef, useEffect } from "react";
import { useAcademy } from "../context/AcademyContext";
import { parseVideoUrl } from "../utils/videoUtils";
import {
  Film,
  Play,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Edit3,
  ExternalLink,
  Sparkles,
  Volume2
} from "lucide-react";

export default function YouTubeShortsReel({ className = "" }) {
  const {
    youtubeShorts = [],
    addYouTubeShort,
    deleteYouTubeShort,
    updateYouTubeShort,
    userRole,
    showToast
  } = useAcademy();

  const scrollContainerRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingShort, setEditingShort] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const [newShort, setNewShort] = useState({
    title: "",
    embedUrl: "",
    performer: "Dr. Malavika M. Sunil",
    batch: "Bharatanatyam Diploma"
  });

  const [editShortForm, setEditShortForm] = useState({
    title: "",
    embedUrl: "",
    performer: "",
    batch: "Bharatanatyam Diploma"
  });

  const isTutorOrAdmin = userRole === "tutor" || userRole === "admin";

  // Smooth continuous auto-scrolling marquee
  useEffect(() => {
    if (isPaused || !scrollContainerRef.current || (youtubeShorts || []).length <= 1) return;

    const interval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollLeft += 1;
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isPaused, youtubeShorts]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const distance = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth"
    });
  };

  const extractVideoId = (rawUrl = "") => {
    if (!rawUrl) return null;
    const parsed = parseVideoUrl(rawUrl);
    if (parsed.videoId) return parsed.videoId;
    const match = rawUrl.match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/i);
    return match ? match[1] : null;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newShort.title.trim() || !newShort.embedUrl.trim()) {
      showToast("Please provide both title and video URL.", "error");
      return;
    }
    const videoId = extractVideoId(newShort.embedUrl);
    const formattedUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : newShort.embedUrl.trim();
    const autoThumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "/images/stage_shows/stage_01.jpg";

    addYouTubeShort({
      ...newShort,
      embedUrl: formattedUrl,
      thumbnail: autoThumb
    });

    setNewShort({
      title: "",
      embedUrl: "",
      performer: "Dr. Malavika M. Sunil",
      batch: "Bharatanatyam Diploma"
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingShort) return;
    if (!editShortForm.title.trim() || !editShortForm.embedUrl.trim()) {
      showToast("Please provide both title and video URL.", "error");
      return;
    }
    const videoId = extractVideoId(editShortForm.embedUrl);
    const formattedUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : editShortForm.embedUrl.trim();
    const autoThumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : editingShort.thumbnail;

    if (typeof updateYouTubeShort === "function") {
      updateYouTubeShort(editingShort.id, {
        ...editShortForm,
        embedUrl: formattedUrl,
        thumbnail: autoThumb
      });
    } else {
      showToast("Short updated!", "success");
    }
    setEditingShort(null);
  };

  // Helper to extract active video ID for the popup player
  const activeVideoId = activeVideo ? extractVideoId(activeVideo.embedUrl) : null;

  return (
    <section className={`w-full py-6 text-left font-sans ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600/15 text-rose-500 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                <Film className="w-3 h-3" />
                <span>YouTube Shorts Reel</span>
              </span>
              <span className="text-[11px] font-semibold text-stone-400">
                Continuous Recital Showcase
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-stone-900">
              Disciple Recitals &amp; Classical Footwork Shorts
            </h3>
            <p className="text-xs text-stone-500 max-w-xl">
              Watch adavu drills, rhythm korvais, and stage recitals. Tap any short to play directly in the pop-up player.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isTutorOrAdmin && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="silk-zari-btn px-4 py-2 rounded-full bg-[#260A22] text-[#E8B896] hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md tap-bounce"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add YouTube Short</span>
              </button>
            )}

            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center justify-center cursor-pointer shadow-xs transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center justify-center cursor-pointer shadow-xs transition-colors"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Shorts Track (Auto-scrolling with pause on hover/touch) */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth touch-pan-x no-scrollbar select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {(youtubeShorts || []).map((short, idx) => {
            const vId = extractVideoId(short.embedUrl);
            const thumbUrl = short.thumbnail || (vId ? `https://img.youtube.com/vi/${vId}/hqdefault.jpg` : "/images/stage_shows/stage_01.jpg");

            return (
              <div
                key={short.id || idx}
                className="relative shrink-0 w-44 sm:w-56 md:w-60 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-[#260A22] to-[#150515] border border-[#DFAC88]/30 shadow-lg group transition-all duration-300 hover:scale-[1.02] hover:border-[#DFAC88] cursor-pointer snap-start flex flex-col justify-between"
                onClick={() => setActiveVideo(short)}
              >
                {/* Aspect Ratio 9:14 Video Thumbnail Container */}
                <div className="relative aspect-[9/14] w-full overflow-hidden bg-stone-900">
                  <img
                    src={thumbUrl}
                    alt={short.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                    onError={(e) => {
                      e.target.src = "/images/stage_shows/stage_01.jpg";
                    }}
                  />

                  {/* Ambient dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/50" />

                  {/* Top Badge: YouTube Shorts Red Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-md">
                    <Play className="w-2.5 h-2.5 fill-white" />
                    <span>Shorts</span>
                  </div>

                  {/* Tutor Actions: Edit/Replace & Delete */}
                  {isTutorOrAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingShort(short);
                          setEditShortForm({
                            title: short.title,
                            embedUrl: short.embedUrl,
                            performer: short.performer || "",
                            batch: short.batch || "Bharatanatyam Diploma"
                          });
                        }}
                        className="w-7 h-7 rounded-full bg-black/70 hover:bg-[#D4AF37] text-white hover:text-stone-900 flex items-center justify-center transition-colors shadow-md cursor-pointer"
                        title="Edit / Replace Shorts Link"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Remove YouTube Short "${short.title}"?`)) {
                            deleteYouTubeShort(short.id);
                          }
                        }}
                        className="w-7 h-7 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
                        title="Delete Short"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Center Play Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#E8B896] text-[#260A22] flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Bottom Details Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-left space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#DFAC88] block truncate">
                      {short.batch || "Bharatanatyam"}
                    </span>
                    <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug drop-shadow-md">
                      {short.title}
                    </h4>
                    <p className="text-[11px] text-stone-300 truncate">
                      By {short.performer || "Dr. Malavika"}
                    </p>
                  </div>
                </div>

                {/* Card Footer Strip */}
                <div className="p-2.5 bg-black/50 border-t border-white/10 flex items-center justify-between text-[11px] text-[#DFAC88]">
                  <span>Tap to play in pop-up window</span>
                  <Play className="w-3 h-3 fill-current" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: PLAY ACTIVE YOUTUBE SHORT DIRECTLY IN POPUP WINDOW
      ═══════════════════════════════════════════════════════════════ */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-[#151515] text-[#F5F0E8] border border-[#DFAC88]/40 shadow-2xl text-left font-sans my-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1D101C]">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DFAC88] block truncate">
                  {activeVideo.batch || "Classical Recital"} &bull; {activeVideo.performer}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-serif-luxury truncate">
                  {activeVideo.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
                title="Close Pop-up Player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Container: 9:16 Vertical Video Frame that plays immediately */}
            <div className="p-3 sm:p-4 bg-black flex items-center justify-center">
              <div className="relative w-full aspect-[9/16] max-h-[65vh] rounded-2xl overflow-hidden bg-black shadow-inner border border-white/10">
                {activeVideoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&mute=0&controls=1&rel=0&playsinline=1&modestbranding=1`}
                    title={activeVideo.title}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                    <p className="text-xs font-bold text-stone-300">Invalid YouTube Link</p>
                    <p className="text-[11px] text-stone-500 mt-1">Please provide a valid YouTube Shorts or Video URL.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer bar */}
            <div className="p-3 sm:p-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400 bg-[#1D101C]">
              <span className="truncate pr-2 text-[11px]">Curated by Dr. Malavika M. Sunil</span>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-colors shrink-0"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: TUTOR ADDS NEW YOUTUBE SHORT
      ═══════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#DFAC88]/40 space-y-4 text-left font-sans my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                  Add YouTube Short to Reel
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Performance Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alarippu Tisra Eka Rhythm Drill"
                  value={newShort.title}
                  onChange={(e) => setNewShort({ ...newShort, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">YouTube Shorts Link or Video URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
                  value={newShort.embedUrl}
                  onChange={(e) => setNewShort({ ...newShort, embedUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Accepts any YouTube Shorts or video link. Plays directly in the pop-up player.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Performer / Guru</label>
                  <input
                    type="text"
                    value={newShort.performer}
                    onChange={(e) => setNewShort({ ...newShort, performer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Batch / Cohort</label>
                  <select
                    value={newShort.batch}
                    onChange={(e) => setNewShort({ ...newShort, batch: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="Bharatanatyam Diploma">Bharatanatyam Diploma</option>
                    <option value="Bharatanatyam Foundation">Bharatanatyam Foundation</option>
                    <option value="Carnatic Vocal Music">Carnatic Vocal Music</option>
                    <option value="Semi-Classical & Bollywood">Semi-Classical &amp; Bollywood</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-5 py-2 rounded-xl bg-[#260A22] text-[#DFAC88] font-bold cursor-pointer shadow-md"
                >
                  Save to Showcase Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: TUTOR EDITS / REPLACES YOUTUBE SHORT
      ═══════════════════════════════════════════════════════════════ */}
      {editingShort && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setEditingShort(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#DFAC88]/40 space-y-4 text-left font-sans my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#B99A63]" />
                <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                  Edit / Replace YouTube Short
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingShort(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Performance Title *</label>
                <input
                  type="text"
                  required
                  value={editShortForm.title}
                  onChange={(e) => setEditShortForm({ ...editShortForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">YouTube Shorts Link or Video URL *</label>
                <input
                  type="url"
                  required
                  value={editShortForm.embedUrl}
                  onChange={(e) => setEditShortForm({ ...editShortForm, embedUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Replace with any new YouTube shorts or video URL.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Performer / Guru</label>
                  <input
                    type="text"
                    value={editShortForm.performer}
                    onChange={(e) => setEditShortForm({ ...editShortForm, performer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Batch / Cohort</label>
                  <select
                    value={editShortForm.batch}
                    onChange={(e) => setEditShortForm({ ...editShortForm, batch: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="Bharatanatyam Diploma">Bharatanatyam Diploma</option>
                    <option value="Bharatanatyam Foundation">Bharatanatyam Foundation</option>
                    <option value="Carnatic Vocal Music">Carnatic Vocal Music</option>
                    <option value="Semi-Classical & Bollywood">Semi-Classical &amp; Bollywood</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingShort(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-5 py-2 rounded-xl bg-[#260A22] text-[#DFAC88] font-bold cursor-pointer shadow-md"
                >
                  Update Short
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
