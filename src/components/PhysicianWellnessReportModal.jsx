import React, { useRef } from "react";
import {
  X,
  Printer,
  Activity,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  AlertCircle,
  FileText
} from "lucide-react";

export default function PhysicianWellnessReportModal({
  isOpen,
  onClose,
  studentName = "Ananya Menon",
  registrationNo = "DR-DIP-2026-084",
  batchName = "Online Bharatanatyam Diploma Course"
}) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const BIOMECHANICAL_METRICS = [
    {
      parameter: "Araimandi Knee & Patellar Alignment",
      clinicalNote: "No medial knee collapse (valgus) detected. Patella tracks smoothly over second toe. Bilateral hip external rotation is optimal at 82°.",
      score: "Excellent (9.4 / 10)",
      status: "safe",
      doctorAdvice: "Continue maintaining quadriceps engagement. Practice static Araimandi holds for 90 seconds without lifting heels."
    },
    {
      parameter: "Spinal Lordosis & Samabhanga Core Stability",
      clinicalNote: "Neutral lumbar spine maintained during complex theermanam jumps. No anterior pelvic tilt during dritha (fast) speed footwork.",
      score: "Optimal (9.0 / 10)",
      status: "safe",
      doctorAdvice: "Keep transversus abdominis engaged when executing broad Pakkadavu lateral extensions."
    },
    {
      parameter: "Achilles Tendon & Plantar Fascia Elasticity",
      clinicalNote: "Adequate shock absorption on Kuditta Mettu heel impacts. Ankle dorsiflexion is symmetrical with no signs of Achilles strain.",
      score: "Good (8.8 / 10)",
      status: "safe",
      doctorAdvice: "Perform bilateral calf & soleus wall stretches for 45 seconds immediately following rigorous sadhana drills."
    },
    {
      parameter: "Natyarambham Scapular & Shoulder Symmetry",
      clinicalNote: "Elbow line aligned with mid-clavicular horizontal plane. Scapulae remain stabilized with zero shoulder elevation during speed shifts.",
      score: "Superior (9.6 / 10)",
      status: "safe",
      doctorAdvice: "Maintain deltoid tone with regular Hasta Mudra transitions across Chathurasram."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#FAF7F2] border border-[#B99A63]/50 shadow-2xl overflow-hidden text-left font-sans my-auto">
        {/* Deep Burgundy Top Header Bar */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-[#1E050B] via-[#2D0A14] to-[#1E050B] text-[#F5F0E8] border-b border-[#B99A63]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3D0B16] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-md">
              <Stethoscope className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
                  Physician Biomechanical &amp; Dance Health Assessment
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  Doctor Verified
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Dr. Malavika M. Sunil, MBBS &bull; Classical Dancer &amp; Physician
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate / Medical Record Card */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Patient / Disciple Profile Strip */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Disciple Name</span>
              <strong className="text-sm text-[#1E050B] font-serif-luxury">{studentName}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Registration Sanad No.</span>
              <span className="font-mono text-stone-700 font-bold">{registrationNo}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Active Discipline</span>
              <span className="text-stone-700 font-semibold">{batchName}</span>
            </div>
          </div>

          {/* Physician's Overall Clinical Impression */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Clinical Posture &amp; Ergonomics Impression: Cleared for High-Intensity Margam</span>
            </div>
            <p className="text-emerald-800 text-[11.5px] leading-relaxed">
              "The disciple exhibits excellent anatomical alignment during rigorous rhythmic stamping. The risk of patellar tendinitis or lumbar fatigue is extremely low due to consistent core stabilization and symmetrical knee kinematics. Continued longitudinal practice is strongly recommended."
            </p>
          </div>

          {/* 4 Biomechanical Parameters Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-500">
              Detailed Anatomical &amp; Kinesiology Metrics
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {BIOMECHANICAL_METRICS.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-[#B99A63]/50 transition-all space-y-2 text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 pb-2">
                    <span className="font-bold text-xs sm:text-sm text-[#1E050B] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      {metric.parameter}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] self-start sm:self-auto">
                      {metric.score}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    <strong className="text-stone-900">Physician Finding:</strong> {metric.clinicalNote}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#F5F0E8] border border-[#B99A63]/20 text-[11px] text-stone-700">
                    <strong className="text-[#1E050B]">Prescribed Dance Warmup:</strong> {metric.doctorAdvice}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor's Signature & Authority Seal */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left text-xs text-stone-500 space-y-0.5">
              <p className="font-semibold text-stone-700">Certified by Academy Health &amp; Movement Clinic</p>
              <p className="text-[11px]">Evaluation conducted under Dr. Malavika's Anatomical Dance Protocol</p>
            </div>

            <div className="text-right">
              <div className="font-serif-luxury font-bold text-sm text-[#1E050B]">
                Dr. Malavika M. Sunil
              </div>
              <p className="text-[10px] text-stone-600">MBBS &bull; Principal Guru &amp; Anatomical Pedagogue</p>
              <p className="text-[9px] font-mono text-stone-400">DancingRagas Conservatory Seal</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#1E050B] text-[#D4AF37] text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
          >
            Close Health Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
