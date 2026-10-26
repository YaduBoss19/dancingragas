import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import AnimatedSection from "../components/AnimatedSection";
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
  ShieldCheck
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
    course: selectedCourseForTrial?.title || selectedCourseForTrial || (courses[0]?.title || ""),
    category: selectedCourseForTrial?.category || "Dance",
    skillLevel: "Absolute Beginner",
    preferredTime: selectedCourseForTrial?.preferredTime || "Weekday Evening (5:00 PM - 7:00 PM)",
    branch: "Downtown Flagship Campus",
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
    const text = `Hello DancingRagas! I just booked a Free Trial Class for ${formData.studentName} for ${formData.course} (Ref: ${submittedEnquiry?.id || "New"}). Looking forward to scheduling!`;
    const url = `https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-x-clip">
      {/* Header */}
      <section className="relative pt-10 sm:pt-12 pb-12 sm:pb-14 bg-gradient-to-b from-purple-100/50 via-slate-50 to-white text-center">
        <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200">
            100% Complimentary • Zero Obligation
          </span>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Book Your Free Trial Class
          </h1>
          <p className="text-xs sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Experience our joyful studios, test our instruments, meet our certified mentors, and discover the right class for your child or yourself.
          </p>
        </AnimatedSection>
      </section>

      {/* Main Container */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-24 sm:pb-28 lg:pb-16">
        {submittedEnquiry ? (
          /* Confirmation State */
          <AnimatedSection
            animation="zoom-in"
            className="bg-white rounded-3xl p-6 sm:p-12 border border-emerald-100 shadow-2xl text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-100">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Booking Reference: {submittedEnquiry.id}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                You're All Set for a Free Trial!
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                Thank you! Our admissions coordinator will reach out to <strong>{formData.phone}</strong> or <strong>{formData.email}</strong> within 24 hours to confirm your studio room and time slot.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-800">{submittedEnquiry.studentName} (Age {submittedEnquiry.studentAge})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Selected Discipline:</span>
                <span className="font-bold text-purple-700">{submittedEnquiry.course}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Preferred Slot:</span>
                <span className="font-bold text-slate-800">{submittedEnquiry.preferredTime}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Studio Campus:</span>
                <span className="font-bold text-slate-800">{submittedEnquiry.branch}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={openWhatsAppConfirmation}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer tap-bounce"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Academy on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setSubmittedEnquiry(null);
                  setSelectedCourseForTrial(null);
                  navigateTo("timetable");
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer tap-bounce"
              >
                View Weekly Timetable
              </button>
            </div>
          </AnimatedSection>
        ) : (
          /* Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left: What to Expect & Guarantees */}
            <AnimatedSection animation="slide-left" className="lg:col-span-5 space-y-6 text-left">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#140F24] via-[#1A1230] to-[#0A0714] text-white shadow-xl space-y-5 border border-amber-500/30">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" /> What to Expect in Your Consultation
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-serif-luxury">
                  A Welcoming 45-Minute Introduction & Assessment
                </h3>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>1-on-1 Artist Consultation:</strong> Dr. Malavika personally assesses natural rhythm, posture, and recommends the ideal diploma or training tier.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Zero Equipment Needed:</strong> For your first session, just join in comfortable clothing. Tanpura accompaniment and exercises are provided.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Global Time Zone Friendly:</strong> Sessions flexibly coordinated across Georgia (GET), India (IST), UAE (GST), Europe (GMT), and USA (EST/PST).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Zero Pressure, Zero Fee:</strong> Experience the virtual studio atmosphere with zero registration fees or obligations.</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 shrink-0" />
                  <p className="text-xs text-slate-300">
                    Mentored directly by Dr. Malavika M. Sunil — CCRT Scholar, MBBS Physician, and Bharatanatyam Master.
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Need Immediate Assistance?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Chat directly with our student coordinator.</p>
                </div>
                <button
                  onClick={openWhatsAppConfirmation}
                  className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shrink-0 tap-bounce"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </AnimatedSection>

            {/* Right: Interactive Booking Form */}
            <AnimatedSection
              animation="slide-right"
              className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-10 border border-slate-100 shadow-xl text-left"
            >
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Student & Contact Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Please provide accurate contact information so we can confirm your slot.</p>
                </div>

                {/* Student Name & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-purple-600" /> Student Full Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      autoComplete="name"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="e.g. Mia Watson"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                        errors.studentName ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 focus:border-purple-500 focus:bg-white"
                      }`}
                    />
                    {errors.studentName && <p className="text-[11px] text-rose-500 font-medium">{errors.studentName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Age *</label>
                    <input
                      type="number"
                      name="studentAge"
                      inputMode="numeric"
                      min="3"
                      max="99"
                      value={formData.studentAge}
                      onChange={handleChange}
                      placeholder="e.g. 8"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                        errors.studentAge ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 focus:border-purple-500 focus:bg-white"
                      }`}
                    />
                    {errors.studentAge && <p className="text-[11px] text-rose-500 font-medium">{errors.studentAge}</p>}
                  </div>
                </div>

                {/* Parent / Guardian Name (if applicable) */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="text-xs font-bold text-slate-700">
                      Parent / Guardian Name {Number(formData.studentAge) < 18 ? "*" : "(Optional for adults)"}
                    </label>
                    <label className="text-[11px] text-slate-500 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAdult"
                        checked={formData.isAdult}
                        onChange={handleChange}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>I am an adult student</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="parentName"
                    autoComplete="name"
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder={formData.isAdult ? "N/A - Self" : "e.g. Karen Watson (Mother)"}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                      errors.parentName ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 focus:border-purple-500 focus:bg-white"
                    }`}
                  />
                  {errors.parentName && <p className="text-[11px] text-rose-500 font-medium">{errors.parentName}</p>}
                </div>

                {/* Contact Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-rose-500" /> Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                        errors.phone ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 focus:border-purple-500 focus:bg-white"
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-rose-500 font-medium">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-purple-600" /> Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                        errors.email ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 focus:border-purple-500 focus:bg-white"
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-rose-500 font-medium">{errors.email}</p>}
                  </div>
                </div>

                <div className="border-b border-slate-100 pb-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course & Timing Preferences</h3>
                </div>

                {/* Course Selection & Prior Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Preferred Class / Service *</label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-amber-500 font-medium"
                    >
                      <optgroup label="Courses We Offer (5)">
                        {courses
                          .filter((c) => c.category === "Courses We Offer")
                          .map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Other Services We Offer (6)">
                        {courses
                          .filter((c) => c.category === "Other Services We Offer")
                          .map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Prior Experience Level</label>
                    <select
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Absolute Beginner">Absolute Beginner (Starting fresh)</option>
                      <option value="Some Experience">Some Experience (Knows basic moves / swaras)</option>
                      <option value="Intermediate">Intermediate (1-3 years prior classical learning)</option>
                      <option value="Advanced / Transfer">Advanced / Seeking Diploma or Stage Choreography</option>
                      <option value="Institutional Organiser">Institutional / Academic Event Organiser</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Time & Learning Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Preferred Slot / Timing *
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Flexible Online Slot (Adjusted to your Timezone)">Flexible Online Slot (Adjusted to your Timezone)</option>
                      <option value="Weekday Evening (Europe / Georgia Time)">Weekday Evening (Europe / Georgia Time)</option>
                      <option value="Weekday Evening (India / IST)">Weekday Evening (India / IST)</option>
                      <option value="Weekend Morning (Global Batches)">Weekend Morning (Global Batches)</option>
                      <option value="Weekend Afternoon / Evening">Weekend Afternoon / Evening</option>
                      <option value="Institutional Dates (Custom Schedule)">Institutional Dates (Custom Schedule)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> Learning Mode / Location
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Online Live Interactive (Global / Remote)">Online Live Interactive (Global / Remote)</option>
                      <option value="Tbilisi Studio / In-Person, Georgia">Tbilisi Studio / In-Person, Georgia</option>
                      <option value="Institutional / On-Campus Residency">Institutional / On-Campus Residency</option>
                      <option value="Custom Event Venue / Private Rehearsal">Custom Event Venue / Private Rehearsal</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Special Notes or Questions (Optional)</label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Tell us about the student's interests, previous musical or dance exposure, or scheduling requests..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-500/30 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer tap-bounce"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Confirm Free Trial Booking</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-xs text-slate-400">
                  By booking, you agree to receive a confirmation WhatsApp/SMS from DancingRagas. We never share your data.
                </p>
              </form>
            </AnimatedSection>
          </div>
        )}
      </section>
    </div>
  );
}
