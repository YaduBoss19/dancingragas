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
  Check,
  Activity,
  Layers,
  ArrowLeft,
  Lock,
  UserCheck,
  Stethoscope,
  Share2,
  Heart,
  Compass,
  CheckCircle,
  Flame,
  CreditCard
} from "lucide-react";
import UniversalVideoPlayer from "../components/UniversalVideoPlayer";
import TanpuraDroneWidget from "../components/TanpuraDroneWidget";
import SollukattuRhythmWidget from "../components/SollukattuRhythmWidget";
import SanadCertificateModal from "../components/SanadCertificateModal";
import PhysicianWellnessReportModal from "../components/PhysicianWellnessReportModal";
import StudentShowcaseModal from "../components/StudentShowcaseModal";
import AbsenceCatchupModal from "../components/AbsenceCatchupModal";
import MargamRoadmapWidget from "../components/MargamRoadmapWidget";
import TuitionRenewalCard from "../components/TuitionRenewalCard";
import VirtualStageRecitalsWidget from "../components/VirtualStageRecitalsWidget";
import TuitionReceiptModal from "../components/TuitionReceiptModal";
import { formatVideoEmbedUrl } from "../utils/videoUtils";

export default function StudentPortal({ onOpenAuth }) {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isWellnessModalOpen, setIsWellnessModalOpen] = useState(false);
  const [isShowcaseModalOpen, setIsShowcaseModalOpen] = useState(false);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [sadhanaStreak, setSadhanaStreak] = useState(14);
  const [practicedToday, setPracticedToday] = useState(false);
  const [activePracticeTool, setActivePracticeTool] = useState("tanpura"); // 'tanpura' | 'talam'
  const {
    authUser,
    userRole,
    handleLogout,
    showToast,
    navigateTo,
    recordings,
    liveClassConfig,
    curriculumModules,
    toggleLessonCompletion,
    studentAssessments,
    submitStudentAssessment,
    studentProfile,
    studentsList,
    activeStudentId,
    setActiveStudentId,
    studyMaterials
  } = useAcademy();

  // Active student identity (from studentsList or authUser)
  const currentStudent =
    (studentsList || []).find((s) => s.id === activeStudentId) ||
    (studentsList || [])[0] || {
      id: "stu-1",
      name: authUser?.user_metadata?.full_name || studentProfile?.studentName || "Ananya Menon",
      registrationNo: studentProfile?.registrationNo || "DR-DIP-2026-084",
      enrolledCourses: ["Bharatanatyam Diploma"],
      attendance: 94
    };

  // Selected course area if student is enrolled in multiple
  const [selectedCourseArea, setSelectedCourseArea] = useState(
    currentStudent.enrolledCourses?.[0] || "Bharatanatyam Diploma"
  );

  useEffect(() => {
    if (currentStudent.enrolledCourses && !currentStudent.enrolledCourses.includes(selectedCourseArea)) {
      setSelectedCourseArea(currentStudent.enrolledCourses[0] || "Bharatanatyam Diploma");
    }
  }, [currentStudent]);

  // Navigation tabs
  const [activeTab, setActiveTab] = useState("curriculum"); // 'curriculum' | 'live_studio' | 'evaluations' | 'documents'

  // Timezone & Countdown
  const [userTimezone, setUserTimezone] = useState("Local Time");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Selected lesson for theater player
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Submission Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: "",
    videoUrl: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search in curriculum
  const [lessonSearch, setLessonSearch] = useState("");

  // Filter recordings strictly for current student and selected course area
  const authorizedRecordings = (recordings || []).filter((rec) => {
    // 1. Must match course category
    const recCategory = rec.courseCategory || rec.category;
    const matchesCourse =
      recCategory === selectedCourseArea ||
      (selectedCourseArea === "Bharatanatyam Diploma" && recCategory?.toLowerCase().includes("bharatanatyam")) ||
      (selectedCourseArea === "Carnatic Music" && recCategory?.toLowerCase().includes("carnatic")) ||
      (selectedCourseArea === "Bollywood & Semi-Classical" && recCategory?.toLowerCase().includes("bollywood"));

    if (!matchesCourse) return false;

    // 2. Access Scope check (selected students only vs all enrolled students)
    if (rec.accessScope === "selected_students") {
      const allowed = rec.allowedStudentIds || [];
      return allowed.includes(currentStudent.id) || allowed.includes(currentStudent.email);
    }

    // Default: visible to any student enrolled in this course
    return true;
  });

  // Set default selected lesson
  useEffect(() => {
    if (!selectedLesson && authorizedRecordings.length > 0) {
      setSelectedLesson(authorizedRecordings[0]);
    } else if (
      selectedLesson &&
      authorizedRecordings.length > 0 &&
      !authorizedRecordings.some((r) => r.id === selectedLesson.id)
    ) {
      setSelectedLesson(authorizedRecordings[0]);
    }
  }, [selectedCourseArea, authorizedRecordings]);

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
        studentName: currentStudent.name,
        registrationNo: currentStudent.registrationNo,
        batch: selectedCourseArea,
        title: submitForm.title.trim(),
        videoUrl: formatVideoEmbedUrl(submitForm.videoUrl.trim()),
        notes: submitForm.notes.trim()
      });
      setSubmitForm({ title: "", videoUrl: "", notes: "" });
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
      setActiveTab("evaluations");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#151515] font-sans">
      {/* ═══════════════════════════════════════════════════════════════
          DEDICATED PORTAL APP TOP NAVIGATION (NO MARKETING HEADER)
      ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#1E050B] via-[#2D0A14] to-[#1E050B] text-[#F5F0E8] border-b border-[#B99A63]/30 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B0B14] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center font-serif-luxury font-bold text-base shadow-sm">
              DR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wide font-serif-luxury">
                  DancingRagas <span className="text-[#D4AF37]">Conservatory</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                  Student Portal
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Dr. Malavika Classical Arts Academy &bull; Authorized Student Workspace
              </p>
            </div>
          </div>

          {/* Student Profile Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Student Switcher (Testing & Verification) */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-stone-200">
              <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] text-stone-400">Student:</span>
              <select
                value={currentStudent.id}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                {(studentsList || []).map((s) => (
                  <option key={s.id} value={s.id} className="text-[#151515] bg-white">
                    {s.name} ({s.enrolledCourses?.join(", ")})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => navigateTo("admin")}
              className="px-3.5 py-1.5 rounded-xl bg-[#3B0B14] hover:bg-[#4E0E1B] text-[#D4AF37] border border-[#B99A63]/40 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Open Tutor / Director Portal"
            >
              Tutor Portal
            </button>

            <button
              onClick={() => navigateTo("home")}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-stone-300 border border-white/10 text-xs font-medium transition-all cursor-pointer"
            >
              Exit to Website
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-700/50 text-xs font-bold transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONSERVATORY DASHBOARD CONTENT
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto py-8 sm:py-10 px-4 sm:px-8 space-y-8">

        {/* ═══════════════════════════════════════════════════════════════
            OFFICIAL DIGITAL STUDENT CREDENTIAL CARD
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection
          animation="fade-up"
          className="rounded-3xl bg-gradient-to-br from-[#1E050B] via-[#3D0B16] to-[#1E050B] text-[#F5F0E8] border border-[#B99A63]/40 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12)_0,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#3B0B14] to-[#151515] border-2 border-[#D4AF37]/60 text-[#D4AF37] flex items-center justify-center font-serif-luxury text-2xl font-bold shadow-lg shadow-[#D4AF37]/15 shrink-0">
                {currentStudent.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    <span>Verified Student Member</span>
                  </span>
                  <span className="text-[11px] font-mono text-stone-300">
                    Reg: <strong className="text-white">{currentStudent.registrationNo}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCertificateOpen(true)}
                    className="silk-zari-btn px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] text-[10px] font-bold shadow-md hover:brightness-105 transition-all flex items-center gap-1 cursor-pointer tap-bounce"
                  >
                    <Award className="w-3 h-3 text-[#1E050B]" />
                    <span>View Gurukula Sanad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsWellnessModalOpen(true)}
                    className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer tap-bounce"
                  >
                    <Stethoscope className="w-3 h-3 text-emerald-300" />
                    <span>Doctor's Wellness Check</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsShowcaseModalOpen(true)}
                    className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer tap-bounce"
                  >
                    <Heart className="w-3 h-3 text-rose-300" />
                    <span>Family Showcase</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAbsenceModalOpen(true)}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer tap-bounce"
                  >
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    <span>Absence &amp; Catch-Up</span>
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury tracking-tight text-white">
                  {currentStudent.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300">
                  Enrolled in: <strong className="text-white">{currentStudent.enrolledCourses?.join(" & ")}</strong> &bull; Location: {currentStudent.location || "Online"}
                </p>
              </div>
            </div>

            {/* Course Area Switcher */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Active Course Area:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentStudent.enrolledCourses?.map((courseName) => (
                  <button
                    key={courseName}
                    onClick={() => setSelectedCourseArea(courseName)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCourseArea === courseName
                        ? "bg-[#D4AF37] text-[#151515] shadow-md"
                        : "bg-white/10 text-stone-300 hover:bg-white/20"
                    }`}
                  >
                    {courseName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Metric Strip */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Course Discipline
              </span>
              <p className="text-sm font-bold text-white truncate">{selectedCourseArea}</p>
              <span className="text-[10px] text-emerald-400 font-semibold block">Access Authorized</span>
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
                Attendance Record
              </span>
              <p className="text-sm font-bold text-white">{currentStudent.attendance || 94}%</p>
              <span className="text-[10px] text-emerald-400 font-semibold block">Exam Qualified</span>
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
            DAILY SADHANA STREAK & PRACTICE COUNTER (CUSTOMER DELIGHT)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1E050B] via-[#2E0913] to-[#1E050B] border border-[#B99A63]/40 p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#D4AF37] text-[#1E050B] flex items-center justify-center font-bold shadow-md shrink-0">
              <Flame className="w-6 h-6 text-[#1E050B] fill-[#1E050B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base font-serif-luxury text-white">
                  Daily Sadhana Streak: <span className="text-[#D4AF37]">{sadhanaStreak} Days Continuous Riyaz</span>
                </h4>
                {practicedToday && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/40">
                    Logged Today
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-300">
                {practicedToday
                  ? "Sadhana completed for today! Guru Dr. Malavika honors your devotion."
                  : "Consistent 20-min daily Adavu drills build injury-free muscle memory & laya stamina."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!practicedToday) {
                setPracticedToday(true);
                setSadhanaStreak((prev) => prev + 1);
                showToast("Sadhana logged! Your 15-day streak is active. Keep up the sacred discipline!", "success");
              } else {
                showToast("Today's sadhana is already recorded! Practice anytime with the Tanpura drone.", "info");
              }
            }}
            className={`silk-zari-btn px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer tap-bounce shrink-0 self-start sm:self-auto ${
              practicedToday
                ? "bg-emerald-900/60 text-emerald-200 border border-emerald-500/40"
                : "bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] hover:brightness-105"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{practicedToday ? "Sadhana Logged for Today" : "I Practiced 30m Today"}</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            PRACTICE TOOL SUITE: TANPURA DRONE vs SOLLUKATTU TALAM
        ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePracticeTool("tanpura")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePracticeTool === "tanpura"
                  ? "bg-[#1E050B] text-[#D4AF37] border border-[#B99A63]/50 shadow-xs"
                  : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
              }`}
            >
              Electronic Tanpura Drone
            </button>

            <button
              onClick={() => setActivePracticeTool("talam")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePracticeTool === "talam"
                  ? "bg-[#1E050B] text-[#D4AF37] border border-[#B99A63]/50 shadow-xs"
                  : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
              }`}
            >
              Sollukattu &amp; Talam Metronome
            </button>
          </div>

          {activePracticeTool === "tanpura" ? (
            <TanpuraDroneWidget />
          ) : (
            <SollukattuRhythmWidget />
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            FINANCIAL TRANSPARENCY & TUITION CARD
        ═══════════════════════════════════════════════════════════════ */}
        <TuitionRenewalCard
          studentName={currentStudent.name}
          registrationNo={currentStudent.registrationNo}
          batchName={currentStudent.enrolledCourses?.[0] || "Online Bharatanatyam Diploma Course"}
          onOpenReceipt={() => setIsReceiptModalOpen(true)}
        />

        {/* ═══════════════════════════════════════════════════════════════
            ACADEMIC NAVIGATION TABS
        ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-left">
          {[
            { id: "curriculum", label: `Course Area & Vault (${authorizedRecordings.length})`, icon: BookOpen },
            { id: "roadmap", label: "Margam Journey & Milestones", icon: Compass },
            { id: "virtual_stage", label: "Virtual Stage & Recitals", icon: Sparkles },
            { id: "live_studio", label: "Live Classroom & Countdown", icon: Calendar },
            { id: "evaluations", label: `Performance Evaluations (${studentAssessments.length})`, icon: Award },
            { id: "documents", label: "Study Materials & Notes", icon: FileText }
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
            TAB 1: COURSE AREA & UNLISTED MASTERCLASS VAULT
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "curriculum" && (
          <div className="space-y-8 text-left">

            {/* Active Theater Player */}
            {selectedLesson ? (
              <div className="rounded-3xl bg-[#151515] text-[#F5F0E8] border border-[#B99A63]/40 shadow-xl overflow-hidden">
                <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2A080E] to-[#151515] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                      {selectedCourseArea} &bull; Unlisted Masterclass Player
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
                      {selectedLesson.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLessonCompletion("mod-1", selectedLesson.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedLesson.completed
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{selectedLesson.completed ? "Marked Completed" : "Mark Unit Completed"}</span>
                    </button>
                  </div>
                </div>

                {/* Video Frame */}
                <UniversalVideoPlayer
                  url={selectedLesson.embedUrl || selectedLesson.videoUrl}
                  title={selectedLesson.title}
                  poster={selectedLesson.thumbnail}
                  className="w-full"
                />

                {/* Lesson Details */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300 border-b border-white/10 pb-3">
                    <span className="text-[#D4AF37] font-semibold">
                      Duration: {selectedLesson.duration} &bull; Recorded Class &bull; {selectedLesson.date}
                    </span>
                    <span className="text-stone-400">
                      Module: {selectedLesson.module || "General Repertoire"}
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
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
                <Lock className="w-8 h-8 text-[#B99A63] mx-auto" />
                <h4 className="text-base font-bold text-stone-900">
                  No Unlisted Videos Assigned Yet
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Dr. Malavika hasn&apos;t added any recorded masterclasses to this course area yet, or access is restricted. Check back after your next live session.
                </p>
              </div>
            )}

            {/* List of Available Unlisted Videos for this Student */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                    {selectedCourseArea} &bull; Authorized Class Recordings ({authorizedRecordings.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Only students officially enrolled in {selectedCourseArea} have access to these unlisted masterclass recordings.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    placeholder="Search recording topic..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-[#B99A63]"
                  />
                </div>
              </div>

              {/* Videos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {authorizedRecordings
                  .filter(
                    (rec) =>
                      !lessonSearch.trim() ||
                      rec.title.toLowerCase().includes(lessonSearch.toLowerCase()) ||
                      (rec.topics && rec.topics.some((t) => t.toLowerCase().includes(lessonSearch.toLowerCase())))
                  )
                  .map((rec) => {
                    const isSelected = selectedLesson?.id === rec.id;
                    return (
                      <div
                        key={rec.id}
                        onClick={() => {
                          setSelectedLesson(rec);
                          window.scrollTo({ top: 320, behavior: "smooth" });
                        }}
                        className={`rounded-2xl overflow-hidden border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                          isSelected
                            ? "border-[#B99A63] ring-2 ring-[#B99A63]/30 shadow-md"
                            : "border-stone-200 hover:border-[#B99A63]/50 shadow-xs"
                        }`}
                      >
                        <div className="relative aspect-video bg-stone-900 overflow-hidden">
                          <img
                            src={rec.thumbnail || "/images/courses/Courses/bharatanatyam_diploma/main.jpg"}
                            alt={rec.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/90 text-[#151515] flex items-center justify-center shadow-lg">
                              <Play className="w-4 h-4 fill-current translate-x-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-bold">
                            {rec.duration}
                          </span>
                        </div>

                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-stone-500">
                              <span className="font-bold text-[#3B0B14]">{rec.module || rec.courseCategory}</span>
                              <span>{rec.date}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2">
                              {rec.title}
                            </h4>
                          </div>

                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#B99A63]">
                            <span>{isSelected ? "● Currently In Player" : "Watch Masterclass"}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB: MARGAM JOURNEY & DIPLOMA MILESTONES (CUSTOMER PROGRESS)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "roadmap" && (
          <MargamRoadmapWidget
            currentLevel={3}
            courseName={selectedCourseArea}
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB: VIRTUAL STAGE & RECITAL CONCLAVES (CUSTOMER PERFORMANCE)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "virtual_stage" && (
          <VirtualStageRecitalsWidget
            studentName={currentStudent.name}
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 2: LIVE MASTERCLASS STUDIO WITH COUNTDOWN & CALENDAR
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "live_studio" && (
          <div className="space-y-8 text-left">
            <div className="rounded-3xl bg-gradient-to-br from-[#1E050B] via-[#3D0B16] to-[#1E050B] text-[#F5F0E8] border border-[#B99A63]/50 shadow-2xl p-6 sm:p-10 relative overflow-hidden space-y-6">
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

                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={`${liveClassConfig?.meetUrl || "https://meet.google.com/dnc-ragas-live"}?authuser=${encodeURIComponent(currentStudent.email || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="silk-zari-btn px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#151515] font-bold text-sm shadow-xl shadow-[#D4AF37]/20 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto shrink-0 tap-bounce"
                  >
                    <Video className="w-5 h-5" />
                    <span>Join Google Meet ({currentStudent.name.split(" ")[0]})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <div className="text-[10px] text-stone-300 text-center flex items-center justify-center gap-1">
                    <span>Passcode: <strong className="text-[#D4AF37] font-mono">{liveClassConfig?.passcode || "RAGAS2026"}</strong></span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
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

              {/* Credentials & Calendar Sync */}
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
                      Calendar Sync
                    </span>
                    <p className="text-stone-300 text-[11px]">
                      Add the live class to your personal Google Calendar, Apple Calendar, or Outlook.
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
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 3: FORMAL FACULTY EVALUATIONS DESK
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "evaluations" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B99A63]/20 text-[#3B0B14] text-[10px] font-bold uppercase tracking-wider">
                    Medical &amp; Artistic Evaluation
                  </span>
                  <span className="text-xs text-stone-500">Evaluated by Dr. Malavika M. Sunil (MBBS)</span>
                </div>
                <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                  Academic Performance &amp; Biomechanics Assessments
                </h3>
                <p className="text-xs text-stone-500">
                  Submit monthly video recordings of your prescribed drills to receive clinical alignment scores and artistic critique.
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

                    <a
                      href={ass.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <Video className="w-3.5 h-3.5 text-[#B99A63]" />
                      <span>View Submission Video</span>
                    </a>
                  </div>

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

                      {ass.clinicalNote && (
                        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#B99A63]/30 space-y-1 text-xs">
                          <strong className="text-[#3B0B14] font-bold block text-xs">
                            Dr. Malavika&apos;s Biomechanical &amp; Performance Summary:
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
            TAB 4: STUDY MATERIALS & NOTES (PDF)
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
              {(studyMaterials || []).map((doc) => (
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
                      {doc.courseCategory && (
                        <span className="px-2 py-0.5 rounded-md bg-[#1E050B]/10 text-[#1E050B] text-[9px] font-bold">
                          {doc.courseCategory}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                      {doc.title}
                    </h4>
                    <span className="text-[11px] text-stone-500 block">
                      {doc.type} &bull; Verified by {doc.verified}
                    </span>
                  </div>

                  <a
                    href={doc.fileUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!doc.fileUrl || doc.fileUrl.startsWith("#")) {
                        e.preventDefault();
                        showToast(`Viewing syllabus material: ${doc.title}`, "info");
                      }
                    }}
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-[#151515] hover:text-[#D4AF37] text-stone-700 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-bold"
                    title="Download Official PDF"
                  >
                    <Download className="w-4 h-4 text-[#B99A63]" />
                    <span className="hidden sm:inline">PDF</span>
                  </a>
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
      <SanadCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        student={currentStudent}
      />

      {/* Physician Biomechanical Health Assessment */}
      <PhysicianWellnessReportModal
        isOpen={isWellnessModalOpen}
        onClose={() => setIsWellnessModalOpen(false)}
        studentName={currentStudent.name}
        registrationNo={currentStudent.registrationNo}
        batchName={currentStudent.enrolledCourses?.[0]}
      />

      {/* Proud Parent & Grandparent Digital Showcase */}
      <StudentShowcaseModal
        isOpen={isShowcaseModalOpen}
        onClose={() => setIsShowcaseModalOpen(false)}
        studentName={currentStudent.name}
        registrationNo={currentStudent.registrationNo}
        batchName={currentStudent.enrolledCourses?.[0]}
        activePiece={selectedLesson?.title || "Jathiswaram in Ragam Kalyani"}
        featuredVideoUrl={selectedLesson?.embedUrl || selectedLesson?.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
      />

      {/* Absence Care & Makeup Catch-Up */}
      <AbsenceCatchupModal
        isOpen={isAbsenceModalOpen}
        onClose={() => setIsAbsenceModalOpen(false)}
        studentName={currentStudent.name}
        onAbsenceLogged={(data) => {
          showToast(`Absence recorded for ${data.date}. Your attendance streak is protected!`, "success");
        }}
      />

      {/* Official Tuition Sanad & Fee Receipt */}
      <TuitionReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        student={currentStudent}
      />
    </div>
  );
}