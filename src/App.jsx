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
import "./App.css";

function AppContent() {
  const { currentPage, academyInfo, isAuthModalOpen, setIsAuthModalOpen } = useAcademy();

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
