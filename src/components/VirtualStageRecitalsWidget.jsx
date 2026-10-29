import React, { useState } from "react";
import {
  Calendar,
  Sparkles,
  Video,
  Award,
  Users,
  ChevronRight,
  ExternalLink,
  Send,
  CheckCircle2
} from "lucide-react";

export default function VirtualStageRecitalsWidget({ studentName = "Ananya Menon" }) {
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [isSlotBooked, setIsSlotBooked] = useState(false);

  const UPCOMING_FESTIVALS = [
    {
      id: "fest-1",
      title: "Winter Margam Tarangam 2026",
      date: "December 20, 2026",
      category: "Global Virtual Broadcast",
      description: "Annual winter conservatory recital streamed live to parents, grandparents, and dance patrons worldwide across 14 countries.",
      allowedLevels: "All Enrolled Disciples (Foundation to Diploma)",
      duration: "5–8 minutes per soloist",
      deadline: "Submissions close Dec 5"
    },
    {
      id: "fest-2",
      title: "Thyagaraja & Purandara Dasa Aradhana",
      date: "January 26, 2027",
      category: "Classical Music & Natya Tribute",
      description: "Sacred devotional tribute honoring the saint-composers of South India. Disciples present Pancharatna Krithis and Keerthanams.",
      allowedLevels: "Carnatic Vocal & Intermediate Margam Disciples",
      duration: "10 minutes per presentation",
      deadline: "Submissions close Jan 10"
    },
    {
      id: "fest-3",
      title: "Navarasa Youth Classical Biennale",
      date: "April 10, 2027",
      category: "Annual Academy Stage Conclave",
      description: "Premier competitive recital evaluated by guest external Natyashastra gurus with certificate of distinction and cash scholarships.",
      allowedLevels: "Diploma Years 2, 3 & Arangetram aspirants",
      duration: "15 minutes per Margam suite",
      deadline: "Submissions close March 20"
    }
  ];

  return (
    <div className="rounded-3xl bg-white border border-[#B99A63]/30 shadow-lg p-6 sm:p-8 text-left font-sans space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1E050B] text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest border border-[#B99A63]/40">
              Stage &amp; Broadcast
            </span>
            <span className="text-xs font-semibold text-stone-500">• Performance Opportunities</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#151515]">
            Virtual Stage &amp; Annual Tarangam Conclaves
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Every disciple is nurtured to perform. Explore upcoming broadcast stages and register your recital presentation.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F5F0E8] border border-[#B99A63]/30 text-xs flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#1E050B] text-[#D4AF37] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Next Live Broadcast</span>
            <strong className="text-sm text-[#1E050B]">Dec 20, 2026</strong>
            <span className="text-[10px] text-emerald-700 block font-semibold">Submissions Open</span>
          </div>
        </div>
      </div>

      {/* Festival Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {UPCOMING_FESTIVALS.map((fest) => (
          <div
            key={fest.id}
            className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 hover:border-[#B99A63]/60 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1E050B] text-[#D4AF37]">
                  {fest.category}
                </span>
                <span className="text-xs font-bold text-stone-700">{fest.date}</span>
              </div>

              <h4 className="text-base font-bold font-serif-luxury text-stone-900 group-hover:text-[#1E050B] transition-colors">
                {fest.title}
              </h4>

              <p className="text-xs text-stone-600 leading-relaxed">
                {fest.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-stone-500">
                <span>Eligibility:</span>
                <strong className="text-stone-800 text-right">{fest.allowedLevels}</strong>
              </div>
              <div className="flex items-center justify-between text-stone-500">
                <span>Time Slot:</span>
                <strong className="text-stone-800">{fest.duration}</strong>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedFestival(fest);
                  setIsSlotBooked(false);
                }}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] hover:text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer tap-bounce"
              >
                <span>Register Performance Slot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Slot Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF7F2] border border-[#B99A63]/50 shadow-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#B99A63] tracking-widest block">Stage Registration</span>
                <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-[#1E050B]">
                  {selectedFestival.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFestival(null)}
                className="w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            {isSlotBooked ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950 font-serif-luxury">
                  Performance Slot Reserved!
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Congratulations! {studentName} has been assigned a live broadcast slot for {selectedFestival.title} on {selectedFestival.date}. Our production team will contact you with camera guidelines and streaming links.
                </p>
                <button
                  onClick={() => setSelectedFestival(null)}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                >
                  Return to Sanctuary
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1">
                  <span className="text-stone-500 font-semibold">Registered Disciple:</span>
                  <strong className="text-stone-900 block text-sm">{studentName}</strong>
                  <span className="text-[11px] text-stone-600 block">Date of Broadcast: {selectedFestival.date}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Select Repertoire Item for Broadcast
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#B99A63]">
                    <option>Alarippu in Tisra Eka Talam</option>
                    <option>Jathiswaram in Ragam Kalyani</option>
                    <option>Shabdam in Ragamalika</option>
                    <option>Varnam: Roopa Varnam Solo Presentation</option>
                    <option>Carnatic Vocal Geetham &amp; Varnam Solo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Practice Video Link (YouTube Unlisted or Drive)
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtu.be/... (for Guru pre-approval)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#B99A63]"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSlotBooked(true)}
                    className="flex-1 py-3 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm Stage Slot Submission</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFestival(null)}
                    className="px-4 py-3 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
