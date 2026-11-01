import React, { useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useAcademy } from "../context/AcademyContext";
import { playGhungrooChime } from "../utils/talamAudio";

/**
 * Luxury WhatsApp Floating Concierge
 * - Default state: Compact circular logo button (never blocks content)
 * - Hover state: Smoothly expands to show "Chat on WhatsApp" when cursor hovers
 * - "Instant Reply" removed per user request
 * - Hidden inside Student and Admin Portals
 */
export default function FloatingConciergePill() {
  const { academyInfo, currentPage } = useAcademy();
  const [isHovered, setIsHovered] = useState(false);

  // Do not show on admin or student portal
  if (currentPage === "admin" || currentPage === "student-portal") {
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
        "Hello Dr. Malavika! I would like to enquire about classical dance & music admissions."
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, "_blank");
  };

  return (
    <div
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 select-none animate-in fade-in duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={handleOpenWhatsApp}
        className="group relative flex items-center bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl hover:shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all duration-300 ease-out cursor-pointer tap-bounce p-3 border-2 border-white/30"
        title="Chat with Dr. Malavika on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        {/* Ambient Pulsing Glow behind logo */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 blur-md opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* WhatsApp Icon with Online Badge */}
        <div className="relative shrink-0 flex items-center justify-center">
          <WhatsAppIcon className="w-6 h-6 text-white" />
          {/* Active Online Pulse Dot */}
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white border border-[#25D366]" />
          </span>
        </div>

        {/* Expanding Label: Visible ONLY when cursor hovers */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out flex items-center whitespace-nowrap ${
            isHovered ? "max-w-xs pl-2.5 pr-1.5 opacity-100" : "max-w-0 pl-0 pr-0 opacity-0"
          }`}
        >
          <span className="font-bold text-xs tracking-wide font-sans">
            WhatsApp Dr. Malavika
          </span>
        </div>
      </button>
    </div>
  );
}
