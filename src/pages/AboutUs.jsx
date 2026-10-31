import React, { useRef, useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import { EditableText, EditableMedia } from "../components/LiveVisualEditor";
import AnimatedSection from "../components/AnimatedSection";
import FilmArchiveShowcase from "../components/FilmArchiveShowcase";
import DiplomaGoldSeal from "../components/DiplomaGoldSeal";
import DrMalavikaProfileSlideshow from "../components/DrMalavikaProfileSlideshow";
import {
  Sparkles,
  Heart,
  Target,
  Compass,
  Globe,
  Music,
  Award,
  Star,
  Users,
  Film,
  Dumbbell,
  ArrowRight,
  MapPin,
  Trophy
} from "lucide-react";

/* ── tiny 3-D card that tilts on mouse-move ── */
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 20;
    setTilt({ x, y });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`perspective-scene ${className}`}
    >
      <div
        className="card-3d"
        style={{
          transform: `rotateY(${tilt.x * 0.5}deg) rotateX(${-tilt.y * 0.5}deg)`
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── animated timeline dot + entry ── */
function TimelineEntry({ year, title, description, delay = 0, isLast = false }) {
  return (
    <AnimatedSection
      animation="slide-right"
      delay={delay}
      className="flex gap-5 sm:gap-7 text-left"
    >
      <div className="flex flex-col items-center">
        <div className="timeline-dot mt-1.5" />
        {!isLast && <div className="timeline-line flex-1 mt-2" />}
      </div>
      <div className={`pb-8 sm:pb-10 ${isLast ? "" : ""}`}>
        <span className="inline-block text-[11px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full mb-2">
          {year}
        </span>
        <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </AnimatedSection>
  );
}

/* ── stat badge ── */
function StatBadge({ icon: Icon, value, label, color = "rose" }) {
  const colorMap = {
    rose:   "bg-rose-50   text-rose-600   border-rose-200",
    violet: "bg-violet-50 text-violet-600 border-violet-200",
    amber:  "bg-amber-50  text-amber-600  border-amber-200",
    gold:   "bg-amber-50/80 text-[#B99A63] border-[#B99A63]/40",
    green:  "bg-emerald-50 text-emerald-600 border-emerald-200"
  };
  return (
    <div className={`flex flex-col items-center gap-1 p-4 rounded-2xl border ${colorMap[color]} text-center`}>
      <Icon className="w-5 h-5 mb-0.5" />
      <div className="text-lg sm:text-2xl font-black">{value}</div>
      <div className="text-[10px] sm:text-xs font-semibold leading-tight opacity-80">{label}</div>
    </div>
  );
}

export default function AboutUs() {
  const { siteContent } = useAcademy();
  const { navigateTo } = useAcademy();

  const milestones = [
    {
      year: "Childhood",
      title: "Born into Artistry",
      description:
        "Malavika began her Bharatanatyam training under her father, Dr. Sunil Nellay, and Carnatic music under her mother, Resmi Narayanan — two disciplines she has pursued for 21 and 16 years respectively, from the very heart of her family."
    },
    {
      year: "Age 12",
      title: "CCRT Scholarship Awarded",
      description:
        "Recognised by the Centre for Cultural Resources and Training (CCRT) with a national scholarship in Bharatanatyam — an honour she continues to hold, a testament to her exceptional classical foundation."
    },
    {
      year: "Film & Devotional Music",
      title: "Child Actress & Recording Artist",
      description:
        "Appeared as a child actress in five Malayalam films — Innathe Chinthavishayam, Achuvinte Amma, Raappakal, Rasathanthram, and Vinodayathra — and featured in devotional music albums Mizhiazhagu Nirayum Radha and Devapamba."
    },
    {
      year: "International Stage",
      title: "600+ Performances Worldwide",
      description:
        "Performed on more than 600 stages across South India and internationally — including Bahrain, Ukraine, and Georgia — participating in prestigious cultural festivals and earning recognition from numerous institutions."
    },
    {
      year: "Georgia",
      title: "MBBS & A New Chapter",
      description:
        "Pursued her MBBS degree in Georgia, weaving the disciplines of medicine and performing arts into a unique journey defined by perseverance, intellectual rigour, and an unrelenting love for classical art."
    },
    {
      year: "5 Years Ago",
      title: "DancingRagas Founded",
      description:
        "Founded DancingRagas Dance & Music Academy in Georgia as an extension of her commitment to preserving and sharing Indian classical arts — conducting 15+ offline workshops, online sessions for international students, and structured Bharatanatyam diploma programmes."
    },
    {
      year: "3 Years of Stage Shows",
      title: "20+ Performances in Georgia",
      description:
        "Organised and presented more than 20 stage shows in Georgia, giving students real performance experience, building confidence, and celebrating Indian cultural heritage in an international setting."
    },
    {
      year: "Arts Leadership",
      title: "Choreographer, Judge & Organiser",
      description:
        "Choreographed for a Georgian reality show; served as judge at Ignite, a prestigious competition at TSMU; and organised Rhythmic Raga, an inter-university solo & duo dance competition in Tbilisi."
    },
    {
      year: "Ongoing",
      title: "Yoga Teacher & Classical Educator",
      description:
        "Completed a certified yoga teacher training course and has been teaching yoga alongside Bharatanatyam and Carnatic music for the past two years — nurturing her students' holistic well-being and artistry."
    }
  ];

  const highlights = [
    { icon: Award,    value: "600+",  label: "Stage Performances",      color: "rose"   },
    { icon: Globe,    value: "15+",   label: "Workshops in Georgia",     color: "violet" },
    { icon: Trophy,   value: "20+",   label: "Stage Shows (3 yrs)",      color: "amber"  },
    { icon: Star,     value: "5+",    label: "Years of Teaching",        color: "gold"   },
    { icon: Users,    value: "Multi", label: "Countries — Online Students", color: "violet" },
    { icon: Film,     value: "5",     label: "Malayalam Films",          color: "rose"   },
    { icon: Music,    value: "2",     label: "Devotional Music Albums",  color: "amber"  },
    { icon: Dumbbell, value: "2 yrs", label: "Teaching Yoga",            color: "green"  }
  ];

  const films = [
    "Innathe Chinthavishayam",
    "Achuvinte Amma",
    "Raappakal",
    "Rasathanthram",
    "Vinodayathra"
  ];

  const albums = ["Mizhiazhagu Nirayum Radha", "Devapamba"];

  const values = [
    {
      icon: Target,
      color: "rose",
      title: "Our Mission",
      text: "To preserve, teach, and share India's timeless classical arts — Bharatanatyam, Carnatic music, and yoga — making them accessible to a global community of learners while honouring their spiritual depth and cultural heritage."
    },
    {
      icon: Compass,
      color: "violet",
      title: "Our Vision",
      text: "To be a bridge between India's living artistic traditions and the world, producing confident stage performers, diploma holders, and lifelong practitioners who carry classical arts across cultural boundaries."
    },
    {
      icon: Heart,
      color: "amber",
      title: "Our Values",
      text: "Integrity in technique, joy in practice, respect for tradition, and celebration of individual growth. Every student — child or adult, beginner or advanced — deserves a nurturing space to discover their artistic voice."
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-clip">

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative pt-10 sm:pt-14 pb-14 sm:pb-20 overflow-hidden">
        {/* Morphing orbs */}
        <div className="orb orb-rose    w-80  h-80  -top-20 -left-20   animate-morph"   style={{ animationDelay: "0s" }} />
        <div className="orb orb-violet  w-96  h-96  top-10  right-10   animate-morph"   style={{ animationDelay: "3s" }} />
        <div className="orb orb-amber   w-64  h-64  bottom-0 left-1/2  animate-morph"   style={{ animationDelay: "5s" }} />

        <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-5 relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-200">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Our Story & the Founder
          </span>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-serif-luxury">
            Meet{" "}
            <span className="text-gradient-warm">Dr. Malavika</span>
            <br className="hidden sm:block" /> M.{" "}
            <span className="text-gradient-vibrant">Sunil</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Bharatanatyam artist · Carnatic musician · Choreographer · Physician · Yoga teacher
            — an artistic journey spanning <strong>over two decades</strong> and three continents.
          </p>
        </AnimatedSection>
      </section>

      {/* ── FOUNDER PROFILE ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* Photo & floating badges */}
          <AnimatedSection animation="slide-left" className="lg:col-span-5 relative">
            <TiltCard>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/40 aspect-[4/5] hover-img-zoom bg-slate-950">
                <DrMalavikaProfileSlideshow
                  aspectRatio="aspect-[4/5]"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-5 right-5 text-left text-white">
                  <EditableText
                    as="h3"
                    section="about"
                    field="title"
                    defaultValue="Dr. Malavika M. Sunil"
                    className="text-lg sm:text-xl font-black font-serif-luxury block"
                  />
                  <p className="text-[11px] text-rose-300 font-semibold tracking-wide mt-0.5">Founder & Artistic Director · DancingRagas</p>
                </div>
              </div>
            </TiltCard>

            {/* Floating: CCRT badge */}
            <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-5 z-30 px-3 py-2 rounded-2xl bg-amber-400 text-amber-950 shadow-xl flex items-center gap-2 text-xs font-black animate-float">
              <Award className="w-4 h-4 shrink-0" />
              <span>CCRT Scholar<br className="hidden sm:block" /><span className="font-medium"> since Age 12</span></span>
            </div>

            {/* Floating: stage count */}
            <div className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-6 z-30 px-3.5 py-2.5 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center gap-2.5 animate-float-reverse">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="text-left">
                <div className="text-lg font-black text-slate-900 leading-none">600+</div>
                <div className="text-[10px] text-slate-500 font-semibold">Stage Performances</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Bio text */}
          <AnimatedSection animation="slide-right" className="lg:col-span-7 text-left space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Founder's Story
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-serif-luxury">
              A Life Rooted in Rhythm, <span className="text-gradient-vibrant">Raga & Resilience</span>
            </h2>

            <div className="space-y-3.5 text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed">
              <p>
                Dr. Malavika M. Sunil is a Bharatanatyam artist, Carnatic musician, educator,
                choreographer, and physician whose artistic journey spans over two decades. Having trained
                in Bharatanatyam under her father, <strong className="text-slate-800">Dr. Sunil Nellay</strong>, for 21 years and
                Carnatic music under her mother, <strong className="text-slate-800">Resmi Narayanan</strong>, for 16 years, she comes
                from a deeply rooted artistic tradition that continues to shape her approach to teaching
                and performance.
              </p>
              <p>
                A recipient of the <strong className="text-slate-800">CCRT Scholarship in Bharatanatyam since the age of 12</strong>,
                Malavika has performed on more than 600 stages, participating in numerous cultural
                festivals across South India and internationally — including Bahrain, Ukraine, and Georgia.
              </p>
              <p>
                Her artistic journey also extended into the Malayalam film industry, where she appeared
                as a child actress in five films, and into devotional music albums. Alongside all this,
                she pursued her <strong className="text-slate-800">MBBS in Georgia</strong>, uniting medicine and the performing
                arts in a journey defined by dedication, perseverance, and a deep commitment to learning.
              </p>
              <p>
                Malavika has also completed her <strong className="text-slate-800">teacher training course in yoga</strong> and has
                been teaching yoga to her students for the past two years.
              </p>
            </div>

            {/* Film filmography snippet */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" /> Malayalam Films (as Child Actress)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {films.map((f) => (
                  <span key={f} className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium shadow-xs">
                    {f}
                  </span>
                ))}
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mt-2">
                <Music className="w-3.5 h-3.5" /> Devotional Music Albums
              </p>
              <div className="flex flex-wrap gap-1.5">
                {albums.map((a) => (
                  <span key={a} className="text-[11px] px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 font-medium shadow-xs">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual Artistic Roots Duo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="rounded-2xl overflow-hidden border border-amber-300/40 bg-white shadow-sm flex items-center gap-3 p-2.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-200">
                  <img
                    src="/images/malavika_vocal.jpg"
                    alt="Dr. Malavika singing Carnatic vocals with mother Resmi Narayanan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                    Carnatic Vocal Roots
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                    With Mother Resmi Narayanan
                  </p>
                  <p className="text-[10px] text-slate-500">16 Years Heritage Training</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-amber-300/40 bg-white shadow-sm flex items-center gap-3 p-2.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-200">
                  <img
                    src="/images/malavika_dance_stage.jpg"
                    alt="Dr. Malavika performing Bharatanatyam"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                    Bharatanatyam Lineage
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                    Trained under Dr. Sunil Nellay
                  </p>
                  <p className="text-[10px] text-slate-500">21 Years Classical Discipline</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={() => navigateTo("trial")}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer tap-bounce"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Book a Free Trial Class</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo("courses")}
                className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer text-center tap-bounce"
              >
                Explore Classes & Services
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── HIGHLIGHTS GRID ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            By the Numbers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif-luxury">A Career Defined by Dedication</h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {highlights.map((h, i) => (
            <AnimatedSection key={i} delay={i * 60} className="hover-lift-3d rounded-2xl">
              <StatBadge {...h} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── FILM & DEVOTIONAL MUSIC ARCHIVE ───────────────────────── */}
      <FilmArchiveShowcase />

      {/* ── VISION BEHIND DANCINGRAGAS ──────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24 rounded-3xl max-w-7xl mx-auto mx-4 sm:mx-8">
        <div className="orb orb-rose   w-72 h-72 -top-10 -left-10  opacity-20 animate-morph" />
        <div className="orb orb-violet w-80 h-80 -bottom-10 right-0 opacity-20 animate-morph" style={{ animationDelay: "4s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
          <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20">
              <Globe className="w-3.5 h-3.5" /> The Vision Behind DancingRagas
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Building a Bridge Between{" "}
              <span className="text-gradient-gold">Tradition & the World</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm lg:text-base leading-relaxed">
              Founded five years ago, DancingRagas is an extension of Malavika's commitment to
              preserving, teaching, and sharing Indian classical arts across cultural boundaries.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
            <AnimatedSection animation="slide-left" className="space-y-4 text-left">
              <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <p>
                  Under Malavika's leadership, the academy has conducted more than{" "}
                  <strong className="text-white">15 offline workshops in Georgia</strong>, organised online
                  workshops for students across various countries, and developed{" "}
                  <strong className="text-white">structured Bharatanatyam diploma programmes</strong>. Its
                  diploma training initiative has been running for over a year and a half, providing
                  students with a dedicated pathway to classical dance education.
                </p>
                <p>
                  Over the past three years, DancingRagas has presented more than{" "}
                  <strong className="text-white">20 stage shows in Georgia</strong>, creating opportunities
                  for students to experience the stage, develop confidence, and celebrate Indian
                  cultural heritage in an international setting.
                </p>
                <p>
                  Malavika has also <strong className="text-white">choreographed for a Georgian reality show</strong>,
                  served as a judge at <em>Ignite</em> (a prestigious dance competition at TSMU), and
                  organised <em>Rhythmic Raga</em> — an inter-university solo and duo dance competition
                  in Tbilisi.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-right">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm quote-accent">
                <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium italic leading-relaxed relative z-10">
                  "Rooted in tradition, shaped by dedication, and carried across borders through
                  the language of art."
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Dr. Malavika M. Sunil</p>
                    <p className="text-[11px] text-rose-400">Founder, DancingRagas</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Achievement bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { value: "15+", label: "Offline Workshops in Georgia", icon: MapPin },
              { value: "20+", label: "Stage Productions (3 yrs)", icon: Star },
              { value: "1.5+", label: "Years — Diploma Programme Running", icon: Award }
            ].map(({ value, label, icon: Icon }, i) => (
              <AnimatedSection
                key={i}
                delay={i * 100}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover-lift"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/30 to-violet-600/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-rose-300" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">{label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCREDITED BHARATANATYAM DIPLOMA PROGRAMME ──────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <DiplomaGoldSeal />
      </section>

      {/* ── MISSION · VISION · VALUES ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
            Our Guiding Principles
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-serif-luxury">
            Mission, Vision & Values
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, color, title, text }, i) => {
            const colors = {
              rose:   "bg-rose-50   text-rose-600   border-rose-100",
              violet: "bg-violet-50 text-violet-600 border-violet-100",
              amber:  "bg-amber-50  text-amber-600  border-amber-100"
            };
            return (
              <AnimatedSection key={i} delay={i * 100} className="hover-lift-3d">
                <div className={`h-full p-6 sm:p-8 rounded-3xl ${colors[color]} border space-y-3`}>
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700">{text}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ─────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            A Journey of Growth
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-serif-luxury">
            Key Milestones & Achievements
          </h2>
        </AnimatedSection>

        <div>
          {milestones.map((item, idx) => (
            <TimelineEntry
              key={idx}
              {...item}
              delay={idx * 80}
              isLast={idx === milestones.length - 1}
            />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-24 sm:pb-28 lg:pb-16">
        <AnimatedSection
          animation="zoom-in"
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-500 via-violet-600 to-indigo-600 p-8 sm:p-14 text-white shadow-2xl text-center"
        >
          <div className="orb orb-amber w-56 h-56 -bottom-10 -right-10 opacity-25 animate-float" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Begin Your Classical Journey
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Train Under Dr. Malavika's Guidance
            </h2>
            <p className="text-white/80 text-xs sm:text-sm lg:text-base leading-relaxed">
              Join DancingRagas and discover the beauty of Bharatanatyam, Carnatic music, and yoga
              — taught with discipline, love, and a deep respect for tradition.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => navigateTo("trial")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-950 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer tap-bounce"
              >
                <Sparkles className="w-5 h-5 text-rose-600" />
                Book Free Trial Now
              </button>
              <button
                onClick={() => navigateTo("contact")}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all cursor-pointer tap-bounce"
              >
                Contact Us
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>

    </div>
  );
}
