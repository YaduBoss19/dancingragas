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
  Edit3,
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
  UserCheck,
  Star,
  Camera,
  Play,
  ArrowRight
} from "lucide-react";
import UniversalVideoPlayer from "../components/UniversalVideoPlayer";
import TuitionReceiptModal from "../components/TuitionReceiptModal";
import { formatVideoEmbedUrl } from "../utils/videoUtils";

export default function AdminDashboard() {
  const {
    isAdminLoggedIn,
    userRole,
    authUser,
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
    updateGalleryItem,
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
    liveClassSchedules,
    addLiveClassSchedule,
    updateLiveClassSchedule,
    deleteLiveClassSchedule,
    studentAssessments,
    gradeAssessment,
    studentsList,
    addStudent,
    deleteStudent,
    addStudentToCourse,
    removeStudentFromCourse,
    studyMaterials,
    addStudyMaterial,
    deleteStudyMaterial,
    setActiveStudentId,
    siteContent,
    updateSection,
    updateSiteContent
  } = useAcademy();

  const isFaculty = userRole === "tutor";

  const [passwordInput, setPasswordInput] = useState("");
  const [workspaceMode, setWorkspaceMode] = useState(isFaculty ? "academic" : "admissions"); // 'academic' | 'admissions'
  const [activeTab, setActiveTab] = useState(isFaculty ? "course_areas" : "site_cms");

  // Tutor Workspace Tabs (Classes & Students)
  const academicTabs = [
    { id: "live_studio", label: "Live Classes & Google Meet", count: null, icon: Video, desc: "Schedule Google Meet classes by batch" },
    { id: "course_areas", label: "Course Videos & Lessons", count: (recordings || []).length, icon: Film, desc: "Class recordings & video access" },
    { id: "students_dir", label: "Students Directory & Courses", count: (studentsList || []).length, icon: Users, desc: "Student list & course enrollments" },
    { id: "materials_cms", label: "Study Materials & PDFs", count: (studyMaterials || []).length, icon: FileText, desc: "Upload slokas, theory notes & PDFs" },
    { id: "assessments", label: "Student Submissions & Grading", count: (studentAssessments || []).length, icon: Award, desc: "Review practice videos & provide grades" }
  ];

  // Admin Workspace Tabs (Website & Academy Settings)
  const admissionsTabs = [
    { id: "site_cms", label: "Website Content & Media", count: null, icon: Sparkles, desc: "Edit text, photos & videos across the public website" },
    { id: "courses", label: "Course Catalog & Galleries", count: (courses || []).length, icon: BookOpen, desc: "Create courses, upload photo galleries & details" },
    { id: "gallery_cms", label: "Photo & Video Gallery", count: (gallery || []).length, icon: Film, desc: "Manage photos & videos in public gallery" },
    { id: "enquiries", label: "Student Inquiries & Leads", count: (enquiries || []).length, icon: MessageSquare, desc: "Inquiries pipeline & direct WhatsApp contact" }
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
  const [receiptStudent, setReceiptStudent] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: "",
    courseCategory: "Bharatanatyam Diploma",
    module: "Module 01: Foundational Adavu Biomechanics",
    duration: "60 mins",
    embedUrl: "",
    description: "",
    syllabusText: "",
    accessScope: "course_enrolled",
    allowedStudentIds: []
  });

  // Add Student Modal State
  const [isAddingStudentModal, setIsAddingStudentModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: "",
    refNo: "",
    category: "Theory & Sanskrit Slokas",
    courseCategory: "Bharatanatyam Diploma",
    fileUrl: "",
    size: "3.2 MB",
    verified: "Dr. Malavika M. Sunil (MBBS)"
  });
  const [isAddingMaterialModal, setIsAddingMaterialModal] = useState(false);
  const [isAddingScheduleModal, setIsAddingScheduleModal] = useState(false);
  const [newScheduleForm, setNewScheduleForm] = useState({
    courseCategory: "Bharatanatyam Diploma",
    batchName: "Online Bharatanatyam Diploma (Sunday Morning)",
    sessionTitle: "Bharatanatyam Diploma: Margam Jathiswaram Precision",
    scheduledDayTime: "Sunday, 05:00 PM IST / 07:30 AM EST",
    targetTimestamp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    meetUrl: "https://meet.google.com/dnc-ragas-live",
    meetingId: "dnc-ragas-live",
    passcode: "RAGAS2026",
    instructor: "Dr. Malavika M. Sunil (MBBS)",
    notice: "Keep ghungroos ready. We will conduct Araimandi knee alignment checks."
  });
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

  // Batch Live Class Scheduler state
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [batchScheduleForm, setBatchScheduleForm] = useState({
    courseCategory: "Bharatanatyam Diploma",
    batchName: "Online Bharatanatyam Diploma (Sunday Morning)",
    sessionTitle: "Bharatanatyam Diploma: Margam Jathiswaram & Adavu Precision",
    instructor: "Dr. Malavika M. Sunil (MBBS)",
    scheduledDayTime: "Sunday, 05:00 PM IST / 07:30 AM EST",
    targetTimestamp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    meetUrl: "https://meet.google.com/dnc-ragas-live",
    meetingId: "dnc-ragas-live",
    passcode: "RAGAS2026",
    status: "Confirmed",
    notice: "Keep ghungroos ready. We will conduct Araimandi knee alignment checks before Jathiswaram Korvai 3.",
    assignedScope: "all_batch"
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

  // ═════════════════════════════════════════════════════════════════
  // MASTER WEBSITE & MEDIA STUDIO EDITABLE STATES
  // ═════════════════════════════════════════════════════════════════
  const [heroForm, setHeroForm] = useState({
    videoUrl: siteContent?.hero?.videoUrl || "/videos/performance.mp4",
    posterUrl: siteContent?.hero?.posterUrl || "/images/hero/hero_slide_01.jpg",
    badge: siteContent?.hero?.badge || "Physician (MBBS) & 21-Year Margam Lineage",
    titleLine1: siteContent?.hero?.titleLine1 || "Your Passion.",
    titleLine2: siteContent?.hero?.titleLine2 || "Your Pace.",
    titleAccent: siteContent?.hero?.titleAccent || "Your Personal Coach.",
    subtitle: siteContent?.hero?.subtitle || "Physician-led classical Bharatanatyam Margam, Carnatic vocal music, and anatomical movement safety mentored directly by Dr. Malavika M. Sunil."
  });

  const [aboutForm, setAboutForm] = useState({
    title: siteContent?.about?.title || "Dr. Malavika M. Sunil",
    doctorCredentials: siteContent?.about?.doctorCredentials || "MBBS Physician & Classical Dancer",
    badge: siteContent?.about?.badge || "Principal Guru & Physician",
    intro: siteContent?.about?.intro || "Bridging 21 years of sacred Natyashastra Margam discipline with modern anatomical movement kinesiology.",
    portraitImage: siteContent?.about?.portraitImage || "/images/malavika_dance_stage.jpg",
    philosophy: siteContent?.about?.philosophy || "No two bodies or voices are identical. In our dedicated coaching, we discard one-size-fits-all pressures. We progress at your exact pace, aligning rhythm, anatomy, and soulful expression so you truly own your art.",
    bio1: siteContent?.about?.bio1 || "Welcome to a private space where classical dance and music are taught as living arts. I began my Bharatanatyam journey over 21 years ago under my father and master guru, Dr. Sunil Nellay, and trained for 16+ years in Carnatic vocal music under my mother, Resmi Narayanan. At age 12, I was honored with the prestigious CCRT National Scholarship by the Government of India.",
    bio2: siteContent?.about?.bio2 || "As a medical doctor (MBBS), I approach pedagogy with scientific depth. Every movement, posture, and mudra is guided with an understanding of human anatomy and biomechanics — teaching safe knee alignment in Araimandi, core engagement, and physical longevity.",
    bio3: siteContent?.about?.bio3 || "Beyond technique lies the heart of art: Bhava and Raga. Whether coaching an aspiring soloist, preparing for yearly diploma examinations, or guiding an adult returning to their childhood dream, each student receives meticulous 1-on-1 focus."
  });

  const [tickerAnnouncement, setTickerAnnouncement] = useState(
    siteContent?.ticker?.announcementText || "ADMISSIONS OPEN 2026/27: Online Bharatanatyam Diploma (Yearly Exams & Certificates) • Carnatic Classical Vocal Coaching • 1-on-1 Consultations"
  );

  const [infoForm, setInfoForm] = useState({
    whatsappNumber: academyInfo?.whatsappNumber || "+919074585672",
    directPhone: academyInfo?.directPhone || "+91 90745 85672",
    email: academyInfo?.email || "info@malavikasunil.com",
    tagline: academyInfo?.tagline || "Your Passion. Your Pace. Your Personal Coach.",
    instagramUrl: academyInfo?.instagramUrl || "https://www.instagram.com/dancingragasbymalavika/",
    instagramHandle: academyInfo?.instagramHandle || "@dancingragasbymalavika"
  });

  // FAQs State
  const [faqsList, setFaqsList] = useState(faqs || FAQS);
  const [editingFaqIdx, setEditingFaqIdx] = useState(null);
  const [faqQuestionDraft, setFaqQuestionDraft] = useState("");
  const [faqAnswerDraft, setFaqAnswerDraft] = useState("");
  const [isAddingFaqModal, setIsAddingFaqModal] = useState(false);

  // Student & Parent Stories (Testimonials) State
  const [storiesList, setStoriesList] = useState(testimonials || []);
  const [isAddingStoryModal, setIsAddingStoryModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyForm, setStoryForm] = useState({
    name: "",
    role: "Bharatanatyam Diploma Disciple",
    location: "London, UK",
    quote: "",
    rating: 5
  });

  // Instagram Feed State
  const [instagramList, setInstagramList] = useState(siteContent?.instagram || []);
  const [isAddingInstaModal, setIsAddingInstaModal] = useState(false);
  const [editingInsta, setEditingInsta] = useState(null);
  const [instaForm, setInstaForm] = useState({
    title: "",
    caption: "",
    category: "stage",
    type: "reel",
    imageUrl: "/images/instagram/insta_01.jpg",
    videoUrl: "/videos/recital_live_01.mp4",
    likes: "3.2k",
    comments: "140",
    tag: "Stage Shows",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  });

  // Performance & Gallery Stream State
  const [isAddingGalleryModal, setIsAddingGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "Performances",
    type: "image", // 'image' | 'video'
    url: "/images/gallery/gallery_01.jpg",
    videoUrl: "/videos/performance.mp4",
    caption: ""
  });

  // Upload Progress & Loading
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState("");

  // Course Edit Modal State
  const [editingCourse, setEditingCourse] = useState(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
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
    image: "/images/courses/course_bharatanatyam_diploma.jpg",
    images: [],
    videoUrl: "/videos/performance.mp4",
    description: "",
    syllabusText: ""
  });

  // Enquiries Search & Filter
  const [enquirySearchQuery, setEnquirySearchQuery] = useState("");
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState("All");

  // Handlers for Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === "tutor123" || passwordInput === "faculty123") {
      loginAdmin && loginAdmin("admin123");
      showToast("Authenticated as Faculty Guru. Welcome to Faculty Desk!", "success");
    } else {
      const ok = loginAdmin(passwordInput);
      if (ok) {
        showToast("Authenticated as Academy Directorate. Welcome Dr. Malavika!", "success");
      } else {
        showToast("Incorrect passcode. Try 'admin123' for Directorate or 'tutor123' for Faculty.", "error");
      }
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // MEDIA UPLOADER HELPERS (USING SUPABASE STORAGE BUCKET 'academy-media')
  // ═════════════════════════════════════════════════════════════════
  const handleUploadHeroMedia = async (e, targetField) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMedia(true);
      setUploadStatusText("Processing media for hero section...");
      if (file.type.startsWith("image/")) {
        const compressed = await compressImageFile(file, 1920, 0.88);
        const res = await uploadMediaToBucket("academy-media", compressed.file, "hero");
        const finalUrl = res.url || compressed.dataUrl;
        setHeroForm((prev) => ({ ...prev, [targetField]: finalUrl }));
        showToast("Hero poster image uploaded and optimized successfully!", "success");
      } else {
        const res = await uploadMediaToBucket("academy-media", file, "hero");
        setHeroForm((prev) => ({ ...prev, [targetField]: res.url }));
        showToast("Hero ambient video uploaded successfully to cloud!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload media.", "error");
    } finally {
      setIsUploadingMedia(false);
      setUploadStatusText("");
      e.target.value = "";
    }
  };

  const handleUploadAboutPortrait = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMedia(true);
      setUploadStatusText("Compressing portrait photo...");
      const compressed = await compressImageFile(file, 1200, 0.90);
      const res = await uploadMediaToBucket("academy-media", compressed.file, "about");
      const finalUrl = res.url || compressed.dataUrl;
      setAboutForm((prev) => ({ ...prev, portraitImage: finalUrl }));
      showToast("Dr. Malavika's stage portrait updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload portrait.", "error");
    } finally {
      setIsUploadingMedia(false);
      setUploadStatusText("");
      e.target.value = "";
    }
  };

  const handleUploadGalleryMedia = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMedia(true);
      setUploadStatusText("Uploading gallery media to storage...");
      if (file.type.startsWith("image/")) {
        const compressed = await compressImageFile(file, 1600, 0.88);
        const res = await uploadMediaToBucket("academy-media", compressed.file, "gallery");
        const finalUrl = res.url || compressed.dataUrl;
        setGalleryForm((prev) => ({ ...prev, url: finalUrl, type: "image" }));
        showToast("Gallery photo optimized and staged for publishing!", "success");
      } else {
        const res = await uploadMediaToBucket("academy-media", file, "gallery");
        setGalleryForm((prev) => ({ ...prev, videoUrl: res.url, url: res.url, type: "video" }));
        showToast("Gallery performance video uploaded to storage!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload gallery media.", "error");
    } finally {
      setIsUploadingMedia(false);
      setUploadStatusText("");
      e.target.value = "";
    }
  };

  const handleUploadInstaMedia = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMedia(true);
      setUploadStatusText("Compressing Instagram photo/reel...");
      if (file.type.startsWith("image/")) {
        const compressed = await compressImageFile(file, 1200, 0.88);
        const res = await uploadMediaToBucket("academy-media", compressed.file, "instagram");
        const finalUrl = res.url || compressed.dataUrl;
        setInstaForm((prev) => ({ ...prev, imageUrl: finalUrl }));
        showToast("Instagram media uploaded successfully!", "success");
      } else {
        const res = await uploadMediaToBucket("academy-media", file, "instagram");
        setInstaForm((prev) => ({ ...prev, videoUrl: res.url, type: "reel" }));
        showToast("Instagram reel video uploaded!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload Instagram media.", "error");
    } finally {
      setIsUploadingMedia(false);
      setUploadStatusText("");
      e.target.value = "";
    }
  };

  // Master Publish Function
  const handlePublishAllSiteContent = () => {
    const updatedContent = {
      ...(siteContent || {}),
      hero: {
        ...(siteContent?.hero || {}),
        ...heroForm
      },
      about: {
        ...(siteContent?.about || {}),
        ...aboutForm,
        paragraphs: [aboutForm.bio1, aboutForm.bio2, aboutForm.bio3].filter(Boolean)
      },
      ticker: {
        announcementText: tickerAnnouncement
      },
      instagram: instagramList,
      brand: {
        ...(siteContent?.brand || {}),
        ...infoForm
      }
    };

    updateSiteContent(updatedContent);
    updateAcademyInfo(infoForm);
    updateFaqs(faqsList);
    updateTestimonials(storiesList);
    showToast("Master Website & Media changes published live across the academy!", "success");
  };

  // Course handlers
  const openEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      category: course.category || "Courses We Offer",
      ageGroup: course.ageGroup || "Children, Teens & Adults",
      level: course.level || "Foundation to Diploma",
      fee: course.fee || "Enrolment Open",
      rawFee: course.rawFee || 0,
      duration: course.duration || "1 hour per session",
      frequency: course.frequency || "1–2 sessions per week (Online)",
      badge: course.badge || "Diploma & Certification",
      image: course.image || "/images/courses/course_bharatanatyam_diploma.jpg",
      images: Array.isArray(course.images) ? [...course.images] : [course.image].filter(Boolean),
      videoUrl: course.videoUrl || "/videos/performance.mp4",
      description: course.description || "",
      syllabusText: (course.syllabus || []).join("\n")
    });
    setIsAddingCourse(false);
  };

  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: "",
      category: "Courses We Offer",
      ageGroup: "Children, Teens & Adults",
      level: "Foundation to Diploma",
      fee: "Enrolment Open",
      rawFee: 0,
      duration: "1 hour per session",
      frequency: "1–2 sessions per week (Online)",
      badge: "Diploma & Certification",
      image: "/images/courses/course_bharatanatyam_diploma.jpg",
      images: [
        "/images/hero/hero_slide_01.jpg",
        "/images/hero/hero_slide_02.jpg",
        "/images/hero/hero_slide_03.jpg",
        "/images/hero/hero_slide_04.jpg",
        "/images/hero/hero_slide_05.jpg"
      ],
      videoUrl: "/videos/performance.mp4",
      description: "",
      syllabusText: "Module 1: Basic Adavus\nModule 2: Hastha Mudras\nModule 3: Tala & Laya Precision"
    });
    setIsAddingCourse(true);
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
      videoUrl: formatVideoEmbedUrl(courseForm.videoUrl || ""),
      description: courseForm.description,
      syllabus: courseForm.syllabusText.split("\n").map((s) => s.trim()).filter(Boolean)
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, payload);
      setEditingCourse(null);
      showToast("Course details and 5-slide gallery updated!", "success");
    } else {
      addCourse(payload);
      setIsAddingCourse(false);
      showToast("New course published to catalog!", "success");
    }
  };

  // IF NOT LOGGED IN: Render Luxury Portal Authentication Screen
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
              Academy Portal Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              DancingRagas <span className="text-[#D4AF37]">Suites</span>
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              Authorized access for Dr. Malavika (Directorate) and Academy Faculty (Gurus) to govern curriculum, manage media, and grade disciples.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-200">Security Passcode</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B99A63] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter passcode ('admin123' or 'tutor123')"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#B99A63]/30 bg-[#121212] text-white text-sm placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="silk-zari-btn w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#1E050B] font-bold text-sm shadow-lg shadow-[#D4AF37]/20 hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2 tap-bounce"
            >
              <span>Authenticate &amp; Enter Portal</span>
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
  // LOGGED IN WORKSPACE: FACULTY GURU DESK vs DIRECTORATE SUITE
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#151515] font-sans pb-24 text-left">
      {/* APP TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#1E050B] text-[#F5F0E8] border-b border-[#B99A63]/30 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B0B14] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center font-serif-luxury font-bold text-base shadow-sm">
              DR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wide font-serif-luxury">
                  {isFaculty ? (
                    <>DancingRagas <span className="text-[#D4AF37]">Tutor Portal</span></>
                  ) : (
                    <>DancingRagas <span className="text-[#D4AF37]">Admin Dashboard</span></>
                  )}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  {isFaculty ? "Tutor Active" : "Admin Active"}
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                {isFaculty
                  ? "Tutor Workspace • Live Classes, Student Video Feedback & PDF Notes"
                  : "Admin Workspace • Website Content, Courses, Student Directory & CRM"}
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
              <span>Switch to Student Portal</span>
            </button>

            <button
              onClick={() => navigateTo("home")}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-stone-300 border border-white/10 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Preview Website</span>
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

      {/* METRICS OVERVIEW BAR */}
      <section className="bg-gradient-to-r from-[#1E050B] via-[#3D0B16] to-[#1E050B] text-[#F5F0E8] py-8 px-4 sm:px-8 border-b border-[#B99A63]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Students</span>
            <span className="text-2xl font-bold font-serif-luxury text-white">{(studentsList || []).length}</span>
            <span className="text-[10px] text-emerald-400 block mt-1">Active Students</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Courses</span>
            <span className="text-2xl font-bold font-serif-luxury text-white">{(courses || []).length}</span>
            <span className="text-[10px] text-[#D4AF37] block mt-1">Available Courses</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Course Videos</span>
            <span className="text-2xl font-bold font-serif-luxury text-white">{(recordings || []).length}</span>
            <span className="text-[10px] text-sky-400 block mt-1">Video Lessons</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Submissions</span>
            <span className="text-2xl font-bold font-serif-luxury text-white">{(studentAssessments || []).length}</span>
            <span className="text-[10px] text-amber-400 block mt-1">Graded Assessments</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1D1D1D]/90 border border-[#B99A63]/20 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Inquiries</span>
            <span className="text-2xl font-bold font-serif-luxury text-[#D4AF37]">{(enquiries || []).length}</span>
            <span className="text-[10px] text-emerald-400 block mt-1">New Leads</span>
          </div>
        </div>
      </section>

      {/* WORKSPACE MODE SWITCHER (FOR ADMIN) */}
      {!isFaculty && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
          <div className="p-1.5 rounded-2xl bg-stone-200/60 border border-stone-300 max-w-md flex items-center gap-1">
            <button
              onClick={() => {
                setWorkspaceMode("admissions");
                setActiveTab("site_cms");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                workspaceMode === "admissions"
                  ? "bg-[#1E050B] text-[#D4AF37] shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Workspace</span>
            </button>

            <button
              onClick={() => {
                setWorkspaceMode("academic");
                setActiveTab("live_studio");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                workspaceMode === "academic"
                  ? "bg-[#1E050B] text-[#D4AF37] shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Tutor Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* TABS NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
          {(workspaceMode === "academic" ? academicTabs : admissionsTabs).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#1E050B] text-white shadow-md border border-[#B99A63]/50"
                    : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#D4AF37]" : "text-stone-500"}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? "bg-[#D4AF37] text-[#1E050B]" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TAB CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* ═══════════════════════════════════════════════════════════════
            TAB: MASTER WEBSITE & MEDIA STUDIO (DIRECTORATE)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "site_cms" && (
          <div className="space-y-8 text-left">
            {/* Studio Header Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E050B] via-[#3D0B16] to-[#1E050B] text-white border border-[#B99A63]/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1E050B] text-[10px] font-bold uppercase tracking-wider">
                    Academy Directorate Master Studio
                  </span>
                  <span className="text-xs text-stone-300">Complete Zero-Code Website CMS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                  Live Website Content &amp; Media Studio
                </h3>
                <p className="text-xs text-stone-300 max-w-xl">
                  Centralized control for Dr. Malavika to replace hero videos, artist portraits, announcements, disciple stories, and FAQs. Connected directly to Supabase storage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePublishAllSiteContent}
                  className="silk-zari-btn px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#1E050B] text-xs font-bold shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer tap-bounce"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1E050B]" />
                  <span>Publish All Changes Live</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo("home")}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Preview Website</span>
                </button>
              </div>
            </div>

            {/* SECTIONS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 1. CINEMATIC HERO MEDIA & HEADINGS */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#3D0B16] text-[#D4AF37] flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-serif-luxury text-base">Hero Section Media &amp; Headlines</h4>
                    <p className="text-[11px] text-stone-500">Full-bleed ambient video background, poster fallback &amp; pitch</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Hero Video Preview & Uploader */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-800">Ambient Background Video</label>
                      <span className="text-[10px] text-stone-500">Muted Loop on Homepage</span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden aspect-video bg-black max-h-40 border border-stone-300">
                      <video
                        src={heroForm.videoUrl}
                        poster={heroForm.posterUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <label className="silk-zari-btn px-4 py-2 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                        <Video className="w-3.5 h-3.5" />
                        <span>Upload Video File (Supabase)</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleUploadHeroMedia(e, "videoUrl")}
                        />
                      </label>
                      <input
                        type="text"
                        value={heroForm.videoUrl}
                        onChange={(e) => setHeroForm({ ...heroForm, videoUrl: e.target.value })}
                        placeholder="Or enter direct video URL / MP4"
                        className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Hero Poster Preview & Uploader */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-800">Poster Fallback Image</label>
                      <span className="text-[10px] text-stone-500">Instant Load Photo</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-stone-300">
                        <img src={heroForm.posterUrl} alt="Hero Poster" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-[11px] cursor-pointer shadow-xs">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Replace Poster (Supabase)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleUploadHeroMedia(e, "posterUrl")}
                          />
                        </label>
                        <input
                          type="text"
                          value={heroForm.posterUrl}
                          onChange={(e) => setHeroForm({ ...heroForm, posterUrl: e.target.value })}
                          placeholder="Or enter photo URL"
                          className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Headlines */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Hero Lineage Badge</label>
                      <input
                        type="text"
                        value={heroForm.badge}
                        onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Title Line 1</label>
                        <input
                          type="text"
                          value={heroForm.titleLine1}
                          onChange={(e) => setHeroForm({ ...heroForm, titleLine1: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Title Line 2</label>
                        <input
                          type="text"
                          value={heroForm.titleLine2}
                          onChange={(e) => setHeroForm({ ...heroForm, titleLine2: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Title Gold Accent Pitch</label>
                      <input
                        type="text"
                        value={heroForm.titleAccent}
                        onChange={(e) => setHeroForm({ ...heroForm, titleAccent: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Hero Subtitle Narrative</label>
                      <textarea
                        rows={2}
                        value={heroForm.subtitle}
                        onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. ABOUT DR. MALAVIKA (PORTRAIT + BIO + PHILOSOPHY) */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#3D0B16] text-[#D4AF37] flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-serif-luxury text-base">About Section: Dr. Malavika Profile</h4>
                    <p className="text-[11px] text-stone-500">Stage portrait, medical credentials, bio paragraphs &amp; philosophy</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Portrait Photo Uploader */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <label className="font-bold text-stone-800 block">Dr. Malavika Stage Portrait Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-24 rounded-2xl overflow-hidden bg-stone-900 shrink-0 border border-stone-300 shadow-sm">
                        <img src={aboutForm.portraitImage} alt="Dr. Malavika Portrait" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs">
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload New Stage Portrait (Supabase)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadAboutPortrait}
                          />
                        </label>
                        <input
                          type="text"
                          value={aboutForm.portraitImage}
                          onChange={(e) => setAboutForm({ ...aboutForm, portraitImage: e.target.value })}
                          placeholder="Or enter portrait image URL"
                          className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Artist / Doctor Name</label>
                      <input
                        type="text"
                        value={aboutForm.title}
                        onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Medical &amp; Art Credentials</label>
                      <input
                        type="text"
                        value={aboutForm.doctorCredentials}
                        onChange={(e) => setAboutForm({ ...aboutForm, doctorCredentials: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Pedagogical Philosophy Statement</label>
                    <textarea
                      rows={2}
                      value={aboutForm.philosophy}
                      onChange={(e) => setAboutForm({ ...aboutForm, philosophy: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Bio Paragraph 1 (Classical Lineage)</label>
                    <textarea
                      rows={2}
                      value={aboutForm.bio1}
                      onChange={(e) => setAboutForm({ ...aboutForm, bio1: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Bio Paragraph 2 (MBBS Medical &amp; Biomechanics)</label>
                    <textarea
                      rows={2}
                      value={aboutForm.bio2}
                      onChange={(e) => setAboutForm({ ...aboutForm, bio2: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. ACADEMY ANNOUNCEMENTS TICKER & FAQS */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#3D0B16] text-[#D4AF37] flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-serif-luxury text-base">Announcements &amp; FAQs</h4>
                    <p className="text-[11px] text-stone-500">Header scrolling marquee ticker &amp; public admissions questions</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Header Scrolling Marquee Ticker Text</label>
                    <textarea
                      rows={2}
                      value={tickerAnnouncement}
                      onChange={(e) => setTickerAnnouncement(e.target.value)}
                      placeholder="ADMISSIONS OPEN 2026/27..."
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                    />
                  </div>

                  {/* FAQs Manager */}
                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">Frequently Asked Questions ({faqsList.length})</span>
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
                          showToast("New FAQ added successfully!", "success");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add FAQ</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {faqsList.map((faq, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <p className="font-bold text-stone-900">{faq.question}</p>
                            <p className="text-stone-600 text-[11px] line-clamp-2">{faq.answer}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = faqsList.filter((_, i) => i !== idx);
                              setFaqsList(updated);
                              updateFaqs(updated);
                              showToast("FAQ removed.", "info");
                            }}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer shrink-0"
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

              {/* 4. STUDENT & PARENT STORIES (TESTIMONIALS) */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#3D0B16] text-[#D4AF37] flex items-center justify-center font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-bold text-stone-900 font-serif-luxury text-base">Student &amp; Parent Stories</h4>
                      <p className="text-[11px] text-stone-500">Verified reviews displayed on the public website</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingStory(null);
                      setStoryForm({
                        name: "",
                        role: "Bharatanatyam Diploma Disciple",
                        location: "London, UK",
                        quote: "",
                        rating: 5
                      });
                      setIsAddingStoryModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Story</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
                  {storiesList.map((story, idx) => (
                    <div key={story.id || idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{story.name}</span>
                          <span className="text-[10px] text-[#B99A63] font-semibold">&bull; {story.role}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: story.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-stone-600 text-[11px] italic leading-relaxed line-clamp-2">
                          &ldquo;{story.quote}&rdquo;
                        </p>
                        <span className="text-[10px] text-stone-400 block">{story.location}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = storiesList.filter((_, i) => i !== idx);
                          setStoriesList(updated);
                          updateTestimonials(updated);
                          showToast("Story deleted.", "info");
                        }}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer shrink-0"
                        title="Delete Story"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. INSTAGRAM FEED STUDIO */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#3D0B16] text-[#D4AF37] flex items-center justify-center font-bold text-sm">5</div>
                    <div>
                      <h4 className="font-bold text-stone-900 font-serif-luxury text-base">Instagram Grid &amp; Reels Manager</h4>
                      <p className="text-[11px] text-stone-500">Live reels &amp; stage snapshots displayed in the homepage social wall</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingInsta(null);
                      setInstaForm({
                        title: "",
                        caption: "",
                        category: "stage",
                        type: "reel",
                        imageUrl: "/images/instagram/insta_01.jpg",
                        videoUrl: "/videos/recital_live_01.mp4",
                        likes: "3.5k",
                        comments: "150",
                        tag: "Stage Shows",
                        instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
                      });
                      setIsAddingInstaModal(true);
                    }}
                    className="silk-zari-btn px-4 py-2 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Instagram Post/Reel</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {instagramList.map((item, idx) => (
                    <div key={item.id || idx} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 flex flex-col justify-between shadow-xs">
                      <div className="relative aspect-square bg-stone-900">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                          {item.type === "reel" ? "Reel" : "Post"}
                        </div>
                        <div className="absolute bottom-2 left-2 text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          ❤️ {item.likes}
                        </div>
                      </div>

                      <div className="p-3 text-xs space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-stone-900 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{item.caption}</p>
                        </div>

                        <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                          <label className="text-[11px] font-bold text-[#1E050B] hover:underline cursor-pointer">
                            Replace Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  showToast("Uploading replacement photo to Supabase...", "info");
                                  const comp = await compressImageFile(file, 1200, 0.88);
                                  const res = await uploadMediaToBucket("academy-media", comp.file, "instagram");
                                  const finalUrl = res.url || comp.dataUrl;
                                  const updated = instagramList.map((it, i) => i === idx ? { ...it, imageUrl: finalUrl } : it);
                                  setInstagramList(updated);
                                  updateSection("instagram", updated);
                                  showToast("Instagram photo replaced and published!", "success");
                                } catch (err) {
                                  showToast("Failed to upload photo", "error");
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = instagramList.filter((_, i) => i !== idx);
                              setInstagramList(updated);
                              showToast("Instagram item deleted.", "info");
                            }}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MASTER PUBLISH BAR */}
            <div className="sticky bottom-4 z-30 p-5 rounded-3xl bg-gradient-to-r from-[#1E050B] via-[#3D0B16] to-[#1E050B] text-white border border-[#D4AF37]/50 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white block text-sm font-serif-luxury">
                  Publish Website Content &amp; Media
                </span>
                <span className="text-xs text-stone-300">
                  Instantly saves all headlines, photos, videos, FAQs, and reviews live across the academy.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo("home")}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  View Public Website
                </button>
                <button
                  type="button"
                  onClick={handlePublishAllSiteContent}
                  className="silk-zari-btn px-8 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#1E050B] font-bold text-xs sm:text-sm shadow-xl hover:brightness-105 transition-all cursor-pointer flex items-center gap-2 tap-bounce"
                >
                  <Sparkles className="w-4 h-4 text-[#1E050B]" />
                  <span>Save &amp; Publish Website Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB: PERFORMANCE & GALLERY STREAM (PUBLIC MEDIA REPOSITORY)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "gallery_cms" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Performance &amp; Gallery Stream
                </h3>
                <p className="text-xs text-stone-500">
                  Add, replace, or delete photos and performance video reels shown in the public gallery.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setGalleryForm({
                    title: "",
                    category: "Performances",
                    type: "image",
                    url: "/images/gallery/gallery_01.jpg",
                    videoUrl: "/videos/performance.mp4",
                    caption: ""
                  });
                  setIsAddingGalleryModal(true);
                }}
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Gallery Media</span>
              </button>
            </div>

            {/* Gallery Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-stone-900">
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 text-[#D4AF37] text-[10px] font-bold uppercase backdrop-blur-xs">
                      {item.category}
                    </div>
                    {item.type === "video" && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>Video</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-stone-900 line-clamp-1">{item.title}</h4>
                      <p className="text-stone-500 text-[11px] line-clamp-2 mt-1">{item.caption}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#1E050B] hover:underline cursor-pointer flex items-center gap-1">
                        <Camera className="w-3 h-3 text-[#B99A63]" />
                        <span>Replace Media</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              showToast("Uploading replacement to Supabase storage...", "info");
                              if (file.type.startsWith("image/")) {
                                const comp = await compressImageFile(file, 1600, 0.88);
                                const res = await uploadMediaToBucket("academy-media", comp.file, "gallery");
                                const finalUrl = res.url || comp.dataUrl;
                                updateGalleryItem(item.id, { url: finalUrl, type: "image" });
                              } else {
                                const res = await uploadMediaToBucket("academy-media", file, "gallery");
                                updateGalleryItem(item.id, { url: res.url, videoUrl: res.url, type: "video" });
                              }
                              showToast("Gallery media replaced successfully!", "success");
                            } catch (err) {
                              showToast("Failed to upload replacement", "error");
                            }
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${item.title}" from gallery?`)) {
                            deleteGalleryItem(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete from gallery"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB: COURSES & 5-SLIDE GALLERIES
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "courses" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-serif-luxury">Courses &amp; Tuition Catalog</h3>
                <p className="text-xs text-stone-500">Edit course details, upload 5-slide photo galleries, and update fees shown on the public site.</p>
              </div>

              <button
                onClick={openAddCourse}
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
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
                      {course.images && course.images.length > 0 && (
                        <span className="inline-block mt-2 text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-bold">
                          📸 {course.images.length} Slide Photos
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditCourse(course)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Details &amp; Slides</span>
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
            ACADEMIC TABS: COURSE AREAS, STUDENTS, ASSESSMENTS, LIVE STUDIO
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "course_areas" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Course Areas &amp; Unlisted Video Vault
                </h3>
                <p className="text-xs text-stone-500">
                  Publish unlisted syllabus recordings and practice drill videos for enrolled disciples.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingVideoModal(true)}
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Masterclass Video</span>
              </button>
            </div>

            {/* Course Area Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {COURSE_OPTIONS.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedCourseArea(area)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCourseArea === area
                      ? "bg-[#3D0B16] text-[#D4AF37] shadow-sm"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            {/* Disciples Enrolled in this Course Area */}
            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <h4 className="text-sm sm:text-base font-bold font-serif-luxury text-stone-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#B99A63]" />
                    <span>Disciples Enrolled in {selectedCourseArea}</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Manage students who have access to this course's masterclass vault &amp; curriculum.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    id="quick-enroll-select"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addStudentToCourse(e.target.value, selectedCourseArea);
                        e.target.value = "";
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50 hover:bg-white focus:outline-none focus:border-[#B99A63] cursor-pointer"
                  >
                    <option value="" disabled>+ Enroll a Student to {selectedCourseArea}...</option>
                    {(studentsList || [])
                      .filter((s) => !(s.enrolledCourses || []).includes(selectedCourseArea))
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.email})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {(() => {
                const enrolledHere = (studentsList || []).filter((s) =>
                  (s.enrolledCourses || []).includes(selectedCourseArea)
                );

                if (enrolledHere.length === 0) {
                  return (
                    <p className="text-xs text-stone-400 italic py-2">
                      No disciples currently enrolled in {selectedCourseArea}. Use the dropdown above to enroll students.
                    </p>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {enrolledHere.map((stu) => (
                      <div
                        key={stu.id}
                        className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <strong className="text-stone-900 block truncate">{stu.name}</strong>
                          <span className="text-[10px] text-stone-500 block truncate font-mono">{stu.registrationNo}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Unenroll ${stu.name} from "${selectedCourseArea}"?`)) {
                              removeStudentFromCourse(stu.id, selectedCourseArea);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 transition-colors cursor-pointer shrink-0"
                          title="Remove from this course"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Recordings List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(recordings || [])
                .filter((r) => !selectedCourseArea || r.courseCategory === selectedCourseArea)
                .map((rec) => (
                  <div key={rec.id} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
                    <UniversalVideoPlayer
                        url={rec.embedUrl}
                        title={rec.title}
                        className="w-full"
                      />
                    <div className="p-5 space-y-2 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#B99A63] font-bold uppercase">{rec.module}</span>
                        <h4 className="font-bold text-stone-900 text-sm mt-0.5">{rec.title}</h4>
                        <p className="text-stone-500 text-[11px] line-clamp-2 mt-1">{rec.description}</p>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400">{rec.duration}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete video "${rec.title}"?`)) {
                              deleteRecording(rec.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* STUDENTS DIRECTORY */}
        {activeTab === "students_dir" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Enrolled Students Directory
                </h3>
                <p className="text-xs text-stone-500">
                  Manage active student credentials, course enrollments, and learning progress.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingStudentModal(true)}
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll New Student</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(studentsList || []).map((student) => (
                <div key={student.id} className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{student.name}</h4>
                      <p className="text-xs text-stone-500">{student.email}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Enrolled
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                        Enrolled Courses:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(student.enrolledCourses && student.enrolledCourses.length > 0
                          ? student.enrolledCourses
                          : [student.batchName || "Bharatanatyam Diploma"]
                        ).map((courseName) => (
                          <span
                            key={courseName}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1E050B]/10 text-[#1E050B] text-[11px] font-bold border border-[#B99A63]/30"
                          >
                            <span>{courseName}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Unenroll ${student.name} from "${courseName}"?`)) {
                                  removeStudentFromCourse(student.id, courseName);
                                }
                              }}
                              className="w-3.5 h-3.5 rounded-full hover:bg-rose-600 hover:text-white flex items-center justify-center text-stone-500 cursor-pointer ml-0.5 text-xs font-bold leading-none"
                              title={`Remove from ${courseName}`}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            addStudentToCourse(student.id, e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="w-full px-2.5 py-1 rounded-lg border border-stone-200 text-[11px] font-semibold bg-stone-50 hover:bg-white focus:outline-none focus:border-[#B99A63] cursor-pointer"
                      >
                        <option value="" disabled>+ Add to another course...</option>
                        {COURSE_OPTIONS.filter((c) => !(student.enrolledCourses || []).includes(c)).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500">
                      <span>Location: <strong>{student.location || "International"}</strong></span>
                      <span>Reg: <strong className="font-mono text-[#3D0B16]">{student.registrationNo || student.id}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStudentId && setActiveStudentId(student.id);
                        navigateTo("student-portal");
                      }}
                      className="text-xs font-bold text-[#3D0B16] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Portal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReceiptStudent(student)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Generate Printable Tuition Receipt & Sanad"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#B99A63]" />
                      <span>Tuition Receipt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remove disciple ${student.name}?`)) {
                          deleteStudent(student.id);
                        }
                      }}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STUDY MATERIALS & PDF VAULT (FACULTY & GURU DESK)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "materials_cms" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Study Materials &amp; PDF Vault
                </h3>
                <p className="text-xs text-stone-500">
                  Upload syllabus PDFs, sloka charts, lyric notations, and medical anatomy notes for enrolled disciples.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingMaterialModal(true)}
                className="silk-zari-btn px-5 py-2.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New PDF Document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(studyMaterials || []).map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between gap-3 text-xs text-left"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#B99A63]">
                          {doc.refNo}
                        </span>
                        <span className="text-[10px] text-stone-400">&bull; {doc.size}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#1E050B]/10 text-[#1E050B] text-[9px] font-bold">
                        {doc.courseCategory || "General"}
                      </span>
                    </div>

                    <h4 className="font-bold text-stone-900 text-sm leading-snug">
                      {doc.title}
                    </h4>

                    <p className="text-[11px] text-stone-500">
                      {doc.type} &bull; Verified by {doc.verified}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">
                      Uploaded: {doc.uploadDate || "Active"}
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={doc.fileUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!doc.fileUrl || doc.fileUrl.startsWith("#")) {
                            e.preventDefault();
                            showToast(`Opening document: ${doc.title}`, "info");
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#B99A63]" />
                        <span>View / Download</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete study material "${doc.title}"?`)) {
                            deleteStudyMaterial(doc.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMISSIONS CRM & LEADS */}
        {activeTab === "enquiries" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                Admissions CRM &amp; Leads Pipeline
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Prospective disciples who submitted the website booking audition or trial form.
              </p>
            </div>

            <div className="space-y-3">
              {(enquiries || []).map((enq) => (
                <div key={enq.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{enq.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#1E050B] font-bold text-[10px]">
                        {enq.discipline || enq.course}
                      </span>
                    </div>
                    <p className="text-stone-600">{enq.email} &bull; {enq.phone}</p>
                    {enq.message && <p className="text-stone-500 italic">&ldquo;{enq.message}&rdquo;</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${(enq.phone || "").replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(enq.name)}%2C%20Dr.%20Malavika%20from%20DancingRagas.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => deleteEnquiry(enq.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FACULTY RUBRIC DESK */}
        {activeTab === "assessments" && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold font-serif-luxury text-stone-900">
                Student Submissions &amp; Video Feedback Desk
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Evaluate student practice videos across Technique, Mudras, Rhythm, and Movement Posture.
              </p>
            </div>

            <div className="space-y-3">
              {(studentAssessments || []).map((ass) => (
                <div key={ass.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{ass.studentName}</h4>
                    <p className="text-stone-500">{ass.moduleName} &bull; Score: <strong className="text-[#3D0B16]">{ass.overallScore} / 40</strong></p>
                    <p className="text-stone-600 text-[11px] mt-1">{ass.clinicalVerdict || ass.facultyNote}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAssessment(ass);
                      setRubricDraft({
                        biomechanicsScore: ass.scores?.biomechanics || 9.5,
                        biomechanicsRemarks: ass.remarks?.biomechanics || "Stable knee angle.",
                        mudraScore: ass.scores?.mudra || 9.0,
                        mudraRemarks: ass.remarks?.mudra || "Crisp Pataka hand definition.",
                        layaScore: ass.scores?.laya || 8.5,
                        layaRemarks: ass.remarks?.laya || "Steady tempo adherence.",
                        angaScore: ass.scores?.anga || 9.0,
                        angaRemarks: ass.remarks?.anga || "Spine elongated.",
                        clinicalNote: ass.clinicalVerdict || "Cleared for next module."
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs"
                  >
                    Grade &amp; Re-evaluate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVE BROADCAST STUDIO & BATCH GOOGLE MEET SCHEDULER */}
        {activeTab === "live_studio" && (
          <div className="space-y-6 text-left">
            {/* Header banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E050B] via-[#2A0812] to-[#1E050B] text-[#F5F0E8] border border-[#B99A63]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                    Google Meet Live Classroom Sync
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-serif-luxury text-white">
                  Batch Live Class Scheduler &amp; Studio Command
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                  Schedule live Google Meet classrooms partitioned by course cohort. Disciples enrolled in each batch will automatically receive the real-time link, countdown timer, meeting passcode, and 1-click WhatsApp sync in their Disciple Sanctuary.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingScheduleId(null);
                    setBatchScheduleForm({
                      courseCategory: "Bharatanatyam Diploma",
                      batchName: "Online Bharatanatyam Diploma (Sunday Morning)",
                      sessionTitle: "Bharatanatyam Diploma: Margam Jathiswaram & Adavu Precision",
                      instructor: "Dr. Malavika M. Sunil (MBBS)",
                      scheduledDayTime: "Sunday, 05:00 PM IST / 07:30 AM EST",
                      targetTimestamp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
                      meetUrl: "https://meet.google.com/dnc-ragas-live",
                      meetingId: "dnc-ragas-live",
                      passcode: "RAGAS2026",
                      status: "Confirmed",
                      notice: "Keep ghungroos ready. We will conduct Araimandi knee alignment checks before Jathiswaram Korvai 3.",
                      assignedScope: "all_batch"
                    });
                    setIsLiveScheduleModalOpen(true);
                  }}
                  className="silk-zari-btn px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#151515] font-bold text-xs shadow-lg shadow-[#D4AF37]/20 hover:brightness-105 transition-all flex items-center gap-2 cursor-pointer tap-bounce"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule New Batch Class</span>
                </button>

                <a
                  href={liveClassConfig?.meetUrl || "https://meet.google.com/dnc-ragas-live"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch Google Meet Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Live Class Rosters by Batch */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-stone-900 font-serif-luxury">
                    Active Scheduled Cohort Classes
                  </h4>
                  <p className="text-xs text-stone-500">
                    Live schedule broadcasts synced in real-time across the disciple portal.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold font-mono">
                  {(liveClassSchedules || []).length} Scheduled Sessions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(liveClassSchedules || []).map((sched) => {
                  const enrolledDisciples = (studentsList || []).filter((st) =>
                    (st.enrolledCourses || [st.enrolledCourse]).includes(sched.courseCategory)
                  );

                  return (
                    <div
                      key={sched.id}
                      className="p-6 rounded-3xl bg-white border border-[#B99A63]/30 shadow-md hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1E050B] text-[#D4AF37] border border-[#B99A63]/40 text-[10px] font-bold uppercase tracking-wider">
                            {sched.courseCategory}
                          </span>
                          <h5 className="text-lg font-bold text-stone-900 font-serif-luxury mt-1">
                            {sched.sessionTitle}
                          </h5>
                          <p className="text-xs text-stone-500">
                            Instructor: <strong className="text-stone-800">{sched.instructor}</strong>
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                          {sched.status}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 font-medium">Scheduled Time:</span>
                          <strong className="text-stone-800 font-serif-luxury">{sched.scheduledDayTime}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 font-medium">Google Meet URL:</span>
                          <a
                            href={sched.meetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 font-mono font-bold hover:underline flex items-center gap-1"
                          >
                            <span>{sched.meetUrl.replace("https://", "")}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 font-medium">Meeting Passcode:</span>
                          <code className="px-2 py-0.5 rounded bg-white border border-stone-200 font-mono text-[#1E050B] font-bold">
                            {sched.passcode}
                          </code>
                        </div>
                        {sched.notice && (
                          <div className="pt-1.5 border-t border-stone-200/60 text-[11px] text-stone-600">
                            <span className="font-bold text-stone-700">Practice Notice: </span>
                            {sched.notice}
                          </div>
                        )}
                      </div>

                      {/* Enrolled Students preview & WhatsApp Broadcast */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <Users className="w-3.5 h-3.5 text-[#B99A63]" />
                          <span><strong>{enrolledDisciples.length}</strong> students connected</span>
                        </span>

                        <div className="flex items-center gap-2">
                          {/* 1-Click WhatsApp Batch Broadcast Generator */}
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `🌸 *DancingRagas Live Class Announcement* 🌸\n\n📌 *Batch:* ${sched.courseCategory}\n🎵 *Class:* ${sched.sessionTitle}\n👩‍🏫 *Instructor:* ${sched.instructor}\n⏰ *Time:* ${sched.scheduledDayTime}\n\n🔗 *Google Meet:* ${sched.meetUrl}\n🔑 *Passcode:* ${sched.passcode}\n\n📝 *Notice:* ${sched.notice || "Please be ready 5 minutes early."}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-[11px] flex items-center gap-1 border border-[#25D366]/30 cursor-pointer"
                            title="Share schedule to batch WhatsApp group"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>WhatsApp Batch</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingScheduleId(sched.id);
                              setBatchScheduleForm({ ...sched });
                              setIsLiveScheduleModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Remove this batch live class schedule?")) {
                                deleteLiveClassSchedule(sched.id);
                                showToast("Batch schedule removed", "info");
                              }
                            }}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete Schedule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Master Google Meet Configuration & Studio Fallback */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h4 className="text-base font-bold font-serif-luxury text-stone-900">
                Master Studio Default Room Credentials
              </h4>
              <p className="text-xs text-stone-500">
                Global fallback Google Meet studio URL applied whenever a disciple does not have a specific cohort schedule.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Session Title</label>
                  <input
                    type="text"
                    value={liveForm.sessionTitle}
                    onChange={(e) => setLiveForm({ ...liveForm, sessionTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Google Meet URL</label>
                  <input
                    type="text"
                    value={liveForm.meetUrl}
                    onChange={(e) => setLiveForm({ ...liveForm, meetUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-mono text-emerald-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Scheduled Day &amp; Time (IST / EST)</label>
                  <input
                    type="text"
                    value={liveForm.scheduledDayTime}
                    onChange={(e) => setLiveForm({ ...liveForm, scheduledDayTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Meeting Passcode</label>
                  <input
                    type="text"
                    value={liveForm.passcode}
                    onChange={(e) => setLiveForm({ ...liveForm, passcode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <a
                  href={liveForm.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Launch Google Meet Studio</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    updateLiveClassConfig(liveForm);
                    showToast("Live Google Meet classroom configuration saved!", "success");
                  }}
                  className="silk-zari-btn px-6 py-2.5 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs cursor-pointer"
                >
                  Save Classroom Settings
                </button>
              </div>
            </div>

            {/* MODAL: SCHEDULE GOOGLE MEET CLASS FOR BATCH */}
            {isLiveScheduleModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#B99A63]/50 p-6 sm:p-8 space-y-6 text-left my-8">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B99A63]">
                        Classroom Broadcast Coordinator
                      </span>
                      <h3 className="text-xl font-bold font-serif-luxury text-stone-900 mt-1">
                        Schedule Google Meet Class for Batch
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLiveScheduleModalOpen(false)}
                      className="p-2 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingScheduleId) {
                        updateLiveClassSchedule(editingScheduleId, batchScheduleForm);
                        showToast("Batch Live Class schedule updated!", "success");
                      } else {
                        addLiveClassSchedule({
                          ...batchScheduleForm,
                          id: `live-sched-${Date.now()}`
                        });
                        showToast("New Batch Live Class published to disciples!", "success");
                      }
                      setIsLiveScheduleModalOpen(false);
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Target Course / Batch</label>
                        <select
                          value={batchScheduleForm.courseCategory}
                          onChange={(e) => setBatchScheduleForm({ ...batchScheduleForm, courseCategory: e.target.value, batchName: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-900"
                          required
                        >
                          {(courses || []).map((c) => (
                            <option key={c.id || c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                          <option value="General Masterclass">General Masterclass (All Batches)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Lead Instructor / Guru</label>
                        <input
                          type="text"
                          value={batchScheduleForm.instructor}
                          onChange={(e) => setBatchScheduleForm({ ...batchScheduleForm, instructor: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-stone-300"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Session Title</label>
                      <input
                        type="text"
                        value={batchScheduleForm.sessionTitle}
                        onChange={(e) => setBatchScheduleForm({ ...batchScheduleForm, sessionTitle: e.target.value })}
                        placeholder="e.g. Bharatanatyam Diploma: Margam Jathiswaram & Adavu Precision"
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-serif-luxury text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Scheduled Day &amp; Time (IST / EST)</label>
                        <input
                          type="text"
                          value={batchScheduleForm.scheduledDayTime}
                          onChange={(e) => setBatchScheduleForm({ ...batchScheduleForm, scheduledDayTime: e.target.value })}
                          placeholder="e.g. Sunday, 05:00 PM IST / 07:30 AM EST"
                          className="w-full p-2.5 rounded-xl border border-stone-300"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Meeting Passcode</label>
                        <input
                          type="text"
                          value={batchScheduleForm.passcode}
                          onChange={(e) => setBatchScheduleForm({ ...batchScheduleForm, passcode: e.target.value })}
                          placeholder="e.g. RAGAS2026"
                          className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Google Meet URL</label>
                        <input
                          type="url"
                          value={batchScheduleForm.meetUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            const idMatch = val.match(/meet\.google\.com\/([a-z0-9-]+)/i);
                            setBatchScheduleForm({
                              ...batchScheduleForm,
                              meetUrl: val,
                              meetingId: idMatch ? idMatch[1] : batchScheduleForm.meetingId
                            });
                          }}
                          placeholder="https://meet.google.com/dnc-ragas-live"
                          className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-emerald-800"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Meeting ID / Room Code</label>
                        <input
                          type="text"
                          value={batchScheduleForm.meetingId}
                          onChange={(e) => setBatchScheduleForm({ ...batchScheduleForm, meetingId: e.target.value })}
                          placeholder="dnc-ragas-live"
                          className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Practice Instructions &amp; Notes for Disciples</label>
                      <textarea
                        rows={3}
                        value={batchScheduleForm.notice}
                        onChange={(e) => setBatchScheduleForm({ ...batchScheduleForm, notice: e.target.value })}
                        placeholder="e.g. Keep ghungroos ready. We will conduct Araimandi knee alignment checks before Jathiswaram Korvai 3."
                        className="w-full p-2.5 rounded-xl border border-stone-300 resize-none"
                      />
                    </div>

                    <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsLiveScheduleModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="silk-zari-btn px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#151515] font-bold shadow-md cursor-pointer"
                      >
                        {editingScheduleId ? "Update Batch Schedule" : "Confirm & Publish Schedule"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: EDIT COURSE & 5-SLIDE PHOTO GALLERY
      ═══════════════════════════════════════════════════════════════ */}
      {(editingCourse || isAddingCourse) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#B99A63]/40 space-y-5 text-left my-8 font-sans">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#B99A63] tracking-wider block">Course Editor</span>
                <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                  {editingCourse ? `Edit: ${editingCourse.title}` : "Create New Academy Course"}
                </h3>
              </div>
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

              {/* Main Cover Photo */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 block text-xs">Main Cover Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-300">
                    <img src={courseForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Cover Photo (Supabase)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            showToast("Uploading course cover to Supabase...", "info");
                            const comp = await compressImageFile(file, 1600, 0.88);
                            const res = await uploadMediaToBucket("academy-media", comp.file, "courses");
                            const finalUrl = res.url || comp.dataUrl;
                            setCourseForm((prev) => ({ ...prev, image: finalUrl }));
                            showToast("Course cover updated!", "success");
                          } catch (err) {
                            showToast("Failed to upload cover photo", "error");
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={courseForm.image}
                      onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                      placeholder="Or enter photo URL"
                      className="w-full px-2.5 py-1 rounded-lg border border-stone-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 5-Slide Photo Gallery per Course */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-stone-800 block text-xs">5-Slide Photo Gallery</label>
                    <span className="text-[10px] text-stone-500">Carousel slides displayed in course detail view</span>
                  </div>

                  <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-[11px] cursor-pointer shadow-xs">
                    <Plus className="w-3 h-3" />
                    <span>Add Slide Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          showToast("Uploading slide to Supabase...", "info");
                          const comp = await compressImageFile(file, 1600, 0.88);
                          const res = await uploadMediaToBucket("academy-media", comp.file, "courses");
                          const finalUrl = res.url || comp.dataUrl;
                          setCourseForm((prev) => ({ ...prev, images: [...(prev.images || []), finalUrl] }));
                          showToast("Slide added to gallery!", "success");
                        } catch (err) {
                          showToast("Failed to upload slide", "error");
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {(courseForm.images || []).map((slideUrl, sIdx) => (
                    <div key={sIdx} className="relative rounded-xl overflow-hidden aspect-square bg-stone-900 border border-stone-300 group">
                      <img src={slideUrl} alt={`Slide ${sIdx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (courseForm.images || []).filter((_, i) => i !== sIdx);
                          setCourseForm({ ...courseForm, images: updated });
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        title="Remove slide"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded font-bold">
                        #{sIdx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Video Preview / Reel URL</label>
                <input
                  type="text"
                  value={courseForm.videoUrl || ""}
                  onChange={(e) => setCourseForm({ ...courseForm, videoUrl: e.target.value })}
                  placeholder="/videos/performance.mp4 or YouTube / Vimeo"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Course Description</label>
                <textarea
                  rows={2}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Syllabus Breakdown (1 item per line)</label>
                <textarea
                  rows={3}
                  value={courseForm.syllabusText}
                  onChange={(e) => setCourseForm({ ...courseForm, syllabusText: e.target.value })}
                  placeholder="Module 1: Basic Adavus\nModule 2: Hastha Mudras"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs font-mono"
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
                  className="silk-zari-btn px-6 py-2.5 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] font-bold text-xs cursor-pointer shadow-md"
                >
                  Save Course &amp; Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: ADD STORY (STUDENT & PARENT REVIEW)
      ═══════════════════════════════════════════════════════════════ */}
      {isAddingStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#B99A63]/40 space-y-4 text-left font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                Add Student &amp; Parent Story
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingStoryModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!storyForm.name.trim() || !storyForm.quote.trim()) {
                  showToast("Name and quote are required.", "error");
                  return;
                }
                const newStory = {
                  id: "story-" + Date.now(),
                  ...storyForm
                };
                const updated = [newStory, ...storiesList];
                setStoriesList(updated);
                updateTestimonials(updated);
                setIsAddingStoryModal(false);
                showToast("New student story added successfully!", "success");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Student / Parent Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sundaram"
                  value={storyForm.name}
                  onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Discipline / Role</label>
                  <input
                    type="text"
                    value={storyForm.role}
                    onChange={(e) => setStoryForm({ ...storyForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={storyForm.location}
                    onChange={(e) => setStoryForm({ ...storyForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Rating</label>
                <select
                  value={storyForm.rating}
                  onChange={(e) => setStoryForm({ ...storyForm, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Good)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Testimonial Quote *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share the disciple's genuine experience with Dr. Malavika's coaching..."
                  value={storyForm.quote}
                  onChange={(e) => setStoryForm({ ...storyForm, quote: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingStoryModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs"
                >
                  Add Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: ADD INSTAGRAM POST / REEL
      ═══════════════════════════════════════════════════════════════ */}
      {isAddingInstaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#B99A63]/40 space-y-4 text-left font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                Add Instagram Post or Reel
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingInstaModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!instaForm.title.trim()) {
                  showToast("Title is required", "error");
                  return;
                }
                const newItem = {
                  id: "insta-" + Date.now(),
                  ...instaForm
                };
                const updated = [newItem, ...instagramList];
                setInstagramList(updated);
                updateSection("instagram", updated);
                setIsAddingInstaModal(false);
                showToast("Instagram media added to live social wall!", "success");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Post / Reel Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Live Stage Varnam Recital"
                  value={instaForm.title}
                  onChange={(e) => setInstaForm({ ...instaForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              {/* Photo Upload to Supabase */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 block">Thumbnail / Photo Media</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-stone-300">
                    <img src={instaForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Photo (Supabase)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadInstaMedia}
                      />
                    </label>
                    <input
                      type="text"
                      value={instaForm.imageUrl}
                      onChange={(e) => setInstaForm({ ...instaForm, imageUrl: e.target.value })}
                      placeholder="Or enter image URL"
                      className="w-full px-2.5 py-1 rounded-lg border border-stone-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Media Type</label>
                  <select
                    value={instaForm.type}
                    onChange={(e) => setInstaForm({ ...instaForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="reel">Reel (Video)</option>
                    <option value="post">Photo Post</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={instaForm.category}
                    onChange={(e) => setInstaForm({ ...instaForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="stage">Stage Shows</option>
                    <option value="workshops">Workshops</option>
                    <option value="music">Music &amp; Dance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={instaForm.caption}
                  onChange={(e) => setInstaForm({ ...instaForm, caption: e.target.value })}
                  placeholder="Captivating stage performance in sacred Margam discipline..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingInstaModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs"
                >
                  Add to Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: ADD GALLERY MEDIA ITEM
      ═══════════════════════════════════════════════════════════════ */}
      {isAddingGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#B99A63]/40 space-y-4 text-left font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                Upload Gallery Media
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingGalleryModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!galleryForm.title.trim()) {
                  showToast("Title is required", "error");
                  return;
                }
                addGalleryItem(galleryForm);
                setIsAddingGalleryModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Media Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Margam Varnam Live Recital"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              {/* Upload to Supabase */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <label className="font-bold text-stone-800 block">Select File (Photo or Video)</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-stone-300">
                    <img src={galleryForm.url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs cursor-pointer shadow-xs">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload File to Supabase</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleUploadGalleryMedia}
                      />
                    </label>
                    <input
                      type="text"
                      value={galleryForm.url}
                      onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                      placeholder="Or enter media URL"
                      className="w-full px-2.5 py-1 rounded-lg border border-stone-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="Performances">Performances</option>
                    <option value="Stage Shows">Stage Shows</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Music & Dance">Music &amp; Dance</option>
                    <option value="Carnatic Vocal">Carnatic Vocal</option>
                    <option value="Doctor & Dancer">Doctor &amp; Dancer</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Media Type</label>
                  <select
                    value={galleryForm.type}
                    onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="image">Photograph</option>
                    <option value="video">Video Recording</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Caption / Story</label>
                <textarea
                  rows={2}
                  value={galleryForm.caption}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  placeholder="Describe the recital, venue or artistic expression..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingGalleryModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs"
                >
                  Publish to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: ADD UNLISTED VIDEO TO COURSE AREA
      ═══════════════════════════════════════════════════════════════ */}
      {isAddingVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#B99A63]/40 space-y-4 text-left font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                Add Unlisted Masterclass Video
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingVideoModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!videoForm.title.trim() || !videoForm.embedUrl.trim()) {
                  showToast("Title and Video Embed URL are required.", "error");
                  return;
                }
                addRecording({
      ...videoForm,
      embedUrl: formatVideoEmbedUrl(videoForm.embedUrl.trim()),
      courseCategory: selectedCourseArea
    });
                setIsAddingVideoModal(false);
                showToast("Unlisted video added to course vault!", "success");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Araimandi Depth & Lateral Balance Drill"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Target Course Area</label>
                <input
                  type="text"
                  disabled
                  value={selectedCourseArea}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Video Embed URL (YouTube Unlisted / Vimeo / MP4) *</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube-nocookie.com/embed/..."
                  value={videoForm.embedUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, embedUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Module Level</label>
                  <input
                    type="text"
                    value={videoForm.module}
                    onChange={(e) => setVideoForm({ ...videoForm, module: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingVideoModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs"
                >
                  Add to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: ENROLL NEW DISCIPLE
      ═══════════════════════════════════════════════════════════════ */}
      {isAddingStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#B99A63]/40 space-y-4 text-left font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                Enroll Conservatory Disciple
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingStudentModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newStudentForm.name.trim() || !newStudentForm.email.trim()) {
                  showToast("Name and email are required.", "error");
                  return;
                }
                addStudent({
                  ...newStudentForm,
                  batchName: newStudentForm.enrolledCourses[0]
                });
                setIsAddingStudentModal(false);
                showToast("Disciple enrolled successfully!", "success");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Disciple Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Menon"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="student@dancingragas.com"
                  value={newStudentForm.email}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={newStudentForm.location}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Enrolled Discipline</label>
                <select
                  value={newStudentForm.enrolledCourses[0]}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, enrolledCourses: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                >
                  <option value="Bharatanatyam Diploma">Online Bharatanatyam Diploma Course</option>
                  <option value="Bharatanatyam Non-Diploma">Online Bharatanatyam Non-Diploma Classes</option>
                  <option value="Carnatic Music">Online Carnatic Music Classes</option>
                  <option value="Bollywood & Semi-Classical">Online Semi-Classical Bollywood Dance Classes</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingStudentModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-6 py-2 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: UPLOAD PDF STUDY MATERIAL (FACULTY GURU)
      ═══════════════════════════════════════════════════════════════ */}
      {isAddingMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#B99A63]/40 space-y-4 text-left font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#B99A63] tracking-wider block">Faculty Desk</span>
                <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                  Upload PDF Study Material
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingMaterialModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!materialForm.title.trim()) {
                  showToast("Material title is required.", "error");
                  return;
                }
                addStudyMaterial(materialForm);
                setIsAddingMaterialModal(false);
                setMaterialForm({
                  title: "",
                  refNo: "",
                  category: "Theory & Sanskrit Slokas",
                  courseCategory: "Bharatanatyam Diploma",
                  fileUrl: "",
                  size: "2.8 MB",
                  verified: "Dr. Malavika M. Sunil (MBBS)"
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diploma Year 2: Jathiswaram Score & Korvai Notations"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-[#B99A63]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target Course</label>
                  <select
                    value={materialForm.courseCategory}
                    onChange={(e) => setMaterialForm({ ...materialForm, courseCategory: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white focus:outline-none"
                  >
                    {COURSE_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category Type</label>
                  <select
                    value={materialForm.category}
                    onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white focus:outline-none"
                  >
                    <option value="Theory & Sanskrit Slokas">Theory &amp; Sanskrit Slokas</option>
                    <option value="Practical Training">Practical Training</option>
                    <option value="Margam Repertoire">Margam Repertoire</option>
                    <option value="Medical Dance Science">Medical Dance Science</option>
                    <option value="Audio Guide & Bol Sheet">Audio Guide &amp; Bol Sheet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Choose PDF / Document File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
                      setMaterialForm((prev) => ({
                        ...prev,
                        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
                        size: sizeMb,
                        fileUrl: URL.createObjectURL(file)
                      }));
                      showToast(`File "${file.name}" attached (${sizeMb})!`, "success");
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1E050B] file:text-[#D4AF37] cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Or Document URL / Cloud Drive Link</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/... or https://..."
                  value={materialForm.fileUrl}
                  onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMaterialModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="silk-zari-btn px-5 py-2 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold shadow-md hover:brightness-105 transition-all cursor-pointer"
                >
                  Publish to Disciple Sanctuary
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-[#B99A63]/40 space-y-4 text-left font-sans my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#B99A63] uppercase tracking-wider block">Faculty Evaluation</span>
                <h3 className="text-lg font-bold font-serif-luxury text-stone-900">
                  {selectedAssessment.studentName} &bull; {selectedAssessment.moduleName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                gradeAssessment(selectedAssessment.id, {
                  scores: {
                    biomechanics: Number(rubricDraft.biomechanicsScore),
                    mudra: Number(rubricDraft.mudraScore),
                    laya: Number(rubricDraft.layaScore),
                    anga: Number(rubricDraft.angaScore)
                  },
                  remarks: {
                    biomechanics: rubricDraft.biomechanicsRemarks,
                    mudra: rubricDraft.mudraRemarks,
                    laya: rubricDraft.layaRemarks,
                    anga: rubricDraft.angaRemarks
                  },
                  clinicalVerdict: rubricDraft.clinicalNote,
                  status: "Evaluated"
                });
                setSelectedAssessment(null);
                showToast("Assessment published to disciple's sanctuary!", "success");
              }}
              className="space-y-3 text-xs"
            >
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <label className="font-bold text-stone-800">1. Biomechanics &amp; Aramandi Posture (0-10)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  required
                  value={rubricDraft.biomechanicsScore}
                  onChange={(e) => setRubricDraft({ ...rubricDraft, biomechanicsScore: e.target.value })}
                  className="w-16 px-2 py-1 text-center font-bold font-mono rounded-lg border border-stone-200"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <label className="font-bold text-stone-800">2. Hastha Mudra Geometry (0-10)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  required
                  value={rubricDraft.mudraScore}
                  onChange={(e) => setRubricDraft({ ...rubricDraft, mudraScore: e.target.value })}
                  className="w-16 px-2 py-1 text-center font-bold font-mono rounded-lg border border-stone-200"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <label className="font-bold text-stone-800">3. Laya &amp; Talam Synchronization (0-10)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  required
                  value={rubricDraft.layaScore}
                  onChange={(e) => setRubricDraft({ ...rubricDraft, layaScore: e.target.value })}
                  className="w-16 px-2 py-1 text-center font-bold font-mono rounded-lg border border-stone-200"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <label className="font-bold text-stone-800">4. Anga Shuddhi Upper-Body (0-10)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  required
                  value={rubricDraft.angaScore}
                  onChange={(e) => setRubricDraft({ ...rubricDraft, angaScore: e.target.value })}
                  className="w-16 px-2 py-1 text-center font-bold font-mono rounded-lg border border-stone-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Clinical Biomechanical Verdict &amp; Guidance</label>
                <textarea
                  rows={3}
                  required
                  value={rubricDraft.clinicalNote}
                  onChange={(e) => setRubricDraft({ ...rubricDraft, clinicalNote: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="font-bold text-stone-900">
                  Total Score:{" "}
                  <strong className="text-[#3D0B16] font-mono text-sm">
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
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="silk-zari-btn px-6 py-2 rounded-xl bg-[#1E050B] text-[#D4AF37] font-bold text-xs"
                  >
                    Publish to Student Portal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <TuitionReceiptModal
        isOpen={Boolean(receiptStudent)}
        onClose={() => setReceiptStudent(null)}
        student={receiptStudent}
        academyInfo={academyInfo}
      />
    </div>
  );
}