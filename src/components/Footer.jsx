import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import { playGhungrooChime } from "../utils/talamAudio";
import {
  Phone,
  Mail,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Award,
  Heart,
  Lock
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const { currentPage, navigateTo, academyInfo, showToast } = useAcademy();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNavClick = (target, pageId) => {
    playGhungrooChime();
    if (pageId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigateTo("home");
      return;
    }
    if (currentPage === "home") {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    navigateTo(pageId);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    showToast("🎉 Thank you for subscribing to Dr. Malavika M. Sunil's Studio Notes!", "success");
    setNewsletterEmail("");
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      academyInfo.whatsappDefaultMsg
    )}`;
    window.open(url, "_blank");
  };

  return (
    <footer id="contact-section" className="bg-[#151515] text-[#F5F0E8] pt-16 pb-24 sm:pb-28 lg:pb-12 border-t border-[#A9A49D]/20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#B99A63]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Top Call to Action Strip */}
        <div className="rounded-3xl bg-[#1c1c1c] border border-[#B99A63]/30 p-8 sm:p-10 mb-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B99A63]/15 text-[#B99A63] border border-[#B99A63]/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#B99A63]" /> Classical Arts Mentorship
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif-luxury text-[#F5F0E8]">
              Ready to begin your personal dance or vocal journey?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Consult directly with Dr. Malavika M. Sunil. Flexible 1-on-1 pedagogical scheduling across international time zones with zero commitment.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById("book-trial");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigateTo("trial");
                }
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B99A63] hover:brightness-105 text-[#151515] font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 tap-bounce"
            >
              <span>Admissions Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#151515]" />
            </button>
            <button
              onClick={openWhatsApp}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer tap-bounce"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Dr. Malavika</span>
            </button>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#A9A49D]/20 text-left">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-[#F5F0E8] p-1.5 shadow-lg flex items-center justify-center shrink-0 border border-[#B99A63]/40">
                <img src="/images/logo_transparent.png" alt="DancingRagas Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-2xl tracking-tight text-[#F5F0E8] font-serif-luxury block leading-tight">
                  Dr. Malavika M Sunil
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#B99A63] uppercase">
                  Dance &amp; Music
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Founded & personally directed by <strong>Dr. Malavika M. Sunil</strong> (CCRT Scholar, Bharatanatyam disciple of 21 years, Carnatic vocalist, and physician). Dedicated to providing mindful, anatomical, and expressive classical training worldwide.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-lg bg-[#1f1f1f] border border-[#A9A49D]/20 text-[11px] font-semibold text-[#B99A63] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#B99A63]" /> CCRT National Scholar
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#1f1f1f] border border-[#A9A49D]/20 text-[11px] font-semibold text-[#F5F0E8] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#B99A63]" /> 21+ Years Classical Lineage
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B99A63] mb-4">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => handleNavClick("top", "home")}
                  className="hover:text-[#F5F0E8] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("about-artist", "about")}
                  className="hover:text-[#F5F0E8] transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("services-section", "courses")}
                  className="hover:text-[#F5F0E8] transition-colors cursor-pointer"
                >
                  Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("gallery-section", "gallery")}
                  className="hover:text-[#F5F0E8] transition-colors cursor-pointer"
                >
                  Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Lesson Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B99A63] mb-4">
              Course Offerings
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li onClick={() => navigateTo("courses")} className="hover:text-[#B99A63] transition-colors cursor-pointer">Bharatanatyam Diploma</li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#B99A63] transition-colors cursor-pointer">Carnatic Vocal Music</li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#B99A63] transition-colors cursor-pointer">Semi-Classical & Bollywood</li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#B99A63] transition-colors cursor-pointer">Physician-Led Yoga & Breath</li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#B99A63] transition-colors cursor-pointer">Personalised Song Choreography</li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#B99A63] transition-colors cursor-pointer">Stage Show Choreography</li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#B99A63] transition-colors cursor-pointer">Institutional Workshops</li>
            </ul>
          </div>

          {/* Col 4: Studio Notes & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B99A63] mb-4">
              Studio Notes
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Receive updates on workshop dates, recital invitations, and musical musings.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2 mb-4">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f1f1f] border border-[#A9A49D]/20 text-xs text-[#F5F0E8] placeholder-slate-500 focus:outline-none focus:border-[#B99A63]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#B99A63] hover:bg-[#cca86d] text-[#151515] text-xs font-bold transition-all cursor-pointer"
              >
                Subscribe
              </button>
            </form>

            <div className="space-y-1.5 text-xs text-slate-400">
              <a
                href={`https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>+91 90745 85672 (WhatsApp)</span>
              </a>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B99A63] shrink-0" />
                <span>{academyInfo.directPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B99A63] shrink-0" />
                <span>{academyInfo.email}</span>
              </div>
              <a
                href={academyInfo.instagramUrl || "https://www.instagram.com/dancingragasbymalavika/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors pt-0.5"
              >
                <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shrink-0 text-[8px] text-white font-bold">
                  ig
                </span>
                <span>@dancingragasbymalavika</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {CURRENT_YEAR} Dr. Malavika M. Sunil. All rights reserved. Private Dance & Music Coaching.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo("admin")}
              className="flex items-center gap-1.5 text-stone-500 hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#B99A63]" />
              <span>Director &amp; Tutor Suite</span>
            </button>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              Move. Learn. Master. with <Heart className="w-3 h-3 text-[#B99A63] fill-[#B99A63]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
