import React, { useState } from "react";
import { ExternalLink, Sparkles, RefreshCw } from "lucide-react";
import InstagramIcon from "./InstagramIcon";

/**
 * Premium SociableKIT Instagram Feed Embed
 * Securely streams @dancingragasbymalavika Instagram reels and posts.
 */
export default function SociableKitInstagramFeed({
  widgetId = "25722712",
  className = ""
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Luxury Gilded Museum Container */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#B99A63]/40 bg-gradient-to-b from-[#1E1B1B] via-[#151515] to-[#110E0E] shadow-[0_25px_60px_rgba(0,0,0,0.75)] transition-all">
        {/* Top Theatrical Accent Bar */}
        <div className="px-3.5 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-[#20070B] via-[#181515] to-[#20070B] border-b border-[#B99A63]/30 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] sm:text-sm font-serif-luxury font-bold text-[#F5F0E8] tracking-wider uppercase">
                Live Instagram Margam &amp; Reels Broadcast
              </span>
            </div>
          </div>

          <a
            href="https://www.instagram.com/dancingragasbymalavika/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all tap-bounce cursor-pointer shrink-0"
            title="Open official Instagram profile @dancingragasbymalavika"
          >
            <InstagramIcon className="w-3 h-3" />
            <span>@dancingragasbymalavika</span>
            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </a>
        </div>

        {/* Loading Shimmer State */}
        {!iframeLoaded && (
          <div className="w-full h-[480px] sm:h-[750px] flex flex-col items-center justify-center gap-3 bg-[#151515] text-[#D4AF37] px-4 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#B99A63]" />
            <span className="text-xs font-serif-luxury tracking-widest uppercase text-slate-300">
              Loading Live Instagram Feed...
            </span>
          </div>
        )}

        {/* Sandboxed SociableKIT Responsive Iframe */}
        <div className={iframeLoaded ? "block" : "hidden"}>
          <iframe
            src={`https://widgets.sociablekit.com/instagram-feed/iframe/${widgetId}`}
            title="Dr. Malavika Sunil Classical Bharatanatyam Instagram Feed"
            frameBorder="0"
            width="100%"
            height="850"
            onLoad={() => setIframeLoaded(true)}
            className="w-full min-h-[480px] sm:min-h-[850px] border-0 bg-transparent"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
