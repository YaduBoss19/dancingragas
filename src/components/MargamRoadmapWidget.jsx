import React, { useState } from "react";
import {
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  Award,
  BookOpen,
  Info,
  Clock,
  ArrowRight
} from "lucide-react";

export default function MargamRoadmapWidget({ currentLevel = 3, courseName = "Bharatanatyam Diploma" }) {
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const MARGAM_STEPS = [
    {
      id: 1,
      title: "Adavu Varisai (Foundation)",
      sanskrit: "अडवु माला",
      category: "Nritta (Pure Technique)",
      status: "completed",
      progress: 100,
      description: "Mastery of 60 foundational adavus across 3 speeds: Tatta, Natta, Kuditta Mettu, Pakka, Sarukkal, and Mandi adavus.",
      keyCompetencies: ["Araimandi Depth (90° knee angle)", "Heel & Toe strike precision", "Hastha Mudra alignment", "Talam counting"],
      examPrereq: "Year 1 Elementary Exam passed"
    },
    {
      id: 2,
      title: "Alarippu (The Flowering)",
      sanskrit: "अलारिप्पु",
      category: "Invocation & Dedication",
      status: "completed",
      progress: 100,
      description: "Traditional invocation piece offering salutations to Guru, Sabha (audience), and God. Focuses on eye and neck coordination (Drishti & Greeva Bheda).",
      keyCompetencies: ["Tisra Eka Talam (3 beats)", "Chaturasra Eka Talam (4 beats)", "Greeva Bheda (Sundari neck movement)", "Salutation protocol"],
      examPrereq: "Stage Recital approved"
    },
    {
      id: 3,
      title: "Jathiswaram (Rhythm & Melody)",
      sanskrit: "जतीश्वरम्",
      category: "Nritta & Svara Patterns",
      status: "current",
      progress: 75,
      description: "Complex rhythmic korvais set to Carnatic svara passages (Ragam Kalyani, Rupaka Talam). Demands supreme stamina and laya precision.",
      keyCompetencies: ["Theermanam footwork", "Pakkadavu extensions", "Seamless speed transitions", "Carnatic svara singing"],
      examPrereq: "Active Unit • Assessment due Nov 15"
    },
    {
      id: 4,
      title: "Shabdam (Expressive Lyrics)",
      sanskrit: "शब्दम्",
      category: "Intro to Abhinaya (Bhava)",
      status: "unlocked",
      progress: 20,
      description: "First formal introduction to expressive story-telling and emotional mime (Abhinaya) praising divine lore (e.g. Krishna, Murugan, Devi).",
      keyCompetencies: ["Mukhabhinaya (facial expressions)", "Navarasas (9 basic emotions)", "Sanchari Bhavas (story elaboration)", "Sahityam meaning"],
      examPrereq: "Prerequisite: Jathiswaram clearance"
    },
    {
      id: 5,
      title: "Varnam (The Crown Jewel)",
      sanskrit: "वर्णम्",
      category: "Peak Margam Stamina & Mastery",
      status: "locked",
      progress: 0,
      description: "The supreme test of a classical dancer: a 40-minute unbroken masterpiece alternating intricate rhythmic jathis with intense emotional abhinaya.",
      keyCompetencies: ["40-min continuous stamina", "Intricate Charanam korvais", "Nayika Bhava (Vipralambha & Sambhoga)", "Live Nattuvangam sync"],
      examPrereq: "Senior Diploma prerequisite"
    },
    {
      id: 6,
      title: "Padam & Keerthanam (Sacred Lyricism)",
      sanskrit: "पदम् व कीर्तनम्",
      category: "Subtle Devotional Abhinaya",
      status: "locked",
      progress: 0,
      description: "Deep, slow-tempo meditative poetry in Telugu, Tamil, and Malayalam by saint-poets expressing mystical devotion and subtle psychological emotions.",
      keyCompetencies: ["Micro-expressions (Sattvika Abhinaya)", "Philosophy of Bhakti", "Improvisational Sancharis", "Vocal sync"],
      examPrereq: "Post-Varnam qualification"
    },
    {
      id: 7,
      title: "Thillana & Mangalam (Ecstatic Finale)",
      sanskrit: "तिल्लाना व मङ्गलम्",
      category: "Grand Climax & Benediction",
      status: "locked",
      progress: 0,
      description: "A fast-paced, sculpturesque rhythmic finale full of joy, statuesque poses, and rapid footwork, concluding with the universal prayer for peace.",
      keyCompetencies: ["Sculpturesque poses (Karana postures)", "Rapid Dritha speed footwork", "Stage exit choreography", "Mangalam prayer"],
      examPrereq: "Pre-Arangetram milestone"
    },
    {
      id: 8,
      title: "Official Sanad Diploma & Arangetram",
      sanskrit: "सनद दीक्षान्त समारोह",
      category: "Graduation & Solo Debut",
      status: "locked",
      progress: 0,
      description: "The formal 3-hour solo stage debut with full live Carnatic orchestra, and conferment of the Government-recognized Academy Sanad Diploma.",
      keyCompetencies: ["3-hour full Margam solo performance", "Live orchestra coordination", "Written theory dissertation", "Lineage accreditation"],
      examPrereq: "Full Margam Clearance by Dr. Malavika"
    }
  ];

  const overallMargamProgress = Math.round(
    MARGAM_STEPS.reduce((acc, step) => acc + step.progress, 0) / MARGAM_STEPS.length
  );

  return (
    <div className="rounded-3xl bg-white border border-[#B99A63]/30 shadow-xl p-6 sm:p-8 text-left font-sans space-y-6">
      {/* Header with Luxury Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1E050B] text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest border border-[#B99A63]/40">
              Natyashastra Margam Path
            </span>
            <span className="text-xs font-semibold text-stone-500">• {courseName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#151515]">
            Classical Journey &amp; Diploma Milestones
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Track your child's progress through the sacred 8-stage Margam repertoire under Dr. Malavika's direct mentorship.
          </p>
        </div>

        {/* Overall Completion Gauge */}
        <div className="p-4 rounded-2xl bg-[#F5F0E8] border border-[#B99A63]/30 flex items-center gap-4 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-300"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#D4AF37]"
                strokeDasharray={`${overallMargamProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-[#1E050B] font-serif-luxury">
              {overallMargamProgress}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Current Focus</span>
            <span className="text-xs sm:text-sm font-bold text-[#1E050B]">Stage 3: Jathiswaram</span>
            <span className="text-[10px] text-emerald-700 block font-semibold">2 Milestones Cleared</span>
          </div>
        </div>
      </div>

      {/* Interactive Milestone Progression Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {MARGAM_STEPS.map((step) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          const isUnlocked = step.status === "unlocked";
          const isLocked = step.status === "locked";

          return (
            <div
              key={step.id}
              onClick={() => setSelectedMilestone(step)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group text-left ${
                isCurrent
                  ? "bg-gradient-to-br from-[#1E050B] to-[#3D0B16] text-white border-[#D4AF37] shadow-lg shadow-[#1E050B]/20 ring-2 ring-[#D4AF37]/50"
                  : isCompleted
                  ? "bg-stone-50 hover:bg-stone-100 text-stone-900 border-emerald-500/30"
                  : isUnlocked
                  ? "bg-stone-50 hover:bg-stone-100 text-stone-900 border-amber-500/40"
                  : "bg-stone-100/60 text-stone-400 border-stone-200 opacity-70"
              }`}
            >
              {/* Step Number & Sanskrit Ribbon */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isCurrent
                      ? "bg-[#D4AF37] text-[#1E050B]"
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-800"
                      : isUnlocked
                      ? "bg-amber-100 text-amber-800"
                      : "bg-stone-200 text-stone-500"
                  }`}
                >
                  Stage 0{step.id}
                </span>

                <span className={`text-[10px] font-serif ${isCurrent ? "text-amber-200" : "text-stone-400"}`}>
                  {step.sanskrit}
                </span>
              </div>

              {/* Title & Category */}
              <h4 className={`text-sm font-bold font-serif-luxury line-clamp-1 ${isCurrent ? "text-white" : "text-stone-900"}`}>
                {step.title}
              </h4>
              <p className={`text-[11px] mb-3 line-clamp-1 ${isCurrent ? "text-stone-300" : "text-stone-500"}`}>
                {step.category}
              </p>

              {/* Status Indicator */}
              <div className="flex items-center justify-between pt-2 border-t border-black/10 mt-auto">
                <div className="flex items-center gap-1.5 text-xs">
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-bold text-emerald-700">Completed (100%)</span>
                    </>
                  ) : isCurrent ? (
                    <>
                      <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse shrink-0" />
                      <span className="text-[11px] font-bold text-[#D4AF37]">Active Study ({step.progress}%)</span>
                    </>
                  ) : isUnlocked ? (
                    <>
                      <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-[11px] font-semibold text-amber-700">Unlocked Next</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-[11px] text-stone-400">Locked Milestone</span>
                    </>
                  )}
                </div>

                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isCurrent ? "text-[#D4AF37]" : "text-stone-400"}`} />
              </div>

              {/* Progress Bar Line */}
              <div className="w-full bg-black/10 rounded-full h-1 mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted
                      ? "bg-emerald-500"
                      : isCurrent
                      ? "bg-gradient-to-r from-[#D4AF37] to-amber-300"
                      : "bg-amber-400"
                  }`}
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Milestone Modal / Flyout */}
      {selectedMilestone && (
        <div className="p-5 rounded-2xl bg-[#F5F0E8] border border-[#B99A63]/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#1E050B] text-[#D4AF37] text-xs font-bold">
                Stage 0{selectedMilestone.id} &bull; {selectedMilestone.title}
              </span>
              <span className="text-xs font-mono text-stone-600 font-semibold">{selectedMilestone.sanskrit}</span>
            </div>
            <button
              onClick={() => setSelectedMilestone(null)}
              className="text-xs text-stone-500 hover:text-stone-900 font-bold underline cursor-pointer"
            >
              Close Details
            </button>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {selectedMilestone.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#B99A63]" />
                Key Competencies Required:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-stone-600 text-[11px]">
                {selectedMilestone.keyCompetencies.map((comp, idx) => (
                  <li key={idx}>{comp}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#B99A63]" />
                Examination &amp; Graduation Prerequisite:
              </span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                {selectedMilestone.examPrereq}
              </p>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-stone-400">Mastery Weightage:</span>
                <span className="ml-1.5 font-bold text-xs text-[#1E050B]">
                  {selectedMilestone.id === 5 ? "35% of Diploma" : "10% of Diploma"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
