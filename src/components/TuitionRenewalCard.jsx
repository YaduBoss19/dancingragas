import React, { useState } from "react";
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check
} from "lucide-react";

export default function TuitionRenewalCard({
  studentName = "Ananya Menon",
  registrationNo = "DR-DIP-2026-084",
  batchName = "Online Bharatanatyam Diploma Course",
  onOpenReceipt
}) {
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const upiId = "malavikasunil@okhdfcbank";

  const handleCopyUpi = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white border border-[#B99A63]/30 shadow-lg p-5 sm:p-6 text-left font-sans space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E050B] text-[#D4AF37] flex items-center justify-center font-bold shadow-md shrink-0">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base font-serif-luxury text-[#151515]">
                  Tuition Status &amp; Term Sanad
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Active &bull; Paid
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Term 2 (2026/27) &bull; Next renewal scheduled for Jan 31, 2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReceipt}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#B99A63]" />
              <span>Official Tax Receipt</span>
            </button>

            <button
              onClick={() => setIsRenewModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1E050B] hover:bg-[#3D0B16] text-[#D4AF37] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#B99A63]/40"
            >
              <span>Tuition Details</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F5F0E8] border border-[#B99A63]/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Enrolled Tier</span>
            <span className="font-bold text-[#1E050B] text-xs sm:text-sm block truncate">{batchName}</span>
            <span className="text-[10px] text-stone-600 block">Monthly 8 Sessions + Vault Access</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F0E8] border border-[#B99A63]/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Current Quarter Status</span>
            <span className="font-bold text-emerald-700 text-xs sm:text-sm flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paid in Full</span>
            </span>
            <span className="text-[10px] text-stone-600 block">Receipt: DR-RCP-2026-104</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F0E8] border border-[#B99A63]/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Next Renewal Cycle</span>
            <span className="font-bold text-[#1E050B] text-xs sm:text-sm block">January 31, 2027</span>
            <span className="text-[10px] text-stone-600 block">Zero late fees &bull; 1-click renewal</span>
          </div>
        </div>
      </div>

      {/* Tuition Renewal Info Modal */}
      {isRenewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#B99A63]/50 shadow-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold font-serif-luxury text-[#1E050B]">
                Academy Tuition &amp; Bank Transfer
              </h3>
              <button
                onClick={() => setIsRenewModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Official UPI ID:</span>
                <button
                  onClick={handleCopyUpi}
                  className="font-mono font-bold text-[#1E050B] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
                  <span>{upiId}</span>
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                <span className="text-stone-500">Account Name:</span>
                <strong className="text-stone-900">Dr. Malavika M. Sunil</strong>
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                <span className="text-stone-500">Bank &amp; Branch:</span>
                <span className="text-stone-800">HDFC Bank, Trivandrum Main</span>
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                <span className="text-stone-500">IFSC Code:</span>
                <span className="font-mono font-bold text-stone-800">HDFC0000043</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              Upon transferring tuition fees, WhatsApp your payment screenshot with disciple registration ID (<strong className="text-stone-800">{registrationNo}</strong>) for instant automated receipt confirmation.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`https://wa.me/919074585672?text=Hello%20Dr.%20Malavika%2C%20here%20is%20the%20tuition%20renewal%20transfer%20confirmation%20for%20disciple%20${encodeURIComponent(studentName)}%20(${registrationNo}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold text-center hover:brightness-105"
              >
                Send Screenshot on WhatsApp
              </a>

              <button
                onClick={() => setIsRenewModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-200 text-stone-800 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
