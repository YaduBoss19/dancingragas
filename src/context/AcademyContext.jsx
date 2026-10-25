import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_COURSES,
  INITIAL_TEACHERS,
  INITIAL_TIMETABLE,
  INITIAL_GALLERY,
  INITIAL_ENQUIRIES,
  ACADEMY_INFO
} from "../data/initialData";

const AcademyContext = createContext();

const STORAGE_KEYS = {
  COURSES: "dancingragas_academy_courses_v8",
  TEACHERS: "dancingragas_academy_teachers_v2",
  TIMETABLE: "dancingragas_academy_timetable_v2",
  GALLERY: "dancingragas_academy_gallery_v3",
  ENQUIRIES: "dancingragas_academy_enquiries_v2",
  AUTH: "dancingragas_academy_admin_auth_v2"
};

export const AcademyProvider = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedCourseForTrial, setSelectedCourseForTrial] = useState(null);
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Data collections with localStorage persistence
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [teachers, setTeachers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const [timetable, setTimetable] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
      return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
    } catch {
      return INITIAL_TIMETABLE;
    }
  });

  const [gallery, setGallery] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === "true";
    } catch {
      return false;
    }
  });

  // Supabase Auth State (Admin vs Student)
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem("dancingragas_auth_user_v1");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userRole, setUserRole] = useState(() => {
    try {
      return localStorage.getItem("dancingragas_auth_role_v1") || "guest";
    } catch {
      return "guest";
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (authUser) {
        localStorage.setItem("dancingragas_auth_user_v1", JSON.stringify(authUser));
      } else {
        localStorage.removeItem("dancingragas_auth_user_v1");
      }
      if (userRole) {
        localStorage.setItem("dancingragas_auth_role_v1", userRole);
      } else {
        localStorage.removeItem("dancingragas_auth_role_v1");
      }
    } catch (e) {
      console.error("Failed to sync auth state", e);
    }
  }, [authUser, userRole]);

  const handleLogout = () => {
    setAuthUser(null);
    setUserRole("guest");
    setIsAdminLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem("dancingragas_auth_user_v1");
    localStorage.removeItem("dancingragas_auth_role_v1");
    showToast("You have been signed out successfully.", "info");
    setCurrentPage("home");
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error("Failed to save courses to localStorage", e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    } catch (e) {
      console.error("Failed to save teachers to localStorage", e);
    }
  }, [teachers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
    } catch (e) {
      console.error("Failed to save timetable to localStorage", e);
    }
  }, [timetable]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch (e) {
      console.error("Failed to save gallery to localStorage", e);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error("Failed to save enquiries to localStorage", e);
    }
  }, [enquiries]);

  // Toast notification system
  const showToast = (text, type = "success") => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation helper
  const navigateTo = (page, data = null) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (page === "trial" && data) {
      setSelectedCourseForTrial(data);
    }
    setCurrentPage(page);
  };

  // Auth
  const loginAdmin = (password) => {
    if (password === "admin123" || password === "admin" || password === "1234") {
      setIsAdminLoggedIn(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, "true");
      showToast("Welcome back, Academy Director! Access granted.", "success");
      return true;
    }
    showToast("Invalid administrative credentials. Hint: use 'admin123'", "error");
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    showToast("You have been signed out of Admin Dashboard.", "info");
    setCurrentPage("home");
  };

  // Reset to factory defaults
  const resetToDefaults = () => {
    setCourses(INITIAL_COURSES);
    setTeachers(INITIAL_TEACHERS);
    setTimetable(INITIAL_TIMETABLE);
    setGallery(INITIAL_GALLERY);
    setEnquiries(INITIAL_ENQUIRIES);
    showToast("All academy data has been restored to factory demo presets!", "info");
  };

  // Enquiries Operations
  const addEnquiry = (enquiryData) => {
    const newEnq = {
      ...enquiryData,
      id: "enq-" + Date.now(),
      status: "New",
      date: new Date().toISOString().split("T")[0]
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    showToast("🎉 Your Free Trial Class has been booked successfully! We will contact you soon.", "success");
    return newEnq;
  };

  const updateEnquiryStatus = (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    showToast(`Enquiry updated to status: "${newStatus}"`, "info");
  };

  const deleteEnquiry = (id) => {
    setEnquiries((prev) => prev.filter((item) => item.id !== id));
    showToast("Enquiry entry deleted.", "info");
  };

  // Courses Operations
  const addCourse = (courseData) => {
    const newCourse = {
      ...courseData,
      id: "c-" + Date.now()
    };
    setCourses((prev) => [newCourse, ...prev]);
    showToast(`Course "${newCourse.title}" published successfully!`, "success");
  };

  const updateCourse = (id, updatedData) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    showToast(`Course updated successfully!`, "success");
  };

  const deleteCourse = (id) => {
    const target = courses.find((c) => c.id === id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast(`Course "${target ? target.title : ""}" deleted.`, "info");
  };

  // Teachers Operations
  const addTeacher = (teacherData) => {
    const newTeacher = {
      ...teacherData,
      id: "t-" + Date.now()
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    showToast(`Teacher profile "${newTeacher.name}" added successfully!`, "success");
  };

  const updateTeacher = (id, updatedData) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );
    showToast(`Teacher profile updated successfully!`, "success");
  };

  const deleteTeacher = (id) => {
    const target = teachers.find((t) => t.id === id);
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    showToast(`Teacher profile "${target ? target.name : ""}" removed.`, "info");
  };

  // Timetable Operations
  const addTimetableSlot = (slotData) => {
    const newSlot = {
      ...slotData,
      id: "tt-" + Date.now()
    };
    setTimetable((prev) => [...prev, newSlot]);
    showToast(`Class scheduled for ${newSlot.day} at ${newSlot.time}!`, "success");
  };

  const updateTimetableSlot = (id, updatedData) => {
    setTimetable((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, ...updatedData } : slot))
    );
    showToast(`Timetable slot updated successfully!`, "success");
  };

  const deleteTimetableSlot = (id) => {
    setTimetable((prev) => prev.filter((slot) => slot.id !== id));
    showToast("Class slot deleted from timetable.", "info");
  };

  // Gallery Operations
  const addGalleryItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: "g-" + Date.now()
    };
    setGallery((prev) => [newItem, ...prev]);
    showToast(`New gallery media added!`, "success");
  };

  const deleteGalleryItem = (id) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
    showToast("Gallery item deleted.", "info");
  };

  return (
    <AcademyContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        navigateTo,
        selectedCourseForTrial,
        setSelectedCourseForTrial,
        selectedCourseModal,
        setSelectedCourseModal,
        lightboxItem,
        setLightboxItem,
        toasts,
        showToast,
        removeToast,
        // State
        courses,
        teachers,
        timetable,
        gallery,
        enquiries,
        academyInfo: ACADEMY_INFO,
        isAdminLoggedIn: isAdminLoggedIn || userRole === "admin",
        authUser,
        setAuthUser,
        userRole,
        setUserRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        handleLogout,
        // Methods
        loginAdmin,
        logoutAdmin,
        resetToDefaults,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        addCourse,
        updateCourse,
        deleteCourse,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        addGalleryItem,
        deleteGalleryItem
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error("useAcademy must be used within an AcademyProvider");
  }
  return context;
};
