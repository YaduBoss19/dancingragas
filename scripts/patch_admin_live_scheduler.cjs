const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "pages", "AdminDashboard.jsx");
let content = fs.readFileSync(filePath, "utf8");

// 1. Destructure liveClassSchedules, addLiveClassSchedule, updateLiveClassSchedule, deleteLiveClassSchedule
if (!content.includes("liveClassSchedules,")) {
  content = content.replace(
    "    updateLiveClassConfig,",
    "    updateLiveClassConfig,\n    liveClassSchedules,\n    addLiveClassSchedule,\n    updateLiveClassSchedule,\n    deleteLiveClassSchedule,"
  );
}

// 2. Add batch schedule state if not already added
if (!content.includes("isLiveScheduleModalOpen")) {
  const targetAnchor = "  // Live Studio broadcast settings state";
  const stateToAdd = `  // Batch Live Class Scheduler state
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
  });\n\n`;
  content = content.replace(targetAnchor, stateToAdd + targetAnchor);
}

// 3. Replace the live_studio section
const oldStudioStart = `{/* LIVE BROADCAST STUDIO */}\n        {activeTab === "live_studio" && (`;
const oldStudioEnd = `        )}\n      </div>\n\n      {/* ═══════════════════════════════════════════════════════════════\n          MODAL: EDIT COURSE & 5-SLIDE PHOTO GALLERY`;

const newStudioContent = `{/* LIVE BROADCAST STUDIO & BATCH GOOGLE MEET SCHEDULER */}
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

                      {/* Enrolled Disciples preview */}
                      <div className="pt-2 flex items-center justify-between text-xs text-stone-600">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <Users className="w-3.5 h-3.5 text-[#B99A63]" />
                          <span><strong>{enrolledDisciples.length}</strong> disciples automatically connected</span>
                        </span>
                        <div className="flex items-center gap-2">
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
                          id: \`live-sched-\${Date.now()}\`
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
        )}`;

// Normalize newlines in content and search targets
const normalizedContent = content.replace(/\r\n/g, "\n");
const normalizedOldStudioStart = oldStudioStart.replace(/\r\n/g, "\n");
const normalizedOldStudioEnd = oldStudioEnd.replace(/\r\n/g, "\n");

const startIndex = normalizedContent.indexOf(normalizedOldStudioStart);
const endIndex = normalizedContent.indexOf(normalizedOldStudioEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find start or end index for live_studio tab in AdminDashboard.jsx");
  process.exit(1);
}

const finalContent =
  normalizedContent.slice(0, startIndex) +
  newStudioContent +
  "\n      </div>\n\n      {/* ═══════════════════════════════════════════════════════════════\n          MODAL: EDIT COURSE & 5-SLIDE PHOTO GALLERY" +
  normalizedContent.slice(endIndex + normalizedOldStudioEnd.length);

fs.writeFileSync(filePath, finalContent, "utf8");
console.log("Successfully patched AdminDashboard.jsx with Batch Live Class Scheduler!");
