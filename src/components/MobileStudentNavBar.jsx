import React from "react";
import { Video, BookOpen, FileText, Award, User, Sparkles } from "lucide-react";

/**
 * Mobile Bottom Navigation Bar for Student Portal
 * Provides iPhone/Android app-like bottom navigation for dancers practicing in front of mirrors.
 */
export default function MobileStudentNavBar({ activeTab, onSelectTab, onOpenProfile, counts = {} }) {
  const items = [
    { id: "live_studio", label: "Live Meet", icon: Video },
    { id: "curriculum", label: "Videos", icon: BookOpen, count: counts.videos },
    { id: "documents", label: "Notes", icon: FileText, count: counts.docs },
    { id: "evaluations", label: "Feedback", icon: Award, count: counts.feedback },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <nav aria-label="Mobile Navigation" className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1E050B]/95 text-[#F5F0E8] border-t border-[#B99A63]/40 backdrop-blur-lg px-2 py-1.5 shadow-2xl flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === "profile") {
                if (onOpenProfile) onOpenProfile();
              } else {
                onSelectTab(item.id);
              }
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
              isActive
                ? "text-[#D4AF37]"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? "bg-[#3D0B16] text-[#D4AF37]" : ""}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 tracking-tight">{item.label}</span>
            {item.count != null && item.count > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#1E050B] text-[9px] font-bold flex items-center justify-center">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
