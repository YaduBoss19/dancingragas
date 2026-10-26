import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import AnimatedSection from "../components/AnimatedSection";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Building
} from "lucide-react";
import { FAQS } from "../data/initialData";

export default function ContactUs() {
  const { academyInfo, showToast, addEnquiry, faqs } = useAcademy();
  const activeFaqs = faqs || FAQS;

  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Course Enquiry",
    message: ""
  });

  const [formSent, setFormSent] = useState(false);

  const openWhatsApp = () => {
    const url = `https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      academyInfo.whatsappDefaultMsg
    )}`;
    window.open(url, "_blank");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      showToast("Please fill in your name, email and message.", "error");
      return;
    }

    // Save as general enquiry
    addEnquiry({
      studentName: contactForm.name,
      studentAge: "General Contact",
      parentName: "General Enquiry",
      phone: contactForm.phone || "Not provided",
      email: contactForm.email,
      course: contactForm.subject,
      category: "Contact Us",
      skillLevel: "N/A",
      preferredTime: "Anytime",
      branch: "All Branches",
      notes: contactForm.message
    });

    setFormSent(true);
    showToast("Message sent! Our admissions desk will reply shortly.", "success");
    setContactForm({
      name: "",
      email: "",
      phone: "",
      subject: "General Course Enquiry",
      message: ""
    });
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-x-clip">
      {/* Header */}
      <section className="relative pt-10 sm:pt-12 pb-12 sm:pb-14 bg-gradient-to-b from-purple-100/50 via-slate-50 to-white text-center">
        <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200">
            We'd Love to Hear From You
          </span>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Contact & Studio Locations
          </h1>
          <p className="text-xs sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Drop by our studios, send us a WhatsApp message, or reach our admissions counselors for personalized guidance.
          </p>
        </AnimatedSection>
      </section>

      {/* Quick Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Card 1: WhatsApp */}
          <AnimatedSection delay={0} className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm text-left flex flex-col justify-between hover-lift">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">WhatsApp Chat</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Fastest response! Chat directly with our student admissions director.
              </p>
            </div>
            <button
              onClick={openWhatsApp}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm tap-bounce"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat: +91 90745 85672</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </AnimatedSection>

          {/* Card 2: Direct Call */}
          <AnimatedSection delay={80} className="p-6 rounded-3xl bg-rose-50 border border-rose-200 shadow-sm text-left flex flex-col justify-between hover-lift">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-4 shadow-md shadow-rose-500/20">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Call Admissions</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Direct phone line for immediate schedule & trial inquiries.
              </p>
            </div>
            <a
              href={`tel:${academyInfo.directPhone.replace(/[^0-9+]/g, "")}`}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 text-center shadow-sm tap-bounce"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{academyInfo.directPhone}</span>
            </a>
          </AnimatedSection>

          {/* Card 3: Email */}
          <AnimatedSection delay={160} className="p-6 rounded-3xl bg-purple-50 border border-purple-200 shadow-sm text-left flex flex-col justify-between hover-lift">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-600/20">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Email Desk</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Detailed queries regarding curriculum, exam boards, or fees.
              </p>
            </div>
            <a
              href={`mailto:${academyInfo.email}`}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 text-center shadow-sm tap-bounce"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{academyInfo.email}</span>
            </a>
          </AnimatedSection>

          {/* Card 4: Hours */}
          <AnimatedSection delay={240} className="p-6 rounded-3xl bg-slate-900 text-white shadow-sm text-left flex flex-col justify-between hover-lift">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mb-4 border border-slate-700">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Studio Hours</h3>
              <div className="space-y-1 text-xs text-slate-300 mb-4">
                <p><strong>Mon – Fri:</strong> 2:00 PM – 9:00 PM</p>
                <p><strong>Saturday:</strong> 9:00 AM – 7:00 PM</p>
                <p><strong>Sunday:</strong> 9:30 AM – 5:00 PM</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Studios Open for Visitors
            </span>
          </AnimatedSection>
        </div>
      </section>

      {/* Campus Locations & Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Campuses Info */}
          <AnimatedSection animation="slide-left" className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
            {academyInfo.branches.map((b, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-md space-y-3 hover-lift"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{b.name}</h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </p>

                <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  <strong>Studio Facilities:</strong> {b.features}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 tap-bounce"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`tel:${b.phone}`}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    {b.phone}
                  </a>
                </div>
              </div>
            ))}
          </AnimatedSection>

          {/* Styled Google Maps Interactive Embed Card */}
          <AnimatedSection
            animation="slide-right"
            className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 relative min-h-[340px] sm:min-h-[380px]"
          >
            <iframe
              title="DancingRagas Academy Location Map"
              width="100%"
              height="100%"
              className="absolute inset-0 border-0 filter contrast-105"
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190564.92243405763!2d44.6644485558457!3d41.73256934898144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cd7e64f626b%3A0x61d084ede2576ea3!2sTbilisi%2C%20Georgia!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
            />
            {/* Map overlay card */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-200 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-900">DancingRagas Studio · Tbilisi, Georgia</h4>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600">
                In-person classical Bharatanatyam, Carnatic music, and yoga workshops in Georgia, plus worldwide online sessions.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* General Message Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <AnimatedSection animation="fade-up" className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-100 shadow-xl text-left space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Have a Specific Question?
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Send an Enquiry to Our Admissions Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Our team typically responds within 3 business hours.
            </p>
          </div>

          {formSent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <h4 className="text-base sm:text-lg font-bold text-emerald-800">Your message was sent successfully!</h4>
              <p className="text-xs text-emerald-700">Thank you for reaching out. We will connect with you via email or phone shortly.</p>
              <button
                onClick={() => setFormSent(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 tap-bounce"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Rachel Adams"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="rachel@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subject</label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="General Course Enquiry">General Course Enquiry</option>
                    <option value="Kids Batches (Ages 3-11)">Kids Batches (Ages 3-11)</option>
                    <option value="Adult Beginners Group">Adult Beginners Group</option>
                    <option value="Exam & Certification (Trinity/RAD)">Exam & Certification (Trinity/RAD)</option>
                    <option value="Studio Rental / Private Coaching">Studio Rental / Private Coaching</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Your Message *</label>
                <textarea
                  rows="4"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can we assist you with our music or dance programs?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer tap-bounce"
              >
                <Send className="w-4 h-4" />
                <span>Submit Enquiry</span>
              </button>
            </form>
          )}
        </AnimatedSection>
      </section>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-24 sm:pb-28 lg:pb-16">
        <AnimatedSection animation="fade-up" className="text-center mb-8 sm:mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </AnimatedSection>

        <div className="space-y-3">
          {activeFaqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            const faqNum = faq.number || String(idx + 1).padStart(2, "0");
            return (
              <AnimatedSection
                key={idx}
                delay={Math.min(idx * 30, 300)}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs text-left transition-all"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-slate-900 hover:text-purple-700 transition-colors cursor-pointer tap-bounce"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-purple-600 font-mono text-sm font-semibold shrink-0">
                      {faqNum}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-purple-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 pl-10 sm:pl-11 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </AnimatedSection>
            );
          })}
        </div>

        {/* Ending note in quotes as requested */}
        <AnimatedSection animation="fade-up" className="mt-8 sm:mt-10">
          <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-6 sm:p-8 text-center shadow-xs">
            <p className="text-sm sm:text-base italic font-serif text-slate-800 leading-relaxed max-w-2xl mx-auto">
              &ldquo;Still have questions? Contact DancingRagas through our website or official social media page for enquiries about registrations, fees and batch availability.&rdquo;
            </p>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
