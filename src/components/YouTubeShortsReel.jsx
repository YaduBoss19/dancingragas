import React, { useState, useRef, useEffect } from "react";
import { Play, Plus, Trash2, Edit3, X, ChevronLeft, ChevronRight, Film, ExternalLink, Sparkles } from "lucide-react";
import UniversalVideoPlayer from "./UniversalVideoPlayer";
import { useAcademy } from "../context/AcademyContext";

/**
 * DancingRagas YouTube Shorts & Recital Highlights Reel
 * Displays a continuous, auto-scrolling luxury reel of YouTube Shorts.
 * Available inside Tutor Portal, Admin Workspace, and Student Portal.
 */
export default function YouTubeShortsReel({ className = "" }) {
  const {
    youtubeShorts = [],
    addYouTubeShort,
    updateYouTubeShort,
    deleteYouTubeShort,
    userRole,
    showToast
  } = useAcademy();

  const [activeVideo, setActiveVideo] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingShort, setEditingShort] = useState(null);

  const [newShort, setNewShort] = useState({
    title: "",
    embedUrl: "",
    performer: "",
    batch: "Bharatanatyam Diploma"
  });

  const [editShortForm, setEditShortForm] = useState({
    title: "",
    embedUrl: "",
    performer: "",
    batch: "Bharatanatyam Diploma"
  });

  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const isTutorOrAdmin = userRole === "tutor" || userRole === "admin";

  // Continuous auto-scrolling effect (pauses on hover or touch)
  useEffect(() => {
    if (isPaused || !scrollContainerRef.current || (youtubeShorts || []).length <= 1) return;

    const interval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      // Loop back to start if at the end
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 15) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollLeft += 1;
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isPaused, youtubeShorts]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newShort.title.trim() || !newShort.embedUrl.trim()) {
      showToast("Please enter a title and YouTube Shorts URL.", "error");
      return;
    }
    if (typeof addYouTubeShort === "function") {
      addYouTubeShort(newShort);
    }
    setNewShort({
      title: "",
      embedUrl: "",
      performer: "",
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
    if (typeof updateYouTubeShort === "function") {
      updateYouTubeShort(editingShort.id, editShortForm);
    } else {
      showToast("Short updated!", "success");
    }
    setEditingShort(null);
  };

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
              Watch adavu drills, rhythm korvais, and stage recitals. Auto-scrolling reel curated directly by Dr. Malavika.
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

        {/* Horizontal Scrolling Shorts Track (Auto-scrolling with pause on hover) */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth touch-pan-x no-scrollbar select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {(youtubeShorts || []).map((short, idx) => (
            <div
              key={short.id || idx}
              className="relative shrink-0 w-44 sm:w-56 md:w-60 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-[#260A22] to-[#150515] border border-[#DFAC88]/30 shadow-lg group transition-all duration-300 hover:scale-[1.02] hover:border-[#DFAC88] cursor-pointer snap-start flex flex-col justify-between"
              onClick={() => setActiveVideo(short)}
            >
              {/* Aspect Ratio 9:14 Video Thumbnail Container */}
              <div className="relative aspect-[9/14] w-full overflow-hidden bg-stone-900">
                <img
                  src={short.thumbnail || "/images/stage_shows/stage_01.jpg"}
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
                <span>Tap to watch short</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: PLAY ACTIVE YOUTUBE SHORT
      ═══════════════════════════════════════════════════════════════ */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-md max-h-[94vh] overflow-y-auto rounded-3xl bg-[#151515] text-[#F5F0E8] border border-[#DFAC88]/40 shadow-2xl text-left font-sans my-auto">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DFAC88] block truncate">
                  {activeVideo.batch || "YouTube Shorts"} &bull; {activeVideo.performer}
                </span>
                <h4 className="text-base font-bold text-white font-serif-luxury truncate">
                  {activeVideo.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 sm:p-4">
              <div className="rounded-2xl overflow-hidden aspect-[9/16] max-h-[60vh] mx-auto bg-black border border-white/10 shadow-2xl flex items-center justify-center">
                <UniversalVideoPlayer
                  url={activeVideo.embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
              <span className="truncate pr-2">Recital performance curated by Dr. Malavika</span>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-colors shrink-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: TUTOR ADDS NEW YOUTUBE SHORT
      ═══════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#DFAC88]/40 space-y-4 text-left font-sans my-auto">
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
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Paste any YouTube Shorts URL, standard watch URL, or short link.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Performer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Malavika"
                    value={newShort.performer}
                    onChange={(e) => setNewShort({ ...newShort, performer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Batch / Discipline</label>
                  <input
                    type="text"
                    placeholder="Bharatanatyam Diploma"
                    value={newShort.batch}
                    onChange={(e) => setNewShort({ ...newShort, batch: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2 rounded-xl bg-[#260A22] text-[#E8B896] hover:text-white font-bold cursor-pointer shadow-md"
                >
                  Save &amp; Add to Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: TUTOR EDITS / REPLACES YOUTUBE SHORT LINK
      ═══════════════════════════════════════════════════════════════ */}
      {editingShort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#DFAC88]/40 space-y-4 text-left font-sans my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#C9956A]" />
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
                <label className="block font-bold text-stone-700 mb-1">YouTube Shorts URL / Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
                  value={editShortForm.embedUrl}
                  onChange={(e) => setEditShortForm({ ...editShortForm, embedUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-mono text-[11px]"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Paste a new YouTube Shorts URL to immediately replace this recital video.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Performer Name</label>
                  <input
                    type="text"
                    value={editShortForm.performer}
                    onChange={(e) => setEditShortForm({ ...editShortForm, performer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Batch / Discipline</label>
                  <input
                    type="text"
                    value={editShortForm.batch}
                    onChange={(e) => setEditShortForm({ ...editShortForm, batch: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingShort(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2 rounded-xl bg-[#260A22] text-[#E8B896] hover:text-white font-bold cursor-pointer shadow-md"
                >
                  Save / Replace Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
