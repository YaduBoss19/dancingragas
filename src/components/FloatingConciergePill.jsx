import React, { useState } from "react";
import { X } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useAcademy } from "../context/AcademyContext";
import { playGhungrooChime } from "../utils/talamAudio";

export default function FloatingConciergePill() {
  const { academyInfo, currentPage } = useAcademy();
  const [isDismissed, setIsDismissed] = useState(false);

  // Do not show on admin or student portal
  if (isDismissed || currentPage === "admin" || currentPage === "student-portal") {
    return null;
  }

  const handleOpenWhatsApp = () => {
    try {
      playGhungrooChime();
    } catch {
      // Audio fallback
    }
    const cleanNumber = (academyInfo?.whatsappNumber || "919074585672").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      academyInfo?.whatsappDefaultMsg ||
        "Hello Dr. Malavika! I would like to book a trial session for dance / music coaching."
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative group">
        {/* Glow ambient background */}
        <div className="absolute -inset-1 bg-[#25D366]/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Concierge Pill Button with authentic WhatsApp branding */}
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="relative flex items-center gap-2.5 sm:gap-3 py-2 px-3 sm:py-2.5 sm:px-4 rounded-full bg-[#260A22] hover:bg-[#3D1035] text-[#FBF7F5] border border-[#25D366]/60 shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer tap-bounce select-none"
          title="Chat directly with Dr. Malavika on WhatsApp"
          aria-label="Admission Enquiries on WhatsApp"
        >
          {/* Avatar with authentic WhatsApp Icon badge */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#25D366] bg-[#25D366] flex items-center justify-center shadow-md">
              <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            {/* Active Online Pulse Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366] border-2 border-[#260A22]" />
            </span>
          </div>

          {/* Text Content */}
          <div className="text-left flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-white font-serif-luxury tracking-wide">
                Enquire on WhatsApp
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#25D366]/20 text-[#25D366] text-[9px] font-bold">
                Online
              </span>
            </div>
            <span className="text-[10px] text-rose-200/80 font-medium hidden sm:block">
              Admissions &amp; Trial Classes &bull; Instant Reply
            </span>
          </div>
        </button>
      </div>

      {/* Dismiss micro-button (optional user preference) */}
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer text-[10px] hidden lg:flex"
        title="Hide concierge pill for this session"
        aria-label="Close concierge"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
