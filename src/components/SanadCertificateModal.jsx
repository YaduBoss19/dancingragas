import React from "react";
import { X, Award, Printer, ShieldCheck, Sparkles, Download } from "lucide-react";

export default function SanadCertificateModal({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null;

  const regCode = student.registrationNo || `DR-2026-${String(student.id || "001").padStart(3, "0")}`;
  const batch = student.batchName || student.enrolledCourses?.[0] || "Online Bharatanatyam Diploma Course";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#FCFAF6] border-2 border-[#D4AF37] shadow-2xl p-4 sm:p-6 text-center font-sans space-y-3.5 my-auto text-stone-900">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-all print:hidden z-10"
          title="Close Certificate"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Frame Inner Border */}
        <div className="border-2 sm:border-4 border-double border-[#B99A63]/60 p-4 sm:p-6 rounded-xl sm:rounded-2xl relative bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] space-y-2.5 sm:space-y-3">
          {/* Top Sanskrit Lineage Shloka */}
          <div className="space-y-0.5">
            <p className="text-[10px] sm:text-xs font-serif text-[#3D0B16] font-bold tracking-widest uppercase">
              ॥ नादबिन्दु कलातीतः सर्वविद्या विशारदः ॥
            </p>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#1E050B] tracking-wide">
              DancingRagas Conservatory
            </h2>
            <p className="text-[9px] sm:text-[10px] text-[#B99A63] font-bold uppercase tracking-[0.2em]">
              Academy of Classical Dance &amp; Carnatic Music &bull; Dr. Malavika M. Sunil
            </p>
          </div>

          <div>
            <span className="px-3 py-0.5 rounded-full bg-[#1E050B] text-[#D4AF37] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider inline-block shadow-xs">
              Official Sanad of Enrolment &amp; Lineage Admission
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-stone-600 font-serif italic max-w-lg mx-auto">
            This certifies that the conservatory disciple has been officially inducted into the traditional Gurukula lineage:
          </p>

          {/* Student Full Name */}
          <div className="my-2 py-1.5 border-b-2 border-dotted border-[#D4AF37] max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#1E050B] tracking-wide">
              {student.name}
            </h3>
          </div>

          <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed max-w-xl mx-auto">
            Admitted to <strong>{batch}</strong>. Endowed with continuous 1-on-1 mentorship in Margam Adavu biomechanics, Hastha Mudra geometry, and classical Natyashastra traditions.
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2.5 border-t border-stone-200 text-left text-[11px]">
            <div>
              <span className="text-[9px] text-stone-400 font-bold uppercase block">Sanad Identifier</span>
              <strong className="font-mono text-[#3D0B16] text-[10px] sm:text-xs">{regCode}</strong>
            </div>
            <div>
              <span className="text-[9px] text-stone-400 font-bold uppercase block">Admission Year</span>
              <strong className="text-[10px] sm:text-xs">Academic Year 2026/27</strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] text-stone-400 font-bold uppercase block">Pedagogy Head</span>
              <strong className="text-emerald-800 text-[10px] sm:text-xs">Dr. Malavika M. Sunil (MBBS)</strong>
            </div>
          </div>

          {/* Seal and Signatures */}
          <div className="pt-3 border-t border-[#B99A63]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B99A63] p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full bg-[#1E050B] text-[#D4AF37] flex flex-col items-center justify-center p-0.5 text-[7px] font-bold text-center leading-tight">
                  <Award className="w-3.5 h-3.5 mb-0.5 text-[#D4AF37]" />
                  <span>SEAL</span>
                </div>
              </div>
              <div className="text-left text-[9px] text-stone-500">
                <span className="font-bold text-[#1E050B] block">CCRT National Cultural Scholar</span>
                <span>Govt. of India &bull; MBBS Physician</span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif-luxury text-sm sm:text-base font-bold text-[#1E050B] italic tracking-wide">
                Dr. Malavika M. Sunil
              </div>
              <span className="text-[9px] text-stone-500 block">Founder &amp; Principal Guru</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="flex items-center justify-center gap-2 pt-1 print:hidden flex-wrap">
          <button
            type="button"
            onClick={handlePrint}
            className="silk-zari-btn px-5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#1E050B] font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer tap-bounce"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save Sanad (PDF)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
