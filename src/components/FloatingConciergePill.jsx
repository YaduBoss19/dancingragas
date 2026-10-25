import React, { useState } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";
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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37]/40 via-emerald-500/30 to-[#B99A63]/40 rounded-full blur-xs opacity-75 group-hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Concierge Pill Button */}
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="relative flex items-center gap-2.5 sm:gap-3 py-2 px-3 sm:py-2.5 sm:px-4 rounded-full bg-[#151515] hover:bg-[#1C1817] text-[#F5F0E8] border border-[#B99A63]/60 shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer tap-bounce select-none"
          title="Chat directly with Dr. Malavika on WhatsApp"
          aria-label="Chat with Dr. Malavika on WhatsApp"
        >
          {/* Avatar with live presence ring */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#D4AF37]/70 bg-[#25060C] flex items-center justify-center shadow-xs">
              <img
                src="/images/teachers/dr_malavika_portrait.jpg"
                alt="Dr. Malavika M. Sunil"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <Sparkles className="w-4 h-4 text-[#D4AF37] absolute" />
            </div>

            {/* Active Online Pulse Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366] border-2 border-[#151515]" />
            </span>
          </div>

          {/* Text Content */}
          <div className="text-left flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-[#F5F0E8] font-serif-luxury tracking-wide">
                Chat with Dr. Malavika
              </span>
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366] shrink-0" />
            </div>
            <span className="text-[10px] text-[#D4AF37] font-medium hidden sm:block">
              Admissions &amp; Trial Queries • Active
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
