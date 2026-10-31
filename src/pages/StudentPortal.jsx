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
  CreditCard,
  Eye,
  X,
  KeyRound
} from "lucide-react";
import WhatsAppIcon from "../components/WhatsAppIcon";
import UniversalVideoPlayer from "../components/UniversalVideoPlayer";
import YouTubeShortsReel from "../components/YouTubeShortsReel";
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
import StudentProfileModal from "../components/StudentProfileModal";
import FloatingTanpuraBar from "../components/FloatingTanpuraBar";
import MobileStudentNavBar from "../components/MobileStudentNavBar";
import StickyLiveMeetPill from "../components/StickyLiveMeetPill";
import { MessageCircle, Camera, Edit2 } from "lucide-react";
import { formatVideoEmbedUrl } from "../utils/videoUtils";

export default function StudentPortal({ onOpenAuth }) {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isCertLockedNoticeOpen, setIsCertLockedNoticeOpen] = useState(false);
  const [isWellnessModalOpen, setIsWellnessModalOpen] = useState(false);
  const [isShowcaseModalOpen, setIsShowcaseModalOpen] = useState(false);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [previewPdfDoc, setPreviewPdfDoc] = useState(null);
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
    studyMaterials,
    liveClassSchedules,
    updateStudentProfileDetails,
    updateStudentAccessKey,
    reportStudentAbsence
  } = useAcademy();

  // 🔒 SECURE STUDENT ISOLATION:
  // When logged in as student, ALWAYS lock directly to authenticated student identity.
  // Never allow viewing another student's assessments, attendance, or private feedback.
  const currentStudent = userRole === "student" && authUser?.email
    ? ((studentsList || []).find((s) => s.email?.toLowerCase() === authUser.email.toLowerCase()) || {
        id: authUser.id || "stu-user",
        name: authUser.user_metadata?.full_name || "Enrolled Disciple",
        email: authUser.email,
        registrationNo: authUser.user_metadata?.registration_no || "DR-DIP-2026",
        enrolledCourses: ["Bharatanatyam Diploma"],
        attendance: 94
      })
    : ((studentsList || []).find((s) => s.id === activeStudentId) ||
       (authUser?.email && (studentsList || []).find((s) => s.email?.toLowerCase() === authUser.email.toLowerCase())) ||
       (studentsList || [])[0] || {
        id: "stu-1",
        name: "Ananya Menon",
        email: "ananya.menon@example.com",
        registrationNo: "DR-DIP-2026-084",
        enrolledCourses: ["Bharatanatyam Diploma"],
        attendance: 94
      });

  // Selected course area if student is enrolled in multiple
  const [selectedCourseArea, setSelectedCourseArea] = useState(
    currentStudent.enrolledCourses?.[0] || "Bharatanatyam Diploma"
  );

  useEffect(() => {
    if (currentStudent.enrolledCourses && !currentStudent.enrolledCourses.includes(selectedCourseArea)) {
      setSelectedCourseArea(currentStudent.enrolledCourses[0] || "Bharatanatyam Diploma");
    }
  }, [currentStudent]);

  // Match scheduled live class with student's active course area
  const activeLiveSession = (liveClassSchedules || []).find((s) =>
    s.courseCategory === selectedCourseArea ||
    (s.batchName && s.batchName.toLowerCase().includes(selectedCourseArea.toLowerCase()))
  ) || (liveClassSchedules || [])[0] || liveClassConfig;

  // Dynamic Personalized Greeting with Next Class Countdown
  const getGreetingData = () => {
    const hour = new Date().getHours();
    let salutation = "Good evening";
    if (hour >= 5 && hour < 12) salutation = "Good morning";
    else if (hour >= 12 && hour < 17) salutation = "Good afternoon";

    const firstName = (currentStudent?.name || "Student").split(" ")[0];

    let nextClassPhrase = "Class schedule updating soon";
    if (activeLiveSession?.targetTimestamp) {
      const diffMs = new Date(activeLiveSession.targetTimestamp).getTime() - Date.now();
      if (diffMs <= 0) {
        nextClassPhrase = "Class is happening today!";
      } else {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 0) {
          nextClassPhrase = `Next live class is today (in ${diffHours}h)!`;
        } else if (diffDays === 1) {
          nextClassPhrase = "Next live class is tomorrow!";
        } else {
          nextClassPhrase = `Next live class in ${diffDays} days!`;
        }
      }
    }
    return { salutation, firstName, nextClassPhrase };
  };
  const greetingData = getGreetingData();

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

  // Filter curriculum modules for active course category
  const filteredModules = (curriculumModules || []).filter((m) => {
    if (!m.courseCategory) return true;
    return (
      m.courseCategory === selectedCourseArea ||
      (selectedCourseArea === "Bharatanatyam Diploma" && m.courseCategory?.toLowerCase().includes("bharatanatyam")) ||
      (selectedCourseArea === "Carnatic Music" && m.courseCategory?.toLowerCase().includes("carnatic")) ||
      (selectedCourseArea === "Bollywood & Semi-Classical" && m.courseCategory?.toLowerCase().includes("bollywood"))
    );
  });

  // Extract lessons from modules and combine with recordings
  const moduleLessons = filteredModules.flatMap((m) =>
    (m.lessons || []).map((l) => ({
      ...l,
      module: m.title,
      moduleId: m.id,
      courseCategory: m.courseCategory || l.category || selectedCourseArea
    }))
  );

  const combinedRecordings = [...moduleLessons];
  (recordings || []).forEach((rec) => {
    if (!combinedRecordings.some((r) => r.id === rec.id)) {
      combinedRecordings.push(rec);
    }
  });

  // Filter recordings strictly for current student and selected course area
  const authorizedRecordings = combinedRecordings.filter((rec) => {
    const recCategory = rec.courseCategory || rec.category;
    const matchesCourse =
      !recCategory ||
      recCategory === selectedCourseArea ||
      (selectedCourseArea === "Bharatanatyam Diploma" && recCategory?.toLowerCase().includes("bharatanatyam")) ||
      (selectedCourseArea === "Carnatic Music" && recCategory?.toLowerCase().includes("carnatic")) ||
      (selectedCourseArea === "Bollywood & Semi-Classical" && recCategory?.toLowerCase().includes("bollywood"));

    if (!matchesCourse) return false;

    if (rec.accessScope === "selected_students") {
      const allowed = rec.allowedStudentIds || [];
      return allowed.includes(currentStudent.id) || allowed.includes(currentStudent.email);
    }

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
    const target = new Date(activeLiveSession?.targetTimestamp || liveClassConfig?.targetTimestamp || Date.now() + 2 * 24 * 60 * 60 * 1000).getTime();

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
  }, [activeLiveSession?.targetTimestamp, liveClassConfig?.targetTimestamp]);

  const handleAddToGoogleCalendar = () => {
    const title = encodeURIComponent(`DancingRagas Live: ${activeLiveSession?.sessionTitle || liveClassConfig?.sessionTitle || "Bharatanatyam Masterclass"}`);
    const details = encodeURIComponent(
      `Interactive masterclass with ${activeLiveSession?.instructor || "Dr. Malavika M. Sunil"}.\n\nMeeting Link: ${activeLiveSession?.meetUrl || liveClassConfig?.meetUrl || ""}\nMeeting ID: ${activeLiveSession?.meetingId || liveClassConfig?.meetingId || ""}\nPasscode: ${activeLiveSession?.passcode || liveClassConfig?.passcode || ""}\nBatch: ${activeLiveSession?.courseCategory || selectedCourse}`
    );
    const location = encodeURIComponent(activeLiveSession?.meetUrl || liveClassConfig?.meetUrl || "Google Meet Online Studio");
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(gcalUrl, "_blank");
    showToast("Opened Google Calendar to save your masterclass!", "info");
  };

  const handleDownloadIcs = () => {
    const eventTitle = activeLiveSession?.sessionTitle || liveClassConfig?.sessionTitle || "DancingRagas Masterclass";
    const eventUrl = activeLiveSession?.meetUrl || liveClassConfig?.meetUrl || "https://meet.google.com";
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#151515] font-sans">
      {/* ═══════════════════════════════════════════════════════════════
          DEDICATED PORTAL APP TOP NAVIGATION (NO MARKETING HEADER)
      ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0F172A] via-[#0B132B] to-[#0F172A] text-[#F5F0E8] border-b border-[#DFAC88]/30 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#151515] border border-[#C9956A]/50 text-[#C9956A] flex items-center justify-center font-serif-luxury font-bold text-base shadow-sm">
              DR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wide font-serif-luxury">
                  DancingRagas <span className="text-[#C9956A]">Conservatory</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C9956A]/20 border border-[#C9956A]/40 text-[#C9956A] text-[10px] font-bold uppercase tracking-wider">
                  Student Portal
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Dr. Malavika Classical Arts Academy &bull; Authorized Student Workspace
              </p>
            </div>
          </div>

          {/* Student Profile Identity & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Tutor Inspection Mode: Switcher & Return to Desk */}
            {(userRole === "tutor" || userRole === "admin") ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-stone-200">
                  <UserCheck className="w-3.5 h-3.5 text-[#C9956A]" />
                  <span className="text-[11px] text-stone-400">Viewing Disciple:</span>
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
                  className="px-3.5 py-1.5 rounded-xl bg-[#C9956A] hover:bg-[#b07d53] text-[#260A22] text-xs font-bold transition-all cursor-pointer shadow-xs"
                  title="Return to Tutor / Director Desk"
                >
                  Tutor Desk &rarr;
                </button>
              </>
            ) : (
              /* Enrolled Student Secured View: Fixed Single Identity (No Switching Allowed) */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-[#DFAC88]/30 text-xs text-[#E8B896]">
                  <UserCheck className="w-3.5 h-3.5 text-[#C9956A]" />
                  <span className="font-bold text-white">{currentStudent.name}</span>
                  <span className="text-[10px] text-stone-300 font-mono">({currentStudent.registrationNo || "Enrolled Disciple"})</span>
                </div>
                <button
                  onClick={() => {
                    const newKey = window.prompt(`Set your new personal access key:`, currentStudent.accessKey || "ragas2026");
                    if (newKey && newKey.trim()) {
                      if (newKey.trim().length < 4) {
                        alert("Access key must be at least 4 characters.");
                        return;
                      }
                      updateStudentAccessKey && updateStudentAccessKey(currentStudent.id, newKey.trim());
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#E8B896] border border-[#DFAC88]/30 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                  title="Change your personal access key"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#C9956A]" />
                  <span className="hidden sm:inline">Change Key</span>
                </button>
              </div>
            )}

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

      {/* Sticky Quick-Join Live Class Banner Pill */}
      <StickyLiveMeetPill
        liveSession={activeLiveSession}
        studentEmail={currentStudent.email}
        studentName={currentStudent.name}
        onCopyLink={handleCopyLink}
      />

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONSERVATORY DASHBOARD CONTENT
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto py-8 sm:py-10 px-4 sm:px-8 space-y-8">

        {/* ═══════════════════════════════════════════════════════════════
            OFFICIAL DIGITAL STUDENT CREDENTIAL CARD
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection
          animation="fade-up"
          className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-[#F5F0E8] border border-[#DFAC88]/40 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12)_0,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Disciple Portrait Photo Avatar with Edit Trigger */}
              <div
                onClick={() => setIsProfileModalOpen(true)}
                className="relative group cursor-pointer shrink-0"
                title="Click to change disciple photo & details"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#260A22] to-[#3D1035] border-2 border-[#C9956A] text-[#C9956A] flex items-center justify-center font-serif-luxury text-2xl font-bold shadow-xl overflow-hidden group-hover:scale-105 transition-all">
                  {currentStudent.avatarUrl ? (
                    <img src={currentStudent.avatarUrl} alt={currentStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentStudent.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-r from-[#C9956A] to-[#DFAC88] text-[#0F172A] shadow-md group-hover:brightness-110">
                  <Camera className="w-3.5 h-3.5 text-[#0F172A]" />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#C9956A]/20 border border-[#C9956A]/40 text-[#C9956A] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-[#C9956A]" />
                    <span>Verified Student ID</span>
                  </span>
                  <span className="text-[11px] font-mono text-stone-300">
                    ID: <strong className="text-white">{currentStudent.registrationNo}</strong>
                  </span>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-[#C9956A]" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9956A]/20 border border-[#C9956A]/40 text-[#E8B896] text-xs font-semibold backdrop-blur-md">
                  <span>🙏 {greetingData.salutation}, <strong>{greetingData.firstName}</strong>!</span>
                  <span className="text-stone-400">&bull;</span>
                  <span className="text-white font-bold">{greetingData.nextClassPhrase}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury tracking-tight text-white">
                    {currentStudent.name}
                  </h1>

                  {/* Direct WhatsApp Contact Pill */}
                  <a
                    href={`https://wa.me/${(currentStudent.whatsappNumber || currentStudent.phone || "+919847012345").replace(/[^0-9]/g, "")}?text=Hello%20Dr.%20Malavika%2C%20this%20is%20${encodeURIComponent(currentStudent.name)}%20(${currentStudent.registrationNo}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-emerald-300 text-xs font-bold transition-all shadow-xs"
                    title="Direct WhatsApp with Dr. Malavika"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp: {currentStudent.whatsappNumber || currentStudent.phone || "+91 98470 12345"}</span>
                  </a>
                </div>

                <p className="text-xs sm:text-sm text-stone-300">
                  Enrolled in: <strong className="text-white">{currentStudent.enrolledCourses?.join(" & ")}</strong> &bull; Location: {currentStudent.location || "Online"}
                </p>

                {/* Academy Quick Actions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {/* View Certificate: ONLY visible when tutor enables it for this student or if previewing as tutor/admin */}
                  {(currentStudent.certificateEnabled || userRole === "tutor" || userRole === "admin") && (
                    <button
                      type="button"
                      onClick={() => setIsCertificateOpen(true)}
                      className="silk-zari-btn px-3 py-1 rounded-full bg-gradient-to-r from-[#C9956A] to-[#DFAC88] text-[#0F172A] text-[10px] font-bold shadow-md hover:brightness-105 transition-all flex items-center gap-1 cursor-pointer tap-bounce"
                    >
                      <Award className="w-3 h-3 text-[#0F172A]" />
                      <span>View Certificate</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsWellnessModalOpen(true)}
                    className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer tap-bounce"
                  >
                    <Stethoscope className="w-3 h-3 text-emerald-300" />
                    <span>Wellness Advice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsShowcaseModalOpen(true)}
                    className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer tap-bounce"
                  >
                    <Heart className="w-3 h-3 text-rose-300" />
                    <span>Student Showcase</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAbsenceModalOpen(true)}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer tap-bounce"
                  >
                    <Calendar className="w-3 h-3 text-[#C9956A]" />
                    <span>Report Absence</span>
                  </button>
                </div>
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
                        ? "bg-[#C9956A] text-[#151515] shadow-md"
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
                <p className="text-base font-bold text-[#C9956A]">{overallProgress}%</p>
                <span className="text-[10px] text-stone-400">{completedLessons}/{allLessons.length} Units</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#DFAC88] to-[#C9956A] transition-all duration-700"
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
              <p className="text-xs sm:text-sm font-bold text-[#C9956A] truncate">Dr. Malavika M. Sunil</p>
              <span className="text-[10px] text-stone-400 block">MBBS &bull; Senior Exponent</span>
            </div>
          </div>
        
          {/* Expanded Curriculum Milestone Journey */}
          <div className="relative z-10 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-300 font-bold uppercase tracking-wider text-[11px]">Syllabus Milestones:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C9956A]/20 text-[#E8B896] border border-[#C9956A]/40 text-[10px] font-bold uppercase tracking-wider">
                  {overallProgress < 25 ? "Stage 1: Beginner" : overallProgress < 50 ? "Stage 2: Intermediate" : overallProgress < 75 ? "Stage 3: Advanced" : "Stage 4: Arangetram Ready"}
                </span>
              </div>
              <div className="text-[11px] text-stone-300 font-mono">
                Overall Progress: <strong className="text-[#E8B896] text-sm">{overallProgress}%</strong> ({completedLessons}/{allLessons.length} units completed)
              </div>
            </div>

            <div className="w-full h-3.5 rounded-full bg-black/40 border border-white/10 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C9956A] via-[#E8B896] to-[#C9956A] transition-all duration-700 shadow-sm"
                style={{ width: `${Math.max(5, overallProgress)}%` }}
              />
            </div>

            <div className="grid grid-cols-4 text-center text-[10px] sm:text-xs pt-1">
              <div className={`p-1.5 rounded-xl ${overallProgress >= 0 ? "bg-white/5 text-[#E8B896] font-bold" : "text-stone-400"}`}>
                <span>Beginner</span>
                <span className="block text-[9px] opacity-70">0 - 25%</span>
              </div>
              <div className={`p-1.5 rounded-xl ${overallProgress >= 25 ? "bg-white/5 text-[#E8B896] font-bold" : "text-stone-400"}`}>
                <span>Intermediate</span>
                <span className="block text-[9px] opacity-70">26 - 50%</span>
              </div>
              <div className={`p-1.5 rounded-xl ${overallProgress >= 50 ? "bg-white/5 text-[#E8B896] font-bold" : "text-stone-400"}`}>
                <span>Advanced</span>
                <span className="block text-[9px] opacity-70">51 - 75%</span>
              </div>
              <div className={`p-1.5 rounded-xl ${overallProgress >= 75 ? "bg-white/5 text-[#E8B896] font-bold" : "text-stone-400"}`}>
                <span>Arangetram</span>
                <span className="block text-[9px] opacity-70">76 - 100%</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            LIVE CLASSROOM GOOGLE MEET CONNECT (SYNCED PER BATCH)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl bg-gradient-to-br from-[#260A22] via-[#3D1035] to-[#260A22] border border-[#DFAC88]/50 text-white p-6 sm:p-7 shadow-2xl relative overflow-hidden text-left space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  Live Classroom &bull; {selectedCourseArea} Batch
                </span>
                <span className="text-xs text-[#C9956A] font-semibold">
                  • {activeLiveSession.scheduledDayTime}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-white">
                {activeLiveSession.sessionTitle || "Weekly Live Masterclass Studio"}
              </h3>
              <p className="text-xs text-stone-300">
                Mentored directly by {activeLiveSession.instructor || "Dr. Malavika M. Sunil (MBBS)"} &bull; Batch: {activeLiveSession.batchName || selectedCourseArea}
              </p>
            </div>

            {/* Google Meet & Instant Classroom Direct Launch */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href={(activeLiveSession.meetUrl && !activeLiveSession.meetUrl.includes("dnc-") && !activeLiveSession.meetUrl.includes("ragas-live-room")) ? activeLiveSession.meetUrl : "https://meet.google.com/new"}
                target="_blank"
                rel="noopener noreferrer"
                className="silk-zari-btn px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2 cursor-pointer tap-bounce"
              >
                <Video className="w-4 h-4 text-white" />
                <span>Join Google Meet Now</span>
              </a>



              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🌸 DancingRagas Live Classroom\n\nClass: ${activeLiveSession.sessionTitle}\nBatch: ${selectedCourseArea}\nTime: ${activeLiveSession.scheduledDayTime}\n\nJoin Google Meet:\n${activeLiveSession.meetUrl || "https://meet.google.com/new"}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-emerald-300 transition-all cursor-pointer shadow-xs"
                title="Send Meet link to WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Class Platform</span>
              <strong className="text-white text-xs block">Google Meet (HD Video &amp; Audio)</strong>
              <span className="text-[10px] text-stone-300 font-mono">ID: {activeLiveSession.meetingId || "ragas-live-room"}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Next Live Countdown</span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#C9956A]">
                <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
              </div>
              <span className="text-[10px] text-emerald-300">Synchronized to {userTimezone}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Classroom Protocol</span>
              <p className="text-[11px] text-stone-300 leading-snug">
                {activeLiveSession.notice || "Ensure ghungroos and traditional practice attire are ready 5 minutes before class."}
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            DAILY PRACTICE TRACKER (ACADEMY RIYAZ)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl bg-gradient-to-r from-[#260A22] via-[#3D1035] to-[#260A22] border border-[#DFAC88]/40 p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#C9956A] text-[#0F172A] flex items-center justify-center font-bold shadow-md shrink-0">
              <Flame className="w-6 h-6 text-[#0F172A] fill-[#0F172A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base font-serif-luxury text-white">
                  Daily Practice Tracker: <span className="text-[#C9956A]">{sadhanaStreak} Days Active Streak</span>
                </h4>
                {practicedToday && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/40">
                    Logged Today
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-300">
                {practicedToday
                  ? "Practice logged for today! Guru Dr. Malavika acknowledges your dedication."
                  : "Consistent daily practice builds neuromuscular coordination, rhythm timing, and movement stamina."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!practicedToday) {
                setPracticedToday(true);
                setSadhanaStreak((prev) => prev + 1);
                showToast("Practice logged! Streak updated. Keep up the dedication!", "success");
              } else {
                showToast("Today's practice is already logged! Practice anytime with the Tanpura drone.", "info");
              }
            }}
            className={`silk-zari-btn px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer tap-bounce shrink-0 self-start sm:self-auto ${
              practicedToday
                ? "bg-emerald-900/60 text-emerald-200 border border-emerald-500/40"
                : "bg-gradient-to-r from-[#C9956A] to-[#DFAC88] text-[#0F172A] hover:brightness-105"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{practicedToday ? "Practice Logged for Today" : "Log 30m Practice Today"}</span>
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
                  ? "bg-[#0F172A] text-[#C9956A] border border-[#DFAC88]/50 shadow-xs"
                  : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
              }`}
            >
              Electronic Tanpura Drone
            </button>

            <button
              onClick={() => setActivePracticeTool("talam")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePracticeTool === "talam"
                  ? "bg-[#0F172A] text-[#C9956A] border border-[#DFAC88]/50 shadow-xs"
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
            { id: "live_studio", label: "Live Classes & Google Meet", icon: Video },
            { id: "curriculum", label: `Course Videos & Lessons (${authorizedRecordings.length})`, icon: BookOpen },
            { id: "documents", label: `Study Materials & PDFs (${(studyMaterials || []).length})`, icon: FileText },
            { id: "evaluations", label: `My Submissions & Feedback (${studentAssessments.length})`, icon: Award },
            { id: "roadmap", label: "Learning Milestones", icon: Compass },
            { id: "virtual_stage", label: "Student Recitals & Stage", icon: Film }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#151515] text-[#C9956A] shadow-sm"
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
              <div className="rounded-3xl bg-[#151515] text-[#F5F0E8] border border-[#DFAC88]/40 shadow-xl overflow-hidden">
                <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2A080E] to-[#151515] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9956A]">
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
                    <span className="text-[#C9956A] font-semibold">
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

                  {/* Attached PDF Below Video Player */}
                  {(selectedLesson.notesPdf || selectedLesson.pdfTitle || selectedLesson.pdfUrl) && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-[#C9956A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C9956A]/20 border border-[#C9956A]/40 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-[#C9956A]" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#C9956A] tracking-wider block">
                            Attached Study Notes &amp; Notation
                          </span>
                          <strong className="text-white text-xs sm:text-sm block">
                            {selectedLesson.pdfTitle || selectedLesson.notesPdf}
                          </strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewPdfDoc({
                              title: selectedLesson.pdfTitle || selectedLesson.notesPdf,
                              fileUrl: selectedLesson.pdfUrl || "#",
                              type: "Lesson Study Notes"
                            })
                          }
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#E8B896] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C9956A]" />
                          <span>Preview Notes</span>
                        </button>
                        <a
                          href={selectedLesson.pdfUrl || "#"}
                          download={`${selectedLesson.pdfTitle || selectedLesson.notesPdf || "Lesson_Notes"}.pdf`}
                          onClick={(e) => {
                            if (!selectedLesson.pdfUrl || selectedLesson.pdfUrl.startsWith("#")) {
                              e.preventDefault();
                              setPreviewPdfDoc({
                                title: selectedLesson.pdfTitle || selectedLesson.notesPdf,
                                fileUrl: selectedLesson.pdfUrl || "#",
                                type: "Lesson Study Notes"
                              });
                            }
                          }}
                          className="silk-zari-btn px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9956A] to-[#DFAC88] text-[#151515] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
                <Lock className="w-8 h-8 text-[#DFAC88] mx-auto" />
                <h4 className="text-base font-bold text-stone-900">
                  No Unlisted Videos Assigned Yet
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Dr. Malavika hasn&apos;t added any recorded masterclasses to this course area yet, or access is restricted. Check back after your next live session.
                </p>
              </div>
            )}

            {/* Course Module-Wise Outline */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#3D1035] text-[#E8B896] text-[10px] font-bold uppercase tracking-wider">
                      Module-Wise Curriculum
                    </span>
                    <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                      {selectedCourseArea} &bull; Structured Units &amp; Lessons
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Structured by module with syllabus drills, actual video durations, and attached PDF notes.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    placeholder="Search module or topic..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-[#DFAC88]"
                  />
                </div>
              </div>

              {/* Modules List */}
              {filteredModules.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
                  <h4 className="text-sm font-bold text-stone-700">No modules found for this course area</h4>
                  <p className="text-xs text-stone-500">Dr. Malavika will publish the next syllabus module soon.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredModules.map((mod, modIdx) => {
                    const modLessons = mod.lessons || [];
                    const filteredLessons = modLessons.filter(
                      (l) =>
                        !lessonSearch.trim() ||
                        l.title.toLowerCase().includes(lessonSearch.toLowerCase()) ||
                        mod.title.toLowerCase().includes(lessonSearch.toLowerCase()) ||
                        (l.topics && l.topics.some((t) => t.toLowerCase().includes(lessonSearch.toLowerCase())))
                    );
                    if (filteredLessons.length === 0 && lessonSearch.trim()) return null;

                    const completedCount = modLessons.filter((l) => l.completed).length;
                    const modPct = modLessons.length > 0 ? Math.round((completedCount / modLessons.length) * 100) : (mod.progressPercent || 0);

                    return (
                      <div
                        key={mod.id || modIdx}
                        className="rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden transition-all hover:border-[#DFAC88]/60"
                      >
                        {/* Module Header Bar */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 via-white to-stone-50 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-[#3D1035] text-[#E8B896] text-[10px] font-bold uppercase tracking-wider">
                                {mod.moduleNumber || `Module 0${modIdx + 1}`}
                              </span>
                              <span className="text-xs font-semibold text-stone-500">
                                {modLessons.length} {modLessons.length === 1 ? "Lesson" : "Lessons"}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-stone-900 font-serif-luxury">
                              {mod.title}
                            </h4>
                            {mod.description && (
                              <p className="text-xs text-stone-600 line-clamp-2 max-w-2xl">
                                {mod.description}
                              </p>
                            )}
                          </div>

                          {/* Module Progress Metric */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="text-[10px] font-bold uppercase text-stone-400 block">Progress</span>
                              <span className="text-xs font-bold text-[#3D1035]">{modPct}% Complete</span>
                            </div>
                            <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                              <div
                                className="h-full bg-gradient-to-r from-[#C9956A] to-[#3D1035] rounded-full transition-all duration-500"
                                style={{ width: `${modPct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Module Lessons Grid */}
                        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredLessons.map((rec) => {
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
                                    ? "border-[#3D1035] ring-2 ring-[#3D1035]/20 shadow-md"
                                    : "border-stone-200 hover:border-[#DFAC88]/60 shadow-xs"
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
                                  {/* Actual Video Duration */}
                                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-[10px] text-white font-bold">
                                    {rec.duration || "24 mins"}
                                  </span>
                                  {rec.completed && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[9px] font-bold flex items-center gap-1 shadow-sm">
                                      <CheckCircle2 className="w-3 h-3" /> Done
                                    </span>
                                  )}
                                </div>

                                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                                      <span className="font-bold text-[#3D1035] truncate max-w-[150px]">{mod.moduleNumber || "Unit"}</span>
                                      <span>{rec.date || "Term Class"}</span>
                                    </div>
                                    <h5 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2">
                                      {rec.title}
                                    </h5>
                                  </div>

                                  {/* PDF Notes Attached Indicator */}
                                  {(rec.notesPdf || rec.pdfTitle) && (
                                    <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#3D1035] bg-stone-50 px-2 py-1 rounded-lg border border-stone-200">
                                      <FileText className="w-3 h-3 text-[#C9956A] shrink-0" />
                                      <span className="truncate">Notes: {rec.pdfTitle || rec.notesPdf}</span>
                                    </div>
                                  )}

                                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#C9956A]">
                                    <span>{isSelected ? "● Playing in Player" : "Watch Lesson"}</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
            <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-[#F5F0E8] border border-[#DFAC88]/50 shadow-2xl p-6 sm:p-10 relative overflow-hidden space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      Live Broadcast Studio Active
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
                    {activeLiveSession?.sessionTitle || liveClassConfig?.sessionTitle || "Bharatanatyam Diploma Masterclass"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
                    Conducted directly by <strong className="text-white">{activeLiveSession?.instructor || liveClassConfig?.instructor || "Dr. Malavika M. Sunil (MBBS)"}</strong> &bull; Interactive posture correction &amp; rhythm drills.
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={activeLiveSession?.meetUrl || liveClassConfig?.meetUrl || "https://meet.google.com/new"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="silk-zari-btn px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C9956A] via-[#F3E5AB] to-[#DFAC88] text-[#151515] font-bold text-sm shadow-xl shadow-[#C9956A]/20 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto shrink-0 tap-bounce"
                  >
                    <Video className="w-5 h-5" />
                    <span>Join Google Meet ({currentStudent.name.split(" ")[0]})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>



                  <div className="text-[10px] text-stone-300 text-center flex items-center justify-center gap-1">
                    <span>Passcode: <strong className="text-[#C9956A] font-mono">{activeLiveSession?.passcode || liveClassConfig?.passcode || "RAGAS2026"}</strong></span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9956A] block">
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
                      className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-[#DFAC88]/30 text-center space-y-0.5"
                    >
                      <p className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#C9956A]">
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
                    <strong className="text-white">{activeLiveSession?.platform || liveClassConfig?.platform || "Google Meet"}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Meeting ID:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(activeLiveSession?.meetingId || liveClassConfig?.meetingId || "ragas-live-room", "Meeting ID")}
                      className="font-mono text-[#C9956A] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{activeLiveSession?.meetingId || liveClassConfig?.meetingId || "ragas-live-room"}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Passcode:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(activeLiveSession?.passcode || liveClassConfig?.passcode || "RAGAS2026", "Passcode")}
                      className="font-mono text-[#C9956A] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{activeLiveSession?.passcode || liveClassConfig?.passcode || "RAGAS2026"}</span>
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
                      <CalendarPlus className="w-3.5 h-3.5 text-[#C9956A]" />
                      <span>Google Calendar</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadIcs}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C9956A]" />
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
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DFAC88]/20 text-[#1E293B] text-[10px] font-bold uppercase tracking-wider">
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
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#151515] hover:bg-[#DFAC88] text-white hover:text-[#151515] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Upload className="w-4 h-4 text-[#C9956A]" />
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
                          <span className="px-2.5 py-0.5 rounded-full bg-[#151515] text-[#C9956A] text-[10px] font-bold">
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
                      <Video className="w-3.5 h-3.5 text-[#DFAC88]" />
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
                          Score: <strong className="text-[#1E293B]">{ass.totalScore}</strong> / {ass.maxTotal}
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
                              <span className="px-2 py-0.5 rounded bg-white font-mono font-bold text-[#1E293B] border border-stone-200">
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
                        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DFAC88]/30 space-y-1 text-xs">
                          <strong className="text-[#1E293B] font-bold block text-xs">
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
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-4 hover:border-[#DFAC88]/50 transition-all"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#DFAC88]">
                        {doc.refNo}
                      </span>
                      <span className="text-[10px] text-stone-400">&bull; {doc.size}</span>
                      {doc.courseCategory && (
                        <span className="px-2 py-0.5 rounded-md bg-[#0F172A]/10 text-[#0F172A] text-[9px] font-bold">
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

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewPdfDoc(doc)}
                      className="px-3 py-2 rounded-xl bg-[#260A22]/5 hover:bg-[#260A22]/10 text-[#3D1035] border border-[#3D1035]/20 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                      title="Preview PDF notes before downloading"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C9956A]" />
                      <span>Preview</span>
                    </button>
                    <a
                      href={doc.fileUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!doc.fileUrl || doc.fileUrl.startsWith("#")) {
                          e.preventDefault();
                          setPreviewPdfDoc(doc);
                        }
                      }}
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-[#260A22] hover:text-[#E8B896] text-stone-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                      title="Download Official PDF"
                    >
                      <Download className="w-4 h-4 text-[#C9956A]" />
                      <span className="hidden sm:inline">PDF</span>
                    </a>
                  </div>
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
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#DFAC88]/50 shadow-2xl p-6 sm:p-7 space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DFAC88]">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#DFAC88]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#DFAC88] font-mono"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#DFAC88]"
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
                  className="silk-zari-btn px-6 py-2.5 rounded-xl bg-[#151515] hover:bg-[#DFAC88] text-white hover:text-[#151515] text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#C9956A]" />
                  <span>{isSubmitting ? "Submitting..." : "Submit for Faculty Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Disciple Profile & WhatsApp Contact Editor */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={currentStudent}
        onSave={(updated) => {
          if (updateStudentProfileDetails) {
            updateStudentProfileDetails(currentStudent.id, updated);
          }
        }}
      />

      
      {/* ═══════════════════════════════════════════════════════════════
          MODAL: CERTIFICATE IN PROGRESS / LOCKED NOTICE
      ═══════════════════════════════════════════════════════════════ */}
      {isCertLockedNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#DFAC88]/40 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7 text-[#C9956A]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9956A]">
                Diploma Sanad Status
              </span>
              <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                Certificate in Progress
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
              Dr. Malavika will unlock your official Diploma Sanad upon satisfactory completion of your term syllabus modules and performance assessments.
            </p>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 space-y-1">
              <span className="font-bold text-stone-700 block">Current Disciple Status:</span>
              <span>Enrolled &bull; Syllabus Ongoing &bull; {currentStudent.progress || 35}% Complete</span>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsCertLockedNoticeOpen(false)}
                className="silk-zari-btn px-6 py-2.5 rounded-full bg-[#260A22] text-[#E8B896] hover:text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Continue Practice
              </button>
            </div>
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
        wellnessAdvice={currentStudent.wellnessAdvice}
        student={currentStudent}
      />

      {/* Proud Parent & Grandparent Digital Showcase */}
      <StudentShowcaseModal
        isOpen={isShowcaseModalOpen}
        onClose={() => setIsShowcaseModalOpen(false)}
        studentName={currentStudent.name}
        registrationNo={currentStudent.registrationNo}
        batchName={currentStudent.enrolledCourses?.[0]}
        activePiece={selectedLesson?.title || "Jathiswaram in Ragam Kalyani"}
        featuredVideoUrl={currentStudent.showcaseVideoUrl || currentStudent.featuredVideoUrl || selectedLesson?.embedUrl || selectedLesson?.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
      />

      {/* Absence Care & Makeup Catch-Up */}
      <AbsenceCatchupModal
        isOpen={isAbsenceModalOpen}
        onClose={() => setIsAbsenceModalOpen(false)}
        studentName={currentStudent.name}
        onAbsenceLogged={(data) => {
          if (typeof reportStudentAbsence === "function") {
            reportStudentAbsence(currentStudent.id, data);
          } else {
            showToast(`Absence recorded for ${data.date}. Your attendance streak is protected!`, "success");
          }
        }}
      />

      {/* Official Tuition Fee Receipt */}
      <TuitionReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        student={currentStudent}
      />

      {/* PDF Notes Preview Modal */}
      {previewPdfDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#260A22] to-[#3D1035] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#E8B896]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">{previewPdfDoc.title || previewPdfDoc.name || "PDF Document"}</h3>
                  <p className="text-[11px] text-[#E8B896]">Official DancingRagas Study Notes &bull; Verified by Dr. Malavika</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewPdfDoc(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-left">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>Course Batch: <strong>{selectedCourseArea}</strong></span>
                  <span>Document Type: <strong>{previewPdfDoc.type || "Repertoire Notes"}</strong></span>
                </div>
                <div className="text-xs text-stone-500">
                  Attached to Lesson: <strong>{selectedLesson?.title || "Class Curriculum"}</strong>
                </div>
              </div>

              {previewPdfDoc.fileUrl && !previewPdfDoc.fileUrl.startsWith("#") ? (
                <iframe
                  src={previewPdfDoc.fileUrl}
                  title={previewPdfDoc.title}
                  className="w-full h-96 rounded-xl border border-stone-200"
                />
              ) : (
                <div className="p-8 text-center rounded-2xl bg-gradient-to-b from-stone-50 to-stone-100 border border-stone-200 space-y-3">
                  <FileText className="w-12 h-12 text-[#C9956A] mx-auto" />
                  <h4 className="font-bold text-stone-800 text-sm">{previewPdfDoc.title || "Lesson Study Material"}</h4>
                  <p className="text-xs text-stone-600 max-w-md mx-auto">
                    This document contains detailed tala notations, adavu footwork angles, mudra slokas, and practice regimens curated specifically for this unit.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <a
                      href={previewPdfDoc.fileUrl || "#"}
                      download={previewPdfDoc.title ? `${previewPdfDoc.title}.pdf` : "DancingRagas_Notes.pdf"}
                      className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#3D1035] text-[#E8B896] hover:bg-[#260A22] text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#C9956A]" />
                      <span>Download Study Material (PDF)</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">DancingRagas Digital Academy</span>
              <button
                onClick={() => setPreviewPdfDoc(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Floating Tanpura Audio Bar */}
      <FloatingTanpuraBar />

      {/* Mobile App Bottom Navigation Bar */}
      <MobileStudentNavBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        counts={{
          videos: (authorizedRecordings || []).length,
          docs: (studyMaterials || []).length,
          feedback: (studentAssessments || []).length
        }}
      />
    </div>
  );
}