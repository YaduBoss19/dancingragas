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
  Volume2,
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
  Award
} from "lucide-react";

export default function StudentPortal({ onOpenAuth }) {
  const {
    authUser,
    userRole,
    handleLogout,
    showToast,
    recordings,
    liveClassConfig
  } = useAcademy();

  // Local Timezone calculation
  const [userTimezone, setUserTimezone] = useState("");
  const [activeTab, setActiveTab] = useState("schedule"); // 'schedule' | 'recordings' | 'resources' | 'practice'

  // Selected recording for theater mode
  const activeRecordings = recordings || [];
  const [selectedRecording, setSelectedRecording] = useState(
    activeRecordings[0] || null
  );
  const [recordingSearch, setRecordingSearch] = useState("");
  const [recordingFilter, setRecordingFilter] = useState("All");

  // Student batch and identity
  const studentName =
    authUser?.user_metadata?.full_name ||
    authUser?.email?.split("@")[0] ||
    "Student Artist";
  const batchName =
    authUser?.user_metadata?.batch_name ||
    liveClassConfig?.activeBatch ||
    "Online Bharatanatyam Diploma Course";

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(tz || "Local Time");
    } catch {
      setUserTimezone("Local Time");
    }
  }, []);

  // Practice submission form state
  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submissions, setSubmissions] = useState([
    {
      id: "sub-1",
      title: "Adavu Step 1-4 Posture & Aramandi Check",
      date: "Oct 24, 2026",
      status: "reviewed",
      feedback:
        "Excellent footwork precision! Keep your torso lengthened and ensure the Aramandi knee angle stays open without leaning forward to protect the patella.",
      mentor: "Dr. Malavika M. Sunil (MBBS)"
    },
    {
      id: "sub-2",
      title: "Alarippu Talam Precision (Tisra Ekam)",
      date: "Oct 22, 2026",
      status: "pending",
      feedback:
        "Submission received. Dr. Malavika is evaluating your rhythmic cadence and eye coordination.",
      mentor: "Under Review"
    }
  ]);

  const handleSubmitPractice = (e) => {
    e.preventDefault();
    if (!submissionTitle.trim() || !submissionLink.trim()) {
      showToast("Please provide both a title and video link / upload.", "error");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setSubmissions([
        {
          id: `sub-${Date.now()}`,
          title: submissionTitle,
          date: "Just now",
          status: "pending",
          feedback:
            "Submission received. Dr. Malavika will evaluate your biomechanics & rhythm shortly.",
          mentor: "Dr. Malavika M. Sunil (MBBS)"
        },
        ...submissions
      ]);
      setSubmissionTitle("");
      setSubmissionLink("");
      setSubmissionNotes("");
      setIsSubmitting(false);
      showToast("Practice video submitted successfully for Guru review!", "success");
    }, 600);
  };

  // Filter recordings
  const filteredRecordings = activeRecordings.filter((rec) => {
    const matchCat =
      recordingFilter === "All" || rec.category === recordingFilter;
    const matchSearch =
      !recordingSearch.trim() ||
      rec.title.toLowerCase().includes(recordingSearch.toLowerCase()) ||
      (rec.topics &&
        rec.topics.some((t) =>
          t.toLowerCase().includes(recordingSearch.toLowerCase())
        ));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#151515] py-8 sm:py-14 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Card */}
        <AnimatedSection
          animation="fade-up"
          className="rounded-3xl bg-gradient-to-r from-[#151515] via-[#2A080E] to-[#151515] text-[#F5F0E8] p-6 sm:p-10 border border-[#B99A63]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#B99A63]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B99A63]/20 border border-[#B99A63]/40 text-[#D4AF37] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DancingRagas Ragas Vidyalaya • Student Sanctuary</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif-luxury tracking-tight">
              Namaskaram, <span className="text-[#D4AF37]">{studentName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Enrolled in: <strong className="text-white">{batchName}</strong> • Mentored by Dr. Malavika M. Sunil (MBBS)
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer tap-bounce"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </AnimatedSection>

        {/* Local Timezone Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#B99A63]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-left">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-[#B99A63] shrink-0" />
            <span>
              Detected Timezone: <strong className="text-[#151515]">{userTimezone}</strong> (All class times are synced to your local clock)
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Batch Status: Enrolled &amp; Active
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-left">
          {[
            { id: "schedule", label: "Live Classroom & Schedule", icon: Calendar },
            { id: "recordings", label: `Class Recordings Vault (${activeRecordings.length})`, icon: Film },
            { id: "resources", label: "Learning Vault (PDF & Audio)", icon: BookOpen },
            { id: "practice", label: `Practice Homework (${submissions.length})`, icon: Upload }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap tap-bounce shrink-0 ${
                  isActive
                    ? "bg-[#151515] text-[#D4AF37] shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            TAB 1: SCHEDULE & LIVE CLASSROOM
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "schedule" && (
          <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Live Classroom Join Card */}
              <div className="md:col-span-2 rounded-3xl bg-white border border-[#B99A63]/30 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between text-left">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B99A63] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Next Live Online Session
                    </span>
                    <span className="animate-pulse flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      {liveClassConfig?.status || "Studio Room Ready"}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#151515]">
                    {liveClassConfig?.sessionTitle || "Bharatanatyam Diploma: Margam & Adavu Precision"}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {liveClassConfig?.notice ||
                      "Interactive live instruction conducted directly by Dr. Malavika. Please ensure you have comfortable practice saree/salwar, your ghungroos, and space for Aramandi footing."}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FAF5EC] to-white border border-[#B99A63]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-slate-500 block text-xs">Scheduled Batch Slot</span>
                    <strong className="text-slate-900 font-bold text-sm sm:text-base">
                      {liveClassConfig?.scheduledDayTime || "Monday & Friday • 05:30 PM - 06:30 PM"}
                    </strong>
                  </div>

                  <a
                    href={liveClassConfig?.meetUrl || "https://meet.google.com/new"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="silk-zari-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#151515] hover:bg-[#B99A63] text-[#F5F0E8] hover:text-[#151515] text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer shrink-0 tap-bounce"
                  >
                    <Video className="w-4 h-4 text-[#D4AF37]" />
                    <span>Join Live Studio Session</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              </div>

              {/* Attendance & Batch Summary */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                <h4 className="font-bold text-sm text-[#151515] font-serif-luxury flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#B99A63]" />
                  <span>Curriculum Milestones</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                    <span className="text-slate-600">Attendance Rate</span>
                    <strong className="text-emerald-700 font-bold">100% (All Live Classes Attended)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                    <span className="text-slate-600">Prescribed Evaluation</span>
                    <strong className="text-slate-900 font-bold">Yearly Diploma Examination</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                    <span className="text-slate-600">Theory Completion</span>
                    <strong className="text-[#B99A63] font-bold">Module 4 of 6 Completed</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Have questions regarding your batch schedule or timing adjustments? Contact academy support via official WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 2: CLASS RECORDINGS VAULT (OPTION A2 - EMBEDDED PLAYER)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "recordings" && (
          <div className="space-y-6 text-left">
            {/* Featured Recording Player */}
            {selectedRecording && (
              <div className="rounded-3xl bg-[#151515] border border-[#B99A63]/40 shadow-xl overflow-hidden text-white">
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={selectedRecording.videoUrl}
                    title={selectedRecording.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B99A63]/20 border border-[#B99A63]/40 text-[#D4AF37]">
                        {selectedRecording.batch}
                      </span>
                      <span className="text-xs text-slate-400">
                        Recorded on: {selectedRecording.date} • {selectedRecording.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>HD Masterclass Recording</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#F5F0E8]">
                    {selectedRecording.title}
                  </h3>

                  {selectedRecording.topics && selectedRecording.topics.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Topics &amp; Practice Focus:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecording.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300"
                          >
                            ✓ {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {["All", "Bharatanatyam", "Carnatic Music", "Bollywood & Semi-Classical"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRecordingFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      recordingFilter === cat
                        ? "bg-[#151515] text-[#D4AF37]"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={recordingSearch}
                  onChange={(e) => setRecordingSearch(e.target.value)}
                  placeholder="Search recording topic..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#B99A63]"
                />
              </div>
            </div>

            {/* Recordings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecordings.map((rec) => {
                const isSelected = selectedRecording?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setSelectedRecording(rec);
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className={`rounded-2xl overflow-hidden border transition-all cursor-pointer bg-white flex flex-col justify-between tap-bounce ${
                      isSelected
                        ? "border-[#B99A63] ring-2 ring-[#B99A63]/30 shadow-md"
                        : "border-slate-200 hover:border-[#B99A63]/50 shadow-xs"
                    }`}
                  >
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={rec.thumbnail || "/images/courses/Courses/bharatanatyam_diploma/main.jpg"}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{rec.category}</span>
                          <span>{rec.date}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                          {rec.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#B99A63]">
                        <span>{isSelected ? "● Currently Playing" : "Watch Class"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 3: LEARNING VAULT (PDFs, Theory & Tanpura)
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "resources" && (
          <div className="space-y-6 text-left">
            {/* Tanpura Ambience Practice Player */}
            <div className="p-6 rounded-3xl bg-[#151515] text-[#F5F0E8] border border-[#B99A63]/40 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-base sm:text-lg font-bold font-serif-luxury">
                    Tanpura Shruti Player for Daily Sadhana
                  </h3>
                </div>
                <span className="text-xs text-[#D4AF37] px-2.5 py-0.5 rounded-full bg-white/10 border border-[#B99A63]/30">
                  Continuous Drone
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Select your prescribed base pitch for Carnatic vocal riyaz or Bharatanatyam Margam rehearsal.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {["Pitch C (1 Kattai)", "Pitch C# (1.5 Kattai)", "Pitch D (2 Kattai)", "Pitch G (5 Kattai)"].map(
                  (pitch, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => showToast(`Streaming Tanpura in ${pitch}`, "info")}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#B99A63] hover:text-[#151515] border border-white/20 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 tap-bounce"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{pitch}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Prescribed Materials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Diploma Year 1: Natyashastra Mudras & Hastha Bhedas",
                  type: "PDF Document (18 Pages)",
                  category: "Theory Syllabus"
                },
                {
                  title: "Adavu Step-by-Step Footwork & Talam Notation",
                  type: "Practice Guidebook",
                  category: "Practical Training"
                },
                {
                  title: "Alarippu (Tisra Ekam) Audio Track with Sollukattu",
                  type: "Audio MP3 (320kbps)",
                  category: "Choreography Repertoire"
                },
                {
                  title: "Dancer Musculoskeletal Posture & Injury Prevention Guide",
                  type: "Clinical Biomechanics",
                  category: "Medical Dance Science by Dr. Malavika"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4 hover:border-[#B99A63]/50 transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B99A63]">
                      {item.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                    <span className="text-[11px] text-slate-500 block">{item.type}</span>
                  </div>
                  <button
                    onClick={() => showToast(`Downloading: ${item.title}`, "success")}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#151515] hover:text-[#D4AF37] text-slate-700 transition-colors cursor-pointer shrink-0 tap-bounce"
                    title="Download Material"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB 4: PRACTICE SUBMISSIONS & GURU FEEDBACK
        ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "practice" && (
          <div className="space-y-8 text-left">
            {/* Submit Homework Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#B99A63]/30 shadow-sm space-y-4">
              <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-[#151515]">
                Upload Weekly Practice Clip for Mentor Feedback
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Share a video link (Google Drive, YouTube unlisted, or Dropbox) of your weekly Adavu or recital rehearsal. Dr. Malavika will evaluate your posture, Aramandi angle, rhythm, and Abhinaya.
              </p>

              <form onSubmit={handleSubmitPractice} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Practice Title / Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tatta Adavu Speed 2 & 3"
                      value={submissionTitle}
                      onChange={(e) => setSubmissionTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Video Link (YouTube Unlisted / Google Drive / Cloud) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/... or YouTube link"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Notes / Questions for Dr. Malavika (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need feedback on knee position in Aramandi during the 3rd speed transition."
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#B99A63] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="silk-zari-btn px-6 py-2.5 rounded-full bg-[#151515] hover:bg-[#B99A63] text-[#F5F0E8] hover:text-[#151515] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer tap-bounce"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isSubmitting ? "Submitting..." : "Submit for Evaluation"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Submissions & Mentor Feedback History */}
            <div className="space-y-4">
              <h4 className="text-base font-bold font-serif-luxury text-slate-900">
                Evaluation History &amp; Biomechanical Feedback
              </h4>

              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            sub.status === "reviewed" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        <h5 className="text-sm font-bold text-slate-900">{sub.title}</h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{sub.date}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            sub.status === "reviewed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {sub.status === "reviewed" ? "Feedback Ready" : "Under Review"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                      <strong className="text-slate-900 block flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A63]" />
                        Mentor Feedback ({sub.mentor}):
                      </strong>
                      <p className="leading-relaxed">{sub.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
