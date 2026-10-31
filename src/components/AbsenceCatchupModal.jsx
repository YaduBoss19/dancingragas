import WhatsAppIcon from "./WhatsAppIcon";
import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Play,
  FileText,
  Send,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function AbsenceCatchupModal({
  isOpen,
  onClose,
  studentName = "Ananya Menon",
  onAbsenceLogged
}) {
  const [absenceDate, setAbsenceDate] = useState("");
  const [reason, setReason] = useState("Academic Exams & School Tests");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onAbsenceLogged) {
      onAbsenceLogged({ date: absenceDate, reason, notes });
    }
  };

  const RECENT_MISSED_SESSIONS = [
    {
      id: "missed-1",
      date: "Saturday, Oct 24, 2026",
      topic: "Jathiswaram Korvai 3 & 4 (Tisra Gati Transitions)",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      notesPdf: "/materials/Jathiswaram_Korvai3_Notes.pdf",
      duration: "45 mins"
    },
    {
      id: "missed-2",
      date: "Wednesday, Oct 21, 2026",
      topic: "Alarippu Speed Drills & Sundari Greeva Bheda",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      notesPdf: "/materials/Alarippu_Speed_Drills.pdf",
      duration: "40 mins"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FAF7F2] border border-[#B99A63]/50 shadow-2xl overflow-hidden text-left font-sans my-auto">
        {/* Deep Burgundy Top Header Bar */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-[#1E050B] via-[#2D0A14] to-[#1E050B] text-[#F5F0E8] border-b border-[#B99A63]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3D0B16] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
                  Absence Care &amp; Makeup Catch-Up
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                  Zero Fall-Behind
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Log planned travel or school absences in 1 click &bull; Catch up immediately with full recordings.
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

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-emerald-950 font-serif-luxury">
                Absence Logged &bull; Makeup Clearance Issued
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                Thank you for notifying us! Dr. Malavika and the faculty team have been informed. Your attendance streak is protected, and the full class recording will be ready in your vault immediately after the live batch completes.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/919074585672?text=${encodeURIComponent(
                    `🌸 Namaste Dr. Malavika,\n\nThis is to notify that ${studentName} will be unable to attend class on ${absenceDate}.\nReason: ${reason}${notes ? `\nNotes: ${notes}` : ""}\n\nPlease excuse this planned absence. Thank you!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md cursor-pointer tap-bounce"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Also Notify Dr. Malavika on WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-emerald-900 font-bold underline cursor-pointer"
              >
                Log another upcoming absence date
              </button>
            </div>
          ) : (
            /* Absence Form */
            <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-[#B99A63]" />
                <span>1-Tap Upcoming Absence Request</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Date of Expected Absence *
                  </label>
                  <input
                    type="date"
                    required
                    value={absenceDate}
                    onChange={(e) => setAbsenceDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:border-[#B99A63] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Primary Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:border-[#B99A63] focus:outline-none"
                  >
                    <option value="Academic Exams & School Tests">Academic Exams &amp; School Tests</option>
                    <option value="Family Travel / Out of Town">Family Travel / Out of Town</option>
                    <option value="Health / Rest / Recovery">Health / Rest / Recovery</option>
                    <option value="Family Function / Festive Event">Family Function / Festive Event</option>
                    <option value="Other">Other Personal Commitment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Optional Note for Dr. Malavika
                </label>
                <input
                  type="text"
                  placeholder="e.g. Preparing for mid-term science paper on Monday"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:border-[#B99A63] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] hover:text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer tap-bounce border border-[#B99A63]/40"
              >
                <span>Notify Faculty &amp; Protect Attendance Streak</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </form>
          )}

          {/* Missed Class Catch-Up Vault */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-stone-600 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#B99A63]" />
                Recent Recordings to Catch Up On
              </span>
              <span className="text-[11px] text-stone-400">Never miss a beat</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {RECENT_MISSED_SESSIONS.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:border-[#B99A63]/50 transition-all"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#B99A63] uppercase tracking-wider">
                      {sess.date} &bull; {sess.duration}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-[#1E050B]">
                      {sess.topic}
                    </h5>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={sess.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#1E050B] text-[#D4AF37] text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 text-[#D4AF37]" />
                      <span>Watch Recording</span>
                    </a>

                    <button
                      onClick={() => alert(`Downloading study notes for: ${sess.topic}`)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all"
                      title="Download Notes"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close Absence Manager
          </button>
        </div>
      </div>
    </div>
  );
}
