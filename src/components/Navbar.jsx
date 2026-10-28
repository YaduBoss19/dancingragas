import React, { useState, useEffect } from "react";
import { useAcademy } from "../context/AcademyContext";
import { playGhungrooChime } from "../utils/talamAudio";
import { Sparkles, ChevronRight, GraduationCap, Shield, User } from "lucide-react";
import { EditableText, EditableMedia } from "./LiveVisualEditor";

export default function Navbar() {
  const { currentPage, navigateTo, authUser, userRole, setIsAuthModalOpen, siteContent } = useAcademy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: "about", label: "About", target: "about-artist" },
    { id: "courses", label: "Courses", target: "services-section" },
    { id: "gallery", label: "Gallery", target: "gallery-section" },
    { id: "trial", label: "Admissions", target: "book-trial" },
    { id: "contact", label: "Contact", target: "contact-section" }
  ];

  const handleNavClick = (linkItem) => {
    playGhungrooChime();
    setMobileMenuOpen(false);
    if (typeof linkItem === "string") {
      navigateTo(linkItem);
      return;
    }

    if (currentPage === "home") {
      const el = document.getElementById(linkItem.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    // If not on home, or target not found, navigate to corresponding page
    if (linkItem.id === "courses") {
      navigateTo("courses");
    } else if (linkItem.id === "about") {
      navigateTo("about");
    } else if (linkItem.id === "gallery") {
      navigateTo("gallery");
    } else if (linkItem.id === "trial") {
      navigateTo("trial");
    } else if (linkItem.id === "contact") {
      navigateTo("contact");
    } else {
      navigateTo("home");
    }
  };

  const handlePortalClick = () => {
    playGhungrooChime();
    setMobileMenuOpen(false);
    if (userRole === "admin") {
      navigateTo("admin");
    } else if (userRole === "student") {
      navigateTo("student-portal");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* High-Jewelry Minimalist Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#F5F0E8]/98 text-[#151515] backdrop-blur-md shadow-xs py-2.5 sm:py-3 border-b border-[#B99A63]/30"
            : "bg-[#F5F0E8]/95 text-[#151515] backdrop-blur-md py-3 sm:py-4 border-b border-[#A9A49D]/15"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
          {/* Logo & Instructor Brand Name */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group cursor-pointer focus:outline-none tap-bounce min-w-0"
            aria-label="Dr. Malavika M Sunil Home"
          >
            <div className="h-9 sm:h-11 md:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0">
              <EditableMedia
                section="brand"
                field="logoUrl"
                defaultSrc="/images/logo_transparent.png"
                alt="Academy Logo"
                className="h-full w-auto object-contain drop-shadow-xs"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center">
                <EditableText
                  section="brand"
                  field="name"
                  defaultValue="Dr. Malavika M Sunil"
                  className="font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-tight font-serif-luxury text-[#151515] leading-tight block whitespace-nowrap"
                />
              </div>
              <EditableText
                as="p"
                section="brand"
                field="brandTitle"
                defaultValue="Classical Dance &amp; Music"
                className="text-[8px] sm:text-[9.5px] md:text-[10.5px] font-bold tracking-[0.2em] text-[#B99A63] uppercase mt-0.5 leading-none whitespace-nowrap block"
              />
            </div>
          </button>

          {/* Editorial Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-[#151515] font-bold bg-[#B99A63]/15"
                      : "text-stone-700 hover:text-[#151515] hover:bg-stone-200/40"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#B99A63] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action: Clean Portal Access Pill (iPhone Deep Burgundy & Gold) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handlePortalClick}
              className="group px-4 py-2 rounded-full border border-[#B99A63]/60 bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] hover:text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md shadow-[#1E050B]/20 flex items-center gap-2 cursor-pointer tap-bounce"
            >
              {userRole === "admin" ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span>Director Suite</span>
                </>
              ) : userRole === "student" ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span>Student Sanctuary</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span>Portal Access</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Right: Discreet Portal Icon + Clean Hamburger */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={handlePortalClick}
              className="p-2 rounded-full border border-[#B99A63]/40 bg-white/70 text-stone-800 text-xs font-bold tap-bounce"
              title="Portal Access"
              aria-label="Portal Access"
            >
              <User className="w-4 h-4 text-[#B99A63]" />
            </button>

            {/* Smooth Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-colors focus:outline-none tap-bounce text-[#151515] hover:bg-black/5 border border-black/10 bg-white/70"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={`w-5 h-0.5 rounded-full bg-[#151515] transition-all duration-300 ${
                  mobileMenuOpen ? "transform rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 rounded-full bg-[#151515] transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 rounded-full bg-[#151515] transition-all duration-300 ${
                  mobileMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer & Backdrop */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-16 bg-[#151515]/70 backdrop-blur-xs z-30 lg:hidden animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="relative z-40 lg:hidden border-t border-[#A9A49D]/20 bg-[#F5F0E8] px-5 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-300 max-h-[calc(100vh-70px)] overflow-y-auto">
              <div className="flex flex-col gap-1.5 text-left">
                {navLinks.map((link) => {
                  const isActive = currentPage === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all text-left cursor-pointer min-h-[46px] tap-bounce ${
                        isActive
                          ? "text-[#151515] bg-[#B99A63]/20 font-black"
                          : "text-[#151515]/85 hover:bg-black/5 hover:text-[#151515]"
                      }`}
                    >
                      <span className="font-serif-luxury text-lg">{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-[#A9A49D]" />
                    </button>
                  );
                })}

                <div className="pt-4 mt-2 border-t border-[#A9A49D]/20 space-y-2">
                  <button
                    onClick={handlePortalClick}
                    className="w-full py-3.5 rounded-2xl bg-[#151515] text-[#D4AF37] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer tap-bounce shadow-md"
                  >
                    {userRole === "admin" ? (
                      <>
                        <Shield className="w-4 h-4 text-[#D4AF37]" />
                        <span>Open Director Suite</span>
                      </>
                    ) : userRole === "student" ? (
                      <>
                        <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                        <span>Open Student Sanctuary</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span>Portal Access (Student / Director)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
