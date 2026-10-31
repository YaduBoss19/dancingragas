import React from "react";
import { AcademyProvider, useAcademy } from "./context/AcademyContext";
import { Shield, GraduationCap } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import CourseDetailsModal from "./components/CourseDetailsModal";
import LightboxModal from "./components/LightboxModal";

// Pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Courses from "./pages/Courses";
import Gallery from "./pages/Gallery";
import BookTrial from "./pages/BookTrial";
import ContactUs from "./pages/ContactUs";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPortal from "./pages/StudentPortal";

import CustomCursor from "./components/CustomCursor";
import FloatingConciergePill from "./components/FloatingConciergePill";
import AuthModal from "./components/AuthModal";
import "./App.css";

function AppContent() {
  const { currentPage, academyInfo, isAuthModalOpen, setIsAuthModalOpen, isAdminLoggedIn, userRole, navigateTo, handleLogout } = useAcademy();

  const openWhatsApp = () => {
    const url = `https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      academyInfo.whatsappDefaultMsg
    )}`;
    window.open(url, "_blank");
  };

  const renderPage = () => {
    // 🛡️ STRICT SECURITY ROUTE GUARD: Protect Tutor & Admin Desk
    if (currentPage === "admin" && userRole !== "tutor" && userRole !== "admin") {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-serif-luxury text-stone-900">Tutor Desk Protected</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              This portal requires verified faculty credentials. If you are an enrolled student, please log in through your Student Portal.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => {
                  navigateTo("home");
                  setIsAuthModalOpen(true);
                }}
                className="silk-zari-btn w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#260A22] text-[#E8B896] text-xs font-bold"
              >
                Log In as Tutor
              </button>
              <button
                onClick={() => navigateTo("home")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Return to Website
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 🛡️ STRICT SECURITY ROUTE GUARD: Protect Student Portal
    if (currentPage === "student-portal" && userRole !== "student" && userRole !== "tutor" && userRole !== "admin") {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-serif-luxury text-stone-900">Student Portal Access</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Please enter your registered student email and the access key provided by Dr. Malavika to view your recordings and study notes.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => {
                  navigateTo("home");
                  setIsAuthModalOpen(true);
                }}
                className="silk-zari-btn w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#260A22] text-[#E8B896] text-xs font-bold"
              >
                Sign In with Access Key
              </button>
              <button
                onClick={() => navigateTo("home")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Return to Website
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case "home":
        return <Home />;
      case "about":
      case "teachers":
        return <AboutUs />;
      case "courses":
      case "timetable":
        return <Courses />;
      case "gallery":
        return <Gallery />;
      case "trial":
        return <BookTrial />;
      case "contact":
        return <ContactUs />;
      case "admin":
        return <AdminDashboard />;
      case "student-portal":
        return <StudentPortal onOpenAuth={() => setIsAuthModalOpen(true)} />;
      default:
        return <Home />;
    }
  };

  const isPortal = currentPage === "admin" || currentPage === "student-portal";

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#151515] font-sans selection:bg-[#B99A63]/30 selection:text-[#151515]">
      {/* Luxury Magnetic Follower Cursor (Desktop) */}
      <CustomCursor />

      {/* Sticky Navigation (Hidden inside portals) */}
      {!isPortal && isAdminLoggedIn && (
        <div className="bg-[#1E050B] text-[#D4AF37] border-b border-[#B99A63]/40 px-4 py-2 text-xs flex items-center justify-between z-50 sticky top-0 font-sans shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold tracking-wide">
              {userRole === "tutor" ? "Tutor Portal Active" : "Directorate Suite Active"}
            </span>
            <span className="hidden sm:inline text-stone-300">• Viewing Public Academy Website</span>
          </div>
          <button
            onClick={() => navigateTo("admin")}
            className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] font-bold text-[11px] shadow-sm hover:brightness-105 transition-all cursor-pointer"
          >
            {userRole === "tutor" ? "Open Tutor Desk \u2192" : "Open Directorate Suite \u2192"}
          </button>
        </div>
      )}
      {!isPortal && <Navbar />}

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {renderPage()}
      </main>

      {/* Luxury Floating Concierge Pill (WhatsApp) (Hidden inside portals) */}
      {!isPortal && <FloatingConciergePill />}

      {/* Footer (Hidden inside portals) */}
      {!isPortal && <Footer />}

      {/* Global Modals & Notifications */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <CourseDetailsModal />
      <LightboxModal />
      <Toast />
          </div>
  );
}

export default function App() {
  return (
    <AcademyProvider>
      <AppContent />
    </AcademyProvider>
  );
}
