import React from "react";
import { Video, Clock, ExternalLink, MessageCircle, Copy } from "lucide-react";

/**
 * Sticky Live Class Top Banner Pill
 * Shows when a live class is scheduled so students can join with 1 click from anywhere.
 */
export default function StickyLiveMeetPill({ liveSession, studentEmail, studentName, onCopyLink }) {
  if (!liveSession || !liveSession.meetUrl) return null;

  return (
    <div className="sticky top-[58px] z-30 bg-gradient-to-r from-[#162032] via-[#0F172A] to-[#162032] border-b border-[#D4AF37]/40 text-[#F5F0E8] py-2 px-4 shadow-lg backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2.5 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[9px] uppercase tracking-wider shrink-0 border border-emerald-500/30">
            Next Live Session
          </span>
          <span className="font-bold text-white truncate font-serif-luxury text-xs sm:text-sm">
            {liveSession.sessionTitle || "Classical Live Masterclass"}
          </span>
          <span className="hidden md:inline text-stone-400 font-mono text-[11px]">
            ({liveSession.scheduledDayTime})
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={liveSession.meetUrl.includes("http") ? liveSession.meetUrl : `https://${liveSession.meetUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="silk-zari-btn px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#151515] font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer tap-bounce"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Google Meet</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={`https://meet.jit.si/DancingRagas-Classroom-${encodeURIComponent((liveSession.courseCategory || "Academy").replace(/[^a-zA-Z0-9]/g, ""))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold items-center gap-1.5 transition-all cursor-pointer"
            title="Alternative zero-setup video classroom (works with no Google login)"
          >
            <span>Web Classroom</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {liveSession.passcode && (
            <button
              type="button"
              onClick={() => onCopyLink && onCopyLink(liveSession.passcode, "Passcode")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
              title="Copy meeting passcode"
            >
              <span>Code: {liveSession.passcode}</span>
              <Copy className="w-2.5 h-2.5 text-[#D4AF37]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
