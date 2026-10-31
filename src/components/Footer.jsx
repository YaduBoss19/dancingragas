import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import { playGhungrooChime } from "../utils/talamAudio";
import WhatsAppIcon from "./WhatsAppIcon";
import YouTubeIcon from "./YouTubeIcon";
import {
  Phone,
  Mail,
  ArrowRight,
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
              Classical Arts Mentorship
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
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer tap-bounce"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" />
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

            {/* Official Social Media Connection Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
              {/* WhatsApp */}
              <a
                href="https://wa.me/919074585672"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all shadow-xs"
                title="Connect on WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {/* Instagram */}
              <a
                href={academyInfo.instagramUrl || "https://www.instagram.com/dancingragasbymalavika/"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E1306C]/15 hover:bg-[#E1306C]/25 border border-[#E1306C]/40 text-[#f56040] text-xs font-bold transition-all shadow-xs"
                title="Follow on Instagram"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-[7px] text-white font-bold">
                  ig
                </span>
                <span>Instagram</span>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@dancingragasbymalavika"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF0000]/15 hover:bg-[#FF0000]/25 border border-[#FF0000]/40 text-rose-400 text-xs font-bold transition-all shadow-xs"
                title="Subscribe on YouTube"
              >
                <YouTubeIcon className="w-4 h-4" />
                <span>YouTube</span>
              </a>
            </div>

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

            <div className="space-y-2 text-xs text-slate-400">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0 text-[#25D366]" />
                <span className="font-semibold text-stone-300">WhatsApp: +91 90745 85672</span>
              </a>

              {/* Instagram */}
              <a
                href={academyInfo.instagramUrl || "https://www.instagram.com/dancingragasbymalavika/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pink-400 transition-colors"
              >
                <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shrink-0 text-[8px] text-white font-bold">
                  ig
                </span>
                <span className="font-semibold text-stone-300">Instagram: @dancingragasbymalavika</span>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@dancingragasbymalavika"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-rose-400 transition-colors"
              >
                <YouTubeIcon className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-stone-300">YouTube: @dancingragasbymalavika</span>
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

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Social Icons Strip */}
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/919074585672"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-[#25D366] transition-colors p-1"
                title="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={academyInfo.instagramUrl || "https://www.instagram.com/dancingragasbymalavika/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-pink-400 transition-colors p-1"
                title="Instagram"
              >
                <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] inline-flex items-center justify-center text-[8px] text-white font-bold">
                  ig
                </span>
              </a>
              <a
                href="https://www.youtube.com/@dancingragasbymalavika"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                title="YouTube"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
            </div>

            <span className="flex items-center gap-1 text-slate-400">
              Move. Learn. Master. with <Heart className="w-3 h-3 text-[#B99A63] fill-[#B99A63]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
