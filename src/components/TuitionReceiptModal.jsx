import React from "react";
import { X, Printer, CheckCircle2, ShieldCheck } from "lucide-react";

export default function TuitionReceiptModal({ isOpen, onClose, student, academyInfo }) {
  if (!isOpen || !student) return null;

  const invoiceNo = `INV-2026-${String(student.id || "001").padStart(3, "0")}`;
  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-[#B99A63]/50 shadow-2xl p-5 sm:p-8 text-left font-sans space-y-5 my-auto text-stone-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-all print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Invoice Printable Sheet */}
        <div className="p-6 border border-stone-200 rounded-2xl space-y-6 bg-stone-50/50">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B99A63]">Official Tuition Sanad</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#1E050B]">
                DancingRagas Academy
              </h3>
              <p className="text-xs text-stone-500">Dr. Malavika M. Sunil &bull; Classical Bharatanatyam &amp; Vocal</p>
              <p className="text-[11px] text-stone-400">Email: info@malavikasunil.com &bull; Tel: +91 90745 85672</p>
            </div>

            <div className="sm:text-right text-xs space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider inline-block">
                Paid &bull; Verified Enrolment
              </span>
              <p className="font-mono text-stone-700 font-bold mt-1">{invoiceNo}</p>
              <p className="text-stone-500 text-[11px]">Date: {today}</p>
            </div>
          </div>

          {/* Student & Course Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block mb-0.5">Billed To (Disciple)</span>
              <p className="font-bold text-stone-900 text-sm">{student.name}</p>
              <p className="text-stone-600">{student.email}</p>
              <p className="text-stone-500">{student.location || "International Student Cohort"}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-stone-400 font-bold uppercase block mb-0.5">Academic Discipline</span>
              <p className="font-bold text-stone-900">{student.batchName || student.enrolledCourses?.[0]}</p>
              <p className="text-stone-600">Mode: 1-on-1 Online Video Studio</p>
              <p className="text-stone-500 font-mono">Reg ID: {student.registrationNo || student.id}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-xs border-t border-b border-stone-200">
            <thead>
              <tr className="bg-stone-100/80 text-stone-700 text-left">
                <th className="py-2.5 px-3 font-bold">Curriculum / Tuition Item</th>
                <th className="py-2.5 px-3 font-bold text-center">Frequency</th>
                <th className="py-2.5 px-3 font-bold text-right">Fee Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="py-3 px-3">
                  <strong className="block text-stone-900">{student.batchName || "Bharatanatyam Diploma Course"}</strong>
                  <span className="text-[11px] text-stone-500">Unlisted masterclass vault access, 4-point rubric evaluations &amp; live Google Meet</span>
                </td>
                <td className="py-3 px-3 text-center text-stone-600">Weekly Live + Vault</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-700">Enrolled &bull; Active</td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note and Stamp */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
            <div className="text-[11px] text-stone-500 max-w-sm">
              <p>Certified by DancingRagas Conservatory Directorate under Dr. Malavika M. Sunil (MBBS, CCRT National Cultural Scholar).</p>
            </div>

            <div className="text-right">
              <div className="font-serif-luxury text-base font-bold text-[#1E050B] italic">Dr. Malavika M. Sunil</div>
              <span className="text-[10px] text-stone-400 block">Authorized Directorate Signature</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="silk-zari-btn px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B99A63] text-[#1E050B] font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer tap-bounce"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Tuition Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
