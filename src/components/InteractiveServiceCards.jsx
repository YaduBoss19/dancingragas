import React, { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import StageSpotlightOverlay from "./StageSpotlightOverlay";
import { useAcademy } from "../context/AcademyContext";
import { playGhungrooChime } from "../utils/talamAudio";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Award,
  Music,
  Heart,
  Flame,
  Star,
  Users,
  Building,
  GraduationCap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";

// Visual themes & prefilled WhatsApp messages for each of the 11 courses & services
const SERVICE_THEMES = {
  // 5 Courses We Offer
  "crs-bharatanatyam-diploma": {
    accentColor: "border-[#B99A63]/60",
    pillBadge: "bg-[#3B0B14] text-[#D4AF37] border border-[#B99A63]/50",
    icon: Award,
    whatsappMsg:
      "Hello Dr. Malavika! I would love to enquire about enrolling in the Online Bharatanatyam Diploma Course. Please share details on the prescribed syllabus, yearly examinations, and trial class availability."
  },
  "crs-bharatanatyam-non-diploma": {
    accentColor: "border-[#B99A63]/50",
    pillBadge: "bg-[#25060C] text-[#D4AF37] border border-[#B99A63]/40",
    icon: Sparkles,
    whatsappMsg:
      "Hello Dr. Malavika! I am inquiring about the Online Bharatanatyam Non-Diploma Classes for practical training and classical dance development. Could you please share timing details?"
  },
  "crs-carnatic-music": {
    accentColor: "border-[#B99A63]/50",
    pillBadge: "bg-[#25060C] text-[#D4AF37] border border-[#B99A63]/40",
    icon: Music,
    whatsappMsg:
      "Hello Dr. Malavika! I would love to enquire about the Online Carnatic Music Classes (vocal & theory). Could you please guide me on introductory sessions and shruti alignment?"
  },
  "crs-semiclassical-bollywood": {
    accentColor: "border-amber-500/40",
    pillBadge: "bg-amber-950 text-amber-300 border border-amber-500/40",
    icon: Flame,
    whatsappMsg:
      "Hello Dr. Malavika! I am interested in joining the Online Semi-Classical Bollywood Dance Classes for expression, rhythm, and vibrant choreographies. What are the trial options?"
  },
  "crs-60-day-fitness": {
    accentColor: "border-emerald-500/40",
    pillBadge: "bg-emerald-950 text-emerald-300 border border-emerald-500/40",
    icon: Heart,
    whatsappMsg:
      "Hello Dr. Malavika! I would like to enrol in the 60-Day Fitness Program (guided yoga, dance-based workouts, and dietary guidance). Please let me know the upcoming batch schedule."
  },

  // 6 Other Services We Offer
  "srv-event-stage-show": {
    accentColor: "border-purple-500/40",
    pillBadge: "bg-purple-950 text-purple-300 border border-purple-500/40",
    icon: Users,
    whatsappMsg:
      "Hello Dr. Malavika! We are seeking Event-Based Stage Show Choreography for an upcoming cultural program / stage performance. Could we discuss the concept and timeline?"
  },
  "srv-wedding-choreography": {
    accentColor: "border-rose-500/40",
    pillBadge: "bg-rose-950 text-rose-300 border border-rose-500/40",
    icon: Star,
    whatsappMsg:
      "Hello Dr. Malavika! We need Wedding Choreography for our special occasion (solo, couple dance, and family/friends group choreography). Could we discuss songs and rehearsal slots?"
  },
  "srv-one-day-workshop": {
    accentColor: "border-orange-500/40",
    pillBadge: "bg-orange-950 text-orange-300 border border-orange-500/40",
    icon: Building,
    whatsappMsg:
      "Hello Dr. Malavika! We represent an institution/organization interested in booking an intensive One-Day Dance Workshop. Could you please share the syllabus and availability?"
  },
  "srv-three-day-workshop": {
    accentColor: "border-[#B99A63]/60",
    pillBadge: "bg-[#151515] text-[#D4AF37] border border-[#B99A63]/60",
    icon: GraduationCap,
    whatsappMsg:
      "Hello Dr. Malavika! We would like to invite you for a structured Three-Day Dance Workshop for our students / institution. Please share available dates and syllabus."
  },
  "srv-competition-choreography": {
    accentColor: "border-amber-600/40",
    pillBadge: "bg-amber-950 text-amber-200 border border-amber-600/40",
    icon: Award,
    whatsappMsg:
      "Hello Dr. Malavika! I am seeking Competition-Based Choreography (solo/duet/group) tailored to a specific theme and performance requirements. Could we discuss details?"
  },
  "srv-corporate-events": {
    accentColor: "border-blue-500/40",
    pillBadge: "bg-blue-950 text-blue-300 border border-blue-500/40",
    icon: Building,
    whatsappMsg:
      "Hello Dr. Malavika! We are looking for Corporate Event Stage Shows choreography and performance preparation for our corporate celebration / annual gala. Could you share details?"
  }
};

function InstagramIcon({ className = "w-3 h-3" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/**
 * In-Drawer Auto-Slideshow Component
 * Begins playing automatically when expanded.
 * User can pause on hover or tap to navigate slides manually.
 */
function CourseSlideshow({ images = [], title = "", instagramUrl = "" }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slideshow every 3.2s when active and not hovered
  useEffect(() => {
    if (!images || images.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [images, isPaused]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#151515] border border-[#B99A63]/35 shadow-lg group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((imgSrc, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-[#0f0e0d] flex items-center justify-center ${
            idx === currentIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Approach B: Luxury ambient feathered blurred background */}
          <img
            src={imgSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
            aria-hidden="true"
          />
          {/* Approach B: Full uncropped photo — face, crown & mudras 100% visible */}
          <img
            src={imgSrc}
            alt={`${title} photo ${idx + 1}`}
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/75 via-transparent to-black/20 pointer-events-none z-10" />
        </div>
      ))}

      {/* Top Slide Counter Badge & Instagram Reel Badge */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#151515]/85 text-[#D4AF37] text-[10px] font-bold tracking-wider uppercase border border-[#B99A63]/40 backdrop-blur-xs shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">Live Slideshow</span>
            <span className="xs:hidden">Live</span>
          </span>
          <span className="px-2 py-1 rounded-full bg-[#151515]/85 text-[#F5F0E8] text-[10px] font-bold tracking-widest border border-white/10 backdrop-blur-xs">
            {String(currentIdx + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
          </span>
        </div>

        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              playGhungrooChime();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:brightness-110 text-white text-[10px] font-bold tracking-wide shadow-md border border-white/25 transition-all hover:scale-105 active:scale-95 cursor-pointer tap-bounce backdrop-blur-xs shrink-0"
            title="Watch real dance reels & performances on Instagram"
          >
            <InstagramIcon className="w-3 h-3 text-white fill-white/20 shrink-0" />
            <span>Watch Reel</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-90 shrink-0" />
          </a>
        )}
      </div>

      {/* Next / Previous Controls */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playGhungrooChime();
              setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-[#151515] text-[#F5F0E8] hover:text-[#D4AF37] border border-white/20 flex items-center justify-center transition-all opacity-85 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer tap-bounce"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playGhungrooChime();
              setCurrentIdx((prev) => (prev + 1) % images.length);
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-[#151515] text-[#F5F0E8] hover:text-[#D4AF37] border border-white/20 flex items-center justify-center transition-all opacity-85 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer tap-bounce"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Bottom Dot Indicators */}
          <div className="absolute bottom-2.5 left-0 right-0 z-20 flex items-center justify-center gap-1.5">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playGhungrooChime();
                  setCurrentIdx(dotIdx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === currentIdx
                    ? "w-5 h-1.5 bg-[#D4AF37]"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Jump to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Individual Accordion Card Row
 * Short initial view -> expands to reveal live photo slideshow, full brief & curriculum.
 */
function CourseAccordionItem({
  course,
  theme,
  isOpen,
  onToggle,
  onBookingClick,
  onWhatsAppClick,
  onViewSyllabus
}) {
  const Icon = theme.icon || Award;
  const slideImages =
    course.images && course.images.length > 0 ? course.images : [course.image];

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "bg-white border-[#B99A63] shadow-lg ring-2 ring-[#B99A63]/20"
          : "bg-white/95 hover:bg-white border-[#A9A49D]/25 hover:border-[#B99A63]/60 shadow-xs hover:shadow-md"
      }`}
    >
      {/* ── HEADER STRIP: Short, Compact & Instant to Read ── */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-3 sm:p-3.5 md:p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Compact Photo Thumbnail with Museum Frame (Approach B: Uncropped full view) */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-[#0f0e0d] relative border border-[#B99A63]/40 shadow-xs flex items-center justify-center">
            <img
              src={course.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
              aria-hidden="true"
            />
            <img
              src={course.image}
              alt={course.title}
              className="relative z-10 w-full h-full object-contain"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/15 pointer-events-none z-10" />
            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-[#151515] text-[#D4AF37] flex items-center justify-center border border-[#B99A63]/40 z-20">
              <Icon className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold ${theme.pillBadge}`}
              >
                {course.badge || course.category}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#B99A63]" />
                {course.duration}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm md:text-base font-bold text-[#151515] font-serif-luxury truncate">
              {course.title}
            </h4>

            <p className="text-[11px] text-slate-500 truncate hidden xs:block">
              {course.level} • {course.ageGroup}
            </p>
          </div>
        </div>

        {/* Right Toggle Button & Action Hint */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-[#B99A63] hidden md:inline-block">
            {isOpen ? "Close" : "Explore"}
          </span>
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? "bg-[#151515] text-[#D4AF37] rotate-180"
                : "bg-slate-100 hover:bg-[#151515] text-slate-700 hover:text-[#D4AF37] border border-[#A9A49D]/30"
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </button>

      {/* ── EXPANDED ACCORDION DRAWER ── */}
      {isOpen && (
        <div className="px-3.5 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-slate-100 animate-fadeIn space-y-3.5">
          {/* Live Photo Slideshow */}
          <div>
            <CourseSlideshow
              images={slideImages}
              title={course.title}
              instagramUrl={course.instagramReelUrl}
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 px-1">
              <span>✦ Slideshow starts automatically</span>
              <span>Tap or hover to pause</span>
            </div>
          </div>

          {/* Full Official Description / Brief */}
          <div className="text-left space-y-1">
            <span className="text-[10px] font-bold text-[#B99A63] uppercase tracking-wider block">
              Program Brief
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {course.description}
            </p>
          </div>

          {/* Curriculum Points */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-1.5 text-left">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A63]" />
                Key Syllabus &amp; Highlights:
              </span>
              <div className="space-y-1 text-[11px] sm:text-xs text-slate-600">
                {course.syllabus.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B99A63] shrink-0 mt-1.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Specs */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600">
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-medium">
              <strong>Frequency:</strong> {course.frequency}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-medium">
              <strong>Age Group:</strong> {course.ageGroup}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-medium">
              <strong>Fee:</strong> {course.fee}
            </span>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onBookingClick(course.title)}
              className="silk-zari-btn px-4 py-2 rounded-full bg-[#151515] hover:bg-[#B99A63] text-[#F5F0E8] hover:text-[#151515] text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer tap-bounce shadow-xs hover:shadow-md"
            >
              <span>
                {course.category === "Courses We Offer"
                  ? "Book Free Trial"
                  : "Enquire Service"}
              </span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => onViewSyllabus(course)}
              className="text-[11px] font-bold text-slate-600 hover:text-[#151515] underline underline-offset-4 cursor-pointer py-1 ml-auto"
            >
              {course.category === "Courses We Offer"
                ? "Full Syllabus"
                : "Full Details"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * System 1: Dual-Sanctum Split Implementation
 * - On PC (Desktop/Widescreen): Displays 2 side-by-side columns:
 *   Left = Courses We Offer (5) | Right = Other Services We Offer (6).
 *   Fits comfortably in a single 16:9 viewport height.
 * - On Mobile (Smartphone): Uses a clean, thumb-friendly 2-Tab Switcher
 *   [Courses We Offer (5)] vs [Other Services We Offer (6)] with compact accordion rows.
 */
export default function InteractiveServiceCards({ onSelectServiceForBooking }) {
  const { courses, setSelectedCourseModal, academyInfo } = useAcademy();

  // Mobile active tab: "courses" | "services"
  const [mobileTab, setMobileTab] = useState("courses");

  // Open item state: separate per column on PC so user can compare side-by-side
  const [openCourseId, setOpenCourseId] = useState("crs-bharatanatyam-diploma");
  const [openServiceId, setOpenServiceId] = useState(null);

  // Groupings
  const academyCourses = courses.filter((c) => c.category === "Courses We Offer");
  const otherServices = courses.filter((c) => c.category === "Other Services We Offer");

  const toggleCourseAccordion = (courseId) => {
    playGhungrooChime();
    setOpenCourseId((prev) => (prev === courseId ? null : courseId));
  };

  const toggleServiceAccordion = (serviceId) => {
    playGhungrooChime();
    setOpenServiceId((prev) => (prev === serviceId ? null : serviceId));
  };

  const handleWhatsAppEnquiry = (course) => {
    playGhungrooChime();
    const meta = SERVICE_THEMES[course.id];
    const msg = meta
      ? meta.whatsappMsg
      : `Hello Dr. Malavika! I am interested in ${course.title}.`;
    const cleanNumber = academyInfo.whatsappNumber.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleBookingClick = (courseTitle) => {
    playGhungrooChime();
    if (onSelectServiceForBooking) {
      onSelectServiceForBooking(courseTitle);
    }
  };

  const handleViewSyllabus = (course) => {
    playGhungrooChime();
    setSelectedCourseModal(course);
  };

  return (
    <StageSpotlightOverlay className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#A9A49D]/20">
      <div
        id="services-section"
        className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-20"
      >
        {/* Section Heading */}
        <AnimatedSection
          animation="fade-up"
          className="text-center max-w-3xl mx-auto space-y-3.5"
        >
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#151515] font-serif-luxury">
            Courses &amp; <span className="italic text-[#B99A63]">Services</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            At DancingRagas by Dr. Malavika M. Sunil, we offer structured classical
            dance, music, and fitness courses, alongside professional choreography
            and customised dance experiences for special occasions, institutions,
            competitions, and corporate events.
          </p>
        </AnimatedSection>

        {/* ── MOBILE / TABLET 2-TAB SWITCHER (Visible on < lg screens) ── */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-center p-1.5 rounded-2xl bg-white border border-[#A9A49D]/30 shadow-xs max-w-md mx-auto mb-4">
            <button
              type="button"
              onClick={() => {
                playGhungrooChime();
                setMobileTab("courses");
              }}
              className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer tap-bounce flex items-center justify-center gap-1.5 ${
                mobileTab === "courses"
                  ? "bg-[#151515] text-[#D4AF37] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Courses ({academyCourses.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playGhungrooChime();
                setMobileTab("services");
              }}
              className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer tap-bounce flex items-center justify-center gap-1.5 ${
                mobileTab === "services"
                  ? "bg-[#151515] text-[#D4AF37] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#B99A63]" />
              <span>Services ({otherServices.length})</span>
            </button>
          </div>

          {/* Guidance note for mobile */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B99A63] animate-ping" />
            <span>Tap any item to expand brief and live photo slideshow</span>
          </div>

          {/* Mobile Accordion Stack */}
          <div className="space-y-3">
            {(mobileTab === "courses" ? academyCourses : otherServices).map((item) => {
              const theme = SERVICE_THEMES[item.id] || {
                accentColor: "border-[#B99A63]/50",
                pillBadge: "bg-[#151515] text-[#D4AF37]",
                icon: Award,
                whatsappMsg: `Hello Dr. Malavika! I am interested in ${item.title}.`
              };
              const isOpen =
                mobileTab === "courses"
                  ? openCourseId === item.id
                  : openServiceId === item.id;

              return (
                <CourseAccordionItem
                  key={item.id}
                  course={item}
                  theme={theme}
                  isOpen={isOpen}
                  onToggle={() =>
                    mobileTab === "courses"
                      ? toggleCourseAccordion(item.id)
                      : toggleServiceAccordion(item.id)
                  }
                  onBookingClick={handleBookingClick}
                  onWhatsAppClick={handleWhatsAppEnquiry}
                  onViewSyllabus={handleViewSyllabus}
                />
              );
            })}
          </div>
        </div>

        {/* ── DESKTOP DUAL-SANCTUM SPLIT (Visible on lg+ screens: 16:9 Fit) ── */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-start">
          {/* ── LEFT SANCTUM: COURSES WE OFFER (5) ── */}
          <div className="space-y-4 p-5 rounded-3xl bg-amber-50/20 border border-[#B99A63]/30 shadow-xs">
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-[#B99A63]/25 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#3B0B14] text-[#D4AF37] flex items-center justify-center border border-[#B99A63]/50 shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#151515] font-serif-luxury leading-tight">
                    Courses We Offer
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Structured Classical &amp; Wellness Syllabi with Examinations
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#3B0B14] text-[#D4AF37] text-xs font-bold border border-[#B99A63]/50 shadow-xs">
                5 Programs
              </span>
            </div>

            {/* Courses Accordion List */}
            <div className="space-y-3">
              {academyCourses.map((course) => {
                const theme = SERVICE_THEMES[course.id] || {
                  accentColor: "border-[#B99A63]/50",
                  pillBadge: "bg-[#151515] text-[#D4AF37]",
                  icon: Award,
                  whatsappMsg: `Hello Dr. Malavika! I am interested in ${course.title}.`
                };
                const isOpen = openCourseId === course.id;

                return (
                  <CourseAccordionItem
                    key={course.id}
                    course={course}
                    theme={theme}
                    isOpen={isOpen}
                    onToggle={() => toggleCourseAccordion(course.id)}
                    onBookingClick={handleBookingClick}
                    onWhatsAppClick={handleWhatsAppEnquiry}
                    onViewSyllabus={handleViewSyllabus}
                  />
                );
              })}
            </div>
          </div>

          {/* ── RIGHT SANCTUM: OTHER SERVICES WE OFFER (6) ── */}
          <div className="space-y-4 p-5 rounded-3xl bg-slate-50/70 border border-slate-200/90 shadow-xs">
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#151515] text-[#D4AF37] flex items-center justify-center border border-[#B99A63]/50 shadow-xs">
                  <Sparkles className="w-4 h-4 text-[#B99A63]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#151515] font-serif-luxury leading-tight">
                    Other Services We Offer
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Bespoke Choreography, Workshops &amp; Stage Performances
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#151515] text-[#D4AF37] text-xs font-bold border border-white/10 shadow-xs">
                6 Services
              </span>
            </div>

            {/* Services Accordion List */}
            <div className="space-y-3">
              {otherServices.map((service) => {
                const theme = SERVICE_THEMES[service.id] || {
                  accentColor: "border-[#B99A63]/50",
                  pillBadge: "bg-[#151515] text-[#D4AF37]",
                  icon: Building,
                  whatsappMsg: `Hello Dr. Malavika! I am interested in ${service.title}.`
                };
                const isOpen = openServiceId === service.id;

                return (
                  <CourseAccordionItem
                    key={service.id}
                    course={service}
                    theme={theme}
                    isOpen={isOpen}
                    onToggle={() => toggleServiceAccordion(service.id)}
                    onBookingClick={handleBookingClick}
                    onWhatsAppClick={handleWhatsAppEnquiry}
                    onViewSyllabus={handleViewSyllabus}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </StageSpotlightOverlay>
  );
}
