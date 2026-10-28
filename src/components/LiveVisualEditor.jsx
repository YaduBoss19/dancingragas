import React, { useState, useRef } from "react";
import { useAcademy } from "../context/AcademyContext";
import { compressImageFile } from "../utils/imageCompressor";
import {
  Edit3,
  Camera,
  Check,
  X,
  Sparkles,
  RotateCcw,
  Video,
  Eye,
  Sliders,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

/**
 * Floating Director Control Bar on Live Site
 * Visible only when authenticated as Director/Admin
 */
export function DirectorLiveBar() {
  const {
    isAdminLoggedIn,
    currentPage,
    navigateTo,
    isVisualEditMode,
    setIsVisualEditMode,
    resetToDefaults,
    showToast
  } = useAcademy();

  if (!isAdminLoggedIn || currentPage === "admin" || currentPage === "student-portal") {
    return null;
  }

  return (
    <aside aria-label="Director Live In-Page CMS" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#1E050B]/95 text-white border border-[#D4AF37]/60 shadow-2xl shadow-black/80 backdrop-blur-xl px-4 sm:px-6 py-2.5 rounded-full flex items-center gap-3 sm:gap-5 font-sans">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 pr-2 border-r border-white/15">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] whitespace-nowrap hidden sm:inline">
            Director CMS
          </span>
        </div>

        {/* Visual Edit Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !isVisualEditMode;
            setIsVisualEditMode(next);
            showToast(
              next
                ? "Visual In-Page Editor ACTIVATED! Hover and click any text or photo to edit."
                : "Visual In-Page Editor Deactivated (Viewing Mode).",
              next ? "success" : "info"
            );
          }}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer tap-bounce ${
            isVisualEditMode
              ? "bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] shadow-md shadow-[#D4AF37]/30"
              : "bg-white/10 hover:bg-white/20 text-stone-200"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isVisualEditMode ? "Click-to-Edit: ON" : "Turn ON Click-to-Edit"}</span>
        </button>

        {/* Restore Defaults Panic Button */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Restore factory demo presets for all text, photos and courses?")) {
              resetToDefaults();
              showToast("All text, media and presets restored to factory defaults!", "info");
            }
          }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white transition-colors cursor-pointer hidden md:flex"
          title="Restore Original Demo Content"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Open Admin Portal Link */}
        <button
          type="button"
          onClick={() => navigateTo("admin")}
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#D4AF37] border border-[#B99A63]/30 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
        >
          <span>Director Suite</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}

/**
 * Editable Text Component
 * Renders ordinary typography for public visitors.
 * For Director in Visual Edit Mode, shows a gold dashed border on hover; clicking opens an instant inline modal!
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
  const { siteContent, updateSection, isVisualEditMode, isAdminLoggedIn } = useAcademy();
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [draftValue, setDraftValue] = useState("");

  const currentValue = siteContent?.[section]?.[field] ?? defaultValue ?? children ?? "";

  const handleOpenEdit = (e) => {
    if (!isAdminLoggedIn || !isVisualEditMode) return;
    e.stopPropagation();
    e.preventDefault();
    setDraftValue(currentValue);
    setIsEditingModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSection(section, { [field]: draftValue });
    setIsEditingModalOpen(false);
  };

  if (!isAdminLoggedIn || !isVisualEditMode) {
    return <Component className={className}>{currentValue}</Component>;
  }

  return (
    <>
      <Component
        onClick={handleOpenEdit}
        className={`${className} cursor-pointer relative group transition-all duration-200 outline-1 outline-dashed outline-transparent hover:outline-[#D4AF37] hover:bg-[#D4AF37]/15 rounded-sm`}
        title={`Click to edit [${section}.${field}]`}
      >
        {currentValue}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 right-0 bg-[#1E050B] text-[#D4AF37] border border-[#D4AF37]/60 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm z-30 pointer-events-none whitespace-nowrap flex items-center gap-1">
          <Edit3 className="w-2.5 h-2.5" />
          <span>Edit</span>
        </span>
      </Component>

      {/* Instant Edit Popover Modal */}
      {isEditingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsEditingModalOpen(false)}
        >
          <div
            className="bg-[#1E050B] text-white border border-[#D4AF37]/60 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4 font-sans text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#D4AF37] text-[#1E050B] flex items-center justify-center font-bold text-xs">
                  ✎
                </span>
                <div>
                  <h4 className="font-bold text-sm text-white font-serif-luxury">Live Content Editor</h4>
                  <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-wider block">
                    {section} &bull; {field}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1.5">Edit Text Content:</label>
                {multiline ? (
                  <textarea
                    rows={4}
                    autoFocus
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#D4AF37]/40 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-sans resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    autoFocus
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#D4AF37]/40 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-sans"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-600 text-xs font-bold text-stone-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] text-xs font-bold shadow-md hover:brightness-105 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Change</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Editable Media Component (Images & Videos)
 * In normal mode, renders normal img/video.
 * In Director Visual Edit Mode, shows hover overlay "📷 Replace Photo / Video".
 * Clicking triggers browser file compression and saves the image to siteContent instantly!
 */
export function EditableMedia({
  section,
  field,
  defaultSrc = "",
  alt = "Media",
  className = "",
  type = "image", // 'image' | 'video'
  poster = ""
}) {
  const { siteContent, updateSection, isVisualEditMode, isAdminLoggedIn, showToast } = useAcademy();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const currentSrc = siteContent?.[section]?.[field] || defaultSrc;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      showToast("Optimizing photo in browser...", "info");
      const compressed = await compressImageFile(file, 1920, 0.88);
      updateSection(section, { [field]: compressed.dataUrl });
      showToast(`Photo updated successfully (${compressed.reductionPct}% smaller)!`, "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to compress photo", "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handlePromptVideo = () => {
    const url = window.prompt("Enter new Video URL (MP4, YouTube embed, Vimeo):", currentSrc);
    if (url && url.trim()) {
      updateSection(section, { [field]: url.trim() });
      showToast("Video URL updated and published live!", "success");
    }
  };

  if (!isAdminLoggedIn || !isVisualEditMode) {
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

  return (
    <div className="relative group inline-block max-w-full">
      {type === "video" ? (
        <video
          src={currentSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          className={className}
        />
      ) : (
        <img src={currentSrc} alt={alt} className={className} />
      )}

      {/* Director Overlay on Hover */}
      <div className="absolute inset-0 bg-[#1E050B]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 rounded-inherit backdrop-blur-2xs z-30">
        {type === "image" ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="silk-zari-btn px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] text-xs font-bold shadow-xl hover:brightness-105 cursor-pointer flex items-center gap-2 tap-bounce"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isUploading ? "Compressing..." : "Replace Photo"}</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePromptVideo();
            }}
            className="silk-zari-btn px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] text-xs font-bold shadow-xl hover:brightness-105 cursor-pointer flex items-center gap-2 tap-bounce"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Change Video Link</span>
          </button>
        )}
      </div>
    </div>
  );
}
