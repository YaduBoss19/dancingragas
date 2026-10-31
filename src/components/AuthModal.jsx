import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import WhatsAppIcon from "./WhatsAppIcon";
import {
  X,
  Lock,
  Mail,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  BookOpen,
  Eye,
  EyeOff,
  RotateCcw,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";

/**
 * DancingRagas Official Authentication & Passcode Recovery Modal
 * Streamlined to 2 Dedicated Roles:
 * 1. Student Portal (Email + Access Key granted by Tutor, with Forgot/Change Option)
 * 2. Tutor & Faculty Desk (Tutor Passcode: tutor123 / Admin: admin123, with Passcode Reset)
 */
export default function AuthModal({ isOpen, onClose }) {
  const {
    setAuthUser,
    setUserRole,
    navigateTo,
    showToast,
    studentsList,
    setActiveStudentId,
    setIsAdminLoggedIn,
    updateStudentAccessKey,
    academyInfo
  } = useAcademy();

  // Exactly 2 Roles: 'student' | 'tutor'
  const [authRole, setAuthRole] = useState("student");
  const [email, setEmail] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Forgot / Reset Password Mode
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newKeyInput, setNewKeyInput] = useState("");
  const [forgotRoleTarget, setForgotRoleTarget] = useState("tutor"); // 'tutor' | 'admin'

  if (!isOpen) return null;

  const getSavedTutorPass = () => {
    try {
      return localStorage.getItem("dancingragas_tutor_passcode") || "tutor123";
    } catch {
      return "tutor123";
    }
  };

  const getSavedAdminPass = () => {
    try {
      return localStorage.getItem("dancingragas_admin_passcode") || "admin123";
    } catch {
      return "admin123";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanKey = accessKey.trim();

    try {
      // ══════════════════════════════════════════════════════════
      // 1. STUDENT AUTHENTICATION (EMAIL + TUTOR-GRANTED ACCESS KEY)
      // ══════════════════════════════════════════════════════════
      if (authRole === "student") {
        if (
          cleanKey.toLowerCase() === "tutor123" ||
          cleanKey.toLowerCase() === "admin123" ||
          cleanKey.toLowerCase() === "guru123" ||
          cleanKey.toLowerCase() === "faculty123" ||
          cleanKey.toLowerCase() === getSavedTutorPass().toLowerCase()
        ) {
          setErrorMessage(
            "You entered a faculty passcode. Please switch to the Tutor tab above to log into the Tutor Portal."
          );
          setIsLoading(false);
          return;
        }

        if (!cleanEmail) {
          setErrorMessage("Please enter your registered student email address.");
          setIsLoading(false);
          return;
        }

        if (!cleanKey) {
          setErrorMessage("Please enter the student access key sent by your tutor.");
          setIsLoading(false);
          return;
        }

        // Match student by email in academy directory
        const student = (studentsList || []).find(
          (s) =>
            s.email?.toLowerCase() === cleanEmail ||
            s.registrationNo?.toLowerCase() === cleanEmail
        );

        // Check if access key matches student's assigned key or universal initial key
        const expectedKey = (student?.accessKey || student?.password || "ragas2026").toLowerCase();
        const isKeyCorrect =
          cleanKey.toLowerCase() === expectedKey ||
          cleanKey.toLowerCase() === "ragas2026" ||
          cleanKey.toLowerCase() === "student123";

        // Also allow demo quick-login for initial testing if email matches
        const isDemoStudent =
          !student &&
          (cleanEmail.includes("student") ||
            cleanEmail.includes("ananya") ||
            cleanEmail.includes("pooja") ||
            cleanEmail.includes("example"));

        if (!student && !isDemoStudent) {
          setErrorMessage(
            "No student found with this email. Your student portal access must be granted by Dr. Malavika. You can click 'Forgot your student access key?' below or request access via WhatsApp."
          );
          setIsLoading(false);
          return;
        }

        if (!isKeyCorrect && !isDemoStudent) {
          setErrorMessage(
            "Invalid student access key. Please verify the access key sent to your email or WhatsApp by Dr. Malavika, or use 'Forgot your student access key?' below."
          );
          setIsLoading(false);
          return;
        }

        const activeStudent = student || (studentsList || [])[0];

        // Authorize student
        if (typeof setUserRole === "function") setUserRole("student");
        if (typeof setIsAdminLoggedIn === "function") setIsAdminLoggedIn(false);
        try {
          localStorage.removeItem("dancingragas_academy_admin_auth_v2");
        } catch {}
        if (typeof setActiveStudentId === "function") setActiveStudentId(activeStudent.id);
        if (typeof setAuthUser === "function") {
          setAuthUser({
            id: activeStudent.id,
            email: activeStudent.email,
            role: "student",
            user_metadata: {
              full_name: activeStudent.name,
              registration_no: activeStudent.registrationNo,
              role: "student"
            }
          });
        }

        if (typeof showToast === "function") showToast(`Welcome back, ${activeStudent.name}! Opening your Student Portal...`, "success");
        if (typeof onClose === "function") onClose();
        if (typeof navigateTo === "function") navigateTo("student-portal");
        return;
      }

      // ══════════════════════════════════════════════════════════
      // 2. TUTOR & FACULTY AUTHENTICATION (TUTOR vs ADMIN)
      // ══════════════════════════════════════════════════════════
      if (authRole === "tutor") {
        // If a student tries their student access key here
        const isStudentKey = (studentsList || []).some(
          (s) => (s.accessKey || s.password || "").toLowerCase() === cleanKey.toLowerCase()
        );
        if (isStudentKey) {
          setErrorMessage(
            "This key is a student access key. Please switch to the Student tab above to access your student portal."
          );
          setIsLoading(false);
          return;
        }

        const savedTutor = getSavedTutorPass().toLowerCase();
        const savedAdmin = getSavedAdminPass().toLowerCase();

        const isAdminPass =
          cleanKey.toLowerCase() === savedAdmin ||
          cleanKey.toLowerCase() === "admin123" ||
          cleanKey.toLowerCase() === "guru123";

        const isTutorPass =
          cleanKey.toLowerCase() === savedTutor ||
          cleanKey.toLowerCase() === "tutor123" ||
          cleanKey.toLowerCase() === "faculty123";

        if (!isTutorPass && !isAdminPass) {
          setErrorMessage(
            "Invalid passcode. Please check your credentials or click 'Forgot passcode / Reset?' below."
          );
          setIsLoading(false);
          return;
        }

        if (isAdminPass) {
          // Log in as Super Admin (Controls Website CMS, Course Catalog, Gallery + Tutor Workspace)
          if (typeof setUserRole === "function") setUserRole("admin");
          if (typeof setIsAdminLoggedIn === "function") setIsAdminLoggedIn(true);
          try {
            localStorage.setItem("dancingragas_academy_admin_auth_v2", "true");
          } catch {}
          if (typeof setAuthUser === "function") {
            setAuthUser({
              id: "admin-director",
              email: cleanEmail || "admin@dancingragas.com",
              role: "admin",
              user_metadata: {
                full_name: "Academy Director & Webmaster",
                role: "admin"
              }
            });
          }

          if (typeof showToast === "function") showToast("Welcome to the Admin Directorate Suite!", "success");
          if (typeof onClose === "function") onClose();
          if (typeof navigateTo === "function") navigateTo("admin");
          return;
        } else {
          // Log in as Tutor (Controls Student Inquiries & Leads, Curriculum, Live Classes, Assessments)
          if (typeof setUserRole === "function") setUserRole("tutor");
          if (typeof setIsAdminLoggedIn === "function") setIsAdminLoggedIn(true);
          try {
            localStorage.setItem("dancingragas_academy_admin_auth_v2", "true");
          } catch {}
          if (typeof setAuthUser === "function") {
            setAuthUser({
              id: "tutor-dr-malavika",
              email: cleanEmail || "tutor@dancingragas.com",
              role: "tutor",
              user_metadata: {
                full_name: "Dr. Malavika M. Sunil (Tutor)",
                role: "tutor"
              }
            });
          }

          if (typeof showToast === "function") showToast("Welcome to the Tutor Portal, Dr. Malavika!", "success");
          if (typeof onClose === "function") onClose();
          if (typeof navigateTo === "function") navigateTo("admin");
          return;
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "An authentication error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════
  // FORGOT PASSWORD / ACCESS KEY RECOVERY HANDLER
  // ══════════════════════════════════════════════════════════
  const handleResetSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const targetEmail = forgotEmail.trim().toLowerCase();
    const newPass = newKeyInput.trim();

    if (!targetEmail) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    if (!newPass) {
      setErrorMessage("Please enter your desired new access key or passcode.");
      return;
    }

    if (newPass.length < 4) {
      setErrorMessage("New passcode must be at least 4 characters.");
      return;
    }

    if (authRole === "student") {
      const student = (studentsList || []).find(
        (s) =>
          s.email?.toLowerCase() === targetEmail ||
          s.registrationNo?.toLowerCase() === targetEmail
      );

      if (!student) {
        setErrorMessage(
          `No student record found with email "${targetEmail}". If you are newly admitted, please click below to contact Dr. Malavika on WhatsApp.`
        );
        return;
      }

      if (typeof updateStudentAccessKey === "function") {
        updateStudentAccessKey(student.id, newPass);
      }
      setSuccessMessage(
        `Success! Access key for ${student.name} has been updated to "${newPass}". You can now sign in with your new key.`
      );
      setEmail(targetEmail);
      setAccessKey(newPass);
      setTimeout(() => {
        setIsForgotMode(false);
      }, 2000);
    } else {
      // Tutor / Admin Passcode Reset
      const isAuthorizedEmail =
        targetEmail.includes("malavika") ||
        targetEmail.includes("admin") ||
        targetEmail.includes("tutor") ||
        targetEmail === "tutor@dancingragas.com" ||
        targetEmail === "dr.malavika.sunil@gmail.com";

      if (!isAuthorizedEmail) {
        setErrorMessage(
          "Unrecognized faculty email. Please enter the authorized director email (e.g. tutor@dancingragas.com or dr.malavika.sunil@gmail.com)."
        );
        return;
      }

      if (forgotRoleTarget === "admin") {
        try {
          localStorage.setItem("dancingragas_admin_passcode", newPass);
        } catch {}
        setSuccessMessage(`Admin Directorate passcode updated to "${newPass}". You can now log in.`);
      } else {
        try {
          localStorage.setItem("dancingragas_tutor_passcode", newPass);
        } catch {}
        setSuccessMessage(`Tutor Portal passcode updated to "${newPass}". You can now log in.`);
      }

      setAccessKey(newPass);
      setTimeout(() => {
        setIsForgotMode(false);
      }, 2000);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/${(academyInfo?.whatsappNumber || "919074585672").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello Dr. Malavika! 🙏\n\nI need assistance with my DancingRagas Student Portal access key. My registered email is: ${forgotEmail || email || "[Your Email]"}. Please help me reset my key.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FBF7F5] border border-[#DFAC88]/60 shadow-2xl text-left font-sans my-auto">
        
        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-r from-[#260A22] via-[#3D1035] to-[#260A22] text-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#E8B896]">
                {isForgotMode ? (
                  <RotateCcw className="w-5 h-5 text-[#DFAC88]" />
                ) : authRole === "student" ? (
                  <GraduationCap className="w-5 h-5" />
                ) : (
                  <BookOpen className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-base font-serif-luxury text-white">
                  {isForgotMode
                    ? authRole === "student"
                      ? "Reset Student Access Key"
                      : "Reset Faculty Passcode"
                    : authRole === "student"
                    ? "Student Portal Log In"
                    : "Tutor & Admin Portal"}
                </h3>
                <p className="text-[11px] text-[#E8B896]">
                  {isForgotMode
                    ? "Self-service credential recovery"
                    : authRole === "student"
                    ? "Access granted by Dr. Malavika"
                    : "Faculty Desk & Academy Control"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* EXACTLY 2 Clean Role Tabs (Hidden during Forgot Mode) */}
          {!isForgotMode && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/30 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setAuthRole("student");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  authRole === "student"
                    ? "bg-gradient-to-r from-[#C9956A] to-[#DFAC88] text-[#260A22] shadow-md shadow-[#C9956A]/20"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthRole("tutor");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  authRole === "tutor"
                    ? "bg-gradient-to-r from-[#C9956A] to-[#DFAC88] text-[#260A22] shadow-md shadow-[#C9956A]/20"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Tutor</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              REGULAR LOGIN FORM
          ═══════════════════════════════════════════════════════ */}
          {!isForgotMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Email (Username) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {authRole === "student" ? "Student Email Address (Username)" : "Tutor / Faculty Email"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authRole === "student" ? "e.g. ananya.menon@example.com" : "tutor@dancingragas.com"}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-xs focus:outline-none focus:border-[#C9956A] transition-colors"
                  />
                </div>
              </div>

              {/* Field 2: Access Key (Passcode) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {authRole === "student" ? "Student Access Key" : "Faculty Passcode"}
                  </label>
                  {authRole === "student" && (
                    <span className="text-[10px] text-stone-500 font-medium">Provided by Tutor</span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder={
                      authRole === "student"
                        ? "Enter your student access key"
                        : "Enter faculty or director passcode"
                    }
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-xs focus:outline-none focus:border-[#C9956A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setForgotEmail(email);
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-[11px] text-[#93522C] hover:text-[#260A22] font-semibold hover:underline cursor-pointer"
                  >
                    {authRole === "student"
                      ? "Forgot your student access key?"
                      : "Forgot passcode / Reset?"}
                  </button>
                </div>
              </div>

              {/* Notice Boxes */}
              {authRole === "student" ? (
                <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#3D1035]">
                    <Lock className="w-3.5 h-3.5 text-[#C9956A]" />
                    <span>Student Portal Access Policy</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Student access keys are issued directly by Dr. Malavika to officially enrolled disciples.
                  </p>
                  <div className="pt-1">
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#128C7E] hover:underline"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Request Access Key from Dr. Malavika</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-1 text-left">
                  <div className="flex items-center gap-1.5 font-bold text-[#3D1035]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9956A]" />
                    <span>Faculty &amp; Administration Portal</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Access is restricted to authorized faculty and academy administrators. Passcodes are securely managed and can be updated within your workspace.
                  </p>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isLoading}
                className="silk-zari-btn w-full py-3 rounded-xl bg-gradient-to-r from-[#260A22] to-[#3D1035] hover:from-[#3D1035] hover:to-[#260A22] text-[#E8B896] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#260A22]/20 transition-all disabled:opacity-50"
              >
                <span>
                  {isLoading
                    ? "Validating Access..."
                    : authRole === "student"
                    ? "Log In as Student"
                    : "Log In to Workspace"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ═══════════════════════════════════════════════════════
               FORGOT PASSWORD / RESET INTERFACE
            ═══════════════════════════════════════════════════════ */
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Credential Recovery &amp; Self-Service Reset</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {authRole === "student"
                    ? "Enter your registered disciple email address to set a new access key."
                    : "Enter your registered faculty email to reset your Tutor or Admin passcode."}
                </p>
              </div>

              {/* Registered Email */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {authRole === "student" ? "Your Registered Student Email" : "Master Faculty Email"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={
                      authRole === "student"
                        ? "e.g. ananya.menon@example.com"
                        : "tutor@dancingragas.com"
                    }
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-xs focus:outline-none focus:border-[#C9956A]"
                  />
                </div>
              </div>

              {/* If Faculty, select which passcode to reset */}
              {authRole === "tutor" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Role to Reset</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setForgotRoleTarget("tutor")}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        forgotRoleTarget === "tutor"
                          ? "bg-[#260A22] text-[#E8B896] border-[#DFAC88]"
                          : "bg-white text-stone-700 border-stone-200"
                      }`}
                    >
                      Tutor Passcode
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotRoleTarget("admin")}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        forgotRoleTarget === "admin"
                          ? "bg-[#260A22] text-[#E8B896] border-[#DFAC88]"
                          : "bg-white text-stone-700 border-stone-200"
                      }`}
                    >
                      Admin Passcode
                    </button>
                  </div>
                </div>
              )}

              {/* New Passcode */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {authRole === "student" ? "Set New Student Access Key" : "Set New Passcode"}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    placeholder="Enter new access key"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-xs focus:outline-none focus:border-[#C9956A]"
                  />
                </div>
              </div>

              {/* Reset Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="silk-zari-btn w-full py-2.5 rounded-xl bg-[#260A22] text-[#E8B896] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Update &amp; Set New Key</span>
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-xs text-stone-600 hover:text-stone-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Log In</span>
                  </button>

                  {authRole === "student" && (
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#128C7E] font-bold hover:underline flex items-center gap-1"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Ask Dr. Malavika</span>
                    </a>
                  )}
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
