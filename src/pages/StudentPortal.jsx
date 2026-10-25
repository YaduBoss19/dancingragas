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
  CheckCircle,
  FileText,
  User,
  LogOut,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function StudentPortal({ onOpenAuth }) {
  const { authUser, userRole, handleLogout, showToast } = useAcademy();

  // Local Timezone calculation
  const [userTimezone, setUserTimezone] = useState("");
  const [activeTab, setActiveTab] = useState("schedule"); // 'schedule' | 'resources' | 'practice'

  // Mock student batch data (connected to Supabase/state)
  const studentName = authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0] || "Student Artist";
  const batchName = authUser?.user_metadata?.batch_name || "Online Bharatanatyam Diploma (Batch A)";

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
      date: "Oct 22, 2026",
      status: "reviewed",
      feedback:
        "Excellent footwork precision! Make sure the Aramandi knee angle stays aligned without leaning forward to protect the joints.",
      mentor: "Dr. Malavika M. Sunil (MBBS)"
    },
    {
      id: "sub-2",
      title: "Alarippu Talam Precision (Tisra Ekam)",
      date: "Oct 25, 2026",
      status: "pending",
      feedback: "Reviewing in progress. Feedback will be posted before Saturday masterclass.",
      mentor: "Pending"
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
          feedback: "Submission received. Dr. Malavika will review your biomechanics & rhythm shortly.",
          mentor: "Dr. Malavika M. Sunil"
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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#151515] py-10 sm:py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="rounded-3xl bg-gradient-to-r from-[#151515] via-[#25060C] to-[#151515] text-[#F5F0E8] p-6 sm:p-10 border border-[#B99A63]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B99A63]/20 border border-[#B99A63]/40 text-[#D4AF37] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DancingRagas Student Sanctuary</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif-luxury tracking-tight">
              Namaskaram, <span className="text-[#D4AF37]">{studentName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Enrolled in: <strong className="text-white">{batchName}</strong> • Mentored by Dr. Malavika M. Sunil
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
        </div>

        {/* Local Timezone Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#B99A63]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-[#B99A63]" />
            <span>
              Detected Timezone: <strong className="text-[#151515]">{userTimezone}</strong> (All class times are synced to your device clock)
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            ● Batch Status: Active
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "schedule"
                ? "bg-[#151515] text-[#D4AF37] shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Classroom &amp; Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "resources"
                ? "bg-[#151515] text-[#D4AF37] shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Learning Vault (PDF &amp; Audio)</span>
          </button>
          <button
            onClick={() => setActiveTab("practice")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "practice"
                ? "bg-[#151515] text-[#D4AF37] shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Practice Submissions &amp; Reviews</span>
          </button>
        </div>

        {/* TAB 1: SCHEDULE & LIVE CLASSROOM */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Live Classroom Join Card */}
              <div className="md:col-span-2 rounded-3xl bg-white border border-[#B99A63]/30 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between text-left">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B99A63]">
                      Next Live Online Session
                    </span>
                    <span className="animate-pulse flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      Studio Room Ready
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#151515]">
                    Bharatanatyam Diploma: Adavu Rhythmic Precision &amp; Theory
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Interactive live instruction conducted directly by Dr. Malavika. Please ensure you have comfortable practice saree/salwar, your ghungroos, and space for Aramandi footing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs">Scheduled Slot</span>
                    <strong className="text-slate-900 font-bold">
                      Monday &amp; Friday • 05:30 PM - 06:30 PM (Your Local Time)
                    </strong>
                  </div>
                  <a
                    href="https://meet.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="silk-zari-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#151515] hover:bg-[#B99A63] text-[#F5F0E8] hover:text-[#151515] text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
                  >
                    <Video className="w-4 h-4 text-[#D4AF37]" />
                    <span>Join Google Meet Classroom</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              </div>

              {/* Attendance & Batch Summary */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                <h4 className="font-bold text-sm text-[#151515] font-serif-luxury">
                  Your Learning Progress
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                    <span className="text-slate-600">Attendance Rate</span>
                    <strong className="text-emerald-700 font-bold">96% (12/12 Sessions)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                    <span className="text-slate-600">Prescribed Exam Year</span>
                    <strong className="text-slate-900 font-bold">Diploma Level 1 (2026/27)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                    <span className="text-slate-600">Theory Completion</span>
                    <strong className="text-[#B99A63] font-bold">8 / 10 Modules</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-slate-500 leading-normal block">
                    Have questions about rescheduling a session? Contact academy support via the floating concierge.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEARNING VAULT (PDFs, Theory & Tanpura) */}
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
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#B99A63] hover:text-[#151515] border border-white/20 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
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
                  type: "Clinical Clinical Biomechanics",
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
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#151515] hover:text-[#D4AF37] text-slate-700 transition-colors cursor-pointer shrink-0"
                    title="Download Material"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRACTICE SUBMISSIONS & GURU FEEDBACK */}
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
                      placeholder="e.g. Tatta Adavu 1-8 Speed II &amp; III"
                      value={submissionTitle}
                      onChange={(e) => setSubmissionTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Video Link (Drive / YouTube / Vimeo) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/..."
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notes or Questions for Dr. Malavika
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Having difficulty keeping balance in the 4th step during fast tempo..."
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#B99A63] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="silk-zari-btn px-6 py-3 rounded-full bg-[#151515] hover:bg-[#B99A63] text-[#F5F0E8] hover:text-[#151515] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isSubmitting ? "Submitting..." : "Submit for Guru Feedback"}</span>
                </button>
              </form>
            </div>

            {/* Past Submissions & Feedback History */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 font-serif-luxury">
                Submission &amp; Review History
              </h4>
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{sub.title}</span>
                        <span className="text-[11px] text-slate-400">• {sub.date}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          sub.status === "reviewed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {sub.status === "reviewed" ? "✓ Reviewed by Dr. Malavika" : "● In Review"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                      <strong className="text-[#B99A63] block mb-1">Guru Feedback:</strong>
                      {sub.feedback}
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
