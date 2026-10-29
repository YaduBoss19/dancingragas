const fs = require('fs');
const path = require('path');

const authModalPath = path.join(__dirname, '..', 'src', 'components', 'AuthModal.jsx');

const code = `import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import { loginUser, signUpStudent } from "../lib/supabaseClient";
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  BookOpen
} from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const { setAuthUser, setUserRole, setCurrentPage, showToast, studentsList, setStudentsList, loginAdmin } = useAcademy();

  // 3 Prestigious Roles: 'student' (Disciple Sanctuary) | 'tutor' (Faculty & Guru Desk) | 'admin' (Directorate Suite)
  const [authRole, setAuthRole] = useState("student");
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup' | 'forgot'

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [batchName, setBatchName] = useState("Online Bharatanatyam Diploma Course");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setResetSuccessMessage("");

    try {
      // 1. FORGOT PASSWORD (FOR CONSERVATORY DISCIPLES)
      if (authMode === "forgot") {
        if (!email.trim()) {
          setErrorMessage("Please enter your registered student email address or ID.");
          setIsLoading(false);
          return;
        }
        if (!newPassword || newPassword.length < 6) {
          setErrorMessage("New password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setErrorMessage("Passwords do not match. Please re-enter.");
          setIsLoading(false);
          return;
        }

        // Look up disciple in registered studentsList
        const normalized = email.trim().toLowerCase();
        const found = (studentsList || []).find(
          (s) => s.email?.toLowerCase() === normalized || s.registrationNo?.toLowerCase() === normalized
        );

        if (found) {
          const updatedList = studentsList.map((s) =>
            s.id === found.id ? { ...s, password: newPassword } : s
          );
          setStudentsList(updatedList);
          try {
            localStorage.setItem("dancingragas_academy_students_v3", JSON.stringify(updatedList));
          } catch {
            // Ignore storage failure
          }
        }

        setResetSuccessMessage("Password reset successfully! You can now log in to the Disciple Sanctuary.");
        setPassword(newPassword);
        setTimeout(() => {
          setAuthMode("login");
          setResetSuccessMessage("");
        }, 1800);
        showToast("Password reset successfully!", "success");
        return;
      }

      // 2. NEW STUDENT SIGN UP
      if (authMode === "signup" && authRole === "student") {
        const { user, error } = await signUpStudent(email, password, fullName, batchName);
        if (error) {
          setErrorMessage(error.message);
          setIsLoading(false);
          return;
        }
        setAuthUser(user);
        setUserRole("student");
        showToast("Disciple account created successfully! Welcome to DancingRagas Sanctuary.", "success");
        onClose();
        setCurrentPage("student-portal");
        return;
      }

      // 3. FACULTY & GURU DESK AUTHENTICATION
      if (authRole === "tutor") {
        const isGuruKey = password === "tutor123" || password === "guru123" || password === "faculty123";
        const isGuruEmail = email.toLowerCase().includes("tutor") || email.toLowerCase().includes("guru") || email.toLowerCase().includes("faculty");

        if (!isGuruKey && !isGuruEmail) {
          setErrorMessage("Invalid Faculty Guru credentials. Passcode key: 'tutor123'");
          setIsLoading(false);
          return;
        }

        setUserRole("tutor");
        setAuthUser({
          id: "faculty-guru-01",
          email: email || "guru@dancingragas.com",
          role: "tutor",
          user_metadata: { full_name: "Faculty Guru & Pedagogue", role: "tutor" }
        });
        showToast("Welcome to Faculty & Guru Desk! Academic suite active.", "success");
        onClose();
        setCurrentPage("admin");
        return;
      }

      // 4. DIRECTORATE SUITE AUTHENTICATION
      if (authRole === "admin") {
        const ok = loginAdmin ? loginAdmin(password) : (password === "admin123" || password === "admin");
        if (!ok) {
          setErrorMessage("Invalid Directorate passcode. Default key is 'admin123'");
          setIsLoading(false);
          return;
        }
        setUserRole("admin");
        setAuthUser({
          id: "director-malavika",
          email: "info@malavikasunil.com",
          role: "admin",
          user_metadata: { full_name: "Dr. Malavika M. Sunil (MBBS)", role: "admin" }
        });
        showToast("Directorate Suite authenticated! Master Studio active.", "success");
        onClose();
        setCurrentPage("admin");
        return;
      }

      // 5. DISCIPLE SANCTUARY SIGN IN
      const { user, role, error } = await loginUser(email, password);
      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      const effectiveRole = role || "student";
      setAuthUser(user);
      setUserRole(effectiveRole);
      showToast("Welcome back to your Disciple Sanctuary!", "success");
      onClose();
      setCurrentPage("student-portal");
    } catch (err) {
      setErrorMessage(err.message || "Authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF7F2] border border-[#B99A63]/50 shadow-2xl overflow-hidden text-left font-sans">
        {/* iPhone Deep Burgundy Header bar */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-b from-[#1E050B] via-[#2D0A14] to-[#1E050B] text-[#F5F0E8] border-b border-[#B99A63]/30">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Verified Academy Access
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
            DancingRagas <span className="text-[#D4AF37]">Portals</span>
          </h3>
          <p className="text-xs text-stone-300 mt-0.5">
            {authMode === "forgot"
              ? "Self-Service Disciple Credential Recovery"
              : authRole === "admin"
              ? "Dr. Malavika M. Sunil • Academy Directorate Suite"
              : authRole === "tutor"
              ? "Teaching Faculty • Biomechanical Rubrics & Masterclass Desk"
              : "Conservatory Disciples • Curriculum, Unlisted Vaults & Live Classroom"}
          </p>

          {/* 3 Client Role Selector Tabs */}
          {authMode !== "forgot" && (
            <div className="mt-5 grid grid-cols-3 p-1 rounded-2xl bg-black/40 border border-[#B99A63]/30 gap-1">
              <button
                type="button"
                onClick={() => {
                  setAuthRole("student");
                  setErrorMessage("");
                }}
                className={\`py-2 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer \${
                  authRole === "student"
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] shadow-md shadow-[#D4AF37]/20"
                    : "text-stone-300 hover:text-white"
                }\`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Disciple Sanctuary</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthRole("tutor");
                  setAuthMode("login");
                  setErrorMessage("");
                }}
                className={\`py-2 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer \${
                  authRole === "tutor"
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] shadow-md shadow-[#D4AF37]/20"
                    : "text-stone-300 hover:text-white"
                }\`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Faculty Desk</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthRole("admin");
                  setAuthMode("login");
                  setErrorMessage("");
                }}
                className={\`py-2 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer \${
                  authRole === "admin"
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] shadow-md shadow-[#D4AF37]/20"
                    : "text-stone-300 hover:text-white"
                }\`}
              >
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Directorate</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {resetSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{resetSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* FORGOT PASSWORD FORM (FOR DISCIPLES) */}
            {authMode === "forgot" ? (
              <>
                <div className="p-3 rounded-xl bg-[#3D0B16]/10 border border-[#B99A63]/30 text-xs text-[#3D0B16]">
                  <p className="font-bold flex items-center gap-1.5 mb-0.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#B99A63]" />
                    <span>Instant Disciple Password Recovery</span>
                  </p>
                  <p className="text-[11px] text-stone-600">
                    Enter your registered disciple email address (*e.g., student@dancingragas.com*) and choose your new password.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Registered Disciple Email / ID</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="student@dancingragas.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none focus:ring-1 focus:ring-[#B99A63]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none focus:ring-1 focus:ring-[#B99A63]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none focus:ring-1 focus:ring-[#B99A63]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="silk-zari-btn w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer tap-bounce"
                >
                  <KeyRound className="w-4 h-4 text-[#1E050B]" />
                  <span>Update Password &amp; Continue</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMessage("");
                    }}
                    className="text-xs text-stone-600 hover:text-[#151515] underline cursor-pointer"
                  >
                    &larr; Return to Sign In
                  </button>
                </div>
              </>
            ) : (
              /* REGULAR LOGIN / SIGNUP FORM */
              <>
                {authMode === "signup" && authRole === "student" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Disciple Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ananya Menon"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none focus:ring-1 focus:ring-[#B99A63]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Enrolled Discipline / Batch
                      </label>
                      <select
                        value={batchName}
                        onChange={(e) => setBatchName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none"
                      >
                        <option value="Online Bharatanatyam Diploma Course">
                          Online Bharatanatyam Diploma Course
                        </option>
                        <option value="Online Bharatanatyam Non-Diploma Classes">
                          Online Bharatanatyam Non-Diploma Classes
                        </option>
                        <option value="Online Carnatic Music Classes">
                          Online Carnatic Music Classes
                        </option>
                        <option value="Online Semi-Classical Bollywood Dance Classes">
                          Online Semi-Classical Bollywood Dance Classes
                        </option>
                      </select>
                    </div>
                  </>
                )}

                {authRole === "admin" ? (
                  <div className="p-3.5 rounded-2xl bg-[#3D0B16]/10 border border-[#B99A63]/30 text-xs text-[#3D0B16]">
                    <span className="font-bold flex items-center gap-1.5 mb-1 text-sm text-[#3D0B16] font-serif-luxury">
                      <Shield className="w-4 h-4 text-[#B99A63]" />
                      <span>Academy Directorate Authentication</span>
                    </span>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Enter the director security passcode to access the Master Website &amp; Media Studio, admissions CRM, and full academic governance.
                    </p>
                  </div>
                ) : authRole === "tutor" ? (
                  <div className="p-3.5 rounded-2xl bg-[#3D0B16]/10 border border-[#B99A63]/30 text-xs text-[#3D0B16]">
                    <span className="font-bold flex items-center gap-1.5 mb-1 text-sm text-[#3D0B16] font-serif-luxury">
                      <BookOpen className="w-4 h-4 text-[#B99A63]" />
                      <span>Faculty &amp; Guru Desk Access</span>
                    </span>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Enter your faculty passcode (e.g. <code>tutor123</code>) or faculty email to review disciple submissions, conduct 4-point biomechanical grading, and host live classes.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Disciple Registered Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="student@dancingragas.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none focus:ring-1 focus:ring-[#B99A63]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      {authRole === "admin"
                        ? "Directorate Security Key"
                        : authRole === "tutor"
                        ? "Faculty Passcode"
                        : "Disciple Password"}
                    </label>
                    {authRole === "student" && authMode === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("forgot");
                          setErrorMessage("");
                        }}
                        className="text-[11px] text-[#B99A63] hover:text-[#3D0B16] font-semibold cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder={
                        authRole === "admin"
                          ? "Enter director security key (admin123)"
                          : authRole === "tutor"
                          ? "Enter faculty key (tutor123)"
                          : "••••••••"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none focus:ring-1 focus:ring-[#B99A63]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="silk-zari-btn w-full py-3.5 rounded-full bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] hover:text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer tap-bounce border border-[#B99A63]/40"
                >
                  <span>
                    {isLoading
                      ? "Verifying Credentials..."
                      : authMode === "signup"
                      ? "Create Disciple Sanctuary Account"
                      : authRole === "admin"
                      ? "Access Directorate Suite"
                      : authRole === "tutor"
                      ? "Access Faculty & Guru Desk"
                      : "Sign In to Disciple Sanctuary"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </>
            )}
          </form>

          {/* Switch mode for students */}
          {authRole === "student" && authMode !== "forgot" && (
            <div className="text-center pt-1 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                className="text-xs text-stone-600 hover:text-[#151515] underline cursor-pointer"
              >
                {authMode === "login"
                  ? "Enrolled for a new batch? Create your disciple account"
                  : "Already enrolled? Sign in to your Disciple Sanctuary"}
              </button>
            </div>
          )}

          {/* Direct Concierge Support */}
          <div className="p-3 rounded-2xl bg-[#3D0B16]/10 border border-[#B99A63]/30 text-[11px] text-[#3D0B16] flex items-center justify-between gap-3">
            <div>
              <span className="font-bold block">Need Portal Assistance?</span>
              <span className="text-stone-600">Direct WhatsApp with Dr. Malavika</span>
            </div>
            <a
              href="https://wa.me/919074585672?text=Hello%20Dr.%20Malavika%2C%20I%20need%20assistance%20logging%20into%20my%20DancingRagas%20account."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-bold text-xs shrink-0 hover:brightness-105 transition-all shadow-xs"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(authModalPath, code, 'utf8');
console.log('AuthModal.jsx updated successfully with 3 prestigious client roles.');
