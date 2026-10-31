import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import AnimatedSection from "../components/AnimatedSection";
import WhatsAppIcon from "../components/WhatsAppIcon";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Calendar
} from "lucide-react";

export default function BookTrial() {
  const { courses, selectedCourseForTrial, setSelectedCourseForTrial, addEnquiry, academyInfo, navigateTo } = useAcademy();

  const [formData, setFormData] = useState(() => ({
    studentName: "",
    studentAge: "",
    isAdult: false,
    parentName: "",
    phone: "",
    email: "",
    course: selectedCourseForTrial?.title || selectedCourseForTrial || (courses[0]?.title || "Bharatanatyam Diploma"),
    category: selectedCourseForTrial?.category || "Classical Dance",
    skillLevel: "Absolute Beginner",
    preferredTime: selectedCourseForTrial?.preferredTime || "Weekday Evening (5:00 PM - 7:00 PM IST)",
    branch: "Online Virtual Studio (Global)",
    notes: ""
  }));

  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);
  const [errors, setErrors] = useState({});

  const [prevSelectedCourse, setPrevSelectedCourse] = useState(selectedCourseForTrial);
  if (selectedCourseForTrial !== prevSelectedCourse) {
    setPrevSelectedCourse(selectedCourseForTrial);
    if (selectedCourseForTrial) {
      setFormData((prev) => ({
        ...prev,
        course: selectedCourseForTrial.title || selectedCourseForTrial,
        category: selectedCourseForTrial.category || prev.category,
        preferredTime: selectedCourseForTrial.preferredTime || prev.preferredTime
      }));
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = "Please enter student's full name";
    if (!formData.studentAge || isNaN(formData.studentAge) || formData.studentAge < 3) {
      newErrors.studentAge = "Please enter a valid age (min age 3)";
    }
    if (!formData.isAdult && Number(formData.studentAge) < 18 && !formData.parentName.trim()) {
      newErrors.parentName = "Please provide parent or guardian's name for minors";
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      newErrors.phone = "Please enter a valid phone/WhatsApp number";
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.course) {
      newErrors.course = "Please select a preferred course";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const saved = addEnquiry(formData);
    setSubmittedEnquiry(saved);
  };

  const openWhatsAppConfirmation = () => {
    const text = `Hello Dr. Malavika! I just requested an Admissions Consultation & Audition for ${formData.studentName} for ${formData.course} (Ref: ${submittedEnquiry?.id || "DR-ADM"}). Looking forward to scheduling!`;
    const url = `https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-x-clip bg-[#F5F0E8] text-[#151515]">
      {/* Editorial Luxury Header */}
      <section className="relative pt-12 sm:pt-16 pb-12 sm:pb-16 bg-gradient-to-b from-[#151515] via-[#2A080E] to-[#151515] text-[#F5F0E8] text-center border-b border-[#B99A63]/30">
        <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] bg-white/5 px-4 py-1.5 rounded-full border border-[#B99A63]/40 inline-flex items-center gap-2">
            
            <span>Selective Mentorship • Admissions 2026/27</span>
          </span>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold font-serif-luxury tracking-tight text-white">
            Admissions Consultation &amp; Audition
          </h1>
          <p className="text-xs sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto font-sans">
            A private 1-on-1 pedagogical evaluation with Dr. Malavika M. Sunil (MBBS) to assess biomechanical readiness, rhythm affinity, and map the optimal diploma trajectory.
          </p>
        </AnimatedSection>
      </section>

      {/* Main Container */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-24 sm:pb-28 lg:pb-16">
        {submittedEnquiry ? (
          /* Confirmation State */
          <AnimatedSection
            animation="zoom-in"
            className="bg-white rounded-3xl p-6 sm:p-12 border border-[#B99A63]/40 shadow-2xl text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-100 shadow-md">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B99A63] bg-[#B99A63]/10 px-3.5 py-1 rounded-full border border-[#B99A63]/30">
                Audition Dossier Ref: {submittedEnquiry.id}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900">
                Consultation Request Received
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                Thank you! Dr. Malavika and our admissions desk will coordinate directly via WhatsApp at <strong>{formData.phone}</strong> or email at <strong>{formData.email}</strong> to schedule your virtual studio room and time slot.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-[#B99A63]/30 text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">Applicant:</span>
                <span className="font-bold text-stone-900">{submittedEnquiry.studentName} (Age {submittedEnquiry.studentAge})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">Selected Discipline:</span>
                <span className="font-bold text-[#3B0B14]">{submittedEnquiry.course}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">Preferred Slot:</span>
                <span className="font-bold text-stone-900">{submittedEnquiry.preferredTime}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Classroom Format:</span>
                <span className="font-bold text-stone-900">{submittedEnquiry.branch}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={openWhatsAppConfirmation}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer tap-bounce"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                <span>Confirm on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setSubmittedEnquiry(null);
                  setSelectedCourseForTrial(null);
                  navigateTo("courses");
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer tap-bounce"
              >
                Explore Course Syllabus
              </button>
            </div>
          </AnimatedSection>
        ) : (
          /* Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left: What to Expect & Elite Guarantees */}
            <AnimatedSection animation="slide-left" className="lg:col-span-5 space-y-6 text-left">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#151515] via-[#2A080E] to-[#151515] text-[#F5F0E8] shadow-2xl space-y-5 border border-[#B99A63]/40">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B99A63]/20 border border-[#B99A63]/40 text-xs font-bold text-[#D4AF37]">
                  What to Expect
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-serif-luxury text-white">
                  A Welcoming 45-Minute Introduction &amp; Assessment
                </h3>

                <ul className="space-y-3.5 text-xs sm:text-sm text-stone-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>1-on-1 Artist Evaluation:</strong> Dr. Malavika personally evaluates natural rhythm, postural alignment, and recommends the appropriate diploma or recreational tier.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Zero Equipment Needed:</strong> For your preliminary audition, simply join in comfortable clothing. Electronic Tanpura drone and practice guides are provided.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>International Time Zone Harmony:</strong> Sessions scheduled flexibly across India (IST), UAE (GST), Europe (GMT/CET), USA (EST/PST), and Georgia (GET).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>No Registration Fee:</strong> Experience the virtual studio with zero up-front financial commitment.</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#D4AF37] shrink-0" />
                  <p className="text-xs text-stone-300">
                    Mentored directly by Dr. Malavika M. Sunil — CCRT National Scholar, MBBS Physician, and Classical Margam Master.
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#B99A63]/30 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">Prefer an Immediate Chat?</h4>
                  <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Contact Dr. Malavika directly on WhatsApp.</p>
                </div>
                <button
                  type="button"
                  onClick={openWhatsAppConfirmation}
                  className="px-4 py-2 rounded-full bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba59] transition-colors flex items-center gap-2 shrink-0 tap-bounce cursor-pointer shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </AnimatedSection>

            {/* Right: Interactive Admissions Form */}
            <AnimatedSection
              animation="slide-right"
              className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#B99A63]/30 shadow-xl text-left"
            >
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-stone-900">Applicant &amp; Guardian Information</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Please provide accurate contact details so we can allocate your studio slot.</p>
                </div>

                {/* Student Name & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#B99A63]" /> Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      autoComplete="name"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="e.g., Ananya Nair"
                      className={`w-full px-4 py-3 rounded-xl border bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#B99A63] ${
                        errors.studentName ? "border-rose-400 bg-rose-50/30" : "border-stone-200 focus:border-[#B99A63]"
                      }`}
                    />
                    {errors.studentName && <p className="text-[11px] text-rose-500">{errors.studentName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Age *</label>
                    <input
                      type="number"
                      name="studentAge"
                      min="3"
                      max="99"
                      value={formData.studentAge}
                      onChange={handleChange}
                      placeholder="e.g., 9"
                      className={`w-full px-4 py-3 rounded-xl border bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#B99A63] ${
                        errors.studentAge ? "border-rose-400 bg-rose-50/30" : "border-stone-200 focus:border-[#B99A63]"
                      }`}
                    />
                    {errors.studentAge && <p className="text-[11px] text-rose-500">{errors.studentAge}</p>}
                  </div>
                </div>

                {/* Parent / Guardian Name (if under 18) */}
                {Number(formData.studentAge) > 0 && Number(formData.studentAge) < 18 && (
                  <div className="space-y-1.5 animate-in fade-in">
                    <label className="text-xs font-bold text-stone-700">Parent / Guardian Full Name *</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Parent's Name"
                      className={`w-full px-4 py-3 rounded-xl border bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#B99A63] ${
                        errors.parentName ? "border-rose-400 bg-rose-50/30" : "border-stone-200 focus:border-[#B99A63]"
                      }`}
                    />
                    {errors.parentName && <p className="text-[11px] text-rose-500">{errors.parentName}</p>}
                  </div>
                )}

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#B99A63]" /> WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`w-full px-4 py-3 rounded-xl border bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#B99A63] ${
                        errors.phone ? "border-rose-400 bg-rose-50/30" : "border-stone-200 focus:border-[#B99A63]"
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#B99A63]" /> Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@domain.com"
                      className={`w-full px-4 py-3 rounded-xl border bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#B99A63] ${
                        errors.email ? "border-rose-400 bg-rose-50/30" : "border-stone-200 focus:border-[#B99A63]"
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                  </div>
                </div>

                {/* Course Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#B99A63]" /> Preferred Discipline *
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:border-[#B99A63] focus:ring-1 focus:ring-[#B99A63]"
                  >
                    {(courses || []).map((c) => (
                      <option key={c.id || c.title} value={c.title}>
                        {c.title} — {c.level || c.ageGroup}
                      </option>
                    ))}
                    <option value="Custom Bespoke Mentorship">Custom Bespoke Mentorship / Choreography</option>
                  </select>
                </div>

                {/* Skill Level & Preferred Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Prior Experience Level</label>
                    <select
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:border-[#B99A63]"
                    >
                      <option value="Absolute Beginner">Absolute Beginner (Starting fresh)</option>
                      <option value="1-2 Years Previous Training">1–2 Years Previous Training</option>
                      <option value="Intermediate / Post-Arangetram">Intermediate / Post-Arangetram</option>
                      <option value="Adult Returning Dancer">Adult Returning Dancer</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#B99A63]" /> Preferred Timing
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:border-[#B99A63]"
                    >
                      <option value="Weekday Evening (5:00 PM - 8:00 PM IST)">Weekday Evening (IST)</option>
                      <option value="Weekend Morning (9:00 AM - 12:00 PM IST)">Weekend Morning (IST)</option>
                      <option value="US EST Morning / EU Afternoon Slot">US EST / Europe Timezone Friendly</option>
                      <option value="Flexible / Schedule via WhatsApp">Flexible / Confirm via WhatsApp</option>
                    </select>
                  </div>
                </div>

                {/* Additional Artistic Goals */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Artistic Aspirations &amp; Questions (Optional)</label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Tell Dr. Malavika about your prior training, specific items you wish to learn, or injury considerations..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:border-[#B99A63] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="silk-zari-btn w-full py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#151515] font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-[#D4AF37]/20 hover:brightness-105 active:scale-98 transition-all duration-300 cursor-pointer tap-bounce flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#151515]" />
                  <span>Submit Admissions Dossier</span>
                  <ArrowRight className="w-4 h-4 text-[#151515]" />
                </button>
              </form>
            </AnimatedSection>
          </div>
        )}
      </section>
    </div>
  );
}
