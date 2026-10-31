import React, { useState, useEffect } from "react";
import { useAcademy } from "../context/AcademyContext";
import { playGhungrooChime } from "../utils/talamAudio";
import { ChevronRight, GraduationCap, Shield, User, LogOut } from "lucide-react";
import { EditableText, EditableMedia } from "./LiveVisualEditor";

export default function Navbar() {
  const { currentPage, navigateTo, authUser, userRole, setIsAuthModalOpen, handleLogout, siteContent } = useAcademy();
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

  const handleLoginClick = () => {
    playGhungrooChime();
    setMobileMenuOpen(false);
    if (userRole === "tutor" || userRole === "admin") {
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
            ? "bg-[#FBF7F5]/98 text-[#260A22] backdrop-blur-md shadow-xs py-2.5 sm:py-3 border-b border-[#C9956A]/30"
            : "bg-[#FBF7F5]/95 text-[#260A22] backdrop-blur-md py-3 sm:py-4 border-b border-[#A5929B]/15"
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
                  className="font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-tight font-serif-luxury text-[#260A22] leading-tight block whitespace-nowrap"
                />
              </div>
              <EditableText
                as="p"
                section="brand"
                field="brandTitle"
                defaultValue="Classical Dance &amp; Music"
                className="text-[8px] sm:text-[9.5px] md:text-[10.5px] font-bold tracking-[0.2em] text-[#C9956A] uppercase mt-0.5 leading-none whitespace-nowrap block"
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
                      ? "text-[#260A22] font-bold bg-[#C9956A]/15"
                      : "text-stone-700 hover:text-[#260A22] hover:bg-[#C9956A]/10"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#C9956A] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action: Clean Log In & Portal Access */}
          <div className="hidden lg:flex items-center gap-2.5">
            {userRole === "student" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo("student-portal")}
                  className="px-4 py-2 rounded-full border border-[#C9956A]/60 bg-[#260A22] hover:bg-[#3D1035] text-[#E8B896] hover:text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer tap-bounce"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#E8B896]" />
                  <span>Student Portal</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-full border border-stone-300 hover:border-rose-400 bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  title="Sign Out of Academy"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden xl:inline">Sign Out</span>
                </button>
              </div>
            ) : userRole === "tutor" || userRole === "admin" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo("admin")}
                  className="px-4 py-2 rounded-full border border-[#C9956A]/60 bg-[#260A22] hover:bg-[#3D1035] text-[#E8B896] hover:text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer tap-bounce"
                >
                  <Shield className="w-3.5 h-3.5 text-[#E8B896]" />
                  <span>Tutor Portal</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-full border border-stone-300 hover:border-rose-400 bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  title="Sign Out of Academy"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden xl:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  playGhungrooChime();
                  setIsAuthModalOpen(true);
                }}
                className="group px-5 py-2.5 rounded-full border border-[#C9956A]/60 bg-[#260A22] hover:bg-[#3D1035] text-[#E8B896] hover:text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md shadow-[#260A22]/20 flex items-center gap-2 cursor-pointer tap-bounce"
              >
                <User className="w-3.5 h-3.5 text-[#E8B896] group-hover:scale-110 transition-transform" />
                <span>Log In</span>
              </button>
            )}
          </div>

          {/* Mobile Right: Discreet Log In / Portal Icon + Clean Hamburger */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            {userRole === "student" ? (
              <button
                onClick={() => navigateTo("student-portal")}
                className="px-3 py-1.5 rounded-full border border-[#C9956A]/40 bg-[#260A22] text-[#E8B896] text-xs font-bold flex items-center gap-1 tap-bounce"
                title="Student Portal"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#E8B896]" />
                <span>Portal</span>
              </button>
            ) : userRole === "tutor" || userRole === "admin" ? (
              <button
                onClick={() => navigateTo("admin")}
                className="px-3 py-1.5 rounded-full border border-[#C9956A]/40 bg-[#260A22] text-[#E8B896] text-xs font-bold flex items-center gap-1 tap-bounce"
                title="Tutor Portal"
              >
                <Shield className="w-3.5 h-3.5 text-[#E8B896]" />
                <span>Tutor</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  playGhungrooChime();
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-full border border-[#C9956A]/60 bg-[#260A22] text-[#E8B896] text-xs font-bold flex items-center gap-1.5 tap-bounce shadow-xs"
                title="Log In"
              >
                <User className="w-3.5 h-3.5 text-[#E8B896]" />
                <span>Log In</span>
              </button>
            )}

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
                  {userRole === "student" ? (
                    <>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigateTo("student-portal");
                        }}
                        className="w-full py-3.5 rounded-2xl bg-[#260A22] text-[#E8B896] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer tap-bounce shadow-md"
                      >
                        <GraduationCap className="w-4 h-4 text-[#E8B896]" />
                        <span>Go to Student Portal</span>
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full py-2.5 rounded-xl border border-stone-300 text-rose-700 bg-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : userRole === "tutor" || userRole === "admin" ? (
                    <>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigateTo("admin");
                        }}
                        className="w-full py-3.5 rounded-2xl bg-[#260A22] text-[#E8B896] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer tap-bounce shadow-md"
                      >
                        <Shield className="w-4 h-4 text-[#E8B896]" />
                        <span>Open Tutor Portal</span>
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full py-2.5 rounded-xl border border-stone-300 text-rose-700 bg-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        playGhungrooChime();
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-[#260A22] text-[#E8B896] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer tap-bounce shadow-md"
                    >
                      <User className="w-4 h-4 text-[#E8B896]" />
                      <span>Log In (Student / Tutor)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
