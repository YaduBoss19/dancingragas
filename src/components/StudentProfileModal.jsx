import React, { useState } from "react";
import {
  X,
  Camera,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Check,
  Sparkles
} from "lucide-react";
import { compressImageFile } from "../utils/imageCompressor";

export default function StudentProfileModal({
  isOpen,
  onClose,
  student,
  onSave
}) {
  const [name, setName] = useState(student?.name || "");
  const [whatsapp, setWhatsapp] = useState(student?.whatsappNumber || student?.phone || "+91 98470 12345");
  const [email, setEmail] = useState(student?.email || "");
  const [location, setLocation] = useState(student?.location || "Kochi, Kerala");
  const [guardianName, setGuardianName] = useState(student?.guardianName || "Sunil Menon");
  const [avatarUrl, setAvatarUrl] = useState(student?.avatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressed = await compressImageFile(file, 600, 0.85);
      setAvatarUrl(compressed.dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        name,
        whatsappNumber: whatsapp,
        phone: whatsapp,
        email,
        location,
        guardianName,
        avatarUrl
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF7F2] border border-[#B99A63]/50 shadow-2xl p-6 sm:p-8 text-left font-sans space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#B99A63] tracking-widest block">
              Student Information
            </span>
            <h3 className="text-lg font-bold font-serif-luxury text-[#0F172A]">
              Edit Student Profile &amp; Contact
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Avatar / Photo Upload */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-bold text-xl overflow-hidden shrink-0 shadow-md">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span>{name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-800 block text-xs">Student Profile Photo</span>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-[#D4AF37] font-bold text-[11px] cursor-pointer transition-all shadow-xs">
                <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isUploading ? "Compressing..." : "Upload New Photo"}</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <p className="text-[10px] text-stone-400">Recommended square headshot for certificates &amp; ID</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Student Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#B99A63]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                WhatsApp Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+91 98470 12345"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#B99A63]"
                />
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5 block">Used for class Google Meet links</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#B99A63]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Sunil Menon"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#B99A63]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">City / Country</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. London, UK / Kochi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#B99A63]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="silk-zari-btn px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-[#D4AF37] font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Profile &amp; Contact</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
