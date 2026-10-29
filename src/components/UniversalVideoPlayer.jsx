import React, { useState, useRef } from "react";
import { parseVideoUrl } from "../utils/videoUtils";
import { Play, ExternalLink, AlertCircle, Video, ShieldCheck, Sparkles } from "lucide-react";

export default function UniversalVideoPlayer({
  url = "",
  title = "Academy Video Masterclass",
  poster = "",
  className = "",
  aspectRatio = "aspect-video",
  showControlsBar = true
}) {
  const parsed = parseVideoUrl(url);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  if (!url || !parsed.isPlayable) {
    return (
      <div className={`w-full ${aspectRatio} rounded-2xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center p-6 text-center text-stone-400 ${className}`}>
        <Video className="w-10 h-10 text-stone-600 mb-2" />
        <p className="text-xs font-bold text-stone-300">No Video URL Provided</p>
        <p className="text-[11px] text-stone-500 mt-0.5">Please add a YouTube, Vimeo, Google Drive or MP4 video link.</p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-2xl bg-black border border-[#B99A63]/30 shadow-xl ${className}`}>
      <div className={`relative w-full ${aspectRatio} bg-black`}>
        {parsed.type === "direct" ? (
          <video
            ref={videoRef}
            src={parsed.embedUrl}
            poster={poster}
            controls
            playsInline
            className="w-full h-full object-contain"
            onError={() => setHasError(true)}
          />
        ) : (
          <iframe
            src={parsed.embedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )}

        {hasError && (
          <div className="absolute inset-0 bg-stone-950/90 flex flex-col items-center justify-center p-4 text-center text-white z-20">
            <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
            <p className="text-xs font-bold">Browser Restricted Direct Embed</p>
            <p className="text-[11px] text-stone-400 max-w-sm mt-1 mb-3">
              This video host requires opening in a dedicated tab or player.
            </p>
            <a
              href={parsed.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#1E050B] font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <span>Watch Video Externally</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {showControlsBar && (
        <div className="bg-[#1A0B10] border-t border-[#B99A63]/30 px-3.5 py-2 flex items-center justify-between gap-3 text-xs text-stone-300 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[11px] text-[#D4AF37] uppercase tracking-wider">
              {parsed.type === "youtube" ? "YouTube Stream" : parsed.type === "vimeo" ? "Vimeo Masterclass" : parsed.type === "gdrive" ? "Google Drive" : "Studio HD Video"}
            </span>
            <span className="text-stone-500 hidden sm:inline">&bull; {title}</span>
          </div>

          <div className="flex items-center gap-2">
            {parsed.type === "direct" && (
              <div className="flex items-center gap-1 mr-2 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
                <span className="text-[10px] text-stone-400 font-bold">Speed:</span>
                {[0.5, 0.75, 1.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleRateChange(rate)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${playbackRate === rate ? "bg-[#D4AF37] text-[#1E050B]" : "text-stone-300 hover:text-white"}`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}

            <a
              href={parsed.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all"
              title="Open video in full window"
            >
              <span>Open Link</span>
              <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
