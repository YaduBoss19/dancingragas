import React, { useState, useMemo } from "react";
import { useAcademy } from "../context/AcademyContext";
import AnimatedSection from "../components/AnimatedSection";
import DiplomaGoldSeal from "../components/DiplomaGoldSeal";
import GoldDivider from "../components/GoldDivider";
import YouTubeShortsReel from "../components/YouTubeShortsReel";
import {
  Sparkles,
  Search,
  Clock,
  CheckCircle2,
  RotateCcw,
  Award,
  Compass,
  ArrowRight
} from "lucide-react";

export default function Courses() {
  const { courses, setSelectedCourseModal, navigateTo } = useAcademy();

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'online' | 'choreography' | 'workshops'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Tab definitions with counts and descriptions
  const PILLAR_TABS = [
    {
      id: "all",
      label: "All Offerings",
      count: courses.length,
      icon: Compass,
      description: "Explore our complete portfolio of structured classical courses, bespoke choreography, and institutional workshops."
    },
    {
      id: "courses",
      label: "Courses We Offer",
      count: courses.filter((c) => c.category === "Courses We Offer").length,
      icon: Award,
      description: "Structured programs: Online Bharatanatyam Diploma & Non-Diploma, Carnatic Music, Semi-Classical Bollywood, and 60-Day Fitness Program."
    },
    {
      id: "services",
      label: "Other Services",
      count: courses.filter((c) => c.category === "Other Services We Offer").length,
      icon: Sparkles,
      description: "Customised experiences: Event Stage Shows, Wedding Choreography, 1-Day & 3-Day Workshops, Competition Choreography, and Corporate Events."
    }
  ];

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        // Category Tab filter
        if (activeTab === "courses" && c.category !== "Courses We Offer") return false;
        if (activeTab === "services" && c.category !== "Other Services We Offer") return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (c.title || "").toLowerCase().includes(q);
          const matchDesc = (c.description || "").toLowerCase().includes(q);
          const matchBadge = (c.badge || "").toLowerCase().includes(q);
          const matchCat = (c.category || "").toLowerCase().includes(q);
          return matchTitle || matchDesc || matchBadge || matchCat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "title-asc") return (a.title || "").localeCompare(b.title || "");
        if (sortBy === "title-desc") return (b.title || "").localeCompare(a.title || "");
        return 0;
      });
  }, [courses, activeTab, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setSortBy("default");
  };

  const getButtonText = (course) => {
    if (course.category === "Other Services We Offer") return "Enquire for Service";
    return "Book Free Trial / Enrol";
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-x-clip">
      {/* ── LUXURY PAGE HEADER ────────────────────────────────────── */}
      <section className="relative pt-10 sm:pt-14 pb-12 sm:pb-16 bg-gradient-to-b from-amber-50/70 via-slate-50 to-white text-center">
        <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
            Curriculum & Offerings Portfolio
          </span>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-serif-luxury">
            Courses & <span className="gold-foil-text italic">Services We Offer</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            At DancingRagas by <strong>Dr. Malavika M. Sunil</strong>, we offer professional choreography and customised dance experiences for special occasions, institutions, competitions, and corporate events. Every service is customised to suit the event, participants, and creative vision.
          </p>
        </AnimatedSection>
      </section>

      {/* ── CATEGORIZED PILLAR TABS ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <AnimatedSection animation="fade-up" className="space-y-6">
          {/* Pillar Selector Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-3xl bg-slate-100/80 border border-slate-200">
            {PILLAR_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-2xl font-bold text-left transition-all duration-200 cursor-pointer tap-bounce ${
                    isActive
                      ? "bg-white text-slate-900 shadow-md border border-amber-300/40 ring-2 ring-amber-400/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? "bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-sm"
                          : "bg-slate-200/80 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold truncate">
                      {tab.label}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? "bg-amber-100 text-amber-900"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Filter & Active Pillar Note */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Category
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-700 mt-0.5">
                {PILLAR_TABS.find((t) => t.id === activeTab)?.description}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search classes or workshops..."
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort offerings by"
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500 transition-colors shrink-0"
              >
                <option value="default">Curated Order</option>
                <option value="title-asc">Name: A to Z</option>
                <option value="title-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ── CLASSES & SERVICES CARDS GRID ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        {filteredCourses.length === 0 ? (
          <AnimatedSection animation="fade-up" className="p-12 sm:p-16 rounded-3xl bg-white border border-slate-200 shadow-sm text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">No matching services found</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Try adjusting your search query or switch back to "All Classes & Services".
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-md hover:bg-amber-700 transition-colors inline-flex items-center gap-1.5 tap-bounce"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredCourses.map((course, idx) => {
              const isDiploma = course.id === "crs-bharatanatyam-diploma";
              const isWorkshop = course.title.toLowerCase().includes("workshop");
              const isService = course.category === "Other Services We Offer";

              return (
                <AnimatedSection
                  key={course.id}
                  delay={idx * 60}
                  className={`bg-white rounded-3xl overflow-hidden shadow-md hover-lift-3d transition-all duration-300 flex flex-col text-left group border ${
                    isDiploma
                      ? "border-2 border-amber-400 ring-4 ring-amber-100/60 shadow-amber-500/15"
                      : "border-slate-200"
                  }`}
                >
                  {/* Top Image Banner (Approach B: Full uncropped letterbox) */}
                  <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-[#0f0e0d] flex items-center justify-center">
                    <img
                      src={course.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                      aria-hidden="true"
                    />
                    <img
                      src={course.image}
                      alt={course.title}
                      className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none z-10" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-slate-900 shadow-sm backdrop-blur-md">
                        {course.category}
                      </span>
                      {course.badge && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow-sm">
                          ★ {course.badge}
                        </span>
                      )}
                    </div>

                    {/* Bottom Title Overlay */}
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-0.5">
                        {course.level}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black font-serif-luxury leading-tight text-white drop-shadow-sm">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                        <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                        </span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          {course.frequency}
                        </span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          {course.ageGroup}
                        </span>
                      </div>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Syllabus Highlights Preview */}
                    {course.syllabus && course.syllabus.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-slate-700 space-y-2">
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-[11px] sm:text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Key Modules & Takeaways:</span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                          {course.syllabus.slice(0, 4).map((item, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span className="truncate">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Card Actions Strip */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedCourseModal(course)}
                        className="text-xs font-bold text-slate-600 hover:text-amber-700 transition-colors underline-offset-4 hover:underline cursor-pointer py-1"
                      >
                        Detailed Syllabus
                      </button>

                      <button
                        onClick={() => navigateTo("trial", course)}
                        className={`px-5 py-2.5 rounded-xl text-white text-xs font-extrabold shadow-md hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer tap-bounce ${
                          isDiploma
                            ? "bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 shadow-amber-500/25"
                            : isWorkshop
                            ? "bg-gradient-to-r from-indigo-600 to-purple-700 shadow-purple-500/25"
                            : isService
                            ? "bg-gradient-to-r from-amber-600 to-rose-600 shadow-amber-500/25"
                            : "bg-gradient-to-r from-rose-500 to-violet-600 shadow-rose-500/25"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>{getButtonText(course)}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </section>

      {/* ── YOUTUBE SHORTS REEL (BELOW COURSES) ── */}
      <YouTubeShortsReel className="bg-[#FAF7F2] border-y border-[#DFAC88]/20 my-8" />

      <GoldDivider />

      {/* ACCREDITED DIPLOMA CREDENTIAL & OFFICIAL GOLD SEAL */}
      <DiplomaGoldSeal />

      <GoldDivider />

      {/* ── BESPOKE CONSULTATION CALLOUT ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-24 sm:pb-28 lg:pb-16">
        <AnimatedSection
          animation="zoom-in"
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#140F24] via-[#1A1230] to-[#0A0714] text-white shadow-2xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Direct Mentorship by Dr. Malavika
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif-luxury tracking-tight">
              Looking for a Custom Workshop or Private Choreography?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              We collaborate with international schools, university dance societies, TV shows, and families worldwide to craft unforgettable stage experiences and custom curriculum residencies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 relative z-10">
            <button
              onClick={() => navigateTo("trial", { title: "Institutional Workshop / Custom Choreography", category: "Bespoke" })}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer tap-bounce"
            >
              Consult with Dr. Malavika
            </button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
