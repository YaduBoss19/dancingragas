import React, { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import SacredMandalaScroll from "./SacredMandalaScroll";
import { useAcademy } from "../context/AcademyContext";
import { playGhungrooChime } from "../utils/talamAudio";
import { EditableText, EditableMedia } from "./LiveVisualEditor";
import DrMalavikaProfileSlideshow from "./DrMalavikaProfileSlideshow";
import {
  Sparkles,
  Award,
  Music,
  Film,
  Stethoscope,
  Globe,
  Heart,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const MILESTONES = [
  {
    year: "2003 – Present",
    period: "21+ Years",
    tabLabel: "Bharatanatyam (2003)",
    title: "Bharatanatyam Discipline & Margam Mastery",
    guru: "Dr. Sunil Nellay (Father & Master Guru)",
    institution: "Nellay Nrithya Kalalayam",
    category: "Classical Dance",
    icon: Sparkles,
    badgeColor: "bg-[#3B0B14] text-[#D4AF37] border-[#B99A63]/50",
    quote: "Dance is not an external routine; it is an inward sadhana passed down from father to daughter.",
    description:
      "Initiated into classical Bharatanatyam in early childhood under her father Dr. Sunil Nellay. Mastered the pure technical precision of Adavus, intricate Talam calculations, and the complete classical Margam repertoire (Alarippu, Jathiswaram, Shabdam, Varnam, Padam, Thillana).",
    achievements: [
      "Rigorous Gurukula-style discipline under master Dr. Sunil Nellay",
      "Full classical Margam mastery and traditional Arangetram debut",
      "Foundation for lifelong aesthetic integrity and pedagogical purity"
    ]
  },
  {
    year: "2008 – Present",
    period: "16+ Years",
    tabLabel: "Carnatic Vocal (2008)",
    title: "Carnatic Vocal Lineage & Shruti Sadhana",
    guru: "Resmi Narayanan (Mother & Vocal Mentor)",
    institution: "Hereditary Vocal Lineage",
    category: "Vocal Music",
    icon: Music,
    badgeColor: "bg-[#25060C] text-[#D4AF37] border-[#B99A63]/40",
    quote: "A dancer without swara knowledge is like a temple without a flame.",
    description:
      "Nurtured from childhood in the divine traditions of Carnatic vocal music by mother Resmi Narayanan. Steeped in shruti alignment, swara mathematical patterns (Sarali, Janta, Dhatu), foundational ragas, complex Varnams, and expressive devotional Keerthanas.",
    achievements: [
      "16+ continuous years of classical vocal training and live recital practice",
      "Mastery of Tala-Raga synchronization for classical dance accompaniment",
      "Direct vocal pedagogy focusing on pitch resonance and breath control"
    ]
  },
  {
    year: "2008",
    period: "National Honour",
    tabLabel: "CCRT Scholar (2008)",
    title: "CCRT National Scholarship Awardee",
    guru: "Government of India",
    institution: "Centre for Cultural Resources & Training (Ministry of Culture)",
    category: "Accreditation",
    icon: Award,
    badgeColor: "bg-[#3B0B14] text-[#D4AF37] border-[#B99A63]/50",
    quote: "Recognised nationally at age 12 among India's most promising young classical artists.",
    description:
      "Selected at the age of 12 for the coveted National Cultural Talent Search Scholarship by CCRT (Ministry of Culture, Govt. of India). This national fellowship supported advanced masterclasses, repertoire development, and participation in premier national cultural festivals.",
    achievements: [
      "Conferred National Scholar status in Bharatanatyam",
      "Represented young classical talent at state & national conclaves",
      "Certified benchmark of classical excellence recognised globally"
    ]
  },
  {
    year: "2004 – 2008",
    period: "Silver Screen",
    tabLabel: "Cinema (2004-08)",
    title: "Child Actress in 5 Landmark Malayalam Films",
    guru: "Indian Cinema",
    institution: "Collaborations with Mohanlal, Mammootty & Sathyan Anthikad",
    category: "Cinema & Abhinaya",
    icon: Film,
    badgeColor: "bg-rose-950 text-rose-300 border-rose-500/40",
    quote: "Cinema taught me authentic emotive abhinaya—living the character without artificial pretense.",
    description:
      "Featured as a celebrated child artist in 5 iconic Malayalam feature films alongside titans of Indian cinema: Mohanlal, Mammootty, Urvashi, and master director Sathyan Anthikad. Cultivated naturalistic Navarasa emotive depth that elevates her classical abhinaya today.",
    achievements: [
      "Starred in Achuvinte Amma, Rasathanthram, Raappakal, Vinodayathra & Innathe Chinthavishayam",
      "Collaborated closely with legendary cinema masters and award-winning directors",
      "Seamlessly translated silver-screen emotive subtlety into classical dance storytelling"
    ]
  },
  {
    year: "2018 – 2024",
    period: "Medical Science",
    tabLabel: "MBBS & Yoga (2018-24)",
    title: "MBBS Physician & Certified Yoga Educator",
    guru: "ALTE University, Georgia",
    institution: "Anatomical Kinesiology & Biomechanics",
    category: "Medical Science",
    icon: Stethoscope,
    badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
    quote: "Understanding human anatomy transforms dance from repetitive strain into lifelong healing.",
    description:
      "Completed her MBBS from ALTE University, Georgia. Graduated as a medical doctor (MBBS) in Georgia and qualified as a certified yoga instructor.",
    achievements: []
  },
  {
    year: "2020 – Present",
    period: "Global Reach",
    tabLabel: "600+ Stages (2020+)",
    title: "600+ Stage Recitals & International Productions",
    guru: "Global Stages & DancingRagas",
    institution: "20+ Productions in Georgia & Worldwide Studio Classes",
    category: "International",
    icon: Globe,
    badgeColor: "bg-purple-950 text-purple-300 border-purple-500/40",
    quote: "Art knows no geographical boundaries. Today, our students connect from 12+ nations.",
    description:
      "Over 600 stage recitals across India and Europe, and founder of DancingRagas. Directed 20+ major cultural productions and university workshops in Georgia. Now dedicating her expertise to mentoring students worldwide with personalised attention.",
    achievements: [
      "600+ live stage recitals and classical concert performances",
      "Directed 20+ stage productions and institutional masterclasses across Georgia",
      "Global mentorship for students in North America, Europe, the Gulf & Asia"
    ]
  }
];

export default function CuratorMasterProfile() {
  const { academyInfo } = useAcademy();
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(0);

  const activeMilestone = MILESTONES[activeMilestoneIdx];
  const MilestoneIcon = activeMilestone.icon;

  const handleSelectMilestone = (idx) => {
    playGhungrooChime();
    setActiveMilestoneIdx(idx);
  };

  const handlePrevMilestone = () => {
    playGhungrooChime();
    setActiveMilestoneIdx((prev) => (prev - 1 + MILESTONES.length) % MILESTONES.length);
  };

  const handleNextMilestone = () => {
    playGhungrooChime();
    setActiveMilestoneIdx((prev) => (prev + 1) % MILESTONES.length);
  };

  const scrollToTrial = () => {
    playGhungrooChime();
    const el = document.getElementById("book-trial");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openWhatsApp = () => {
    playGhungrooChime();
    const cleanNumber = academyInfo.whatsappNumber.replace(/[^0-9]/g, "");
    const msg =
      "Hello Dr. Malavika! I was reading your master profile and artistic journey on DancingRagas. I would love to discuss personal coaching / enrollment.";
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section
      id="about-artist"
      className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#A9A49D]/20 bg-[#FAF7F2] relative overflow-hidden"
    >
      {/* Anchor aliases for Navbar compatibility */}
      <span id="meet-instructor" className="absolute -top-24" />
      <span id="artistic-journey" className="absolute -top-24" />

      {/* Sacred Temple Yantra Mandala Background Watermark */}
      <SacredMandalaScroll
        className="absolute -right-28 -top-20 opacity-[0.05] pointer-events-none -z-10"
        size={540}
      />
      <div className="absolute -left-32 bottom-0 w-80 h-80 bg-[#B99A63]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 sm:space-y-12">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#151515] font-serif-luxury">
            About <EditableText section="about" field="title" defaultValue="Dr. Malavika M. Sunil" className="italic text-[#B99A63]" />
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Rooted in sacred tradition, guided by anatomical science. Meet <strong>Dr. Malavika M. Sunil</strong> — Bharatanatyam artist, Carnatic vocalist,
            CCRT National Scholar, and medical physician blending 21+ years of lineage with clinical biomechanics.
          </p>
        </AnimatedSection>

        {/* ── UNIFIED MASTER-PROFILE GRID: Portrait + Bio + Milestones ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ── LEFT PANEL (5 cols): Portrait, Philosophy & Badges ── */}
          <AnimatedSection
            animation="fade-up"
            delay={100}
            className="lg:col-span-5 space-y-4 sm:space-y-5"
          >
            {/* Museum Gilded Frame Portrait */}
            <div className="museum-frame group shadow-xl">
              <div className="museum-frame-inner aspect-[4/5] bg-[#151515] relative overflow-hidden rounded-2xl">
                <DrMalavikaProfileSlideshow
                  aspectRatio="aspect-[4/5]"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/95 via-[#151515]/30 to-transparent pointer-events-none" />

                {/* Gilded Plaque Overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-left text-white space-y-0.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3B0B14] text-[#D4AF37] border border-[#B99A63]/50 inline-block uppercase tracking-wider mb-1">
                    <EditableText section="about" field="badge" defaultValue="Principal Guru & Physician" />
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#F5F0E8] leading-tight">
                    Dr. Malavika M. Sunil
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#A9A49D]">
                    <EditableText section="about" field="doctorCredentials" defaultValue="Disciple of Dr. Sunil Nellay & Resmi Narayanan" />
                  </p>
                </div>
              </div>
            </div>

            {/* Teaching Philosophy Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#151515] text-[#F5F0E8] border border-[#B99A63]/40 shadow-md space-y-2 text-left">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#B99A63] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#B99A63] text-[#B99A63]" />
                <span>My Teaching Philosophy</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                <EditableText section="about" field="philosophy" multiline defaultValue="No two bodies or voices are identical. In our dedicated coaching, we discard one-size-fits-all pressures. We progress at your exact pace, aligning rhythm, anatomy, and soulful expression so you truly own your art." />
              </p>
            </div>

            {/* 4 Core Milestone Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-2.5 pt-1">
              <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#A9A49D]/25 shadow-xs text-center">
                <div className="text-lg sm:text-xl font-black text-[#151515] font-serif-luxury">
                  21+ Yrs
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold">
                  Bharatanatyam Margam
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#B99A63]/40 shadow-xs text-center">
                <div className="text-lg sm:text-xl font-black text-[#B99A63] font-serif-luxury">
                  CCRT
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold">
                  National Scholar (Age 12)
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#A9A49D]/25 shadow-xs text-center">
                <div className="text-lg sm:text-xl font-black text-[#151515] font-serif-luxury">
                  MBBS
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold">
                  Doctor &amp; Yoga Science
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#B99A63]/40 shadow-xs text-center">
                <div className="text-lg sm:text-xl font-black text-[#B99A63] font-serif-luxury">
                  600+
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-semibold">
                  Stage Productions
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ── RIGHT PANEL (7 cols): Narrative Biography + Interactive 21-Year Milestones ── */}
          <AnimatedSection
            animation="fade-up"
            delay={200}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Narrative Biography */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#A9A49D]/25 shadow-xs space-y-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B99A63] block">
                Living Lineage &amp; Pedagogy
              </span>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <EditableText section="about" field="bio1" multiline defaultValue="Welcome to a private space where classical dance and music are taught as living arts. I began my Bharatanatyam journey over 21 years ago under my father and master guru, Dr. Sunil Nellay, and trained for 16+ years in Carnatic vocal music under my mother, Resmi Narayanan. At age 12, I was honored with the prestigious CCRT National Scholarship by the Government of India." />
              </p>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Alongside 600+ stage recitals and starring in 5 Malayalam feature films (including{" "}
                <em>Kaazhcha</em>, <em>Achuvinte Amma</em> &amp; <em>Rasathanthram</em> with Mohanlal &amp;
                Mammootty), I completed my medical degree (<strong>MBBS</strong>) in Tbilisi,
                Georgia, and qualified as a certified yoga instructor. This unique intersection of
                medicine and movement enables me to coach dancers with biomechanical precision—preventing
                injuries, correcting posture, and conditioning vocal endurance safely.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-slate-600">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  ✦ Doctor-Led Biomechanics
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  ✦ Prescribed Syllabus &amp; Exams
                </span>
                <span className="px-3 py-1 rounded-full bg-[#151515] text-[#D4AF37]">
                  ✦ Global Mentorship
                </span>
              </div>
            </div>

            {/* ── INTERACTIVE 21-YEAR MILESTONE SLIDER ── */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#B99A63]/30 shadow-md space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-base sm:text-lg font-bold text-[#151515] font-serif-luxury flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B99A63]" />
                    <span>Her 21-Year Artistic Milestones</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Click through the defining chapters from 2003 to present
                  </p>
                </div>

                {/* Slider Chevrons & Counter */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">
                    {String(activeMilestoneIdx + 1).padStart(2, "0")} /{" "}
                    {String(MILESTONES.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={handlePrevMilestone}
                    aria-label="Previous milestone"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-[#151515] text-slate-700 hover:text-[#D4AF37] border border-[#A9A49D]/30 flex items-center justify-center transition-all cursor-pointer tap-bounce"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMilestone}
                    aria-label="Next milestone"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-[#151515] text-slate-700 hover:text-[#D4AF37] border border-[#A9A49D]/30 flex items-center justify-center transition-all cursor-pointer tap-bounce"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Milestone Selector Pill Strip */}
              <div
                className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {MILESTONES.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectMilestone(idx)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer tap-bounce ${
                      idx === activeMilestoneIdx
                        ? "bg-[#151515] text-[#D4AF37] shadow-sm scale-[1.02] border border-[#B99A63]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent"
                    }`}
                  >
                    {m.tabLabel}
                  </button>
                ))}
              </div>

              {/* Active Milestone Card Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#151515] text-[#F5F0E8] border border-[#B99A63]/40 shadow-inner space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#3B0B14] text-[#D4AF37] flex items-center justify-center border border-[#B99A63]/50">
                      <MilestoneIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#B99A63] font-mono tracking-wider block">
                        {activeMilestone.year} • {activeMilestone.period}
                      </span>
                      <h5 className="text-sm sm:text-base font-bold text-[#F5F0E8] font-serif-luxury leading-tight">
                        {activeMilestone.title}
                      </h5>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${activeMilestone.badgeColor}`}
                  >
                    {activeMilestone.category}
                  </span>
                </div>

                {/* Institution & Quote */}
                <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-white/10">
                  <p className="text-[#D4AF37] font-medium">
                    ✦ {activeMilestone.guru} — <em>{activeMilestone.institution}</em>
                  </p>
                  <p className="text-slate-300 italic text-xs leading-relaxed">
                    "{activeMilestone.quote}"
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeMilestone.description}
                </p>

                {/* Key Accomplishments (if any) */}
                {activeMilestone.achievements && activeMilestone.achievements.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    {activeMilestone.achievements.map((item, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-start gap-1.5 text-[11px] text-slate-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A63] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToTrial}
                  className="silk-zari-btn px-6 py-2.5 rounded-full bg-[#151515] hover:bg-[#B99A63] text-[#F5F0E8] hover:text-[#151515] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer tap-bounce shadow-xs hover:shadow-md"
                >
                  <span>Book Private Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
