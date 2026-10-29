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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#FCFAF6] border-2 border-[#D4AF37] shadow-2xl p-6 sm:p-10 text-center font-sans space-y-6 my-8 text-stone-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-all print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Frame Inner Border */}
        <div className="border-4 border-double border-[#B99A63]/60 p-6 sm:p-10 rounded-2xl relative bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]">
          {/* Top Sanskrit Lineage Shloka */}
          <div className="space-y-1 mb-4">
            <p className="text-[11px] sm:text-xs font-serif text-[#3D0B16] font-bold tracking-widest uppercase">
              ॥ नादबिन्दु कलातीतः सर्वविद्या विशारदः ॥
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#1E050B] tracking-wide">
              DancingRagas Conservatory
            </h2>
            <p className="text-[11px] text-[#B99A63] font-bold uppercase tracking-[0.25em]">
              Academy of Classical Dance &amp; Carnatic Music &bull; Dr. Malavika M. Sunil
            </p>
          </div>

          <div className="my-6">
            <span className="px-4 py-1 rounded-full bg-[#1E050B] text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-widest inline-block shadow-sm">
              Official Sanad of Enrolment &amp; Lineage Admission
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 font-serif italic max-w-lg mx-auto">
            This certifies that the conservatory disciple has been officially inducted into the traditional Gurukula lineage:
          </p>

          {/* Student Full Name */}
          <div className="my-5 py-2 border-b-2 border-dotted border-[#D4AF37] max-w-md mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#1E050B] tracking-wide">
              {student.name}
            </h3>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed max-w-xl mx-auto">
            Admitted to the <strong>{batch}</strong>. Endowed with continuous 1-on-1 mentorship in Margam Adavu biomechanics, Hastha Mudra geometry, and classical Natyashastra traditions.
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 pt-4 border-t border-stone-200 text-left text-xs">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Sanad Identifier</span>
              <strong className="font-mono text-[#3D0B16]">{regCode}</strong>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Admission Year</span>
              <strong>Academic Year 2026/27</strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Pedagogy Head</span>
              <strong className="text-emerald-800">Dr. Malavika M. Sunil (MBBS)</strong>
            </div>
          </div>

          {/* Seal and Signatures */}
          <div className="pt-6 border-t border-[#B99A63]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B99A63] p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#1E050B] text-[#D4AF37] flex flex-col items-center justify-center p-1 text-[8px] font-bold text-center leading-tight">
                  <Award className="w-4 h-4 mb-0.5 text-[#D4AF37]" />
                  <span>SEAL</span>
                </div>
              </div>
              <div className="text-left text-[10px] text-stone-500">
                <span className="font-bold text-[#1E050B] block">CCRT National Cultural Scholar</span>
                <span>Government of India &bull; MBBS Physician</span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif-luxury text-lg font-bold text-[#1E050B] italic tracking-wide">
                Dr. Malavika M. Sunil
              </div>
              <span className="text-[10px] text-stone-500 block">Founder &amp; Principal Guru</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="flex items-center justify-center gap-3 pt-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="silk-zari-btn px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#1E050B] font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer tap-bounce"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Official Certificate (PDF)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
