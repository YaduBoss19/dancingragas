import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Heart,
  Sparkles,
  Award,
  Video,
  Send,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import UniversalVideoPlayer from "./UniversalVideoPlayer";

export default function StudentShowcaseModal({
  isOpen,
  onClose,
  studentName = "Ananya Menon",
  registrationNo = "DR-DIP-2026-084",
  batchName = "Online Bharatanatyam Diploma Course",
  activePiece = "Jathiswaram (Ragam Kalyani)",
  featuredVideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  teacherPraise = "Ananya has made tremendous leaps in Araimandi stability and footwork speed. Her eye coordination (Drishti Bheda) and devotion to the Margam repertoire are inspiring."
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const showcaseUrl = `${typeof window !== "undefined" ? window.location.origin : "https://dancingragas.vercel.app"}/#student-portal?showcase=${encodeURIComponent(registrationNo)}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(showcaseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `🌸 Blessed to share ${studentName}'s classical dance journey at DancingRagas Academy!\n\n✨ Currently mastering: ${activePiece}\n📜 Enrolled: ${batchName} (Reg: ${registrationNo})\n👩‍⚕️ Mentored by: Dr. Malavika M. Sunil (MBBS)\n\nWatch the performance recital portfolio here:\n${showcaseUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FAF7F2] border border-[#B99A63]/50 shadow-2xl overflow-hidden text-left font-sans my-auto">
        {/* iPhone Deep Burgundy Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-[#1E050B] via-[#2D0A14] to-[#1E050B] text-[#F5F0E8] border-b border-[#B99A63]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3D0B16] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
                  Proud Disciple Digital Showcase
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                  Family Portfolio
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Share your child's classical milestone recitals with family and grandparents worldwide.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Showcase Body */}
        <div className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Disciple Hero Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1E050B] via-[#350A14] to-[#1E050B] text-white border border-[#B99A63]/40 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-[#1E050B] flex items-center justify-center font-bold text-xl font-serif-luxury shadow-md">
                  {studentName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold font-serif-luxury text-white">{studentName}</h2>
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5">
                    {batchName} &bull; <span className="text-[#D4AF37] font-semibold">{activePiece}</span>
                  </p>
                  <p className="text-[10px] font-mono text-stone-400 mt-0.5">
                    Sanad No: {registrationNo}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Honors Disciple</span>
                </span>
                <p className="text-[10px] text-stone-300 mt-1">Direct Mentee of Dr. Malavika</p>
              </div>
            </div>
          </div>

          {/* Featured Recital Video Player */}
          <div className="rounded-2xl border border-stone-300 overflow-hidden shadow-md bg-black">
            <div className="p-3 bg-stone-900 text-stone-200 text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#D4AF37]">
                <Video className="w-3.5 h-3.5" />
                Featured Recital: {activePiece}
              </span>
              <span className="text-[10px] text-stone-400">Recorded for Academy Evaluation</span>
            </div>
            <UniversalVideoPlayer url={featuredVideoUrl} title={activePiece} className="w-full" />
          </div>

          {/* Guru's Words of Blessing & Praise */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <Award className="w-4 h-4 text-[#B99A63]" />
              <span>Guru's Commendation &bull; Dr. Malavika M. Sunil (MBBS)</span>
            </div>
            <blockquote className="italic text-stone-700 leading-relaxed pl-2 border-l-2 border-amber-400">
              "{teacherPraise}"
            </blockquote>
          </div>

          {/* 1-Click WhatsApp & Family Share Buttons */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <span className="text-xs uppercase font-bold text-stone-600 block">
              Share with Grandparents, Family &amp; Friends
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer tap-bounce"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share to Family WhatsApp</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer tap-bounce border border-[#B99A63]/40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Showcase Link Copied!" : "Copy Private Showcase Link"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close Showcase
          </button>
        </div>
      </div>
    </div>
  );
}
