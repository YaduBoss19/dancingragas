import React, { useState, useEffect } from "react";
import { useAcademy } from "../context/AcademyContext";
import AnimatedSection from "../components/AnimatedSection";
import {
  Video,
  BookOpen,
  Calendar,
  Clock,
  Download,
  Upload,
  Play,
  CheckCircle2,
  FileText,
  User,
  LogOut,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Film,
  Search,
  ChevronRight,
  Filter,
  Award,
  CalendarPlus,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Check,
  Activity,
  Layers
} from "lucide-react";

export default function StudentPortal({ onOpenAuth }) {
  const {
    authUser,
    userRole,
    handleLogout,
    showToast,
    recordings,
    liveClassConfig,
    curriculumModules,
    toggleLessonCompletion,
    studentAssessments,
    submitStudentAssessment,
    studentProfile
  } = useAcademy();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState("curriculum"); // 'curriculum' | 'live_studio' | 'evaluations' | 'documents'

  // Timezone & Countdown
  const [userTimezone, setUserTimezone] = useState("Local Time");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Selected lesson for theater player
  const [activeModuleId, setActiveModuleId] = useState(curriculumModules[0]?.id || "mod-1");
  const [selectedLesson, setSelectedLesson] = useState(
    curriculumModules[0]?.lessons[0] || recordings[0] || null
  );

  // Submission Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: "",
    videoUrl: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Printable evaluation slip state
  const [printingAssessment, setPrintingAssessment] = useState(null);

  // Search in curriculum
  const [lessonSearch, setLessonSearch] = useState("");

  // Student Identity
  const displayName = authUser?.user_metadata?.full_name || studentProfile?.studentName || "Ananya Menon";
  const regNumber = studentProfile?.registrationNo || "DR-DIP-2026-084";
  const programName = authUser?.user_metadata?.batch_name || studentProfile?.enrolledProgram || "Online Bharatanatyam Diploma Course";

  // Compute overall progress
  const allLessons = (curriculumModules || []).flatMap((m) => m.lessons || []);
  const completedLessons = allLessons.filter((l) => l.completed).length;
  const overallProgress = allLessons.length > 0 ? Math.round((completedLessons / allLessons.length) * 100) : 68;

  // Local Timezone & Countdown effect
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(tz || "Local Time");
    } catch {
      setUserTimezone("Local Time");
    }
  }, []);

  useEffect(() => {
    const target = new Date(liveClassConfig?.targetTimestamp || Date.now() + 2 * 24 * 60 * 60 * 1000).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [liveClassConfig?.targetTimestamp]);

  // Calendar generators
  const handleAddToGoogleCalendar = () => {
    const title = encodeURIComponent(`DancingRagas Live: ${liveClassConfig?.sessionTitle || "Bharatanatyam Masterclass"}`);
    const details = encodeURIComponent(
      `Interactive masterclass with Dr. Malavika M. Sunil.\n\nMeeting Link: ${liveClassConfig?.meetUrl || ""}\nMeeting ID: ${liveClassConfig?.meetingId || ""}\nPasscode: ${liveClassConfig?.passcode || ""}`
    );
    const location = encodeURIComponent(liveClassConfig?.meetUrl || "Google Meet Online Studio");
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(gcalUrl, "_blank");
    showToast("Opened Google Calendar to save your masterclass!", "info");
  };

  const handleDownloadIcs = () => {
    const eventTitle = liveClassConfig?.sessionTitle || "DancingRagas Masterclass";
    const eventUrl = liveClassConfig?.meetUrl || "https://meet.google.com";
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DancingRagas Classical Arts//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:Interactive classical masterclass with Dr. Malavika M. Sunil. Link: ${eventUrl}`,
      `URL:${eventUrl}`,
      `LOCATION:${eventUrl}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "DancingRagas_Masterclass.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded iCalendar (.ics) file for Apple / Outlook Calendar!", "success");
  };

  const handleCopyLink = (text, label) => {
    navigator.clipboard?.writeText(text);
    showToast(`${label} copied to clipboard!`, "success");
  };

  // Handle Practice Video Submission
  const handleSubmitPractice = (e) => {
    e.preventDefault();
    if (!submitForm.title.trim() || !submitForm.videoUrl.trim()) {
      showToast("Please enter submission title and video link.", "error");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      submitStudentAssessment({
        studentName: displayName,
        registrationNo: regNumber,
        batch: programName,
        title: submitForm.title.trim(),
        videoUrl: submitForm.videoUrl.trim(),
        notes: submitForm.notes.trim()
      });
      setSubmitForm({ title: "", videoUrl: "", notes: "" });
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
      setActiveTab("evaluations");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#151515] py-8 sm:py-12 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ═══════════════════════════════════════════════════════════════
            HEADER: OFFICIAL DIGITAL STUDENT ID & CONSERVATORY CARD
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection
          animation="fade-up"
          className="rounded-3xl bg-gradient-to-br from-[#151515] via-[#2A080E] to-[#151515] text-[#F5F0E8] border border-[#B99A63]/40 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-left"
        >
          {/* Subtle gold ornamentation */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12)_0,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex items-start sm:items-center gap-4">
              {/* Student Monogram Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#3B0B14] to-[#151515] border-2 border-[#D4AF37]/60 text-[#D4AF37] flex items-center justify-center font-serif-luxury text-2xl font-bold shadow-lg shadow-[#D4AF37]/15 shrink-0">
                {displayName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    <span>Official Conservatory Enrolment</span>
                  </span>
                  <span className="text-[11px] font-mono text-stone-300">
                    Reg: <strong className="text-white">{regNumber}</strong>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury tracking-tight text-white">
                  {displayName}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300">
                  {programName} &bull; <span className="text-[#D4AF37]">Year 1 - Foundational Margam</span>
                </p>
              </div>
            </div>

            {/* Quick Actions & Logout */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Timezone: <strong className="text-white">{userTimezone}</strong></span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-900/60 hover:border-rose-500/50 text-white text-xs font-bold border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Academic Metric Strip */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Academic Term
              </span>
              <p className="text-sm font-bold text-white">Autumn 2026/27</p>
              <span className="text-[10px] text-emerald-400 font-semibold block">Active Semester</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Curriculum Progress
              </span>
              <div className="flex items-baseline justify-between">
                <p className="text-base font-bold text-[#D4AF37]">{overallProgress}%</p>
                <span className="text-[10px] text-stone-400">{completedLessons}/{allLessons.length} Units</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B99A63] to-[#D4AF37] transition-all duration-700"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Live Attendance Record
              </span>
              <p className="text-sm font-bold text-white">{studentProfile?.attendancePercent || 94}%</p>
              <span className="text-[10px] text-emerald-400 font-semibold block">Annual Exam Qualified</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Faculty Mentor
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#D4AF37] truncate">Dr. Malavika M. Sunil</p>
              <span className="text-[10px] text-stone-400 block">MBBS &bull; Senior Exponent</span>
            </div>
          </div>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            ACADEMIC NAVIGATION TABS
        ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-left">
          {[
            { id: "curriculum", label: "Academic Curriculum & Modules", icon: BookOpen },
            { id: "live_studio", label: "Live Classroom & Countdown", icon: Calendar },
            { id: "evaluations", label: `Performance Evaluations (${studentAssessments.length})`, icon: Award },
            { id: "documents", label: "Study Materials & Syllabus Notes", icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#151515] text-[#D4AF37] shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            TAB 1: ACADEMIC CURRICULUM & MODULE PROGRESSION TREE
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "curriculum" && (
          <div className="space-y-8 text-left">

            {/* Option A2 Theater Player Card */}
            {selectedLesson && (
              <div className="rounded-3xl bg-[#151515] text-[#F5F0E8] border border-[#B99A63]/40 shadow-xl overflow-hidden">
                <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2A080E] to-[#151515] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                      Option A2 &bull; High-Definition Masterclass Player
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
                      {selectedLesson.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLessonCompletion(activeModuleId, selectedLesson.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedLesson.completed
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{selectedLesson.completed ? "Marked as Completed" : "Mark Unit Completed"}</span>
                    </button>
                  </div>
                </div>

                {/* Video Frame */}
                <div className="aspect-video w-full bg-black relative">
                  <iframe
                    src={selectedLesson.embedUrl || selectedLesson.videoUrl}
                    title={selectedLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Lesson Details */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300 border-b border-white/10 pb-3">
                    <span className="text-[#D4AF37] font-semibold">
                      Duration: {selectedLesson.duration} &bull; Recorded Lecture &bull; {selectedLesson.date}
                    </span>
                    <span className="text-stone-400">
                      Discipline: {selectedLesson.category || "Bharatanatyam Diploma"}
                    </span>
                  </div>

                  {Array.isArray(selectedLesson.topics) && selectedLesson.topics.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Core Syllabus Drills &amp; Mudras Covered:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedLesson.topics.map((top, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-stone-200"
                          >
                            &bull; {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Curriculum Module Tree */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                    Academic Year 1 Curriculum Tree
                  </h3>
                  <p className="text-xs text-stone-500">
                    Follow the sequential modules curated by Dr. Malavika. Click any masterclass lesson to open in the theater viewer.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    placeholder="Search adavu, mudra or topic..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-[#B99A63]"
                  />
                </div>
              </div>

              {/* Module Accordions */}
              <div className="space-y-4">
                {(curriculumModules || []).map((mod) => {
                  const filteredLessons = (mod.lessons || []).filter(
                    (l) =>
                      !lessonSearch.trim() ||
                      l.title.toLowerCase().includes(lessonSearch.toLowerCase()) ||
                      (l.topics && l.topics.some((t) => t.toLowerCase().includes(lessonSearch.toLowerCase())))
                  );

                  if (lessonSearch.trim() && filteredLessons.length === 0) return null;

                  return (
                    <div
                      key={mod.id}
                      className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs space-y-0"
                    >
                      {/* Module Banner */}
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 via-white to-stone-50 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-[#151515] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                              {mod.moduleNumber}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                mod.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : mod.status === "In Progress"
                                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                                  : "bg-stone-100 text-stone-600"
                              }`}
                            >
                              {mod.status} &bull; {mod.progressPercent}%
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-stone-900 font-serif-luxury">
                            {mod.title}
                          </h4>
                          <p className="text-xs text-stone-500 max-w-2xl">
                            {mod.description}
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full md:w-48 shrink-0 space-y-1">
                          <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
                            <span>Unit Progress</span>
                            <span>{mod.progressPercent}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                            <div
                              className="h-full bg-[#B99A63] transition-all duration-500"
                              style={{ width: `${mod.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Lessons List in Module */}
                      <div className="divide-y divide-stone-100">
                        {filteredLessons.map((lesson) => {
                          const isCurrent = selectedLesson?.id === lesson.id;
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => {
                                setActiveModuleId(mod.id);
                                setSelectedLesson(lesson);
                                window.scrollTo({ top: 320, behavior: "smooth" });
                              }}
                              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                                isCurrent
                                  ? "bg-[#FAF7F2] border-l-4 border-[#B99A63]"
                                  : "hover:bg-stone-50"
                              }`}
                            >
                              <div className="flex items-start sm:items-center gap-3">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLessonCompletion(mod.id, lesson.id);
                                  }}
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-colors mt-0.5 sm:mt-0 ${
                                    lesson.completed
                                      ? "bg-emerald-600 border-emerald-600 text-white"
                                      : "border-stone-300 hover:border-[#B99A63] bg-white"
                                  }`}
                                  title={lesson.completed ? "Mark incomplete" : "Mark completed"}
                                >
                                  {lesson.completed && <Check className="w-3.5 h-3.5" />}
                                </div>

                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs sm:text-sm font-bold text-stone-900">
                                      {lesson.title}
                                    </h5>
                                    {isCurrent && (
                                      <span className="px-2 py-0.5 rounded bg-[#151515] text-[#D4AF37] text-[10px] font-bold">
                                        Playing
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-stone-500 block">
                                    {lesson.duration} &bull; {lesson.date} &bull; {lesson.category}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                                <button
                                  type="button"
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    isCurrent
                                      ? "bg-[#151515] text-[#D4AF37]"
                                      : "bg-stone-100 hover:bg-[#151515] hover:text-white text-stone-700"
                                  }`}
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>{isCurrent ? "Active In Theater" : "Watch Lesson"}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 2: LIVE MASTERCLASS STUDIO WITH COUNTDOWN & CALENDAR
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "live_studio" && (
          <div className="space-y-8 text-left">
            {/* Live Masterclass Studio Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#151515] via-[#2A080E] to-[#151515] text-[#F5F0E8] border border-[#B99A63]/50 shadow-2xl p-6 sm:p-10 relative overflow-hidden space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      Live Broadcast Studio Active
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
                    {liveClassConfig?.sessionTitle || "Bharatanatyam Diploma Masterclass"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
                    Conducted directly by <strong className="text-white">Dr. Malavika M. Sunil (MBBS)</strong> &bull; Interactive posture correction &amp; rhythm drills.
                  </p>
                </div>

                {/* 1-Click Join Button */}
                <a
                  href={liveClassConfig?.meetUrl || "https://meet.google.com/dnc-ragas-live"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="silk-zari-btn px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#151515] font-bold text-sm shadow-xl shadow-[#D4AF37]/20 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
                >
                  <Video className="w-5 h-5" />
                  <span>Launch Live Classroom</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Countdown Timer Strip */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
                  Time Remaining Until Next Masterclass:
                </span>
                <div className="grid grid-cols-4 max-w-md gap-3">
                  {[
                    { label: "Days", val: timeLeft.days },
                    { label: "Hours", val: timeLeft.hours },
                    { label: "Minutes", val: timeLeft.minutes },
                    { label: "Seconds", val: timeLeft.seconds }
                  ].map((unit, uIdx) => (
                    <div
                      key={uIdx}
                      className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-[#B99A63]/30 text-center space-y-0.5"
                    >
                      <p className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#D4AF37]">
                        {String(unit.val).padStart(2, "0")}
                      </p>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classroom Access Credentials & Calendar Sync */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <span className="font-bold text-stone-300 block uppercase tracking-wider text-[10px]">
                    Direct Access Credentials
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Platform:</span>
                    <strong className="text-white">{liveClassConfig?.platform || "Google Meet"}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Meeting ID:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(liveClassConfig?.meetingId || "dnc-ragas-live", "Meeting ID")}
                      className="font-mono text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{liveClassConfig?.meetingId || "dnc-ragas-live"}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Passcode:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(liveClassConfig?.passcode || "RAGAS2026", "Passcode")}
                      className="font-mono text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{liveClassConfig?.passcode || "RAGAS2026"}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-stone-300 block uppercase tracking-wider text-[10px] mb-1">
                      Calendar Sync (Never Miss A Class)
                    </span>
                    <p className="text-stone-300 text-[11px]">
                      Add the recurring masterclass schedule to your personal Google Calendar, Apple Calendar, or Microsoft Outlook.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAddToGoogleCalendar}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Google Calendar</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadIcs}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Apple / Outlook (.ics)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pre-Class Technical & Attire Checklist */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <h4 className="text-base font-bold font-serif-luxury text-stone-900">
                Pre-Class Masterclass Checklist (Prescribed by Dr. Malavika)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-xs">1. Full-Body Camera Angle</strong>
                  <p className="leading-relaxed">
                    Position your laptop/tablet 7–9 feet away at hip level so Dr. Malavika can inspect your Aramandi knee turnout and foot strikes clearly.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-xs">2. Practice Saree / Attire &amp; Ghungroo</strong>
                  <p className="leading-relaxed">
                    Traditional practice dance attire or comfortable leggings with ankle bells (Ghungroos) tied securely.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-xs">3. Hydration &amp; Warm-up</strong>
                  <p className="leading-relaxed">
                    Complete 5 minutes of gentle hamstring, Achilles tendon and pelvic flexor stretches prior to joining the live session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 3: FORMAL FACULTY EVALUATION & RUBRIC DESK
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "evaluations" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B99A63]/20 text-[#3B0B14] text-[10px] font-bold uppercase tracking-wider">
                    Medical &amp; Artistic Evaluation
                  </span>
                  <span className="text-xs text-stone-500">Curated by Dr. Malavika M. Sunil (MBBS)</span>
                </div>
                <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                  Academic Performance &amp; Biomechanics Assessments
                </h3>
                <p className="text-xs text-stone-500">
                  Submit monthly video recordings of your prescribed adavu drills to receive clinical alignment scores and artistic critique.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#151515] hover:bg-[#B99A63] text-white hover:text-[#151515] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                <span>Submit Video for Evaluation</span>
              </button>
            </div>

            {/* Assessment Cards */}
            <div className="space-y-4">
              {(studentAssessments || []).map((ass) => (
                <div
                  key={ass.id}
                  className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-stone-500">
                          {ass.registrationNo}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ass.status === "Evaluated"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {ass.status}
                        </span>
                        {ass.grade && ass.grade !== "Under Review" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#151515] text-[#D4AF37] text-[10px] font-bold">
                            Grade: {ass.grade}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-stone-900 font-serif-luxury">
                        {ass.title}
                      </h4>
                      <span className="text-xs text-stone-500">
                        Submitted: {ass.submissionDate} &bull; Evaluated by: {ass.facultyMentor}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={ass.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 text-[#B99A63]" />
                        <span>View Submission Video</span>
                      </a>
                    </div>
                  </div>

                  {/* 4-Point Official Rubric Breakdown */}
                  {ass.rubric ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                          Official 4-Criterion Evaluation Breakdown:
                        </span>
                        <span className="text-sm font-bold text-stone-900 font-serif-luxury">
                          Score: <strong className="text-[#3B0B14]">{ass.totalScore}</strong> / {ass.maxTotal}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {Object.entries(ass.rubric).map(([key, item]) => (
                          <div
                            key={key}
                            className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-900">{item.label}</span>
                              <span className="px-2 py-0.5 rounded bg-white font-mono font-bold text-[#3B0B14] border border-stone-200">
                                {item.score} / {item.maxScore}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600 leading-relaxed">
                              {item.remarks}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Doctor's Clinical & Artistic Verdict */}
                      {ass.clinicalNote && (
                        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#B99A63]/30 space-y-1 text-xs">
                          <strong className="text-[#3B0B14] font-bold block text-xs">
                            Dr. Malavika's Biomechanical &amp; Performance Summary:
                          </strong>
                          <p className="text-stone-700 leading-relaxed italic font-serif-luxury text-sm">
                            &ldquo;{ass.clinicalNote}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{ass.clinicalNote}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 4: STUDY MATERIALS & OFFICIAL SYLLABUS NOTES (PDF)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "documents" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
              <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                Official Syllabus Documents &amp; Clinical Posture Guides
              </h3>
              <p className="text-xs text-stone-500">
                Authorized academic study notes, sloka handbooks, and dancer anatomy manuals verified by Dr. Malavika.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "doc-1",
                  title: "Diploma Year 1: Natyashastra Mudras & Hastha Bhedas Handbook",
                  refNo: "DR-SYL-MUDRA-01",
                  type: "Official PDF Document (24 Pages)",
                  category: "Theory & Sanskrit Slokas",
                  size: "3.4 MB",
                  verified: "Dr. Malavika M. Sunil"
                },
                {
                  id: "doc-2",
                  title: "Adavu Step-by-Step Footwork Notation & Talam Speed Drill Guide",
                  refNo: "DR-PRA-ADAVU-02",
                  type: "Practice Guidebook",
                  category: "Practical Training",
                  size: "4.8 MB",
                  verified: "Dr. Malavika M. Sunil"
                },
                {
                  id: "doc-3",
                  title: "Alarippu (Tisra Ekam) Rhythmic Score Notation & Cymbals Guide",
                  refNo: "DR-REP-ALARIPPU-03",
                  type: "Choreography Repertoire Score",
                  category: "Margam Repertoire",
                  size: "2.1 MB",
                  verified: "Dr. Malavika M. Sunil"
                },
                {
                  id: "doc-4",
                  title: "Dancer Musculoskeletal Posture, Joint Safety & Injury Prevention",
                  refNo: "DR-MED-ANATOMY-04",
                  type: "Clinical Biomechanics Manual",
                  category: "Medical Dance Science by Dr. Malavika",
                  size: "5.2 MB",
                  verified: "Dr. Malavika M. Sunil (MBBS)"
                }
              ].map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-4 hover:border-[#B99A63]/50 transition-all"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#B99A63]">
                        {doc.refNo}
                      </span>
                      <span className="text-[10px] text-stone-400">&bull; {doc.size}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                      {doc.title}
                    </h4>
                    <span className="text-[11px] text-stone-500 block">
                      {doc.type} &bull; Verified by {doc.verified}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast(`Initiating download: ${doc.title}`, "success")}
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-[#151515] hover:text-[#D4AF37] text-stone-700 transition-colors cursor-pointer shrink-0"
                    title="Download Official PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: SUBMIT VIDEO FOR EVALUATION
      ═══════════════════════════════════════════════════════════════ */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#B99A63]/50 shadow-2xl p-6 sm:p-7 space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B99A63]">
                  Formal Faculty Review
                </span>
                <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                  Submit Masterclass Video For Evaluation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitPractice} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Submission Title / Drill Topic *
                </label>
                <input
                  type="text"
                  required
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                  placeholder="e.g. Module 1: Tatta Adavu 1 to 8 Speed Checks & Aramandi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#B99A63]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Video URL (Google Drive, YouTube Unlisted or Vimeo) *
                </label>
                <input
                  type="url"
                  required
                  value={submitForm.videoUrl}
                  onChange={(e) => setSubmitForm({ ...submitForm, videoUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/... or https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#B99A63] font-mono"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Ensure Google Drive permissions are set to &quot;Anyone with the link can view&quot;.
                </span>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Self-Reflection Notes &amp; Questions for Dr. Malavika (Optional)
                </label>
                <textarea
                  rows={3}
                  value={submitForm.notes}
                  onChange={(e) => setSubmitForm({ ...submitForm, notes: e.target.value })}
                  placeholder="e.g. I felt slight tension in the Achilles tendon in the 3rd speed; could you verify my knee angle?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#B99A63]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="silk-zari-btn px-6 py-2.5 rounded-xl bg-[#151515] hover:bg-[#B99A63] text-white hover:text-[#151515] text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isSubmitting ? "Submitting..." : "Submit for Faculty Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
