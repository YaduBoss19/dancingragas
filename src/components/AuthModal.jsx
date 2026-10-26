import React, { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import { loginUser, signUpStudent, isSupabaseConfigured } from "../lib/supabaseClient";
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
  AlertCircle
} from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const { setAuthUser, setUserRole, setCurrentPage, showToast } = useAcademy();

  const [authRole, setAuthRole] = useState("student"); // 'student' | 'admin'
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [batchName, setBatchName] = useState("Online Bharatanatyam Diploma Course");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (authMode === "signup" && authRole === "student") {
        const { user, error } = await signUpStudent(email, password, fullName, batchName);
        if (error) {
          setErrorMessage(error.message);
          setIsLoading(false);
          return;
        }
        setAuthUser(user);
        setUserRole("student");
        showToast("Student account created successfully! Welcome to DancingRagas.", "success");
        onClose();
        setCurrentPage("student-portal");
      } else {
        // Sign In
        const { user, role, error } = await loginUser(email, password);
        if (error) {
          setErrorMessage(error.message);
          setIsLoading(false);
          return;
        }

        const effectiveRole = authRole === "admin" ? "admin" : (role || "student");
        setAuthUser(user);
        setUserRole(effectiveRole);
        showToast(
          effectiveRole === "admin"
            ? "Welcome back, Dr. Malavika (Admin CMS Active)"
            : "Welcome back to your Student Sanctuary!",
          "success"
        );
        onClose();
        setCurrentPage(effectiveRole === "admin" ? "admin" : "student-portal");
      }
    } catch (err) {
      setErrorMessage(err.message || "Authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#B99A63]/50 shadow-2xl overflow-hidden text-left">
        {/* Header bar */}
        <div className="relative p-6 sm:p-7 bg-[#151515] text-[#F5F0E8] border-b border-[#B99A63]/30">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
              Secure Portal Access
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
            DancingRagas <span className="text-[#D4AF37]">Sanctuary</span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            {authRole === "admin"
              ? "Dr. Malavika & Studio Content Management CMS"
              : "Student Classroom, Timezones & Practice Reviews"}
          </p>

          {/* Role selector tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 rounded-2xl bg-white/10 border border-white/15">
            <button
              type="button"
              onClick={() => {
                setAuthRole("student");
                setErrorMessage("");
              }}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authRole === "student"
                  ? "bg-[#D4AF37] text-[#151515] shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthRole("admin");
                setAuthMode("login");
                setErrorMessage("");
              }}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authRole === "admin"
                  ? "bg-[#D4AF37] text-[#151515] shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authRole === "student" && authMode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Menon"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enrolled Programme / Batch
                  </label>
                  <select
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none"
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder={authRole === "admin" ? "malavika@malavikasunil.com" : "student@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:border-[#B99A63] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="silk-zari-btn w-full py-3 rounded-full bg-[#151515] hover:bg-[#B99A63] text-[#F5F0E8] hover:text-[#151515] text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer tap-bounce"
            >
              <span>
                {isLoading
                  ? "Verifying Credentials..."
                  : authMode === "signup"
                  ? "Create Student Account"
                  : authRole === "admin"
                  ? "Access Admin CMS"
                  : "Sign In to Classroom"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Switch mode for students */}
          {authRole === "student" && (
            <div className="text-center pt-1 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                className="text-xs text-slate-600 hover:text-[#151515] underline cursor-pointer"
              >
                {authMode === "login"
                  ? "Enrolled for a new batch? Create your student account"
                  : "Already enrolled? Sign in with your registered email"}
              </button>
            </div>
          )}

          {/* Enrolment Support */}
          <div className="p-3.5 rounded-2xl bg-[#F5F0E8] border border-[#B99A63]/30 text-[11px] text-[#3B0B14] flex items-center justify-between gap-3">
            <div>
              <span className="font-bold block">Need Enrolment or Login Help?</span>
              <span className="text-stone-600">Contact Dr. Malavika at +91 90745 85672</span>
            </div>
            <a
              href="https://wa.me/919074585672?text=Hello%20Dr.%20Malavika%2C%20I%20need%20assistance%20logging%20into%20the%20DancingRagas%20Portal."
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
