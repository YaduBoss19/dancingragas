import React from "react";
import { AcademyProvider, useAcademy } from "./context/AcademyContext";
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
import { DirectorLiveBar } from "./components/LiveVisualEditor";
import "./App.css";

function AppContent() {
  const { currentPage, academyInfo, isAuthModalOpen, setIsAuthModalOpen, isAdminLoggedIn, navigateTo } = useAcademy();

  const openWhatsApp = () => {
    const url = `https://wa.me/${academyInfo.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      academyInfo.whatsappDefaultMsg
    )}`;
    window.open(url, "_blank");
  };

  const renderPage = () => {
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
            <span className="font-bold tracking-wide">Director Live CMS Active</span>
            <span className="hidden sm:inline text-stone-300">• Viewing Public Academy Website</span>
          </div>
          <button
            onClick={() => navigateTo("admin")}
            className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] font-bold text-[11px] shadow-sm hover:brightness-105 transition-all cursor-pointer"
          >
            Return to Director Suite &rarr;
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
      <DirectorLiveBar />
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
