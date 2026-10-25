import React, { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { useAcademy } from "../context/AcademyContext";
import {
  Clock,
  Sparkles,
  ArrowRight,
  MessageCircle,
  MapPin,
  GraduationCap
} from "lucide-react";

/**
 * Academy Happenings, Events & Masterclasses Section
 * Inspired by Sacred Heart College's (shcollege.ac.in) academic event cards and news grid.
 * Combines institutional prestige with direct WhatsApp enquiry and trial bookings.
 */
export default function AcademyNewsAndEvents({ onBookSlot }) {
  const { academyInfo } = useAcademy();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Events" },
    { id: "masterclass", label: "Masterclasses" },
    { id: "workshops", label: "Anatomy & Yoga" },
    { id: "vocal", label: "Carnatic Vocal" },
    { id: "admissions", label: "Cohort Admissions" }
  ];

  const events = [
    {
      id: "evt-navarasa",
      date: "28",
      month: "OCT",
      year: "2026",
      category: "masterclass",
      badge: "Masterclass",
      badgeColor: "bg-[#3B0B14] text-[#D4AF37] border-[#B99A63]/50",
      title: "Navarasa Abhinaya Intensive: Expressive Depth in Margam Repertoire",
      mode: "Online & In-Studio / Live Interactive",
      time: "Flexible Global Slots",
      description:
        "A private masterclass dedicated to unlocking facial expressiveness (Bhavam), eye movements (Drishti Bhedas), and emotional nuances of the 9 classical Rasas.",
      mentor: "Dr. Malavika M. Sunil",
      whatsappMsg:
        "Hello Dr. Malavika! I am interested in registering for the Navarasa Abhinaya Intensive Masterclass. Could you please share slot details?"
    },
    {
      id: "evt-anatomy",
      date: "08",
      month: "NOV",
      year: "2026",
      category: "workshops",
      badge: "Doctor-Led",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
      title: "Dance Kinesiology: Knee Biomechanics & Injury-Free Araimandi Practice",
      mode: "Physician-Led Clinic",
      time: "Weekend Special Sessions",
      description:
        "Dr. Malavika integrates MBBS medical science and yoga postures to diagnose stance imbalances, protect dancer knees, and develop endurance safely.",
      mentor: "Dr. Malavika M. Sunil (MBBS)",
      whatsappMsg:
        "Hello Dr. Malavika! I would like to enquire about your Dance Kinesiology and Araimandi Joint Safety workshop."
    },
    {
      id: "evt-shruti",
      date: "15",
      month: "NOV",
      year: "2026",
      category: "vocal",
      badge: "Carnatic Music",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
      title: "Carnatic Vocal Shruti Alignment & Tala Math for Classical Dancers",
      mode: "Interactive Vocal Studio",
      time: "Morning & Evening Batches",
      description:
        "Master the pitch resonance of the foundational Sa-Pa-Sa' Tanpura drone, Swara patterns, and rhythm synchronization between voice and footwork.",
      mentor: "Hereditary Vocal Lineage (16+ Yrs)",
      whatsappMsg:
        "Hello Dr. Malavika! I am inquiring about enrolling in the Carnatic Vocal Shruti Alignment and Tala sessions."
    },
    {
      id: "evt-cohort",
      date: "01",
      month: "DEC",
      year: "2026",
      category: "admissions",
      badge: "Admissions Open",
      badgeColor: "bg-[#151515] text-[#D4AF37] border-[#B99A63]/60",
      title: "2026/27 Studio Cohorts & Masterclasses: Margam & Bespoke Solo",
      mode: "Full Syllabus Coaching",
      time: "Annual Intake",
      description:
        "Exclusive direct enrollment for dedicated students worldwide seeking accredited syllabus progress, Arangetram preparation, and custom performance choreography.",
      mentor: "Dr. Malavika M. Sunil",
      whatsappMsg:
        "Hello Dr. Malavika! I would love to apply for your 2026/27 Studio Cohort and Masterclasses. Please guide me through the admission process."
    }
  ];

  const filteredEvents =
    activeCategory === "all"
      ? events
      : events.filter((e) => e.category === activeCategory);

  const handleWhatsAppEnquiry = (msg) => {
    const url = `https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="academy-events" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-8 bg-[#FAF7F2] border-b border-[#A9A49D]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 lg:space-y-12 relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#151515] font-serif-luxury">
            Academy <span className="italic text-[#B99A63]">Announcements</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Explore our curated masterclasses, doctor-led kinesiology clinics, and upcoming studio cohort admissions.
          </p>
        </AnimatedSection>

        {/* Category Filter Tabs (Inspired by SH College Gutena-Tabs) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer tap-bounce ${
                activeCategory === cat.id
                  ? "bg-[#151515] text-[#F5F0E8] shadow-md shadow-[#151515]/25 scale-[1.02] border border-[#B99A63]"
                  : "bg-white text-slate-700 border border-[#A9A49D]/30 hover:border-[#B99A63] hover:bg-[#F5F0E8]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 2x2 Event Cards Grid with Big Calendar Date Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredEvents.map((evt) => (
            <AnimatedSection
              key={evt.id}
              animation="fade-up"
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#A9A49D]/25 shadow-md hover:shadow-2xl hover:border-[#B99A63]/60 transition-all duration-300 flex flex-col justify-between group text-left"
            >
              <div className="space-y-4">
                {/* Top Row: Date Badge + Category Tag */}
                <div className="flex items-start justify-between gap-4">
                  {/* Big Institutional Date Block (SH College Style) */}
                  <div className="shrink-0 w-16 h-18 sm:w-18 sm:h-20 rounded-2xl bg-[#151515] text-[#F5F0E8] border border-[#B99A63]/50 flex flex-col items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <span className="text-xl sm:text-2xl font-black font-serif-luxury text-[#D4AF37] leading-none">
                      {evt.date}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#B99A63] mt-0.5 leading-none">
                      {evt.month}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono mt-0.5 leading-none">
                      {evt.year}
                    </span>
                  </div>

                  {/* Mode & Category Tags */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${evt.badgeColor}`}>
                      {evt.badge}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#B99A63]" />
                      <span>{evt.mode}</span>
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#151515] group-hover:text-[#B99A63] transition-colors leading-snug">
                  {evt.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {evt.description}
                </p>

                {/* Mentor Meta */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-[#B99A63]" />
                    <span>{evt.mentor}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-[#B99A63]" />
                    <span>{evt.time}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-[#A9A49D]/20 flex items-center">
                <button
                  onClick={() => {
                    if (onBookSlot) onBookSlot(evt.title);
                    else {
                      const el = document.getElementById("book-trial");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#151515] hover:bg-[#B99A63] text-[#F5F0E8] hover:text-[#151515] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer tap-bounce border border-[#B99A63]/50"
                >
                  <span>Reserve Session Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
