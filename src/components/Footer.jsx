import React from "react";
import { useAcademy } from "../context/AcademyContext";
import { playGhungrooChime } from "../utils/talamAudio";
import WhatsAppIcon from "./WhatsAppIcon";
import YouTubeIcon from "./YouTubeIcon";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Award
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const { currentPage, navigateTo, academyInfo } = useAcademy();

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

  const openWhatsApp = () => {
    const cleanNumber = (academyInfo?.whatsappNumber || "919074585672").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      academyInfo?.whatsappDefaultMsg ||
        "Hello Dr. Malavika! I would like to enquire about classical dance & music coaching."
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, "_blank");
  };

  return (
    <footer id="contact-section" className="bg-[#141414] text-[#F5F0E8] pt-12 pb-24 sm:pb-28 lg:pb-12 border-t border-[#DFAC88]/20 relative overflow-hidden font-sans">
      {/* Subtle warm ambient glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#C9956A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        {/* Sleek Top Banner: Consultation CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-[#1E0D1B] via-[#2A1226] to-[#1E0D1B] border border-[#DFAC88]/30 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DFAC88]/15 text-[#DFAC88] border border-[#DFAC88]/30 text-[10px] font-bold uppercase tracking-wider">
              <Award className="w-3 h-3" />
              <span>Classical Arts Mentorship</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
              Ready to begin your classical journey?
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
              1-on-1 pedagogical consultation with Dr. Malavika M. Sunil. Personalized classical training across worldwide time zones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("book-trial");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else navigateTo("trial");
              }}
              className="silk-zari-btn px-6 py-3 rounded-full bg-gradient-to-r from-[#DFAC88] to-[#C9956A] text-[#151515] font-bold text-xs shadow-lg hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer tap-bounce"
            >
              <span>Book Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={openWhatsApp}
              className="px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer tap-bounce"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>WhatsApp Direct</span>
            </button>
          </div>
        </div>

        {/* Clean, Non-Repetitive 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-8 border-b border-white/10 text-left">
          {/* Column 1: Academy & Dr. Malavika */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#F5F0E8] p-1.5 shadow-md flex items-center justify-center shrink-0 border border-[#DFAC88]/40">
                <img
                  src="/images/logo_transparent.png"
                  alt="DancingRagas Academy Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-lg text-white font-serif-luxury block leading-tight">
                  Dr. Malavika M Sunil
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#DFAC88] uppercase block">
                  DancingRagas Academy
                </span>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed">
              Founded &amp; personally directed by Dr. Malavika M. Sunil (MBBS, CCRT Scholar, Bharatanatyam exponent). Dedicated to providing mindful, anatomical, and expressive classical arts training worldwide.
            </p>

            {/* Social Media Links (Single clean luxury row, no duplicates) */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/919074585672"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all"
                title="Connect on WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={academyInfo.instagramUrl || "https://www.instagram.com/dancingragasbymalavika/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E1306C]/15 hover:bg-[#E1306C]/25 border border-[#E1306C]/40 text-[#f56040] text-xs font-bold transition-all"
                title="Follow on Instagram"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-[7px] text-white font-bold">
                  ig
                </span>
                <span>Instagram</span>
              </a>

              <a
                href="https://www.youtube.com/@dancingragasbymalavika"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF0000]/15 hover:bg-[#FF0000]/25 border border-[#FF0000]/40 text-rose-400 text-xs font-bold transition-all"
                title="Subscribe on YouTube"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#DFAC88] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("top", "home")}
                  className="hover:text-[#DFAC88] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("about-artist", "about")}
                  className="hover:text-[#DFAC88] transition-colors cursor-pointer"
                >
                  About Dr. Malavika
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("services-section", "courses")}
                  className="hover:text-[#DFAC88] transition-colors cursor-pointer"
                >
                  Courses &amp; Curriculum
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("gallery-section", "gallery")}
                  className="hover:text-[#DFAC88] transition-colors cursor-pointer"
                >
                  Photo &amp; Stage Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo("trial")}
                  className="hover:text-[#DFAC88] transition-colors cursor-pointer"
                >
                  Book Audition / Free Trial
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Course Disciplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#DFAC88] mb-4">
              Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li onClick={() => navigateTo("courses")} className="hover:text-[#DFAC88] transition-colors cursor-pointer">
                Bharatanatyam Diploma (Govt Sanad)
              </li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#DFAC88] transition-colors cursor-pointer">
                Foundational Adavu &amp; Rhythm Drill
              </li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#DFAC88] transition-colors cursor-pointer">
                Carnatic Vocal Music (Raga &amp; Tala)
              </li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#DFAC88] transition-colors cursor-pointer">
                Semi-Classical &amp; Bollywood Expressions
              </li>
              <li onClick={() => navigateTo("courses")} className="hover:text-[#DFAC88] transition-colors cursor-pointer">
                Physician-Led Dance Physiology
              </li>
            </ul>
          </div>

          {/* Column 4: Clean Studio Contact (Direct & Non-repetitive) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#DFAC88] mb-4">
              Direct Contact
            </h4>

            <div className="space-y-2.5 text-xs text-stone-300">
              <a
                href="https://wa.me/919074585672"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span className="font-semibold">+91 90745 85672</span>
              </a>

              <a
                href="mailto:info@malavikasunil.com"
                className="flex items-center gap-2 hover:text-[#DFAC88] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#DFAC88] shrink-0" />
                <span>info@malavikasunil.com</span>
              </a>

              <div className="flex items-start gap-2 text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-[#DFAC88] shrink-0 mt-0.5" />
                <span>Global Interactive Online Classes &bull; Kerala Studio</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Faculty Direct Desk</span>
              </span>
            </div>
          </div>
        </div>

        {/* Clean Bottom Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 pt-2">
          <p>
            &copy; {CURRENT_YEAR} Dr. Malavika M. Sunil. All rights reserved. DancingRagas Classical Arts Academy.
          </p>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => handleNavClick("top", "home")}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Back to Top &uarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
