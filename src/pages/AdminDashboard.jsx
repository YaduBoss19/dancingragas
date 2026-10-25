import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import { FAQS } from "../data/initialData";
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
    deleteGalleryItem
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

  // Modals state
  const [editingCourse, setEditingCourse] = useState(null);
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
    category: "Dance",
    ageGroup: "Kids & Adults",
    level: "All Levels",
    fee: "$75 / month",
    rawFee: 75,
    duration: "60 mins per session",
    frequency: "2 sessions / week",
    badge: "New",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    description: "",
    syllabusText: "Technique & alignment\nMusical rhythm timing\nChoreography routine"
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
    link.setAttribute("download", `aura_academy_enquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Enquiries exported successfully to CSV!", "success");
  };

  // Course Handlers
  const openAddCourse = () => {
    setCourseForm({
      title: "",
      category: "Dance",
      ageGroup: "Kids & Adults",
      level: "All Levels",
      fee: "$75 / month",
      rawFee: 75,
      duration: "60 mins per session",
      frequency: "2 sessions / week",
      badge: "Popular",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
      description: "",
      syllabusText: "Foundational techniques\nBody coordination & alignment\nEnd-of-term choreography"
    });
    setIsAddingCourse(true);
    setEditingCourse(null);
  };

  const openEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      category: course.category,
      ageGroup: course.ageGroup,
      level: course.level,
      fee: course.fee,
      rawFee: course.rawFee || 75,
      duration: course.duration,
      frequency: course.frequency || "2 sessions / week",
      badge: course.badge || "",
      image: course.image,
      description: course.description,
      syllabusText: (course.syllabus || []).join("\n")
    });
    setIsAddingCourse(false);
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
      ageGroup: courseForm.ageGroup,
      level: courseForm.level,
      fee: courseForm.fee,
      rawFee: Number(courseForm.rawFee) || 75,
      duration: courseForm.duration,
      frequency: courseForm.frequency,
      badge: courseForm.badge,
      image: courseForm.image,
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

  // IF NOT LOGGED IN: Render Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Academy Director Portal
            </h2>
            <p className="text-xs text-slate-500">
              Administrative access to manage leads, courses, fees, faculty, and weekly schedules.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 text-left">
            <strong>Demo Access Hint:</strong> Password is <code className="bg-white px-2 py-0.5 rounded font-bold text-purple-700">admin123</code>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Director Passcode</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:brightness-110 transition-all cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>

          <button
            onClick={() => navigateTo("home")}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            â† Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="space-y-8 pb-24 text-left">
      {/* Top Header Bar */}
      <section className="bg-slate-900 text-white pt-8 pb-12 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isSupabaseConfigured ? "Supabase Cloud Connected" : "Live CMS Active (Demo Mode)"}
              </span>
              <span className="text-xs text-slate-400">DancingRagas Classical Arts Academy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dr. Malavika Director Control Center &amp; CMS
            </h1>
          </div>

          {/* Quick Operations */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo("home")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </button>

            <button
              onClick={resetToDefaults}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Reset all courses, timetable and teachers to default factory preset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Factory Demo Data</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* High Level Stats Strip */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Trial Enquiries</span>
            <p className="text-2xl font-black text-white mt-1">{enquiries.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-rose-400 uppercase">New Leads</span>
            <p className="text-2xl font-black text-rose-400 mt-1">
              {enquiries.filter((e) => e.status === "New").length}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-purple-400 uppercase">Classes & Services</span>
            <p className="text-2xl font-black text-purple-400 mt-1">{courses.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-amber-400 uppercase">Principal Guru</span>
            <p className="text-base sm:text-lg font-black text-amber-300 mt-1 truncate">Dr. Malavika</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase">Gallery Items</span>
            <p className="text-2xl font-black text-indigo-400 mt-1">{gallery.length}</p>
          </div>
        </div>
      </section>

      {/* Main Tabbed Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs overflow-x-auto max-w-full">
          {[
            { id: "enquiries", label: `Enquiries (${enquiries.length})`, icon: MessageSquare },
            { id: "courses", label: `Classes & Services (${courses.length})`, icon: BookOpen },
            { id: "gallery", label: `Media Vault (${gallery.length})`, icon: ImageIcon },
            { id: "matter", label: "Matter & FAQs CMS", icon: FileText },
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
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600"
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
                                <Mail className="w-3 h-3 text-purple-600 shrink-0" />
                                <span>{enq.email}</span>
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-purple-700">{enq.course}</div>
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
                                    const text = `Hello ${enq.parentName || enq.studentName}! This is Aura Arts Academy regarding your trial enquiry for ${enq.course}.`;
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
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
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
                      <p className="text-xs text-purple-700 font-semibold mt-0.5">{course.ageGroup}</p>
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
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
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
                    <p className="text-xs font-semibold text-purple-700">{teacher.role}</p>
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
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
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
                          <span className="font-extrabold text-purple-700">{slot.day}</span>
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
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
                >
                  Save Ticker
                </button>
              </div>

              <textarea
                rows={2}
                value={tickerAnnouncement}
                onChange={(e) => setTickerAnnouncement(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-purple-600 focus:outline-none"
              />
            </div>

            {/* FAQs Manager */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                    Frequently Asked Questions ({faqsList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edit questions, answers, and admission guidance displayed in the FAQ section.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {faqsList.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all space-y-2 bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
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
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-white cursor-pointer shrink-0"
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
                      <span className="text-xs font-bold text-purple-700">{rev.batch}</span>
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
                      className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-bold underline"
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

      {/* MODAL: VIEW ENQUIRY DETAILS */}
      {viewingEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-purple-600">{viewingEnquiry.id}</span>
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
                  <strong className="text-purple-700">{viewingEnquiry.course}</strong>
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
                <div className="p-3 rounded-xl bg-purple-50 text-purple-950 text-xs">
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Dance">Dance</option>
                    <option value="Music">Music</option>
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

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL (Unsplash or CDN)</label>
                <input
                  type="url"
                  value={courseForm.image}
                  onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
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
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
                <label className="font-bold text-purple-900 block text-xs flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-purple-600" />
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
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
                    const updated = [...faqsList];
                    updated[editingFaqIdx] = {
                      ...updated[editingFaqIdx],
                      question: faqQuestionDraft,
                      answer: faqAnswerDraft
                    };
                    setFaqsList(updated);
                    setEditingFaqIdx(null);
                    showToast("FAQ updated successfully!", "success");
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
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
                <span className="text-xs font-bold text-purple-600 uppercase">Student Practice Review</span>
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
                  className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-800 font-bold underline mt-1"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
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
