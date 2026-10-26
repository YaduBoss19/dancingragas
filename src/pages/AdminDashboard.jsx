import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import { FAQS } from "../data/initialData";
import { compressImageFile } from "../utils/imageCompressor";
import { uploadMediaToBucket, isSupabaseConfigured } from "../lib/supabaseClient";
import {
  Lock,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  Search,
  Download,
  RotateCcw,
  MessageCircle,
  Eye,
  LogOut,
  X,
  Phone,
  Mail,
  UploadCloud,
  FileText,
  GraduationCap,
  CheckCircle2,
  Video,
  Film,
  Sparkles,
  Award,
  Users,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Copy,
  ChevronRight,
  Filter,
  Check,
  UserCheck
} from "lucide-react";

export default function AdminDashboard() {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    resetToDefaults,
    showToast,
    navigateTo,
    // Data
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    faqs,
    updateFaqs,
    academyInfo,
    updateAcademyInfo,
    testimonials,
    updateTestimonials,
    recordings,
    addRecording,
    deleteRecording,
    liveClassConfig,
    updateLiveClassConfig,
    studentAssessments,
    gradeAssessment,
    studentsList,
    addStudent,
    deleteStudent,
    setActiveStudentId
  } = useAcademy();

  const [passwordInput, setPasswordInput] = useState("");
  const [workspaceMode, setWorkspaceMode] = useState("academic"); // 'academic' | 'admissions'
  const [activeTab, setActiveTab] = useState("course_areas"); // 'course_areas' | 'students_dir' | 'enquiries' | 'assessments' | 'live_studio' | 'matter' | 'gallery'


  const academicTabs = [
    { id: "course_areas", label: "Course Areas & Video Vault", count: (recordings || []).length, icon: Film, desc: "Unlisted videos & course access" },
    { id: "students_dir", label: "Enrolled Students Directory", count: (studentsList || []).length, icon: Users, desc: "Student roster & credentials" },
    { id: "assessments", label: "Faculty Rubric Desk", count: (studentAssessments || []).length, icon: Award, desc: "4-point biomechanical grading" },
    { id: "live_studio", label: "Live Broadcast Studio", count: null, icon: Video, desc: "Meet link & class countdown" }
  ];

  const admissionsTabs = [
    { id: "site_cms", label: "Master Website & Media Studio", count: null, icon: Sparkles, desc: "Edit all text, photos & media across the entire website" },
    { id: "courses", label: "Courses & Tuition Catalog", count: (courses || []).length, icon: BookOpen, desc: "Create courses & upload photo slides" },
    { id: "enquiries", label: "Admissions CRM & Leads", count: (enquiries || []).length, icon: MessageSquare, desc: "Inquiries pipeline & WhatsApp outreach" }
  ];

    // Selected Course Area for Unlisted Video Management
  const COURSE_OPTIONS = [
    "Bharatanatyam Diploma",
    "Bharatanatyam Non-Diploma",
    "Carnatic Music",
    "Bollywood & Semi-Classical"
  ];
  const [selectedCourseArea, setSelectedCourseArea] = useState("Bharatanatyam Diploma");

  // Add Unlisted Video Modal State
  const [isAddingVideoModal, setIsAddingVideoModal] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: "",
    courseCategory: "Bharatanatyam Diploma",
    module: "Module 01: Foundational Adavu Biomechanics",
    duration: "60 mins",
    embedUrl: "",
    description: "",
    syllabusText: "",
    accessScope: "course_enrolled", // "course_enrolled" | "selected_students"
    allowedStudentIds: []
  });

  // Add Student Modal State
  const [isAddingStudentModal, setIsAddingStudentModal] = useState(false);
  const [editingStudentCourses, setEditingStudentCourses] = useState(null);
  const [newStudentForm, setNewStudentForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Kerala, India",
    enrolledCourses: ["Bharatanatyam Diploma"]
  });

  // 4-Point Rubric Grading Modal State
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [rubricDraft, setRubricDraft] = useState({
    biomechanicsScore: 9.5,
    biomechanicsRemarks: "Superb external hip rotation and stable knee angle without medial collapse.",
    mudraScore: 9.0,
    mudraRemarks: "Crisp Pataka hand definition with extended thumb and taut palm plane.",
    layaScore: 8.5,
    layaRemarks: "Steady adherence to the Metronome at Vilamba and Madhyama Kaala.",
    angaScore: 9.0,
    angaRemarks: "Excellent thoracic spine elongation and centered shoulder line throughout.",
    clinicalNote: "Student exhibits sound neuromuscular memory and safe biomechanical posture. Cleared for Module 2 progression."
  });

  // Live Studio broadcast settings state
  const [liveForm, setLiveForm] = useState({
    sessionTitle: liveClassConfig?.sessionTitle || "Bharatanatyam Diploma: Margam & Adavu Precision",
    platform: liveClassConfig?.platform || "Google Meet",
    meetUrl: liveClassConfig?.meetUrl || "https://meet.google.com/dnc-ragas-live",
    meetingId: liveClassConfig?.meetingId || "dnc-ragas-live",
    passcode: liveClassConfig?.passcode || "RAGAS2026",
    scheduledDayTime: liveClassConfig?.scheduledDayTime || "Sunday, 05:00 PM IST / 07:30 AM EST",
    targetTimestamp: liveClassConfig?.targetTimestamp || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: liveClassConfig?.status || "Scheduled",
    instructor: liveClassConfig?.instructor || "Dr. Malavika M. Sunil (MBBS)",
    activeBatch: liveClassConfig?.activeBatch || "Online Bharatanatyam Diploma Course"
  });

  // Matter & FAQs CMS State
  const [tickerAnnouncement, setTickerAnnouncement] = useState(
    "ADMISSIONS OPEN 2026/27: Online Bharatanatyam Diploma (Yearly Exams & Certificates) • Carnatic Classical Vocal Coaching • 1-on-1 Consultations"
  );
  const [faqsList, setFaqsList] = useState(faqs || FAQS);
  const [editingFaqIdx, setEditingFaqIdx] = useState(null);
  const [faqQuestionDraft, setFaqQuestionDraft] = useState("");
  const [faqAnswerDraft, setFaqAnswerDraft] = useState("");

  // Academy Info Form state
  const [infoForm, setInfoForm] = useState({
    whatsappNumber: academyInfo?.whatsappNumber || "+919074585672",
    directPhone: academyInfo?.directPhone || "+91 90745 85672",
    email: academyInfo?.email || "info@malavikasunil.com",
    tagline: academyInfo?.tagline || "Your Passion. Your Pace. Your Personal Coach.",
    instagramUrl: academyInfo?.instagramUrl || "https://www.instagram.com/dancingragasbymalavika/",
    instagramHandle: academyInfo?.instagramHandle || "@dancingragasbymalavika"
  });

  // Modals state for Course Catalog
  const [editingCourse, setEditingCourse] = useState(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isUploadingCourseMedia, setIsUploadingCourseMedia] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");

  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "Courses We Offer",
    ageGroup: "Children, Teens & Adults",
    level: "Foundation to Diploma",
    fee: "Enrolment Open",
    rawFee: 0,
    duration: "1 hour per session",
    frequency: "1–2 sessions per week (Online)",
    badge: "Diploma & Certification",
    image: "/images/courses/Courses/bharatanatyam_diploma/main.jpg",
    images: [],
    description: "",
    syllabusText: ""
  });

  // Enquiries search & filter
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState("All");
  const [enquirySearch, setEnquirySearch] = useState("");
  const [viewingEnquiry, setViewingEnquiry] = useState(null);

  // Helper: auto format YouTube URL to embed
  const formatEmbedUrl = (raw) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    }
    const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return trimmed;
  };

  // Submit new unlisted video
  const handleAddVideoSubmit = (e) => {
    e.preventDefault();
    if (!videoForm.title.trim() || !videoForm.embedUrl.trim()) {
      showToast("Title and YouTube/Vimeo unlisted video URL are required.", "error");
      return;
    }
    const finalEmbed = formatEmbedUrl(videoForm.embedUrl);
    if (!finalEmbed) {
      showToast("Please provide a valid YouTube unlisted or Vimeo link.", "error");
      return;
    }

    addRecording({
      title: videoForm.title.trim(),
      courseCategory: videoForm.courseCategory,
      category: videoForm.courseCategory,
      module: videoForm.module.trim(),
      duration: videoForm.duration.trim() || "60 mins",
      embedUrl: finalEmbed,
      description: videoForm.description.trim(),
      topics: videoForm.syllabusText.split("\n").map((s) => s.trim()).filter(Boolean),
      accessScope: videoForm.accessScope,
      allowedStudentIds: videoForm.accessScope === "selected_students" ? videoForm.allowedStudentIds : []
    });

    setIsAddingVideoModal(false);
    setVideoForm({
      title: "",
      courseCategory: selectedCourseArea,
      module: "Module 01: Foundational Adavu Biomechanics",
      duration: "60 mins",
      embedUrl: "",
      description: "",
      syllabusText: "",
      accessScope: "course_enrolled",
      allowedStudentIds: []
    });
  };

  // Submit new student enrolment
  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudentForm.name.trim() || !newStudentForm.email.trim()) {
      showToast("Student name and email are required.", "error");
      return;
    }
    if (newStudentForm.enrolledCourses.length === 0) {
      showToast("Please select at least one course for the student.", "error");
      return;
    }

    addStudent(newStudentForm);
    setIsAddingStudentModal(false);
    setNewStudentForm({
      name: "",
      email: "",
      phone: "",
      location: "Kerala, India",
      enrolledCourses: ["Bharatanatyam Diploma"]
    });
  };

  const handleSaveLiveConfig = (e) => {
    e.preventDefault();
    updateLiveClassConfig(liveForm);
    showToast("Live classroom broadcast settings saved! Reflected in student portal.", "success");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginAdmin(passwordInput);
    setPasswordInput("");
  };

  // Export Enquiries CSV
  const handleExportCSV = () => {
    if (!enquiries || enquiries.length === 0) {
      showToast("No enquiries available to export.", "info");
      return;
    }
    const headers = ["Reference ID", "Student Name", "Age", "Parent Name", "Phone", "Email", "Course", "Category", "Level", "Preferred Slot", "Branch", "Status", "Date", "Notes"];
    const rows = enquiries.map((enq) => [
      enq.id,
      `"${enq.studentName || ""}"`,
      enq.studentAge || "",
      `"${enq.parentName || ""}"`,
      `"${enq.phone || ""}"`,
      `"${enq.email || ""}"`,
      `"${enq.course || ""}"`,
      enq.category || "",
      `"${enq.skillLevel || ""}"`,
      `"${enq.preferredTime || ""}"`,
      `"${enq.branch || ""}"`,
      enq.status || "New",
      enq.date || "",
      `"${(enq.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dancingragas_enquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Enquiries exported successfully to CSV!", "success");
  };

  // Course Handlers
  const openAddCourse = () => {
    setCourseForm({
      title: "",
      category: "Courses We Offer",
      ageGroup: "Children, Teens & Adults",
      level: "All Levels Welcome",
      fee: "Enrolment Open",
      rawFee: 0,
      duration: "1 hour per session",
      frequency: "Weekly once (Online)",
      badge: "New Discipline",
      image: "/images/courses/Courses/bharatanatyam_diploma/main.jpg",
      images: ["/images/courses/Courses/bharatanatyam_diploma/main.jpg"],
      description: "",
      syllabusText: "Core practical training\nTheory and mudras\nClassical choreographies"
    });
    setIsAddingCourse(true);
    setEditingCourse(null);
  };

  const openEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      category: course.category || "Courses We Offer",
      ageGroup: course.ageGroup,
      level: course.level,
      fee: course.fee,
      rawFee: course.rawFee || 0,
      duration: course.duration || "1 hour per session",
      frequency: course.frequency || "1–2 sessions per week (Online)",
      badge: course.badge || "",
      image: course.image,
      images: Array.isArray(course.images) ? [...course.images] : [course.image].filter(Boolean),
      description: course.description,
      syllabusText: (course.syllabus || []).join("\n")
    });
    setIsAddingCourse(false);
  };

  const handleUploadCourseMedia = async (e, isSlide = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCourseMedia(true);
      setUploadProgressText("Compressing photo in browser...");
      const compressed = await compressImageFile(file, 1920, 0.86);

      setUploadProgressText("Uploading to cloud...");
      const res = await uploadMediaToBucket("course-media", compressed.file);
      const finalUrl = res.url || compressed.dataUrl;

      if (isSlide) {
        setCourseForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), finalUrl]
        }));
        showToast("Slide photo added and optimized!", "success");
      } else {
        setCourseForm((prev) => ({
          ...prev,
          image: finalUrl,
          images: prev.images && prev.images.length > 0 ? prev.images : [finalUrl]
        }));
        showToast("Main cover photo updated and optimized!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setIsUploadingCourseMedia(false);
      setUploadProgressText("");
      e.target.value = "";
    }
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      showToast("Course title is required.", "error");
      return;
    }

    const payload = {
      title: courseForm.title,
      category: courseForm.category,
      pillar: courseForm.category,
      ageGroup: courseForm.ageGroup,
      level: courseForm.level,
      fee: courseForm.fee,
      rawFee: Number(courseForm.rawFee) || 0,
      duration: courseForm.duration,
      frequency: courseForm.frequency,
      badge: courseForm.badge,
      image: courseForm.image,
      images: courseForm.images && courseForm.images.length > 0 ? courseForm.images : [courseForm.image],
      description: courseForm.description,
      syllabus: courseForm.syllabusText.split("\n").map((s) => s.trim()).filter(Boolean)
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, payload);
      setEditingCourse(null);
    } else {
      addCourse(payload);
      setIsAddingCourse(false);
    }
  };

  // Filtered Enquiries
  const filteredEnquiries = (enquiries || []).filter((enq) => {
    if (enquiryFilterStatus !== "All" && enq.status !== enquiryFilterStatus) {
      return false;
    }
    if (enquirySearch.trim()) {
      const q = enquirySearch.toLowerCase();
      const matchName = (enq.studentName || "").toLowerCase().includes(q);
      const matchParent = (enq.parentName || "").toLowerCase().includes(q);
      const matchPhone = (enq.phone || "").toLowerCase().includes(q);
      const matchCourse = (enq.course || "").toLowerCase().includes(q);
      return matchName || matchParent || matchPhone || matchCourse;
    }
    return true;
  });

  // Filter recordings for selected course area
  const currentAreaRecordings = (recordings || []).filter((r) => {
    const cat = r.courseCategory || r.category;
    return cat === selectedCourseArea || cat?.toLowerCase().includes(selectedCourseArea.toLowerCase().split(" ")[0]);
  });

  // IF NOT LOGGED IN: Render Luxury Director Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#1E050B] via-[#3D0B16] to-[#1E050B] relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0,transparent_70%)] pointer-events-none" />

        <div className="relative w-full max-w-md rounded-3xl bg-[#1A1A1A] border border-[#B99A63]/40 shadow-2xl p-8 sm:p-10 text-center space-y-6 backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B0B14] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] mx-auto flex items-center justify-center shadow-lg shadow-[#D4AF37]/10">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#D4AF37]">
              Director &amp; Tutor Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              DancingRagas <span className="text-[#D4AF37]">Tutor Portal</span>
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              Authorized access for Dr. Malavika to manage course areas, add unlisted masterclasses, enroll students, and evaluate performance.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-200">Director Passcode</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B99A63] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter authorized passcode"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#B99A63]/30 bg-[#121212] text-white text-sm placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="silk-zari-btn w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#151515] font-bold text-sm shadow-lg shadow-[#D4AF37]/20 hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2 tap-bounce"
            >
              <span>Authenticate &amp; Enter Tutor Portal</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => navigateTo("home")}
              className="text-xs text-stone-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              &larr; Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // LOGGED IN: TUTOR & DIRECTOR EXECUTIVE WORKSPACE
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#151515] font-sans pb-24 text-left">
      {/* ═══════════════════════════════════════════════════════════════
          DEDICATED TUTOR PORTAL APP TOP NAVIGATION (NO MARKETING HEADER)
      ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#1E050B] text-[#F5F0E8] border-b border-[#B99A63]/30 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B0B14] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center font-serif-luxury font-bold text-base shadow-sm">
              DR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wide font-serif-luxury">
                  DancingRagas <span className="text-[#D4AF37]">Tutor Suite</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  Director Active
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Dr. Malavika M. Sunil (MBBS) &bull; Masterclasses, Student Enrolments &amp; Rubric Desk
              </p>
            </div>
          </div>

          {/* Quick Operations */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigateTo("student-portal")}
              className="px-3.5 py-1.5 rounded-xl bg-[#3D0B16] hover:bg-[#4E0E1B] text-[#D4AF37] border border-[#B99A63]/40 text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Switch to Student View</span>
            </button>

            <button
              onClick={() => navigateTo("home")}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-stone-300 border border-white/10 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Exit to Website</span>
            </button>

            <button
              onClick={resetToDefaults}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 text-xs font-medium transition-colors"
              title="Restore Factory Demo Presets"
            >
              <RotateCcw className="w-3 h-3 text-stone-400" />
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-700/50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* High Level Executive Metrics */}
      <section className="bg-gradient-to-r from-[#1E050B] via-[#3D0B16] to-[#1E050B] text-[#F5F0E8] py-8 px-4 sm:px-8 border-b border-[#B99A63]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Enrolled Students</span>
            <p className="text-2xl font-bold font-serif-luxury text-white mt-1">{(studentsList || []).length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">Course Areas</span>
            <p className="text-2xl font-bold font-serif-luxury text-[#D4AF37] mt-1">{COURSE_OPTIONS.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">Unlisted Videos</span>
            <p className="text-2xl font-bold font-serif-luxury text-amber-300 mt-1">{(recordings || []).length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[10px] font-semibold text-rose-300 uppercase tracking-wider">Pending Submissions</span>
            <p className="text-2xl font-bold font-serif-luxury text-rose-400 mt-1">
              {(studentAssessments || []).filter((a) => a.status !== "Evaluated").length}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">New Inquiries</span>
            <p className="text-2xl font-bold font-serif-luxury text-emerald-400 mt-1">
              {(enquiries || []).filter((e) => e.status === "New").length}
            </p>
          </div>
        </div>
      </section>

      {/* Main Executive Workspaces Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-6">
        {/* Executive Mode Switcher: Academic Studio (Tutor) vs Admissions CRM (Admin) */}
        <div className="p-3 sm:p-4 rounded-3xl bg-[#1E050B] border border-[#B99A63]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setWorkspaceMode("academic");
                setActiveTab("course_areas");
              }}
              className={`flex-1 md:flex-initial px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                workspaceMode === "academic"
                  ? "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#151515] shadow-lg shadow-[#D4AF37]/25"
                  : "text-stone-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#151515]" />
              <span>Academic Studio &amp; Vault</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                workspaceMode === "academic" ? "bg-black/20 text-[#151515]" : "bg-white/10 text-[#D4AF37]"
              }`}>
                {(recordings || []).length} Classes
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setWorkspaceMode("admissions");
                setActiveTab("enquiries");
              }}
              className={`flex-1 md:flex-initial px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                workspaceMode === "admissions"
                  ? "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#151515] shadow-lg shadow-[#D4AF37]/25"
                  : "text-stone-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#151515]" />
              <span>Admissions CRM &amp; CMS</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                workspaceMode === "admissions" ? "bg-black/20 text-[#151515]" : "bg-emerald-500/20 text-emerald-300"
              }`}>
                {(enquiries || []).filter(e => e.status === "New").length} New Leads
              </span>
            </button>
          </div>

          <div className="text-left md:text-right px-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] block">
              {workspaceMode === "academic" ? "Tutor Pedagogy Suite" : "Admissions & Operations Office"}
            </span>
            <span className="text-xs text-stone-300">
              {workspaceMode === "academic"
                ? "Dr. Malavika M. Sunil • Masterclasses, Student Roster & Rubric Evaluations"
                : "Student Inquiries, Tuition Catalog & Public Website CMS"}
            </span>
          </div>
        </div>

        {/* Workspace Dedicated Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#B99A63]/30 shadow-xs overflow-x-auto max-w-full">
          {(workspaceMode === "academic" ? academicTabs : admissionsTabs).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#3D0B16] text-[#D4AF37] border border-[#B99A63]/50 shadow-sm"
                    : "text-stone-700 hover:text-stone-900 hover:bg-[#F0EBE1]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? "bg-[#1E050B] text-[#D4AF37]" : "bg-stone-200 text-stone-700"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            TAB 1: COURSE AREAS & UNLISTED VIDEO VAULT
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "course_areas" && (
          <div className="space-y-6 text-left">
            {/* Header & Course Area Filter */}
            <div className="p-6 rounded-3xl bg-white border border-[#B99A63]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B99A63]/20 text-[#3B0B14] text-[10px] font-bold uppercase tracking-wider">
                    Course Area Access Control
                  </span>
                  <span className="text-xs text-stone-500">YouTube Unlisted &bull; Instant Student Sync</span>
                </div>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Course Areas &amp; Unlisted Masterclasses
                </h3>
                <p className="text-xs text-stone-500">
                  Add unlisted YouTube/Vimeo class recordings to a Course Area. Only students enrolled in that course (or specifically assigned) can watch.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setVideoForm({
                    ...videoForm,
                    courseCategory: selectedCourseArea
                  });
                  setIsAddingVideoModal(true);
                }}
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-white hover:text-[#D4AF37] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Add Unlisted Video to {selectedCourseArea}</span>
              </button>
            </div>

            {/* Course Area Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {COURSE_OPTIONS.map((cName) => {
                const count = (recordings || []).filter(
                  (r) => (r.courseCategory || r.category) === cName || (r.courseCategory || r.category)?.toLowerCase().includes(cName.toLowerCase().split(" ")[0])
                ).length;
                const isSelected = selectedCourseArea === cName;
                return (
                  <button
                    key={cName}
                    onClick={() => setSelectedCourseArea(cName)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#1E050B] text-[#D4AF37] shadow-sm"
                        : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <span>{cName}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] ${isSelected ? "bg-[#3D0B16] text-white" : "bg-stone-100 text-stone-600"}`}>
                      {count} videos
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Videos Grid in Selected Course Area */}
            {currentAreaRecordings.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
                <Video className="w-8 h-8 text-stone-400 mx-auto" />
                <h4 className="text-base font-bold text-stone-900">
                  No Unlisted Videos in &ldquo;{selectedCourseArea}&rdquo;
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Click the button above to add an unlisted YouTube or Vimeo class link. It will instantly appear for all enrolled students in {selectedCourseArea}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAreaRecordings.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Video Embed */}
                      <div className="aspect-video w-full bg-black relative">
                        <iframe
                          src={rec.embedUrl}
                          title={rec.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>

                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#3B0B14]">{rec.module || rec.courseCategory}</span>
                          <span className="text-stone-500">{rec.duration} &bull; {rec.date}</span>
                        </div>

                        <h4 className="text-sm font-bold text-stone-900 line-clamp-2">
                          {rec.title}
                        </h4>

                        {/* Access Scope Indicator */}
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
                          {rec.accessScope === "selected_students" ? (
                            <span className="text-amber-800 font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>Restricted to {(rec.allowedStudentIds || []).length} Selected Students</span>
                            </span>
                          ) : (
                            <span className="text-emerald-800 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>All Enrolled Students in {selectedCourseArea}</span>
                            </span>
                          )}
                        </div>

                        {Array.isArray(rec.topics) && rec.topics.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                              Covered Topics:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {rec.topics.map((top, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700"
                                >
                                  {top}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                      <a
                        href={rec.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#3B0B14] hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open Direct Link</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete recording "${rec.title}"?`)) {
                            deleteRecording(rec.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete recording"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 2: ENROLLED STUDENTS DIRECTORY
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "students_dir" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-[#B99A63]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B99A63]/20 text-[#3B0B14] text-[10px] font-bold uppercase tracking-wider">
                    Student Roster Management
                  </span>
                  <span className="text-xs text-stone-500">{(studentsList || []).length} Registered Students</span>
                </div>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Enrolled Students Directory &amp; Course Permissions
                </h3>
                <p className="text-xs text-stone-500">
                  Add new students, assign them to Course Areas, and manage student authorization credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingStudentModal(true)}
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-white hover:text-[#D4AF37] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Enroll New Student</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Student &amp; Reg ID</th>
                      <th className="py-3.5 px-4">Enrolled Course Area(s)</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Attendance</th>
                      <th className="py-3.5 px-4">Enrolment Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(studentsList || []).map((stu) => (
                      <tr key={stu.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-stone-900 text-sm">{stu.name}</div>
                          <span className="font-mono text-[11px] text-[#B99A63] font-bold block">{stu.registrationNo}</span>
                          <span className="text-[11px] text-stone-400">{stu.location}</span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {stu.enrolledCourses?.map((cName) => (
                              <span
                                key={cName}
                                className="px-2.5 py-0.5 rounded-full bg-[#3D0B16]/10 text-[#3B0B14] font-bold text-[11px] border border-[#3B0B14]/20"
                              >
                                {cName}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-4 space-y-0.5">
                          <div className="text-stone-800">{stu.email}</div>
                          <span className="text-stone-500 text-[11px]">{stu.phone || "No phone logged"}</span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                            {stu.attendance || 94}% Attendance
                          </span>
                        </td>

                        <td className="py-4 px-4 text-stone-500">
                          {stu.enrolledDate}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {stu.phone && (
                              <a
                                href={`https://wa.me/${stu.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(stu.name)}!%20This%20is%20Dr.%20Malavika%20from%20DancingRagas.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                title="Message on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setActiveStudentId(stu.id);
                                navigateTo("student-portal");
                              }}
                              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#1E050B] hover:text-white text-stone-800 font-bold text-xs transition-colors"
                              title="Preview Portal as this student"
                            >
                              View As Student
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Revoke enrolment for student "${stu.name}"?`)) {
                                  deleteStudent(stu.id);
                                }
                              }}
                              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 3: ADMISSIONS & ENROLMENTS CRM (ENQUIRIES)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "enquiries" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    placeholder="Search leads by name, course, phone..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#B99A63]"
                  />
                </div>

                <select
                  value={enquiryFilterStatus}
                  onChange={(e) => setEnquiryFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Trial Scheduled">Trial Scheduled</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-[#1E050B] hover:bg-stone-800 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                <span>Export Enquiries to CSV</span>
              </button>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Ref &amp; Date</th>
                      <th className="py-3.5 px-4">Student &amp; Age</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Course &amp; Slot</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-stone-500">
                          No enquiries found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-mono text-[#B99A63] font-bold block">{enq.id}</span>
                            <span className="text-stone-400 text-[11px]">{enq.date}</span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-bold text-stone-900">{enq.studentName}</div>
                            <span className="text-stone-500 text-[11px]">Age: {enq.studentAge || "Not provided"}</span>
                          </td>

                          <td className="py-4 px-4 space-y-0.5">
                            <div className="text-stone-800">{enq.phone}</div>
                            <span className="text-stone-500 text-[11px] block">{enq.email}</span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-semibold text-stone-900 block">{enq.course}</span>
                            <span className="text-stone-400 text-[11px]">{enq.preferredTime || "Flexible"}</span>
                          </td>

                          <td className="py-4 px-4">
                            <select
                              value={enq.status || "New"}
                              onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none ${
                                enq.status === "New"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : enq.status === "Enrolled"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-stone-100 text-stone-700 border-stone-200"
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Trial Scheduled">Trial Scheduled</option>
                              <option value="Enrolled">Enrolled</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  // Quick Enroll directly from Enquiry
                                  addStudent({
                                    name: enq.studentName,
                                    email: enq.email,
                                    phone: enq.phone,
                                    location: enq.branch || "Online",
                                    enrolledCourses: [enq.course?.includes("Carnatic") ? "Carnatic Music" : enq.course?.includes("Bollywood") ? "Bollywood & Semi-Classical" : "Bharatanatyam Diploma"]
                                  });
                                  updateEnquiryStatus(enq.id, "Enrolled");
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                                title="One-Click Enrol Student"
                              >
                                + Enroll Student
                              </button>

                              <button
                                onClick={() => {
                                  const text = `Hello ${enq.parentName || enq.studentName}! This is Dr. Malavika from DancingRagas Classical Arts regarding your trial class inquiry for ${enq.course}.`;
                                  window.open(`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
                                }}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                                title="Message on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete enquiry from ${enq.studentName}?`)) {
                                    deleteEnquiry(enq.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 4: STUDENT ASSESSMENT DESK (RUBRIC)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "assessments" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#B99A63]/20 text-[#3B0B14] text-[10px] font-bold uppercase tracking-wider">
                  Academic Evaluation Portal
                </span>
                <span className="text-xs text-stone-500">Official 4-Criterion Biomechanical Rubric</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-serif-luxury">
                Student Performance &amp; Biomechanical Assessment Desk
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Grade student adavu submissions using the medical-artistic rubric: Aramandi turnout, Mudra precision, Talam cadence, and Anga Shuddhi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(studentAssessments || []).map((ass) => (
                <div
                  key={ass.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#3B0B14]">
                        {ass.registrationNo} &bull; {ass.batch}
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
                    </div>

                    <h4 className="text-sm font-bold text-stone-900">{ass.studentName}</h4>
                    <p className="text-xs text-stone-700 font-medium">{ass.title}</p>
                    <span className="text-[11px] text-stone-400 block">Submitted: {ass.submissionDate}</span>

                    <a
                      href={ass.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#B99A63] hover:underline font-bold"
                    >
                      <Video className="w-3.5 h-3.5 text-[#3B0B14]" />
                      <span>Open Student Video Submission Link</span>
                    </a>

                    {ass.rubric && (
                      <div className="p-3 rounded-xl bg-stone-50 text-xs text-stone-700 space-y-1.5 border border-stone-100">
                        <div className="flex items-center justify-between text-[11px] font-bold text-stone-900">
                          <span>Evaluation Score: {ass.totalScore} / 40</span>
                          <span className="text-emerald-700">{ass.grade}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 italic">
                          &ldquo;{ass.clinicalNote}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAssessment(ass);
                        if (ass.rubric) {
                          setRubricDraft({
                            biomechanicsScore: ass.rubric.biomechanics.score,
                            biomechanicsRemarks: ass.rubric.biomechanics.remarks,
                            mudraScore: ass.rubric.mudraPrecision.score,
                            mudraRemarks: ass.rubric.mudraPrecision.remarks,
                            layaScore: ass.rubric.layaTalam.score,
                            layaRemarks: ass.rubric.layaTalam.remarks,
                            angaScore: ass.rubric.angaShuddhi.score,
                            angaRemarks: ass.rubric.angaShuddhi.remarks,
                            clinicalNote: ass.clinicalNote
                          });
                        }
                      }}
                      className="silk-zari-btn px-4 py-2 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{ass.status === "Evaluated" ? "Update Assessment & Rubric" : "Grade with 4-Point Rubric"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 5: COURSES & TUITION CATALOG
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "courses" && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-serif-luxury">Courses &amp; Tuition Catalog</h3>
                <p className="text-xs text-stone-500">Edit course details, upload photos, and update fees shown on the public site.</p>
              </div>

              <button
                onClick={openAddCourse}
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-stone-900">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-stone-900 text-xs font-bold">
                      {course.category}
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-[#3D0B16] text-[#D4AF37] border border-[#B99A63]/40 text-xs font-bold shadow-md">
                      {course.fee}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-lg font-bold text-stone-900 font-serif-luxury">{course.title}</h4>
                      <p className="text-xs text-[#B99A63] font-semibold mt-0.5">{course.ageGroup}</p>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditCourse(course)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Course</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete course "${course.title}"?`)) {
                            deleteCourse(course.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 6: LIVE BROADCAST STUDIO
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "live_studio" && (
          <div className="space-y-6 text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#B99A63]/30 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      Broadcast Control
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                    Live Google Meet / Zoom Classroom Configuration
                  </h3>
                  <p className="text-xs text-stone-500">
                    Update the active link, meeting ID, passcode, and countdown date. Updates reflect immediately on student portals worldwide.
                  </p>
                </div>

                <a
                  href={liveForm.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test Meeting Link</span>
                </a>
              </div>

              <form onSubmit={handleSaveLiveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Masterclass Topic / Session Title</label>
                  <input
                    type="text"
                    required
                    value={liveForm.sessionTitle}
                    onChange={(e) => setLiveForm({ ...liveForm, sessionTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#B99A63]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Platform</label>
                  <select
                    value={liveForm.platform}
                    onChange={(e) => setLiveForm({ ...liveForm, platform: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Direct Join URL</label>
                  <input
                    type="url"
                    required
                    value={liveForm.meetUrl}
                    onChange={(e) => setLiveForm({ ...liveForm, meetUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Meeting ID / Code</label>
                  <input
                    type="text"
                    value={liveForm.meetingId}
                    onChange={(e) => setLiveForm({ ...liveForm, meetingId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Passcode</label>
                  <input
                    type="text"
                    value={liveForm.passcode}
                    onChange={(e) => setLiveForm({ ...liveForm, passcode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Display Scheduled Date &amp; Time</label>
                  <input
                    type="text"
                    required
                    value={liveForm.scheduledDayTime}
                    onChange={(e) => setLiveForm({ ...liveForm, scheduledDayTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-stone-700">Countdown Target Timestamp (ISO / Date)</label>
                  <input
                    type="text"
                    value={liveForm.targetTimestamp}
                    onChange={(e) => setLiveForm({ ...liveForm, targetTimestamp: e.target.value })}
                    placeholder="e.g. 2026-10-30T17:00:00Z"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono"
                  />
                  <span className="text-[11px] text-stone-500 block">
                    The student portal counts down real-time Days:Hours:Mins:Secs until this date.
                  </span>
                </div>

                <div className="md:col-span-2 pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="silk-zari-btn px-6 py-2.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-white hover:text-[#D4AF37] font-bold text-xs shadow-md cursor-pointer"
                  >
                    Save Live Classroom Broadcast
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 7: SITE ANNOUNCEMENTS & TICKER
        ═══════════════════════════════════════════════════════════════ */}
        
        {/* ═══════════════════════════════════════════════════════════════
            TAB: MASTER WEBSITE CONTENT & MEDIA CMS (ZERO-CODE CLIENT STUDIO)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "site_cms" && (
          <div className="space-y-8 text-left">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E050B] via-[#3D0B16] to-[#1E050B] text-white border border-[#B99A63]/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1E050B] text-[10px] font-bold uppercase tracking-wider">
                    Turnkey Client Studio
                  </span>
                  <span className="text-xs text-stone-300">Header to Footer Zero-Code Live Editor</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                  Master Website Content &amp; Media Studio
                </h3>
                <p className="text-xs text-stone-300 max-w-xl">
                  Update any headline, photo, bio, announcement ticker, or contact detail across the live website. Click &ldquo;Publish Website Changes&rdquo; below to update the live academy instantly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo("home")}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Preview Live Site</span>
                </button>
              </div>
            </div>

            {/* Grid of Sections to Edit */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SECTION 1: HEADER & ACADEMY BRANDING */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3D0B16]/10 text-[#3D0B16] flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-serif-luxury text-base">Header &amp; Brand Identity</h4>
                    <p className="text-[11px] text-stone-500">Website navbar titles and logo presentation</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Artist / Academy Brand Name</label>
                    <input
                      type="text"
                      value={infoForm.brandName || academyInfo.name || "Dr. Malavika M Sunil"}
                      onChange={(e) => setInfoForm({ ...infoForm, brandName: e.target.value })}
                      placeholder="e.g., Dr. Malavika M Sunil"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Brand Subtitle / Tag</label>
                    <input
                      type="text"
                      value={infoForm.brandTitle || academyInfo.brandTitle || "Classical Dance & Music"}
                      onChange={(e) => setInfoForm({ ...infoForm, brandTitle: e.target.value })}
                      placeholder="e.g., Classical Dance & Music"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Hero / Studio Tagline</label>
                    <input
                      type="text"
                      value={infoForm.tagline || academyInfo.tagline || "Your Passion. Your Pace. Your Personal Coach."}
                      onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: CINEMATIC HERO & VIDEO */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3D0B16]/10 text-[#3D0B16] flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-serif-luxury text-base">Cinematic Hero Background</h4>
                    <p className="text-[11px] text-stone-500">Video background and headline pitch</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Hero Main Pitch</label>
                    <input
                      type="text"
                      value={infoForm.heroHeadline || "Your Passion. Your Pace. Your Personal Coach."}
                      onChange={(e) => setInfoForm({ ...infoForm, heroHeadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Ambient Video URL (MP4 / Web)</label>
                    <input
                      type="text"
                      value={infoForm.heroVideoUrl || "/videos/performance.mp4"}
                      onChange={(e) => setInfoForm({ ...infoForm, heroVideoUrl: e.target.value })}
                      placeholder="/videos/performance.mp4 or https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>The full-bleed background video runs seamlessly muted on loop with stage gold particles.</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: ANNOUNCEMENT TICKER & FAQS */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3D0B16]/10 text-[#3D0B16] flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-serif-luxury text-base">Announcements Ticker &amp; FAQs</h4>
                    <p className="text-[11px] text-stone-500">Live scrolling ticker and student inquiries accordion</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Scrolling Announcement Ticker Bar</label>
                    <textarea
                      rows="2"
                      value={tickerAnnouncement}
                      onChange={(e) => setTickerAnnouncement(e.target.value)}
                      placeholder="ADMISSIONS OPEN 2026/27..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-stone-700 block">Frequently Asked Questions ({faqsList.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          const q = window.prompt("Enter new FAQ Question:");
                          if (!q) return;
                          const a = window.prompt("Enter FAQ Answer:");
                          if (!a) return;
                          const updated = [...faqsList, { question: q, answer: a }];
                          setFaqsList(updated);
                          updateFaqs(updated);
                          showToast("New FAQ added!", "success");
                        }}
                        className="text-[11px] font-bold text-[#3D0B16] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-[#B99A63]" />
                        <span>Add FAQ</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {faqsList.map((faq, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <p className="font-bold text-stone-900">{faq.question}</p>
                            <p className="text-stone-500 text-[11px] line-clamp-1">{faq.answer}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = faqsList.filter((_, i) => i !== idx);
                              setFaqsList(updated);
                              updateFaqs(updated);
                              showToast("FAQ removed", "info");
                            }}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: CONTACT, WHATSAPP & SOCIALS */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3D0B16]/10 text-[#3D0B16] flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-serif-luxury text-base">Direct Contact &amp; Social Links</h4>
                    <p className="text-[11px] text-stone-500">WhatsApp hotline, phone, email &amp; Instagram handle</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">WhatsApp Direct Number (With Country Code)</label>
                    <input
                      type="text"
                      value={infoForm.whatsappNumber}
                      onChange={(e) => setInfoForm({ ...infoForm, whatsappNumber: e.target.value })}
                      placeholder="+919074585672"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Display Direct Phone</label>
                    <input
                      type="text"
                      value={infoForm.directPhone}
                      onChange={(e) => setInfoForm({ ...infoForm, directPhone: e.target.value })}
                      placeholder="+91 90745 85672"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Official Academy Email</label>
                    <input
                      type="email"
                      value={infoForm.email}
                      onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                      placeholder="info@malavikasunil.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={infoForm.instagramUrl}
                        onChange={(e) => setInfoForm({ ...infoForm, instagramUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Instagram Handle</label>
                      <input
                        type="text"
                        value={infoForm.instagramHandle}
                        onChange={(e) => setInfoForm({ ...infoForm, instagramHandle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-[#B99A63] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Master Save Bar */}
            <div className="p-5 rounded-3xl bg-white border border-[#B99A63]/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-stone-900 block text-sm">Publish Website Content</span>
                <span className="text-xs text-stone-500">Updates live website texts, FAQs and contact numbers immediately with zero reload.</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateAcademyInfo(infoForm);
                  updateFaqs(faqsList);
                  showToast("Website content published live! All changes active.", "success");
                }}
                className="silk-zari-btn px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#1E050B] font-bold text-xs sm:text-sm shadow-lg shadow-[#D4AF37]/20 hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2 tap-bounce"
              >
                <Sparkles className="w-4 h-4 text-[#1E050B]" />
                <span>Save &amp; Publish Website Changes</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "matter" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                Site Announcements, Contact Info &amp; FAQs
              </h3>

              <div className="space-y-2">
                <label className="font-bold text-stone-700 block text-xs">
                  Header Marquee Ticker Announcement
                </label>
                <textarea
                  rows={2}
                  value={tickerAnnouncement}
                  onChange={(e) => setTickerAnnouncement(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">WhatsApp Enrolment Line</label>
                  <input
                    type="text"
                    value={infoForm.whatsappNumber}
                    onChange={(e) => setInfoForm({ ...infoForm, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Direct Phone Hotline</label>
                  <input
                    type="text"
                    value={infoForm.directPhone}
                    onChange={(e) => setInfoForm({ ...infoForm, directPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    updateAcademyInfo(infoForm);
                    showToast("Announcement and contact info saved!", "success");
                  }}
                  className="silk-zari-btn px-6 py-2 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-white font-bold text-xs"
                >
                  Save Announcement &amp; Info
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: ADD UNLISTED VIDEO TO COURSE AREA
      ═══════════════════════════════════════════════════════════════ */}
      {isAddingVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#B99A63]/40 space-y-5 text-left my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#B99A63] uppercase tracking-wider">
                  Course Area &bull; Video Vault
                </span>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Add Unlisted Video to {videoForm.courseCategory}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingVideoModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Target Course Area *</label>
                <select
                  value={videoForm.courseCategory}
                  onChange={(e) => setVideoForm({ ...videoForm, courseCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold"
                >
                  {COURSE_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Masterclass Session Title *</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Session 14: Natyarambham & Asamyuta Mudras"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#B99A63]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  YouTube Unlisted or Vimeo Link *
                </label>
                <input
                  type="url"
                  required
                  value={videoForm.embedUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, embedUrl: e.target.value })}
                  placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Paste regular YouTube or unlisted link &mdash; automatically converts to embedded player for students.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Module Name</label>
                  <input
                    type="text"
                    value={videoForm.module}
                    onChange={(e) => setVideoForm({ ...videoForm, module: e.target.value })}
                    placeholder="e.g. Module 01: Adavu Biomechanics"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="e.g. 58 mins"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Syllabus Topics Covered (One per line)</label>
                <textarea
                  rows={2}
                  value={videoForm.syllabusText}
                  onChange={(e) => setVideoForm({ ...videoForm, syllabusText: e.target.value })}
                  placeholder="Aramandi knee alignment\nTatta Adavu 1-8\nTalam tracking"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs font-mono"
                />
              </div>

              {/* Access Scope Restriction */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="font-bold text-stone-900 block text-xs">
                  Student Access Scope:
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                    <input
                      type="radio"
                      name="accessScope"
                      checked={videoForm.accessScope === "course_enrolled"}
                      onChange={() => setVideoForm({ ...videoForm, accessScope: "course_enrolled" })}
                    />
                    <span>All students enrolled in &ldquo;{videoForm.courseCategory}&rdquo; (Recommended)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                    <input
                      type="radio"
                      name="accessScope"
                      checked={videoForm.accessScope === "selected_students"}
                      onChange={() => setVideoForm({ ...videoForm, accessScope: "selected_students" })}
                    />
                    <span>Restrict to Specific Selected Students Only</span>
                  </label>
                </div>

                {videoForm.accessScope === "selected_students" && (
                  <div className="pt-2 border-t border-stone-200 space-y-1">
                    <span className="text-[11px] font-bold text-stone-600 block">Select Authorized Students:</span>
                    <div className="max-h-32 overflow-y-auto space-y-1 p-2 rounded-xl bg-white border border-stone-200">
                      {(studentsList || []).map((stu) => {
                        const isChecked = videoForm.allowedStudentIds.includes(stu.id);
                        return (
                          <label key={stu.id} className="flex items-center gap-2 text-[11px] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setVideoForm({
                                    ...videoForm,
                                    allowedStudentIds: [...videoForm.allowedStudentIds, stu.id]
                                  });
                                } else {
                                  setVideoForm({
                                    ...videoForm,
                                    allowedStudentIds: videoForm.allowedStudentIds.filter((id) => id !== stu.id)
                                  });
                                }
                              }}
                            />
                            <span>{stu.name} ({stu.registrationNo})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingVideoModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2.5 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-white font-bold text-xs"
                >
                  Publish to Student Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: ENROLL NEW STUDENT
      ═══════════════════════════════════════════════════════════════ */}
      {isAddingStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#B99A63]/40 space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#B99A63] uppercase tracking-wider">
                  Student Enrolment
                </span>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Enroll New Student
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingStudentModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sreya Narayanan"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={newStudentForm.email}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+91 98470..."
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Kerala, India"
                    value={newStudentForm.location}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1.5">
                  Select Enrolled Course Area(s) *
                </label>
                <div className="space-y-1.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
                  {COURSE_OPTIONS.map((cName) => {
                    const isChecked = newStudentForm.enrolledCourses.includes(cName);
                    return (
                      <label key={cName} className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewStudentForm({
                                ...newStudentForm,
                                enrolledCourses: [...newStudentForm.enrolledCourses, cName]
                              });
                            } else {
                              setNewStudentForm({
                                ...newStudentForm,
                                enrolledCourses: newStudentForm.enrolledCourses.filter((c) => c !== cName)
                              });
                            }
                          }}
                        />
                        <span>{cName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingStudentModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2.5 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-white font-bold text-xs"
                >
                  Confirm Enrolment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: 4-POINT OFFICIAL RUBRIC EVALUATION
      ═══════════════════════════════════════════════════════════════ */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#B99A63]/40 space-y-5 text-left my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#B99A63] uppercase tracking-wider">
                  Academic Performance Rubric &bull; {selectedAssessment.registrationNo}
                </span>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Grade Submission: {selectedAssessment.studentName}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{selectedAssessment.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-600 font-semibold">Video Rehearsal:</span>
              <a
                href={selectedAssessment.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#3B0B14] hover:underline flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Open Video Link</span>
              </a>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const total =
                  Number(rubricDraft.biomechanicsScore) +
                  Number(rubricDraft.mudraScore) +
                  Number(rubricDraft.layaScore) +
                  Number(rubricDraft.angaScore);
                const percent = Math.round((total / 40) * 100);
                const grade =
                  percent >= 85 ? "Distinction (90%)" : percent >= 70 ? "First Class (75%)" : "Merit Pass";

                const rubricData = {
                  biomechanics: {
                    score: Number(rubricDraft.biomechanicsScore),
                    maxScore: 10,
                    label: "Aramandi & Lower-Body Biomechanics",
                    remarks: rubricDraft.biomechanicsRemarks
                  },
                  mudraPrecision: {
                    score: Number(rubricDraft.mudraScore),
                    maxScore: 10,
                    label: "Hasta Mudra Precision",
                    remarks: rubricDraft.mudraRemarks
                  },
                  layaTalam: {
                    score: Number(rubricDraft.layaScore),
                    maxScore: 10,
                    label: "Laya & Talam Synchronization",
                    remarks: rubricDraft.layaRemarks
                  },
                  angaShuddhi: {
                    score: Number(rubricDraft.angaScore),
                    maxScore: 10,
                    label: "Anga Shuddhi (Upper-Body Posture)",
                    remarks: rubricDraft.angaRemarks
                  }
                };

                gradeAssessment(
                  selectedAssessment.id,
                  rubricData,
                  rubricDraft.clinicalNote,
                  grade,
                  total
                );
                setSelectedAssessment(null);
              }}
              className="space-y-4 text-xs"
            >
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900">
                    1. Aramandi &amp; Lower-Body Biomechanics (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    required
                    value={rubricDraft.biomechanicsScore}
                    onChange={(e) =>
                      setRubricDraft({ ...rubricDraft, biomechanicsScore: e.target.value })
                    }
                    className="w-20 px-2.5 py-1 text-center font-bold font-mono rounded-lg border border-stone-200 bg-white"
                  />
                </div>
                <input
                  type="text"
                  value={rubricDraft.biomechanicsRemarks}
                  onChange={(e) =>
                    setRubricDraft({ ...rubricDraft, biomechanicsRemarks: e.target.value })
                  }
                  placeholder="Knee turnout remarks, patella tracking, foot placement..."
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900">
                    2. Hasta Mudra Precision (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    required
                    value={rubricDraft.mudraScore}
                    onChange={(e) =>
                      setRubricDraft({ ...rubricDraft, mudraScore: e.target.value })
                    }
                    className="w-20 px-2.5 py-1 text-center font-bold font-mono rounded-lg border border-stone-200 bg-white"
                  />
                </div>
                <input
                  type="text"
                  value={rubricDraft.mudraRemarks}
                  onChange={(e) =>
                    setRubricDraft({ ...rubricDraft, mudraRemarks: e.target.value })
                  }
                  placeholder="Finger articulation, thumb position, wrist stability..."
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900">
                    3. Laya &amp; Talam Synchronization (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    required
                    value={rubricDraft.layaScore}
                    onChange={(e) =>
                      setRubricDraft({ ...rubricDraft, layaScore: e.target.value })
                    }
                    className="w-20 px-2.5 py-1 text-center font-bold font-mono rounded-lg border border-stone-200 bg-white"
                  />
                </div>
                <input
                  type="text"
                  value={rubricDraft.layaRemarks}
                  onChange={(e) =>
                    setRubricDraft({ ...rubricDraft, layaRemarks: e.target.value })
                  }
                  placeholder="Metronome pacing, foot strike on samam, speed transitions..."
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900">
                    4. Anga Shuddhi &bull; Upper-Body Posture (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    required
                    value={rubricDraft.angaScore}
                    onChange={(e) =>
                      setRubricDraft({ ...rubricDraft, angaScore: e.target.value })
                    }
                    className="w-20 px-2.5 py-1 text-center font-bold font-mono rounded-lg border border-stone-200 bg-white"
                  />
                </div>
                <input
                  type="text"
                  value={rubricDraft.angaRemarks}
                  onChange={(e) =>
                    setRubricDraft({ ...rubricDraft, angaRemarks: e.target.value })
                  }
                  placeholder="Spine elongation, shoulder centering, neck carriage..."
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-900 block mb-1">
                  Dr. Malavika&apos;s Biomechanical &amp; Performance Summary (Clinical Verdict)
                </label>
                <textarea
                  rows={3}
                  required
                  value={rubricDraft.clinicalNote}
                  onChange={(e) =>
                    setRubricDraft({ ...rubricDraft, clinicalNote: e.target.value })
                  }
                  placeholder="Enter detailed feedback and module clearance notes..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#B99A63]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">
                  Total Projected:{" "}
                  <strong className="text-[#3B0B14] font-mono text-sm">
                    {Number(rubricDraft.biomechanicsScore) +
                      Number(rubricDraft.mudraScore) +
                      Number(rubricDraft.layaScore) +
                      Number(rubricDraft.angaScore)}{" "}
                    / 40
                  </strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAssessment(null)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="silk-zari-btn px-6 py-2.5 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Publish Assessment to Student Portal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Edit Modal */}
      {(editingCourse || isAddingCourse) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-[#B99A63]/40 space-y-5 text-left my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                {editingCourse ? `Edit Course: ${editingCourse.title}` : "Add New Course"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingCourse(null);
                  setIsAddingCourse(false);
                }}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tuition Fee Display</label>
                  <input
                    type="text"
                    value={courseForm.fee}
                    onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Weekly Frequency</label>
                  <input
                    type="text"
                    value={courseForm.frequency}
                    onChange={(e) => setCourseForm({ ...courseForm, frequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              {/* Photo Uploader */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800 block text-xs">Main Cover Photo</label>
                  {isUploadingCourseMedia && (
                    <span className="text-xs text-[#B99A63] font-semibold animate-pulse">
                      {uploadProgressText}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-stone-900 overflow-hidden shrink-0 border border-stone-200 relative">
                    <img src={courseForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-white font-bold text-xs cursor-pointer shadow-sm">
                    <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                    <span>Upload Photo from Phone / PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadCourseMedia(e, false)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setIsAddingCourse(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2.5 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-white font-bold text-xs"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
