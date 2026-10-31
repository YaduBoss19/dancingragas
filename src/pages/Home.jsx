import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import AnimatedSection from "../components/AnimatedSection";
import CinematicReelsShowcase from "../components/CinematicReelsShowcase";
import GoldParticlesCanvas from "../components/GoldParticlesCanvas";
import CuratorMasterProfile from "../components/CuratorMasterProfile";
import InteractiveServiceCards from "../components/InteractiveServiceCards";
import YouTubeShortsReel from "../components/YouTubeShortsReel";
import SacredMandalaScroll from "../components/SacredMandalaScroll";
import StageSpotlightOverlay from "../components/StageSpotlightOverlay";
import AnnouncementsTicker from "../components/AnnouncementsTicker";
import HeroSlideshow from "../components/HeroSlideshow";
import AcademyNewsAndEvents from "../components/AcademyNewsAndEvents";
import { playGhungrooChime } from "../utils/talamAudio";
import { EditableText, EditableMedia } from "../components/LiveVisualEditor";
import { FAQS, TESTIMONIALS } from "../data/initialData";
import WhatsAppIcon from "../components/WhatsAppIcon";
import {
  ArrowRight,
  Star,
  Send,
  ChevronDown,
  UserCheck,
  Compass,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const {
    setLightboxItem,
    academyInfo,
    addEnquiry,
    showToast,
    faqs,
    testimonials
  } = useAcademy();

  const activeTestimonials = testimonials || TESTIMONIALS;
  const activeFaqs = faqs || FAQS;

  // Booking Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    discipline: "Online Bharatanatyam Diploma Course",
    level: "Complete Beginner (No prior experience)",
    preferredTime: "Weekday Evening",
    timezone: "Europe / Georgia (GET)",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast("Please provide your name, email, and contact number.", "error");
      return;
    }

    playGhungrooChime();
    setIsSubmitting(true);
    setTimeout(() => {
      addEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: "trial",
        courseInterest: formData.discipline,
        notes: `Level: ${formData.level} | Preferred Time: ${formData.preferredTime} (${formData.timezone}) | Goals: ${formData.notes || "None specified"}`,
        status: "New"
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      playGhungrooChime();
      showToast("Your trial request has been submitted! Dr. Malavika will confirm your slot shortly.", "success");
    }, 600);
  };

  const openWhatsAppBooking = () => {
    playGhungrooChime();
    const msg = `Hello Dr. Malavika! I would like to book a trial session.%0A%0A*Name:* ${formData.name || "Student"}%0A*Discipline:* ${formData.discipline}%0A*Level:* ${formData.level}%0A*Preferred Time:* ${formData.preferredTime}`;
    const url = `https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${msg}`;
    window.open(url, "_blank");
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectServiceForBooking = (serviceTitle) => {
    setFormData((prev) => ({ ...prev, discipline: serviceTitle }));
    scrollToSection("book-trial");
  };

  return (
    <div className="bg-[#F5F0E8] text-[#151515] selection:bg-[#B99A63]/30 selection:text-[#151515] overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. CINEMATIC HERO SECTION: Full-Bleed Performance Video Background
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] lg:min-h-[88vh] flex flex-col justify-center pt-8 xs:pt-10 sm:pt-14 lg:pt-16 pb-4 xs:pb-5 sm:pb-6 px-3.5 sm:px-6 lg:px-8 border-b border-[#B99A63]/30 overflow-hidden bg-[#151515] text-[#F5F0E8]">
        {/* Full-Bleed Ambient Performance Video Background */}
        <EditableMedia
          section="hero"
          field="videoUrl"
          defaultSrc="/videos/performance.mp4"
          poster="/images/hero/hero_slide_01.jpg"
          type="video"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-105 transition-opacity duration-1000"
        />

        {/* Multi-Stop Luxury Dual-Tone Gradient Vignette Overlay (Ensures crystal-clear text contrast on mobile & desktop) */}
        <div className="absolute inset-0 bg-[#151515]/70 sm:bg-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/95 via-[#151515]/80 to-[#151515]/50 sm:bg-gradient-to-r sm:from-[#151515]/95 sm:via-[#24050B]/85 sm:to-[#151515]/65 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15)_0%,rgba(21,21,21,0.8)_85%)] pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F5F0E8] via-[#151515]/80 to-transparent pointer-events-none z-10" />

        {/* Stage Gold Particles Background Canvas & Parallax Sacred Temple Yantra */}
        <GoldParticlesCanvas count={42} className="opacity-75 z-10" />
        <div className="absolute -right-24 -top-20 pointer-events-none z-10">
          <SacredMandalaScroll className="opacity-[0.09]" size={640} />
        </div>

        <div className="max-w-7xl mx-auto relative z-20 w-full space-y-4 xs:space-y-5 sm:space-y-8 lg:space-y-10 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-14 items-center">
            {/* Left Headline & Pitch */}
            <AnimatedSection animation="fade-up" className="lg:col-span-7 text-left space-y-3 xs:space-y-4 sm:space-y-5">
              <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#F5F0E8] leading-[1.08] font-serif-luxury drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                <EditableText section="hero" field="titleLine1" defaultValue="Your Passion." /> <br />
                <EditableText section="hero" field="titleLine2" defaultValue="Your Pace." /> <br />
                <span className="italic text-[#D4AF37]">
                  <EditableText section="hero" field="titleAccent" defaultValue="Your Personal Coach." />
                </span>
              </h1>

              <EditableText
                as="p"
                section="hero"
                field="subtitle"
                defaultValue="A personal space for dance, music, and creative expression. Master Bharatanatyam, Carnatic music, or bespoke choreography, through online and studio classes or personalized mentorship mentored personally by Dr. Malavika M. Sunil."
                multiline={true}
                className="text-xs xs:text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed max-w-xl font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] block"
              />

              {/* Two Required Prominent CTAs: Explore Classes & Meet the Artist */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                <button
                  onClick={() => {
                    playGhungrooChime();
                    scrollToSection("services-section");
                  }}
                  className="silk-zari-btn px-5 sm:px-8 py-3 sm:py-4 rounded-full bg-[#B99A63] hover:bg-[#cca86d] text-[#151515] font-bold text-xs sm:text-base shadow-xl shadow-[#B99A63]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer tap-bounce"
                >
                  <Compass className="w-4 h-4 text-[#151515]" />
                  <span>Explore Classes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    playGhungrooChime();
                    scrollToSection("artistic-journey");
                  }}
                  className="silk-zari-gold-sweep px-5 sm:px-7 py-3 sm:py-4 rounded-full bg-[#151515]/80 hover:bg-[#252525] text-[#F5F0E8] border border-[#B99A63]/50 font-bold text-xs sm:text-base shadow-md backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer tap-bounce"
                >
                  <UserCheck className="w-4 h-4 text-[#B99A63]" />
                  <span>Meet the Artist</span>
                </button>
              </div>

            </AnimatedSection>

            {/* Right Visual Frame: Interactive Hero Photo Slideshow */}
            <AnimatedSection animation="fade-up" delay={150} className="lg:col-span-5 relative">
              <HeroSlideshow onPhotoClick={(item) => setLightboxItem(item)} />
            </AnimatedSection>
          </div>

          {/* 4 Value Pillars Banner: Spans full width gracefully across both mobile and desktop */}
          <div className="pt-4 xs:pt-6 sm:pt-8 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
            {[
              { title: "Global Classes", desc: "Live, interactive lessons worldwide.", tag: "Global" },
              { title: "Personal Coaching", desc: "Syllabus tailored to your anatomy.", tag: "Doctor-Led" },
              { title: "Flexible Timing", desc: "Request times around your routine.", tag: "Self-Paced" },
              { title: "Dance & Music", desc: "Bharatanatyam, Carnatic & Yoga.", tag: "Living Lineage" }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 xs:p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md border border-white/10 hover:border-[#B99A63]/60 transition-all duration-300 hover:-translate-y-1 group text-left"
              >
                <div className="text-[9px] xs:text-[10px] font-mono tracking-widest text-[#B99A63] uppercase mb-0.5">
                  {item.tag}
                </div>
                <div className="text-[11px] xs:text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors leading-tight">
                  {item.title}
                </div>
                <p className="text-[10px] xs:text-[11px] sm:text-xs text-slate-300 mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INSTITUTIONAL ANNOUNCEMENTS TICKER (SH College Inspired)
      ───────────────────────────────────────────────────────────── */}
      <AnnouncementsTicker onAnnouncementClick={scrollToSection} />

      {/* ─────────────────────────────────────────────────────────────
          2. THE CURATOR'S MASTER-PROFILE: Meet the Artist & 21-Year Journey
      ───────────────────────────────────────────────────────────── */}
      <CuratorMasterProfile />

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE 8 SERVICE CARDS: Dedicated Identities & WhatsApp Actions
      ───────────────────────────────────────────────────────────── */}
      <InteractiveServiceCards onSelectServiceForBooking={selectServiceForBooking} />

      {/* ─────────────────────────────────────────────────────────────
          4B. UPCOMING EVENTS & MASTERCLASSES
      ───────────────────────────────────────────────────────────── */}
      <AcademyNewsAndEvents onBookSlot={selectServiceForBooking} />

      {/* ─────────────────────────────────────────────────────────────
          5. THE LEARNING EXPERIENCE: The Process Explained
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-28 px-4 sm:px-8 border-b border-[#A9A49D]/20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#151515] font-serif-luxury">
              The Learning <span className="italic text-[#B99A63]">Experience</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              How our guided mentorship works — from your first trial consultation to stage mastery.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 text-left">
            {[
              {
                step: "01",
                title: "Choose Discipline",
                desc: "Select Bharatanatyam, Carnatic vocal music, Bollywood, or yoga conditioning based on your passion."
              },
              {
                step: "02",
                title: "Discuss Your Goals",
                desc: "A brief private assessment to understand your physical posture, vocal pitch, and musical dreams."
              },
              {
                step: "03",
                title: "Book Flexible Time",
                desc: "Schedule sessions that suit your personal timezone in North America, Europe, Middle East, or Asia."
              },
              {
                step: "04",
                title: "Live Guided Lesson",
                desc: "Direct guidance with Dr. Malavika. Immediate correction of mudras, tala rhythm, and shruti."
              },
              {
                step: "05",
                title: "Personal Feedback",
                desc: "Receive customized video practice clips and constructive notes after every session for steady progress."
              }
            ].map((step, idx) => (
              <AnimatedSection
                key={step.step}
                delay={idx * 60}
                className="p-6 rounded-2xl bg-white border border-[#B99A63]/30 hover:border-[#B99A63] shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-black text-[#B99A63] font-serif-luxury mb-3">
                    {step.step}
                  </div>
                  <h4 className="text-base font-bold text-[#151515] font-serif-luxury mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. THE PERFORMANCE ARCHIVE: YouTube-Style Video Gallery & Achievements
      ───────────────────────────────────────────────────────────── */}
      <CinematicReelsShowcase
        onExploreClick={() => scrollToSection("services-section")}
        onMeetArtistClick={() => scrollToSection("artistic-journey")}
        onPhotoClick={(item) => setLightboxItem(item)}
      />

      {/* ─────────────────────────────────────────────────────────────
          8. STUDENT TESTIMONIALS: Genuine Student Feedback
      ───────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-8 border-b border-[#A9A49D]/20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#151515] font-serif-luxury">
              Student &amp; Parent <span className="italic text-[#B99A63]">Stories</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              What it feels like to learn directly from a dedicated private mentor.
            </p>
          </AnimatedSection>

          <div className={activeTestimonials.length === 1 ? "max-w-2xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto"}>
            {activeTestimonials.map((t, idx) => (
              <AnimatedSection
                key={t.id}
                delay={idx * 80}
                className="bg-white p-7 sm:p-9 rounded-3xl border border-[#B99A63]/30 hover:border-[#B99A63] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left relative overflow-hidden h-full"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1 text-[#B99A63]">
                      {[...Array(t.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#B99A63]" />
                      ))}
                    </div>
                    {t.tag && (
                      <span className="px-3 py-1 rounded-full bg-[#B99A63]/15 text-[#B99A63] border border-[#B99A63]/30 text-[10px] font-bold tracking-wider uppercase">
                        {t.tag}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-slate-800 italic leading-relaxed mb-6 font-serif-luxury whitespace-pre-line">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ${t.avatarPosition || "object-top"} border-2 border-[#B99A63]/50 shadow-md shrink-0`}
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#151515] font-serif-luxury">{t.name}</h4>
                    <p className="text-xs text-[#B99A63] font-medium">{t.relation}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. BOOK A TRIAL SESSION (PRIMARY CONVERSION SECTION)
      ───────────────────────────────────────────────────────────── */}
      <StageSpotlightOverlay>
        <section id="book-trial" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-8 border-b border-[#A9A49D]/20 bg-[#151515] text-[#F5F0E8] relative overflow-hidden">
        {/* Sacred Temple Yantra Mandala Background */}
        <SacredMandalaScroll className="absolute -right-24 -top-24 opacity-[0.06] -z-10" size={540} />

        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B0B14]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B99A63]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10 relative z-10">
          <AnimatedSection animation="fade-up" className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F0E8] font-serif-luxury">
              Admissions Consultation &amp; <span className="italic text-[#D4AF37]">Audition</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Meet Dr. Malavika M. Sunil for a private 45-minute video consultation and movement/vocal assessment. Share your goals, ask questions, and discover your personalized learning pathway.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-semibold tracking-wider uppercase text-[#B99A63]">
              <span className="px-3.5 py-1.5 rounded-full bg-[#B99A63]/10 border border-[#B99A63]/30 backdrop-blur-xs flex items-center gap-1.5">
                <span className="text-[#D4AF37]">✦</span> By Private Consultation &amp; Mentorship
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                <span className="text-[#D4AF37]">✦</span> Flexible Global Cohorts (USA, UK, UAE &amp; India)
              </span>
            </div>
          </AnimatedSection>

          {/* Form Card */}
          <div className="museum-frame-dark bg-[#1f1f1f]/95 rounded-3xl p-6 sm:p-10 border border-[#B99A63]/35 shadow-2xl text-left relative overflow-hidden">
            {submittedSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#B99A63]/20 text-[#B99A63] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#B99A63]" />
                </div>
                <h3 className="text-2xl font-bold font-serif-luxury text-[#F5F0E8]">
                  Trial Request Received!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Dr. Malavika has received your request for <strong>{formData.discipline}</strong>. You will receive an email and WhatsApp confirmation to finalize your exact video session slot.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={openWhatsAppBooking}
                    className="silk-zari-btn px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 tap-bounce"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Confirm Instantly via WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setSubmittedSuccess(false)}
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Student Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Student's Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="e.g. Ananya Nair"
                      className="w-full px-4 py-3 rounded-xl bg-[#151515] border border-[#A9A49D]/30 text-white text-sm focus:outline-none focus:border-[#B99A63]"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="e.g. ananya@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#151515] border border-[#A9A49D]/30 text-white text-sm focus:outline-none focus:border-[#B99A63]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Phone / WhatsApp (with country code) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-[#151515] border border-[#A9A49D]/30 text-white text-sm focus:outline-none focus:border-[#B99A63]"
                    />
                  </div>

                  {/* Discipline Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Discipline of Interest *
                    </label>
                    <select
                      name="discipline"
                      value={formData.discipline}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#151515] border border-[#A9A49D]/30 text-white text-sm focus:outline-none focus:border-[#B99A63]"
                    >
                      <optgroup label="Courses We Offer (5)">
                        <option value="Online Bharatanatyam Diploma Course">Online Bharatanatyam Diploma Course</option>
                        <option value="Online Bharatanatyam Non-Diploma Classes">Online Bharatanatyam Non-Diploma Classes</option>
                        <option value="Online Carnatic Music Classes">Online Carnatic Music Classes</option>
                        <option value="Online Semi-Classical Bollywood Dance Classes">Online Semi-Classical Bollywood Dance Classes</option>
                        <option value="60-Day Fitness Program">60-Day Fitness Program</option>
                      </optgroup>
                      <optgroup label="Other Services We Offer (6)">
                        <option value="Event-Based Stage Show Choreography">Event-Based Stage Show Choreography</option>
                        <option value="Wedding Choreography">Wedding Choreography</option>
                        <option value="One-Day Dance Workshops">One-Day Dance Workshops</option>
                        <option value="Three-Day Dance Workshops">Three-Day Dance Workshops</option>
                        <option value="Competition-Based Choreography">Competition-Based Choreography</option>
                        <option value="Corporate Event Stage Shows">Corporate Event Stage Shows</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Experience Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Current Experience Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#151515] border border-[#A9A49D]/30 text-white text-sm focus:outline-none focus:border-[#B99A63]"
                    >
                      <option value="Complete Beginner (No prior experience)">Complete Beginner (Starting from zero)</option>
                      <option value="Some Prior Lessons (Basic Adavus / Sarali Varisais)">Some Prior Lessons (Basic foundation)</option>
                      <option value="Intermediate Dancer / Singer">Intermediate (Seeking refinement & repertoire)</option>
                      <option value="Advanced / Arangetram / Stage Performer">Advanced / Arangetram / Stage Performer</option>
                    </select>
                  </div>

                  {/* Preferred Time Slot */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Preferred Session Time
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#151515] border border-[#A9A49D]/30 text-white text-sm focus:outline-none focus:border-[#B99A63]"
                    >
                      <option value="Weekday Morning">Weekday Morning</option>
                      <option value="Weekday Afternoon">Weekday Afternoon</option>
                      <option value="Weekday Evening">Weekday Evening</option>
                      <option value="Weekend Morning">Weekend Morning</option>
                      <option value="Weekend Afternoon / Evening">Weekend Afternoon / Evening</option>
                    </select>
                  </div>
                </div>

                {/* Goals & Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Your Creative Goals & Questions (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder="e.g. Preparing for a family sangeet, starting Bharatanatyam as an adult beginner, or seeking posture-safe training..."
                    className="w-full px-4 py-3 rounded-xl bg-[#151515] border border-[#A9A49D]/30 text-white text-sm focus:outline-none focus:border-[#B99A63]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="silk-zari-btn w-full sm:flex-1 py-4 rounded-full bg-[#B99A63] hover:bg-[#cca86d] text-[#151515] font-bold text-sm sm:text-base shadow-xl shadow-[#B99A63]/30 transition-all cursor-pointer flex items-center justify-center gap-2 tap-bounce disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#151515]" />
                        <span>Submit Booking Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      </StageSpotlightOverlay>

      {/* ─────────────────────────────────────────────────────────────
          10. FAQS & REASSURANCE
      ───────────────────────────────────────────────────────────── */}
      <section id="faqs" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-8 border-b border-[#A9A49D]/20 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto space-y-12">
          <AnimatedSection animation="fade-up" className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#151515] font-serif-luxury">
              Frequently Asked <span className="italic text-[#B99A63]">Questions</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Clear answers about online setup, flexible timezones, adult beginner pacing, and cancellations.
            </p>
          </AnimatedSection>

          <div className="space-y-4 text-left">
            {activeFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              const faqNum = faq.number || String(idx + 1).padStart(2, "0");
              return (
                <AnimatedSection
                  key={idx}
                  delay={Math.min(idx * 25, 300)}
                  className="rounded-2xl bg-white border border-[#B99A63]/25 hover:border-[#B99A63]/50 overflow-hidden shadow-xs hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="flex items-center gap-3.5 text-base sm:text-lg font-bold text-[#151515] font-serif-luxury">
                      <span className="text-[#B99A63] font-mono text-sm sm:text-base font-semibold shrink-0">
                        {faqNum}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#B99A63] shrink-0 transition-transform duration-300 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pl-11 sm:pl-14">
                      {faq.answer}
                    </div>
                  )}
                </AnimatedSection>
              );
            })}
          </div>

          {/* Ending note card in quotes */}
          <AnimatedSection animation="fade-up" className="pt-2">
            <div className="rounded-2xl bg-gradient-to-r from-[#FAF5EC] via-white to-[#FAF5EC] border border-[#B99A63]/30 p-6 sm:p-8 text-center shadow-xs">
              <p className="text-sm sm:text-base italic font-serif-luxury text-[#151515] leading-relaxed max-w-2xl mx-auto">
                &ldquo;Still have questions? Contact DancingRagas through our website or official social media page for enquiries about registrations, fees and batch availability.&rdquo;
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("book-trial");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="silk-zari-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#151515] hover:bg-[#B99A63] text-[#F5F0E8] hover:text-[#151515] text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer tap-bounce"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>Send Admissions Enquiry</span>
                </button>
                <a
                  href={academyInfo?.instagramUrl || "https://www.instagram.com/dancingragasbymalavika/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-xs"
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">
                    ig
                  </span>
                  <span>Enquire on Instagram</span>
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
