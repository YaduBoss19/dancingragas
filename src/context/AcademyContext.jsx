import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_COURSES,
  INITIAL_TEACHERS,
  INITIAL_TIMETABLE,
  INITIAL_GALLERY,
  INITIAL_ENQUIRIES,
  ACADEMY_INFO,
  FAQS,
  TESTIMONIALS,
  INITIAL_RECORDINGS,
  INITIAL_LIVE_CLASS,
  INITIAL_STUDENT_PROFILE,
  CURRICULUM_MODULES,
  INITIAL_STUDENT_ASSESSMENTS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_STUDENTS,
  COURSE_AREAS,
  INITIAL_SITE_CONTENT
} from "../data/initialData";

const AcademyContext = createContext();

const STORAGE_KEYS = {
  COURSES: "dancingragas_academy_courses_v9",
  TEACHERS: "dancingragas_academy_teachers_v2",
  TIMETABLE: "dancingragas_academy_timetable_v2",
  GALLERY: "dancingragas_academy_gallery_v3",
  ENQUIRIES: "dancingragas_academy_enquiries_v2",
  AUTH: "dancingragas_academy_admin_auth_v2",
  FAQS: "dancingragas_academy_faqs_v2",
  TESTIMONIALS: "dancingragas_academy_testimonials_v2",
  INFO: "dancingragas_academy_info_v2",
  RECORDINGS: "dancingragas_academy_recordings_v1",
  LIVE_CLASS: "dancingragas_academy_live_class_v1",
  MODULES: "dancingragas_academy_modules_v2",
  ASSESSMENTS: "dancingragas_academy_assessments_v2",
  STUDENT_PROFILE: "dancingragas_academy_student_profile_v2",
  STUDENTS: "dancingragas_academy_students_v3",
  SITE_CONTENT: "dancingragas_academy_site_content_v1",
  STUDY_MATERIALS: "dancingragas_academy_materials_v1"
};

export const AcademyProvider = ({ children }) => {
  // Navigation & URL routing
  const getInitialPage = () => {
    if (typeof window === "undefined") return "home";
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
    const target = path || hash;

    if (target === "admin" || target.startsWith("admin") || target === "tutor") return "admin";
    if (target === "student-portal" || target.startsWith("student") || target === "portal") return "student-portal";
    if (target === "about" || target.startsWith("about")) return "about";
    if (target === "courses" || target.startsWith("courses")) return "courses";
    if (target === "gallery" || target.startsWith("gallery")) return "gallery";
    if (target === "contact" || target.startsWith("contact")) return "contact";
    if (target === "trial" || target.startsWith("trial")) return "trial";
    return "home";
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // Master Dynamic Website Content Store
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
      return saved ? JSON.parse(saved) : INITIAL_SITE_CONTENT;
    } catch {
      return INITIAL_SITE_CONTENT;
    }
  });

  // Live Visual On-Page Edit Mode (active only for authenticated director)
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
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

  const [faqs, setFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      return saved ? JSON.parse(saved) : FAQS;
    } catch {
      return FAQS;
    }
  });

  const [academyInfo, setAcademyInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFO);
      return saved ? JSON.parse(saved) : ACADEMY_INFO;
    } catch {
      return ACADEMY_INFO;
    }
  });

  const [testimonials, setTestimonials] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      return saved ? JSON.parse(saved) : TESTIMONIALS;
    } catch {
      return TESTIMONIALS;
    }
  });

  const [recordings, setRecordings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
      return saved ? JSON.parse(saved) : INITIAL_RECORDINGS;
    } catch {
      return INITIAL_RECORDINGS;
    }
  });

  const [liveClassConfig, setLiveClassConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIVE_CLASS);
      return saved ? JSON.parse(saved) : INITIAL_LIVE_CLASS;
    } catch {
      return INITIAL_LIVE_CLASS;
    }
  });

  const [curriculumModules, setCurriculumModules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODULES);
      return saved ? JSON.parse(saved) : CURRICULUM_MODULES;
    } catch {
      return CURRICULUM_MODULES;
    }
  });

  const [studentAssessments, setStudentAssessments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_ASSESSMENTS;
    } catch {
      return INITIAL_STUDENT_ASSESSMENTS;
    }
  });

  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  const [studentsList, setStudentsList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [studyMaterials, setStudyMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDY_MATERIALS);
      return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
    } catch {
      return INITIAL_STUDY_MATERIALS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_MATERIALS, JSON.stringify(studyMaterials));
    } catch (e) {
      console.error("Failed to save studyMaterials to localStorage", e);
    }
  }, [studyMaterials]);

  const [activeStudentId, setActiveStudentId] = useState("stu-1");

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    } catch (e) {
      console.error("Failed to save faqs to localStorage", e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(academyInfo));
    } catch (e) {
      console.error("Failed to save academyInfo to localStorage", e);
    }
  }, [academyInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    } catch (e) {
      console.error("Failed to save testimonials to localStorage", e);
    }
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(recordings));
    } catch (e) {
      console.error("Failed to save recordings to localStorage", e);
    }
  }, [recordings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIVE_CLASS, JSON.stringify(liveClassConfig));
    } catch (e) {
      console.error("Failed to save liveClassConfig to localStorage", e);
    }
  }, [liveClassConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(curriculumModules));
    } catch (e) {
      console.error("Failed to save curriculumModules to localStorage", e);
    }
  }, [curriculumModules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(studentAssessments));
    } catch (e) {
      console.error("Failed to save studentAssessments to localStorage", e);
    }
  }, [studentAssessments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(studentProfile));
    } catch (e) {
      console.error("Failed to save studentProfile to localStorage", e);
    }
  }, [studentProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsList));
    } catch (e) {
      console.error("Failed to save studentsList to localStorage", e);
    }
  }, [studentsList]);

  useEffect(() => {
    const handleNavigationEvent = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener("popstate", handleNavigationEvent);
    window.addEventListener("hashchange", handleNavigationEvent);
    return () => {
      window.removeEventListener("popstate", handleNavigationEvent);
      window.removeEventListener("hashchange", handleNavigationEvent);
    };
  }, []);

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

  // Navigation helper with URL history sync
  const navigateTo = (page, data = null) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (page === "trial" && data) {
      setSelectedCourseForTrial(data);
    }
    const targetUrl = page === "home" ? "/" : "/" + page;
    if (typeof window !== "undefined" && window.location.pathname !== targetUrl) {
      try {
        window.history.pushState({ page }, "", targetUrl);
      } catch {}
    }
    setCurrentPage(page);
  };

  const updateFaqs = (newFaqs) => {
    setFaqs(newFaqs);
    showToast("FAQs updated successfully!", "success");
  };

  const updateAcademyInfo = (newInfo) => {
    setAcademyInfo(newInfo);
    showToast("Contact and academy details saved!", "success");
  };

  const updateSiteContent = (newContent) => {
    setSiteContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(newContent));
    } catch {
      // ignore
    }
    showToast("Website content updated successfully!", "success");
  };

  const updateSection = (sectionKey, patch) => {
    setSiteContent((prev) => {
      const currentSection = prev?.[sectionKey] || {};
      const updatedSection = { ...currentSection, ...patch };
      const nextContent = { ...prev, [sectionKey]: updatedSection };
      try {
        localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(nextContent));
      } catch {
        // ignore
      }
      return nextContent;
    });
    showToast(`Updated ${sectionKey} live!`, "success");
  };

  const updateTestimonials = (newTestimonials) => {
    setTestimonials(newTestimonials);
    showToast("Student stories and reviews saved!", "success");
  };

  const updateRecordings = (newRecordings) => {
    setRecordings(newRecordings);
    showToast("Class recordings vault updated!", "success");
  };

  const addRecording = (recData) => {
    const newRec = {
      id: "rec-" + Date.now(),
      title: recData.title,
      courseCategory: recData.courseCategory || recData.category || "Bharatanatyam Diploma",
      category: recData.courseCategory || recData.category || "Bharatanatyam Diploma",
      module: recData.module || "Module 01: Foundational Adavu Biomechanics",
      duration: recData.duration || "60 mins",
      date: recData.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      embedUrl: recData.embedUrl,
      videoUrl: recData.embedUrl,
      videoType: "youtube",
      accessScope: recData.accessScope || "course_enrolled",
      allowedStudentIds: recData.allowedStudentIds || [],
      description: recData.description || "",
      topics: recData.topics || (recData.syllabusText ? recData.syllabusText.split("\n").filter(Boolean) : ["Practical drills"]),
      thumbnail: recData.thumbnail || "/images/courses/Courses/bharatanatyam_diploma/main.jpg"
    };
    setRecordings((prev) => [newRec, ...prev]);
    showToast(`Unlisted video published to "${newRec.courseCategory}"! Reflected in Student Portal.`, "success");
  };

  const deleteRecording = (id) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
    showToast("Recording removed from vault.", "info");
  };

  const addStudent = (studentData) => {
    const prefix = (studentData.enrolledCourses?.[0] || "ART").substring(0, 3).toUpperCase();
    const newStudent = {
      id: "stu-" + Date.now(),
      registrationNo: `DR-${prefix}-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: studentData.name.trim(),
      email: studentData.email.trim(),
      phone: studentData.phone?.trim() || "",
      location: studentData.location?.trim() || "Online Global Batch",
      enrolledCourses: studentData.enrolledCourses && studentData.enrolledCourses.length > 0
        ? studentData.enrolledCourses
        : ["Bharatanatyam Diploma"],
      enrolledDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Active",
      attendance: 100
    };
    setStudentsList((prev) => [newStudent, ...prev]);
    showToast(`Student "${newStudent.name}" enrolled in ${newStudent.enrolledCourses.join(", ")}!`, "success");
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
    showToast("Student profile and course enrolment updated!", "success");
  };

  const deleteStudent = (id) => {
    const student = studentsList.find((s) => s.id === id);
    setStudentsList((prev) => prev.filter((s) => s.id !== id));
    showToast(`Enrolment for "${student ? student.name : ""}" removed.`, "info");
  };

  const addStudentToCourse = (studentId, courseName) => {
    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentCourses = s.enrolledCourses || [];
        if (currentCourses.includes(courseName)) return s;
        return {
          ...s,
          enrolledCourses: [...currentCourses, courseName]
        };
      })
    );
    showToast(`Disciple enrolled in "${courseName}"!`, "success");
  };

  const removeStudentFromCourse = (studentId, courseName) => {
    const student = studentsList.find((s) => s.id === studentId);
    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentCourses = s.enrolledCourses || [];
        const filtered = currentCourses.filter((c) => c !== courseName);
        return {
          ...s,
          enrolledCourses: filtered.length > 0 ? filtered : ["Bharatanatyam Diploma"]
        };
      })
    );
    showToast(`Removed "${student ? student.name : "Student"}" from "${courseName}".`, "info");
  };

  const addStudyMaterial = (docData) => {
    const newDoc = {
      id: "doc-" + Date.now(),
      refNo: docData.refNo || `DR-MAT-${Math.floor(100 + Math.random() * 900)}`,
      title: docData.title.trim(),
      type: docData.type || "Official PDF Document",
      category: docData.category || "Theory & Slokas",
      courseCategory: docData.courseCategory || "Bharatanatyam Diploma",
      size: docData.size || "2.5 MB",
      verified: docData.verified || "Dr. Malavika M. Sunil (MBBS)",
      fileUrl: docData.fileUrl || "/materials/sample_syllabus.pdf",
      uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    setStudyMaterials((prev) => [newDoc, ...prev]);
    showToast(`PDF study material "${newDoc.title}" published! Available in Disciple Sanctuary.`, "success");
    return newDoc;
  };

  const deleteStudyMaterial = (id) => {
    setStudyMaterials((prev) => prev.filter((d) => d.id !== id));
    showToast("Study material removed from vault.", "info");
  };

  const updateLiveClassConfig = (newConfig) => {
    setLiveClassConfig(newConfig);
    showToast("Live class configuration updated successfully!", "success");
  };

  const submitStudentAssessment = (submissionData) => {
    const newEntry = {
      id: "ass-" + Date.now(),
      studentName: submissionData.studentName || studentProfile.studentName,
      registrationNo: submissionData.registrationNo || studentProfile.registrationNo,
      batch: submissionData.batch || studentProfile.enrolledProgram,
      title: submissionData.title,
      submissionDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      videoUrl: submissionData.videoUrl,
      notes: submissionData.notes || "",
      status: "Under Faculty Evaluation",
      evaluationDate: "Pending",
      facultyMentor: "Dr. Malavika M. Sunil (MBBS)",
      rubric: null,
      totalScore: null,
      grade: "Under Review",
      clinicalNote: "Submission received. Dr. Malavika is evaluating biomechanics, rhythm & execution."
    };
    setStudentAssessments((prev) => [newEntry, ...prev]);
    showToast("Masterclass performance submitted for Dr. Malavika's evaluation!", "success");
    return newEntry;
  };

  const gradeAssessment = (id, rubricData, clinicalNote, grade, totalScore) => {
    setStudentAssessments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Evaluated",
              evaluationDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              rubric: rubricData,
              clinicalNote,
              grade,
              totalScore
            }
          : item
      )
    );
    showToast("Academic & biomechanical assessment published to student portal!", "success");
  };

  const toggleLessonCompletion = (moduleId, lessonId) => {
    setCurriculumModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const updatedLessons = mod.lessons.map((les) =>
          les.id === lessonId ? { ...les, completed: !les.completed } : les
        );
        const completedCount = updatedLessons.filter((l) => l.completed).length;
        const progressPercent = Math.round((completedCount / updatedLessons.length) * 100);
        return {
          ...mod,
          lessons: updatedLessons,
          progressPercent,
          status: progressPercent === 100 ? "Completed" : progressPercent > 0 ? "In Progress" : "Upcoming"
        };
      })
    );
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
    setSiteContent(INITIAL_SITE_CONTENT);
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
    } catch (e) {
      // Ignore
    }
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

  const updateGalleryItem = (id, updatedData) => {
    setGallery((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    showToast("Gallery media updated successfully!", "success");
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
        academyInfo,
        faqs,
        testimonials,
        updateFaqs,
        updateAcademyInfo,
        updateTestimonials,
        recordings,
        updateRecordings,
        addRecording,
        deleteRecording,
        liveClassConfig,
        updateLiveClassConfig,
        curriculumModules,
        setCurriculumModules,
        toggleLessonCompletion,
        studentAssessments,
        setStudentAssessments,
        submitStudentAssessment,
        gradeAssessment,
        studentProfile,
        setStudentProfile,
        studentsList,
        setStudentsList,
        activeStudentId,
        setActiveStudentId,
        addStudent,
        updateStudent,
        deleteStudent,
        addStudentToCourse,
        removeStudentFromCourse,
        studyMaterials,
        addStudyMaterial,
        deleteStudyMaterial,
        isAdminLoggedIn: isAdminLoggedIn || userRole === "admin" || userRole === "tutor",
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
        deleteGalleryItem,
        updateGalleryItem,
        // Master Site Content & Visual Edit Mode
        siteContent,
        setSiteContent,
        updateSiteContent,
        updateSection,
        isVisualEditMode,
        setIsVisualEditMode
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
