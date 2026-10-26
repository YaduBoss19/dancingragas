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
  Sparkles
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
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    timetable,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
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
    updateRecordings,
    deleteRecording,
    liveClassConfig,
    updateLiveClassConfig
  } = useAcademy();

  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState("enquiries"); // 'enquiries' | 'courses' | 'gallery' | 'matter' | 'students'

  // Matter & FAQs CMS State
  const [tickerAnnouncement, setTickerAnnouncement] = useState(
    "ADMISSIONS OPEN 2026/27: Online Bharatanatyam Diploma (Yearly Exams & Certificates) • Carnatic Classical Vocal Coaching • 1-on-1 Consultations"
  );
  const [faqsList, setFaqsList] = useState(FAQS);
  const [editingFaqIdx, setEditingFaqIdx] = useState(null);
  const [faqQuestionDraft, setFaqQuestionDraft] = useState("");
  const [faqAnswerDraft, setFaqAnswerDraft] = useState("");

  // Student reviews state
  const [studentReviews, setStudentReviews] = useState([
    {
      id: "rev-1",
      studentName: "Ananya Menon",
      batch: "Bharatanatyam Diploma (Junior)",
      title: "Adavu Step 1-4 Posture & Aramandi Check",
      date: "Oct 22, 2026",
      videoUrl: "https://drive.google.com/file/d/sample-adavu/view",
      status: "reviewed",
      feedback:
        "Excellent footwork precision! Make sure the Aramandi knee angle stays aligned without leaning forward to protect the joints."
    },
    {
      id: "rev-2",
      studentName: "Pooja Ramesh",
      batch: "Bharatanatyam Non-Diploma",
      title: "Alarippu Tisra Ekam Practice Video",
      date: "Oct 25, 2026",
      videoUrl: "https://drive.google.com/file/d/sample-alarippu/view",
      status: "pending",
      feedback: ""
    }
  ]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState("");

  // Live Broadcast & Recordings Vault State
  const [liveForm, setLiveForm] = useState({
    title: liveClassConfig?.title || "Bharatanatyam Diploma Masterclass: Aramandi & Tala Sync",
    platform: liveClassConfig?.platform || "Google Meet",
    joinUrl: liveClassConfig?.joinUrl || "https://meet.google.com/dnc-ragas-live",
    scheduledTime: liveClassConfig?.scheduledTime || "Sunday, 5:00 PM IST / 7:30 AM EST",
    status: liveClassConfig?.status || "Live Now",
    instructor: liveClassConfig?.instructor || "Dr. Malavika Sunil",
    targetBatch: liveClassConfig?.targetBatch || "Bharatanatyam Diploma & Non-Diploma"
  });

  const [isAddingRecModal, setIsAddingRecModal] = useState(false);
  const [recForm, setRecForm] = useState({
    title: "",
    category: "Bharatanatyam Diploma",
    duration: "60 mins",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    embedUrl: "",
    description: "",
    syllabusText: ""
  });

  // Modals state
  const [editingCourse, setEditingCourse] = useState(null);
  const [isUploadingCourseMedia, setIsUploadingCourseMedia] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");

  // Academy Info Form state
  const [infoForm, setInfoForm] = useState({
    whatsappNumber: academyInfo?.whatsappNumber || "+919074585672",
    directPhone: academyInfo?.directPhone || "+91 90745 85672",
    email: academyInfo?.email || "info@malavikasunil.com",
    tagline: academyInfo?.tagline || "Your Passion. Your Pace. Your Personal Coach.",
    instagramUrl: academyInfo?.instagramUrl || "https://www.instagram.com/dancingragasbymalavika/",
    instagramHandle: academyInfo?.instagramHandle || "@dancingragasbymalavika"
  });

  // Testimonials draft state
  const [testimonialsDraft, setTestimonialsDraft] = useState(testimonials || []);
  const [editingTestimonialIdx, setEditingTestimonialIdx] = useState(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);

  const [editingTimetable, setEditingTimetable] = useState(null);
  const [isAddingTimetable, setIsAddingTimetable] = useState(false);

  const [isAddingGallery, setIsAddingGallery] = useState(false);

  const [viewingEnquiry, setViewingEnquiry] = useState(null);
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState("All");
  const [enquirySearch, setEnquirySearch] = useState("");

  // Course Form State
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
    syllabusText: "Comprehensive practical Adavu training\nPrescribed theoretical syllabus\nMargam repertoire"
  });

  // Teacher Form State
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    role: "Senior Dance Instructor",
    department: "Dance",
    experience: "8+ Years Experience",
    specialisation: "Contemporary Dance & Improvisation",
    qualifications: "BFA in Dance Performance",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    bio: "",
    classesText: "Contemporary & Lyrical, Hip-Hop"
  });

  // Timetable Form State
  const [timetableForm, setTimetableForm] = useState({
    day: "Monday",
    time: "05:00 PM - 06:00 PM",
    course: "Classical Ballet",
    teacher: "Elena Vance",
    room: "Studio A (Lilac Floor)",
    category: "Dance",
    ageGroup: "Kids (6-9)",
    level: "Beginner"
  });

  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "Performances",
    type: "photo",
    url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "",
    caption: ""
  });

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginAdmin(passwordInput);
    setPasswordInput("");
  };

  // Export Enquiries to CSV
  const handleSaveLiveConfig = (e) => {
    e.preventDefault();
    updateLiveClassConfig(liveForm);
    showToast("Live classroom broadcast settings updated! Live in Student Portal.", "success");
  };

  const formatEmbedUrl = (raw) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    // YouTube watch URL
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return trimmed;
  };

  const handleAddRecordingSubmit = (e) => {
    e.preventDefault();
    if (!recForm.title.trim()) {
      showToast("Masterclass title is required.", "error");
      return;
    }
    const finalEmbed = formatEmbedUrl(recForm.embedUrl);
    if (!finalEmbed) {
      showToast("Please enter a valid YouTube or Vimeo recording link.", "error");
      return;
    }
    const newRec = {
      title: recForm.title.trim(),
      category: recForm.category,
      duration: recForm.duration.trim() || "60 mins",
      date: recForm.date.trim() || "Current Term",
      embedUrl: finalEmbed,
      description: recForm.description.trim() || "Live lecture and practical adavu drill recording.",
      syllabus: recForm.syllabusText.split("\n").map((s) => s.trim()).filter(Boolean)
    };
    addRecording(newRec);
    setIsAddingRecModal(false);
    setRecForm({
      title: "",
      category: "Bharatanatyam Diploma",
      duration: "60 mins",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      embedUrl: "",
      description: "",
      syllabusText: ""
    });
    showToast("Masterclass recording published to Student Vault!", "success");
  };

  const handleExportCSV = () => {
    if (!enquiries.length) {
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
        showToast("Main photo updated and optimized!", "success");
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

  // Teacher Handlers
  const openAddTeacher = () => {
    setTeacherForm({
      name: "",
      role: "Senior Dance Instructor",
      department: "Dance",
      experience: "8+ Years Experience",
      specialisation: "Contemporary & Hip-Hop",
      qualifications: "BFA in Dance Performance",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      bio: "",
      classesText: "Contemporary Dance, Hip-Hop Groove"
    });
    setIsAddingTeacher(true);
    setEditingTeacher(null);
  };

  const openEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      name: teacher.name,
      role: teacher.role,
      department: teacher.department,
      experience: teacher.experience,
      specialisation: teacher.specialisation,
      qualifications: teacher.qualifications || "",
      photo: teacher.photo,
      bio: teacher.bio,
      classesText: (teacher.classes || []).join(", ")
    });
    setIsAddingTeacher(false);
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    if (!teacherForm.name.trim()) {
      showToast("Teacher name is required.", "error");
      return;
    }

    const payload = {
      name: teacherForm.name,
      role: teacherForm.role,
      department: teacherForm.department,
      experience: teacherForm.experience,
      specialisation: teacherForm.specialisation,
      qualifications: teacherForm.qualifications,
      photo: teacherForm.photo,
      bio: teacherForm.bio,
      classes: teacherForm.classesText.split(",").map((s) => s.trim()).filter(Boolean)
    };

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, payload);
      setEditingTeacher(null);
    } else {
      addTeacher(payload);
      setIsAddingTeacher(false);
    }
  };

  // Timetable Handlers
  const openAddTimetable = () => {
    setTimetableForm({
      day: "Monday",
      time: "05:00 PM - 06:00 PM",
      course: courses[0]?.title || "Classical Ballet",
      teacher: teachers[0]?.name || "Elena Vance",
      room: "Studio A (Lilac Floor)",
      category: "Dance",
      ageGroup: "Kids (6-9)",
      level: "Beginner"
    });
    setIsAddingTimetable(true);
    setEditingTimetable(null);
  };

  const openEditTimetable = (slot) => {
    setEditingTimetable(slot);
    setTimetableForm({
      day: slot.day,
      time: slot.time,
      course: slot.course,
      teacher: slot.teacher,
      room: slot.room,
      category: slot.category,
      ageGroup: slot.ageGroup,
      level: slot.level
    });
    setIsAddingTimetable(false);
  };

  const handleSaveTimetable = (e) => {
    e.preventDefault();
    if (editingTimetable) {
      updateTimetableSlot(editingTimetable.id, timetableForm);
      setEditingTimetable(null);
    } else {
      addTimetableSlot(timetableForm);
      setIsAddingTimetable(false);
    }
  };

  // Gallery Handlers
  const handleSaveGallery = (e) => {
    e.preventDefault();
    if (!galleryForm.title.trim() || !galleryForm.url.trim()) {
      showToast("Title and image/media URL are required.", "error");
      return;
    }
    addGalleryItem(galleryForm);
    setIsAddingGallery(false);
    setGalleryForm({
      title: "",
      category: "Performances",
      type: "photo",
      url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "",
      caption: ""
    });
  };

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
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

  // IF NOT LOGGED IN: Render Luxury Director Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[82vh] flex items-center justify-center p-4 bg-gradient-to-b from-[#151515] via-[#2A080E] to-[#151515] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0,transparent_70%)] pointer-events-none" />

        <div className="relative w-full max-w-md rounded-3xl bg-[#1A1A1A] border border-[#B99A63]/40 shadow-2xl p-8 sm:p-10 text-center space-y-6 backdrop-blur-md">
          {/* Gold Crest */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B0B14] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] mx-auto flex items-center justify-center shadow-lg shadow-[#D4AF37]/10">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#D4AF37]">
              Director Control Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              DancingRagas <span className="text-[#D4AF37]">CMS</span>
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              Protected administrative suite for Dr. Malavika to manage admissions, courses, media, live classes & recordings.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5 text-left">
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
              <span>Authenticate &amp; Enter Studio CMS</span>
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

  // LOGGED IN DASHBOARD
  return (
    <div className="space-y-8 pb-24 text-left">
      {/* Top Header Bar */}
      <section className="bg-gradient-to-r from-[#151515] via-[#2A080E] to-[#151515] text-[#F5F0E8] pt-8 pb-12 px-4 sm:px-8 border-b border-[#B99A63]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08)_0,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                {isSupabaseConfigured ? "Supabase Cloud Active" : "Studio CMS Online"}
              </span>
              <span className="text-xs text-stone-300">DancingRagas Classical Arts Academy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white tracking-wide">
              Director Studio Management &amp; CMS
            </h1>
            <p className="text-xs text-stone-300">
              Welcome Dr. Malavika • Live updates publish instantly to students &amp; public visitors worldwide.
            </p>
          </div>

          {/* Quick Operations */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo("home")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>View Public Site</span>
            </button>

            <button
              onClick={() => navigateTo("student-portal")}
              className="px-4 py-2 rounded-xl bg-[#3B0B14] hover:bg-[#4E0E1B] text-[#D4AF37] border border-[#B99A63]/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Portal Preview</span>
            </button>

            <button
              onClick={resetToDefaults}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset all courses, timetable and teachers to default factory preset"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span>Restore Presets</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-4 py-2 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-700/50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* High Level Stats Strip */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 relative">
          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Trial Enquiries</span>
            <p className="text-2xl font-bold font-serif-luxury text-white mt-1">{enquiries.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">New Leads</span>
            <p className="text-2xl font-bold font-serif-luxury text-rose-400 mt-1">
              {enquiries.filter((e) => e.status === "New").length}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">Classes &amp; Services</span>
            <p className="text-2xl font-bold font-serif-luxury text-[#D4AF37] mt-1">{courses.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Vault Recordings</span>
            <p className="text-2xl font-bold font-serif-luxury text-amber-300 mt-1">{(recordings || []).length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider">Principal Mentor</span>
            <p className="text-base sm:text-lg font-bold font-serif-luxury text-white mt-1 truncate">Dr. Malavika</p>
          </div>
        </div>
      </section>

      {/* Main Tabbed Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#FAF7F2] border border-[#B99A63]/30 shadow-xs overflow-x-auto max-w-full">
          {[
            { id: "enquiries", label: `Enquiries (${enquiries.length})`, icon: MessageSquare },
            { id: "courses", label: `Classes & Services (${courses.length})`, icon: BookOpen },
            { id: "live_classroom", label: `Live Class & Vault (${(recordings || []).length})`, icon: Video },
            { id: "gallery", label: `Media Vault (${gallery.length})`, icon: ImageIcon },
            { id: "matter", label: "Announcement & FAQs CMS", icon: FileText },
            { id: "students", label: "Student Reviews & Homework", icon: GraduationCap }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap tap-bounce shrink-0 ${
                  isActive
                    ? "bg-[#3B0B14] text-[#D4AF37] border border-[#B99A63]/50 shadow-sm"
                    : "text-stone-700 hover:text-stone-900 hover:bg-[#F0EBE1]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ENQUIRIES */}
        {activeTab === "enquiries" && (
          <div className="space-y-6">
            {/* Top controls */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    placeholder="Search by student, course, phone..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#B99A63]"
                  />
                </div>

                <select
                  value={enquiryFilterStatus}
                  onChange={(e) => setEnquiryFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none"
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
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                <span>Export Enquiries to CSV</span>
              </button>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Ref & Date</th>
                      <th className="py-3.5 px-4">Student & Age</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Course & Slot</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-500">
                          No enquiries found matching this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((enq) => {
                        let statusColor = "bg-rose-100 text-rose-800 border-rose-200";
                        if (enq.status === "Trial Scheduled") statusColor = "bg-amber-100 text-amber-800 border-amber-200";
                        if (enq.status === "Contacted") statusColor = "bg-blue-100 text-blue-800 border-blue-200";
                        if (enq.status === "Enrolled") statusColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
                        if (enq.status === "Declined") statusColor = "bg-slate-100 text-slate-600 border-slate-200";

                        return (
                          <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-slate-800">
                              <div>{enq.id}</div>
                              <div className="text-[10px] text-slate-400 font-sans">{enq.date}</div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900">{enq.studentName}</div>
                              <div className="text-[11px] text-slate-500">
                                Age {enq.studentAge} {enq.parentName ? `â€¢ Parent: ${enq.parentName}` : ""}
                              </div>
                            </td>

                            <td className="py-4 px-4 space-y-0.5">
                              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                                <Phone className="w-3 h-3 text-rose-500 shrink-0" />
                                <span>{enq.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                <Mail className="w-3 h-3 text-[#B99A63] shrink-0" />
                                <span>{enq.email}</span>
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-[#3B0B14]">{enq.course}</div>
                              <div className="text-[11px] text-slate-500">{enq.preferredTime}</div>
                            </td>

                            <td className="py-4 px-4">
                              <select
                                value={enq.status}
                                onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${statusColor} focus:outline-none cursor-pointer`}
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
                                  onClick={() => setViewingEnquiry(enq)}
                                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200"
                                  title="View Full Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    const text = `Hello ${enq.parentName || enq.studentName}! This is DancingRagas Classical Arts Academy regarding your trial enquiry for ${enq.course}.`;
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
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student & Parent Stories / Testimonials Manager */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                    Student &amp; Parent Stories ({(testimonials || []).length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edit quotes, student names, locations, and upload profile photos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newTestimonial = {
                      id: "t-" + Date.now(),
                      name: "Student Name",
                      relation: "Dance Student • Location",
                      location: "Kerala",
                      avatar: "/images/testimonials/semmalar_dharman.jpg",
                      avatarPosition: "object-center",
                      quote: "Learning dance with DancingRagas has been a transformative journey!",
                      stars: 5,
                      tag: "Verified Student"
                    };
                    const updated = [...(testimonials || []), newTestimonial];
                    updateTestimonials(updated);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Story</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(testimonials || []).map((t, tIdx) => (
                  <div key={t.id || tIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative">
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => {
                              const updated = [...(testimonials || [])];
                              updated[tIdx] = { ...updated[tIdx], name: e.target.value };
                              updateTestimonials(updated);
                            }}
                            className="font-bold text-slate-900 text-xs sm:text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#B99A63] focus:outline-none"
                          />
                          <input
                            type="text"
                            value={t.location || ""}
                            onChange={(e) => {
                              const updated = [...(testimonials || [])];
                              updated[tIdx] = { ...updated[tIdx], location: e.target.value, relation: `Dance Student • ${e.target.value}` };
                              updateTestimonials(updated);
                            }}
                            placeholder="Location"
                            className="block text-[11px] text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#B99A63] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#FAF7F2] text-[#3B0B14] cursor-pointer text-xs font-semibold flex items-center gap-1" title="Upload Student Photo">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                showToast("Optimizing student photo in browser...", "info");
                                const compressed = await compressImageFile(file, 600, 0.88);
                                const res = await uploadMediaToBucket("testimonials", compressed.file);
                                const finalUrl = res.url || compressed.dataUrl;
                                const updated = [...(testimonials || [])];
                                updated[tIdx] = { ...updated[tIdx], avatar: finalUrl };
                                updateTestimonials(updated);
                                showToast("Student photo updated!", "success");
                              } catch (err) {
                                showToast("Failed to upload photo", "error");
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete review from "${t.name}"?`)) {
                              const updated = (testimonials || []).filter((_, idx) => idx !== tIdx);
                              updateTestimonials(updated);
                              showToast("Story removed", "info");
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) => {
                        const updated = [...(testimonials || [])];
                        updated[tIdx] = { ...updated[tIdx], quote: e.target.value };
                        updateTestimonials(updated);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs leading-relaxed text-slate-700 focus:outline-none focus:border-[#B99A63] font-serif-luxury"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSES & FEES */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Manage Courses & Fees</h3>
                <p className="text-xs text-slate-500">Edit existing syllabus and fees, or publish new music and dance disciplines.</p>
              </div>

              <button
                onClick={openAddCourse}
                className="px-5 py-2.5 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-slate-900">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-slate-900 text-xs font-bold">
                      {course.category}
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-black shadow-md">
                      {course.fee}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{course.title}</h4>
                      <p className="text-xs text-[#3B0B14] font-semibold mt-0.5">{course.ageGroup}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditCourse(course)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
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

        {/* TAB 3: FACULTY / TEACHERS */}
        {activeTab === "teachers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Manage Faculty Profiles</h3>
                <p className="text-xs text-slate-500">Update teacher bios, photos, specialisations, and credentials.</p>
              </div>

              <button
                onClick={openAddTeacher}
                className="px-5 py-2.5 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Teacher Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-5 items-start"
                >
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="w-24 h-28 rounded-2xl object-cover shrink-0 bg-slate-100"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md">
                        {teacher.department} â€¢ {teacher.experience}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900">{teacher.name}</h4>
                    <p className="text-xs font-semibold text-[#3B0B14]">{teacher.role}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{teacher.bio}</p>

                    <div className="pt-3 flex items-center gap-2">
                      <button
                        onClick={() => openEditTeacher(teacher)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete teacher profile "${teacher.name}"?`)) {
                            deleteTeacher(teacher.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete teacher"
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

        {/* TAB 4: TIMETABLE */}
        {activeTab === "timetable" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Manage Weekly Class Timetable</h3>
                <p className="text-xs text-slate-500">Assign studio rooms, instructors, and days for each batch.</p>
              </div>

              <button
                onClick={openAddTimetable}
                className="px-5 py-2.5 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class Slot</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Day & Time</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Instructor</th>
                      <th className="py-3 px-4">Studio Room</th>
                      <th className="py-3 px-4">Age / Level</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {timetable.map((slot) => (
                      <tr key={slot.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-[#3B0B14]">{slot.day}</span>
                          <div className="text-slate-500 text-[11px]">{slot.time}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{slot.course}</td>
                        <td className="py-3.5 px-4 text-slate-700">{slot.teacher}</td>
                        <td className="py-3.5 px-4 text-slate-600">{slot.room}</td>
                        <td className="py-3.5 px-4 text-slate-600">{slot.ageGroup} â€¢ {slot.level}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditTimetable(slot)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${slot.day} slot for ${slot.course}?`)) {
                                  deleteTimetableSlot(slot.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
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

            {/* Student & Parent Stories / Testimonials Manager */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                    Student &amp; Parent Stories ({(testimonials || []).length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edit quotes, student names, locations, and upload profile photos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newTestimonial = {
                      id: "t-" + Date.now(),
                      name: "Student Name",
                      relation: "Dance Student • Location",
                      location: "Kerala",
                      avatar: "/images/testimonials/semmalar_dharman.jpg",
                      avatarPosition: "object-center",
                      quote: "Learning dance with DancingRagas has been a transformative journey!",
                      stars: 5,
                      tag: "Verified Student"
                    };
                    const updated = [...(testimonials || []), newTestimonial];
                    updateTestimonials(updated);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Story</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(testimonials || []).map((t, tIdx) => (
                  <div key={t.id || tIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative">
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => {
                              const updated = [...(testimonials || [])];
                              updated[tIdx] = { ...updated[tIdx], name: e.target.value };
                              updateTestimonials(updated);
                            }}
                            className="font-bold text-slate-900 text-xs sm:text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#B99A63] focus:outline-none"
                          />
                          <input
                            type="text"
                            value={t.location || ""}
                            onChange={(e) => {
                              const updated = [...(testimonials || [])];
                              updated[tIdx] = { ...updated[tIdx], location: e.target.value, relation: `Dance Student • ${e.target.value}` };
                              updateTestimonials(updated);
                            }}
                            placeholder="Location"
                            className="block text-[11px] text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#B99A63] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#FAF7F2] text-[#3B0B14] cursor-pointer text-xs font-semibold flex items-center gap-1" title="Upload Student Photo">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                showToast("Optimizing student photo in browser...", "info");
                                const compressed = await compressImageFile(file, 600, 0.88);
                                const res = await uploadMediaToBucket("testimonials", compressed.file);
                                const finalUrl = res.url || compressed.dataUrl;
                                const updated = [...(testimonials || [])];
                                updated[tIdx] = { ...updated[tIdx], avatar: finalUrl };
                                updateTestimonials(updated);
                                showToast("Student photo updated!", "success");
                              } catch (err) {
                                showToast("Failed to upload photo", "error");
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete review from "${t.name}"?`)) {
                              const updated = (testimonials || []).filter((_, idx) => idx !== tIdx);
                              updateTestimonials(updated);
                              showToast("Story removed", "info");
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) => {
                        const updated = [...(testimonials || [])];
                        updated[tIdx] = { ...updated[tIdx], quote: e.target.value };
                        updateTestimonials(updated);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs leading-relaxed text-slate-700 focus:outline-none focus:border-[#B99A63] font-serif-luxury"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GALLERY */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Manage Gallery Moments</h3>
                <p className="text-xs text-slate-500">Upload or link new photos and recital videos to the public gallery.</p>
              </div>

              <button
                onClick={() => setIsAddingGallery(true)}
                className="px-5 py-2.5 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gallery Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-slate-900">
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 text-slate-900 text-[10px] font-bold">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.caption}</p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete gallery item "${item.title}"?`)) {
                            deleteGalleryItem(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete image"
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

        {/* TAB 4: MATTER & FAQS CMS */}
        {activeTab === "matter" && (
          <div className="space-y-8 text-left">
            {/* Announcement Ticker Section */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                    Top Ticker Announcements
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live ticker displayed at the very top of the website for admissions and masterclasses.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast("Announcement text saved to live site!", "success")}
                  className="px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs cursor-pointer"
                >
                  Save Ticker
                </button>
              </div>

              <textarea
                rows={2}
                value={tickerAnnouncement}
                onChange={(e) => setTickerAnnouncement(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#B99A63] focus:outline-none"
              />
            </div>

            {/* Academy Contact & Social Details */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                    Academy Contact &amp; Social Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Updates phone, WhatsApp, and social media handles across all public website pages.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateAcademyInfo({
                      ...academyInfo,
                      ...infoForm
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Save Contact Details
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp Number (e.g. +919074585672)</label>
                  <input
                    type="text"
                    value={infoForm.whatsappNumber}
                    onChange={(e) => setInfoForm({ ...infoForm, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Direct Call Phone (e.g. +91 90745 85672)</label>
                  <input
                    type="text"
                    value={infoForm.directPhone}
                    onChange={(e) => setInfoForm({ ...infoForm, directPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={infoForm.email}
                    onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={infoForm.instagramHandle}
                    onChange={(e) => setInfoForm({ ...infoForm, instagramHandle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* FAQs Manager */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                    Frequently Asked Questions ({(faqs || []).length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edit questions, answers, and admission guidance displayed in the FAQ section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFaq = {
                      number: String((faqs || []).length + 1).padStart(2, "0"),
                      question: "New Question Title",
                      answer: "Provide answers regarding schedule, admission, and fees."
                    };
                    const updated = [...(faqs || []), newFaq];
                    updateFaqs(updated);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {(faqs || []).map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all space-y-2 bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-purple-100 text-[#3B0B14] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {faq.number || String(fIdx + 1).padStart(2, "0")}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{faq.question}</h4>
                      </div>
                      <button
                        onClick={() => {
                          setEditingFaqIdx(fIdx);
                          setFaqQuestionDraft(faq.question);
                          setFaqAnswerDraft(faq.answer);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#B99A63] hover:bg-white cursor-pointer shrink-0"
                        title="Edit FAQ"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-9">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Student & Parent Stories / Testimonials Manager */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                    Student &amp; Parent Stories ({(testimonials || []).length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edit quotes, student names, locations, and upload profile photos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newTestimonial = {
                      id: "t-" + Date.now(),
                      name: "Student Name",
                      relation: "Dance Student • Location",
                      location: "Kerala",
                      avatar: "/images/testimonials/semmalar_dharman.jpg",
                      avatarPosition: "object-center",
                      quote: "Learning dance with DancingRagas has been a transformative journey!",
                      stars: 5,
                      tag: "Verified Student"
                    };
                    const updated = [...(testimonials || []), newTestimonial];
                    updateTestimonials(updated);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Story</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(testimonials || []).map((t, tIdx) => (
                  <div key={t.id || tIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative">
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => {
                              const updated = [...(testimonials || [])];
                              updated[tIdx] = { ...updated[tIdx], name: e.target.value };
                              updateTestimonials(updated);
                            }}
                            className="font-bold text-slate-900 text-xs sm:text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#B99A63] focus:outline-none"
                          />
                          <input
                            type="text"
                            value={t.location || ""}
                            onChange={(e) => {
                              const updated = [...(testimonials || [])];
                              updated[tIdx] = { ...updated[tIdx], location: e.target.value, relation: `Dance Student • ${e.target.value}` };
                              updateTestimonials(updated);
                            }}
                            placeholder="Location"
                            className="block text-[11px] text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#B99A63] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#FAF7F2] text-[#3B0B14] cursor-pointer text-xs font-semibold flex items-center gap-1" title="Upload Student Photo">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                showToast("Optimizing student photo in browser...", "info");
                                const compressed = await compressImageFile(file, 600, 0.88);
                                const res = await uploadMediaToBucket("testimonials", compressed.file);
                                const finalUrl = res.url || compressed.dataUrl;
                                const updated = [...(testimonials || [])];
                                updated[tIdx] = { ...updated[tIdx], avatar: finalUrl };
                                updateTestimonials(updated);
                                showToast("Student photo updated!", "success");
                              } catch (err) {
                                showToast("Failed to upload photo", "error");
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete review from "${t.name}"?`)) {
                              const updated = (testimonials || []).filter((_, idx) => idx !== tIdx);
                              updateTestimonials(updated);
                              showToast("Story removed", "info");
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) => {
                        const updated = [...(testimonials || [])];
                        updated[tIdx] = { ...updated[tIdx], quote: e.target.value };
                        updateTestimonials(updated);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs leading-relaxed text-slate-700 focus:outline-none focus:border-[#B99A63] font-serif-luxury"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STUDENT HOMEWORK & REVIEWS */}
        {activeTab === "students" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                Student Video Submissions &amp; Biomechanical Feedback
              </h3>
              <p className="text-xs text-slate-500">
                Review weekly practice videos uploaded by enrolled students from Georgia, India, and overseas batches.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3B0B14]">{rev.batch}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          rev.status === "reviewed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {rev.status === "reviewed" ? "Reviewed" : "Pending Feedback"}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{rev.studentName}</h4>
                    <p className="text-xs text-slate-600 font-medium">{rev.title}</p>
                    <span className="text-[11px] text-slate-400 block">Submitted: {rev.date}</span>

                    <a
                      href={rev.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#B99A63] hover:text-purple-800 font-bold underline"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Watch Practice Video Link</span>
                    </a>

                    {rev.feedback && (
                      <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 mt-2 border border-slate-100">
                        <strong className="text-slate-900 block mb-0.5">Your Feedback:</strong>
                        {rev.feedback}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedReview(rev);
                        setFeedbackInput(rev.feedback || "");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#151515] hover:bg-purple-600 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      {rev.status === "reviewed" ? "Update Feedback" : "Review & Add Feedback"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

            {/* Add New Recording Modal (Option A2) */}
      {isAddingRecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#B99A63]/50 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B99A63]">Option A2 Vault</span>
                <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                  Add Masterclass Recording
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingRecModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecordingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={recForm.title}
                  onChange={(e) => setRecForm({ ...recForm, title: e.target.value })}
                  placeholder="e.g. Session 12: Natyarambham & Asamyuta Mudras"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#B99A63]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Course Discipline</label>
                  <select
                    value={recForm.category}
                    onChange={(e) => setRecForm({ ...recForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  >
                    <option value="Bharatanatyam Diploma">Bharatanatyam Diploma</option>
                    <option value="Bharatanatyam Non-Diploma">Bharatanatyam Non-Diploma</option>
                    <option value="Carnatic Music">Carnatic Music</option>
                    <option value="Bollywood & Semi-Classical">Bollywood & Semi-Classical</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Duration &amp; Date</label>
                  <input
                    type="text"
                    value={recForm.duration}
                    onChange={(e) => setRecForm({ ...recForm, duration: e.target.value })}
                    placeholder="e.g. 60 mins"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  YouTube Unlisted or Vimeo Link *
                </label>
                <input
                  type="url"
                  required
                  value={recForm.embedUrl}
                  onChange={(e) => setRecForm({ ...recForm, embedUrl: e.target.value })}
                  placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=... or Vimeo"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none font-mono"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Paste standard YouTube or unlisted link &mdash; we automatically format it into a distraction-free player.
                </span>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Session Summary / Description</label>
                <textarea
                  rows={2}
                  value={recForm.description}
                  onChange={(e) => setRecForm({ ...recForm, description: e.target.value })}
                  placeholder="Overview of this week's drills and corrections..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Covered Topics / Mudras (One per line)</label>
                <textarea
                  rows={3}
                  value={recForm.syllabusText}
                  onChange={(e) => setRecForm({ ...recForm, syllabusText: e.target.value })}
                  placeholder="Tatta Adavu 1-8\nPataka & Tripataka Mudras\nAramandi posture corrections"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingRecModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2 rounded-xl bg-[#3B0B14] hover:bg-[#4E0E1B] text-[#D4AF37] text-xs font-bold shadow-md cursor-pointer"
                >
                  Publish to Student Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW ENQUIRY DETAILS */}
      {viewingEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#B99A63]">{viewingEnquiry.id}</span>
                <h3 className="text-lg font-bold text-slate-900">Enquiry & Lead Details</h3>
              </div>
              <button onClick={() => setViewingEnquiry(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50">
                <div>
                  <span className="text-slate-500 block text-[11px]">Student Name</span>
                  <strong className="text-slate-800">{viewingEnquiry.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Age</span>
                  <strong className="text-slate-800">{viewingEnquiry.studentAge}</strong>
                </div>
              </div>

              {viewingEnquiry.parentName && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Parent / Guardian</span>
                  <strong className="text-slate-800">{viewingEnquiry.parentName}</strong>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">Phone / WhatsApp</span>
                  <strong className="text-slate-800">{viewingEnquiry.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email</span>
                  <strong className="text-slate-800">{viewingEnquiry.email}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">Selected Class</span>
                  <strong className="text-[#3B0B14]">{viewingEnquiry.course}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Preferred Timing</span>
                  <strong className="text-slate-800">{viewingEnquiry.preferredTime}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Campus</span>
                <strong className="text-slate-800">{viewingEnquiry.branch}</strong>
              </div>

              {viewingEnquiry.notes && (
                <div className="p-3 rounded-xl bg-[#FAF7F2] text-purple-950 text-xs">
                  <span className="font-bold block mb-1">Notes / Special Requests:</span>
                  <p>{viewingEnquiry.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setViewingEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT COURSE */}
      {(isAddingCourse || editingCourse) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCourse ? `Edit Course: ${editingCourse.title}` : "Add New Course"}
              </h3>
              <button
                onClick={() => {
                  setIsAddingCourse(false);
                  setEditingCourse(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Jazz & Broadway Dance"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#B99A63]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="Courses We Offer">Courses We Offer</option>
                    <option value="Other Services We Offer">Other Services We Offer</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={courseForm.badge}
                    onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value })}
                    placeholder="e.g. Popular / RAD Certified"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tuition Fee Display String</label>
                  <input
                    type="text"
                    value={courseForm.fee}
                    onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
                    placeholder="e.g. $80 / month"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Numeric Fee (for sorting)</label>
                  <input
                    type="number"
                    value={courseForm.rawFee}
                    onChange={(e) => setCourseForm({ ...courseForm, rawFee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age Group</label>
                  <input
                    type="text"
                    value={courseForm.ageGroup}
                    onChange={(e) => setCourseForm({ ...courseForm, ageGroup: e.target.value })}
                    placeholder="e.g. Kids & Adults (Ages 6+)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level</label>
                  <input
                    type="text"
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    placeholder="e.g. Beginner to Advanced"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Session Duration</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="e.g. 1 hour per session"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Weekly Frequency</label>
                  <input
                    type="text"
                    value={courseForm.frequency}
                    onChange={(e) => setCourseForm({ ...courseForm, frequency: e.target.value })}
                    placeholder="e.g. 1–2 sessions per week (Online)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Main Photo Uploader with Auto-Compression */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-800 block text-xs">
                      Main Card Cover Photo
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Uploaded photos are automatically resized & compressed in the browser.
                    </p>
                  </div>
                  {isUploadingCourseMedia && (
                    <span className="text-xs text-[#3B0B14] font-semibold animate-pulse">
                      {uploadProgressText || "Processing..."}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200 shadow-sm relative">
                    <img
                      src={courseForm.image || "/images/hero/hero_slide_01.jpg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold text-xs cursor-pointer shadow-sm transition-all tap-bounce">
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Photo from Phone / PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingCourseMedia}
                        onChange={(e) => handleUploadCourseMedia(e, false)}
                      />
                    </label>
                    <input
                      type="text"
                      value={courseForm.image}
                      onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                      placeholder="Or enter image URL directly"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Carousel Slideshow Photos Manager */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-800 block text-xs">
                      Carousel Slideshow Photos ({courseForm.images?.length || 0})
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Add multiple slides for student recitals, costumes, and studio shots.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer transition-all">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slide Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingCourseMedia}
                      onChange={(e) => handleUploadCourseMedia(e, true)}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {(courseForm.images || []).map((slideUrl, sIdx) => (
                    <div key={sIdx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-900">
                      <img src={slideUrl} alt={`Slide ${sIdx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = courseForm.images.filter((_, idx) => idx !== sIdx);
                          setCourseForm({ ...courseForm, images: updated });
                          showToast("Slide photo removed", "info");
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700"
                        title="Remove slide"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white font-bold">
                        #{sIdx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Summary of course benefits..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Syllabus Highlights (1 per line)</label>
                <textarea
                  rows="3"
                  value={courseForm.syllabusText}
                  onChange={(e) => setCourseForm({ ...courseForm, syllabusText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCourse(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TEACHER */}
      {(isAddingTeacher || editingTeacher) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingTeacher ? `Edit Profile: ${editingTeacher.name}` : "Add Faculty Member"}
              </h3>
              <button
                onClick={() => {
                  setIsAddingTeacher(false);
                  setEditingTeacher(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Faculty Name *</label>
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Title</label>
                  <input
                    type="text"
                    value={teacherForm.role}
                    onChange={(e) => setTeacherForm({ ...teacherForm, role: e.target.value })}
                    placeholder="e.g. Senior Violin Mistress"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={teacherForm.department}
                    onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Dance">Dance</option>
                    <option value="Music">Music</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience</label>
                  <input
                    type="text"
                    value={teacherForm.experience}
                    onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                    placeholder="e.g. 10+ Years Experience"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Accreditations / Degrees</label>
                  <input
                    type="text"
                    value={teacherForm.qualifications}
                    onChange={(e) => setTeacherForm({ ...teacherForm, qualifications: e.target.value })}
                    placeholder="e.g. Royal Academy of Dance, Juilliard"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Core Specialisation</label>
                <input
                  type="text"
                  value={teacherForm.specialisation}
                  onChange={(e) => setTeacherForm({ ...teacherForm, specialisation: e.target.value })}
                  placeholder="e.g. Classical Ballet & Pointe"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Photo URL</label>
                <input
                  type="url"
                  value={teacherForm.photo}
                  onChange={(e) => setTeacherForm({ ...teacherForm, photo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Biography</label>
                <textarea
                  rows="3"
                  value={teacherForm.bio}
                  onChange={(e) => setTeacherForm({ ...teacherForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Classes Taught (comma separated)</label>
                <input
                  type="text"
                  value={teacherForm.classesText}
                  onChange={(e) => setTeacherForm({ ...teacherForm, classesText: e.target.value })}
                  placeholder="e.g. Classical Ballet, Little Steps"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTeacher(false);
                    setEditingTeacher(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TIMETABLE */}
      {(isAddingTimetable || editingTimetable) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingTimetable ? "Edit Scheduled Slot" : "Add Class Slot to Timetable"}
              </h3>
              <button
                onClick={() => {
                  setIsAddingTimetable(false);
                  setEditingTimetable(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTimetable} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Day of Week</label>
                  <select
                    value={timetableForm.day}
                    onChange={(e) => setTimetableForm({ ...timetableForm, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Range</label>
                  <input
                    type="text"
                    required
                    value={timetableForm.time}
                    onChange={(e) => setTimetableForm({ ...timetableForm, time: e.target.value })}
                    placeholder="e.g. 05:00 PM - 06:00 PM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={timetableForm.course}
                  onChange={(e) => setTimetableForm({ ...timetableForm, course: e.target.value })}
                  placeholder="e.g. Classical Ballet (Grade 1)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Instructor</label>
                  <input
                    type="text"
                    required
                    value={timetableForm.teacher}
                    onChange={(e) => setTimetableForm({ ...timetableForm, teacher: e.target.value })}
                    placeholder="e.g. Elena Vance"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Studio Room</label>
                  <input
                    type="text"
                    required
                    value={timetableForm.room}
                    onChange={(e) => setTimetableForm({ ...timetableForm, room: e.target.value })}
                    placeholder="e.g. Studio A (Lilac Floor)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={timetableForm.category}
                    onChange={(e) => setTimetableForm({ ...timetableForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Dance">Dance</option>
                    <option value="Music">Music</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age Group</label>
                  <input
                    type="text"
                    value={timetableForm.ageGroup}
                    onChange={(e) => setTimetableForm({ ...timetableForm, ageGroup: e.target.value })}
                    placeholder="Kids (6-9)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level</label>
                  <input
                    type="text"
                    value={timetableForm.level}
                    onChange={(e) => setTimetableForm({ ...timetableForm, level: e.target.value })}
                    placeholder="Beginner"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTimetable(false);
                    setEditingTimetable(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold"
                >
                  Save Timetable Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GALLERY MEDIA */}
      {isAddingGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Gallery Media</h3>
              <button onClick={() => setIsAddingGallery(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Moment / Event Title *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. Winter Chamber Strings Concert"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Performances">Performances</option>
                    <option value="Dance">Dance</option>
                    <option value="Music">Music</option>
                    <option value="Kids Spotlight">Kids Spotlight</option>
                    <option value="Studio Life">Studio Life</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Media Type</label>
                  <select
                    value={galleryForm.type}
                    onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video (Embed)</option>
                  </select>
                </div>
              </div>

              {/* Direct File Upload & Preview */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2]/70 border border-[#B99A63]/30/80 space-y-2">
                <label className="font-bold text-purple-900 block text-xs flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-[#B99A63]" />
                  <span>Choose Media File from Computer (Photos / Recital Clips)</span>
                </label>
                <input
                  type="file"
                  accept={galleryForm.type === "photo" ? "image/*" : "video/*,image/*"}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      showToast("Uploading media...", "info");
                      const res = await uploadMediaToBucket("gallery-media", file);
                      if (res.url) {
                        setGalleryForm({ ...galleryForm, url: res.url });
                        showToast("Media uploaded successfully!", "success");
                      }
                    }
                  }}
                  className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                />
              </div>

              {galleryForm.url && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-black/90 flex items-center justify-center border border-slate-200">
                  <img
                    src={galleryForm.url}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                    Upload Preview
                  </span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Or Media CDN URL *</label>
                <input
                  type="url"
                  required
                  value={galleryForm.url}
                  onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              {galleryForm.type === "video" && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Video Embed URL (YouTube embed)</label>
                  <input
                    type="url"
                    value={galleryForm.videoUrl}
                    onChange={(e) => setGalleryForm({ ...galleryForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Caption / Story</label>
                <textarea
                  rows="2"
                  value={galleryForm.caption}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  placeholder="Short description of this performance or event..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingGallery(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold"
                >
                  Publish to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: EDIT FAQ ITEM */}
      {editingFaqIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit FAQ Question &amp; Answer</h3>
              <button onClick={() => setEditingFaqIdx(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Question</label>
                <input
                  type="text"
                  value={faqQuestionDraft}
                  onChange={(e) => setFaqQuestionDraft(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={faqAnswerDraft}
                  onChange={(e) => setFaqAnswerDraft(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFaqIdx(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...(faqs || [])];
                    updated[editingFaqIdx] = {
                      ...updated[editingFaqIdx],
                      question: faqQuestionDraft,
                      answer: faqAnswerDraft
                    };
                    updateFaqs(updated);
                    setEditingFaqIdx(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold"
                >
                  Save FAQ Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW STUDENT HOMEWORK */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-[#B99A63] uppercase">Student Practice Review</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedReview.studentName}</h3>
              </div>
              <button onClick={() => setSelectedReview(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <span className="text-slate-500 block text-[11px]">Item / Exercise:</span>
                <strong className="text-slate-900 text-sm block">{selectedReview.title}</strong>
                <a
                  href={selectedReview.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#B99A63] hover:text-purple-800 font-bold underline mt-1"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Open Video Rehearsal Link</span>
                </a>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Dr. Malavika's Feedback (Musculoskeletal Alignment, Aramandi, Talam):
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Ensure the spine remains straight during the Adavu jumps. Great speed precision..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentReviews(
                      studentReviews.map((r) =>
                        r.id === selectedReview.id
                          ? { ...r, feedback: feedbackInput, status: "reviewed" }
                          : r
                      )
                    );
                    setSelectedReview(null);
                    showToast("Feedback sent directly to student portal!", "success");
                  }}
                  className="px-5 py-2 rounded-xl bg-[#151515] hover:bg-[#3B0B14] text-white font-bold"
                >
                  Publish Guru Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
