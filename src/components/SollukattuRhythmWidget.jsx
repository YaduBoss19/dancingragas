import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, FastForward, RotateCcw, Sparkles } from "lucide-react";

export default function SollukattuRhythmWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1); // 1 = 1st speed (60 BPM), 2 = 2nd speed (120 BPM), 3 = 3rd speed (240 BPM)
  const [talam, setTalam] = useState("Adi"); // 'Adi' (8 beats) | 'Rupaka' (6 beats) | 'Tisra' (3 beats)
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);

  // Adi Talam syllables (8 beats)
  const ADI_SYLLABLES = [
    { num: 1, sol: "Tai", action: "Clap (Samam)" },
    { num: 2, sol: "Yum", action: "Finger 1" },
    { num: 3, sol: "Dat", action: "Finger 2" },
    { num: 4, sol: "Ta", action: "Finger 3" },
    { num: 5, sol: "Tai", action: "Wave" },
    { num: 6, sol: "Hi", action: "Turn" },
    { num: 7, sol: "Dat", action: "Wave" },
    { num: 8, sol: "Ta", action: "Turn" }
  ];

  const totalBeats = talam === "Adi" ? 8 : talam === "Rupaka" ? 6 : 3;

  // Sound generator for Talam Clink & Mridangam Dhim
  const playClickSound = (isFirstBeat) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;
      if (isFirstBeat) {
        // High bronze talam bell resonance (880 Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      } else {
        // Crisp wooden talam click (440 Hz)
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Audio fallback
    }
  };

  const bpm = currentSpeed === 1 ? 60 : currentSpeed === 2 ? 120 : 240;
  const intervalMs = (60 / bpm) * 1000;

  useEffect(() => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setCurrentBeat((prev) => {
          const next = (prev + 1) % totalBeats;
          playClickSound(next === 0);
          return next;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSpeed, talam, totalBeats, intervalMs]);

  const togglePlay = () => {
    if (!isPlaying) {
      playClickSound(true);
      setCurrentBeat(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#1E050B] via-[#2A0812] to-[#1E050B] border border-[#B99A63]/50 text-white p-4 sm:p-5 shadow-xl font-sans text-left space-y-4">
      {/* Title & Speed Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3D0B16] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm font-serif-luxury text-white">
                Sollukattu &amp; Nattuvangam Talam Metronome
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/40">
                {talam} Talam ({bpm} BPM)
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              Practice Adavu footwork across 1st, 2nd &amp; 3rd speed with bronze bell clicks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className={`silk-zari-btn px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer tap-bounce self-start sm:self-auto ${
            isPlaying
              ? "bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-600"
              : "bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] hover:brightness-105"
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? "Pause Talam" : "Start Talam"}</span>
        </button>
      </div>

      {/* Speed & Talam Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Speed Tabs */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
            Laya Speed (Kalam):
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
            {[
              { speed: 1, label: "1st Speed", bpm: "60 BPM (Vilambitha)" },
              { speed: 2, label: "2nd Speed", bpm: "120 BPM (Madhyama)" },
              { speed: 3, label: "3rd Speed", bpm: "240 BPM (Dritha)" }
            ].map((s) => (
              <button
                key={s.speed}
                type="button"
                onClick={() => setCurrentSpeed(s.speed)}
                className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                  currentSpeed === s.speed
                    ? "bg-[#D4AF37] text-[#1E050B] shadow-xs"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Talam Type */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
            Talam Meter:
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
            {["Adi", "Rupaka", "Tisra"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTalam(t);
                  setCurrentBeat(0);
                }}
                className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                  talam === t
                    ? "bg-[#D4AF37] text-[#1E050B] shadow-xs"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                {t} ({t === "Adi" ? "8 beats" : t === "Rupaka" ? "6 beats" : "3 beats"})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Beat Indicator Dots */}
      <div className="pt-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
          Current Beat Visualizer:
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {ADI_SYLLABLES.slice(0, totalBeats).map((item, idx) => {
            const isCurrent = isPlaying && currentBeat === idx;
            return (
              <div
                key={idx}
                className={`p-2 rounded-xl text-center transition-all duration-150 border ${
                  isCurrent
                    ? "bg-[#D4AF37] text-[#1E050B] border-white scale-105 shadow-md shadow-[#D4AF37]/40 ring-2 ring-white/50"
                    : "bg-white/5 text-stone-300 border-white/10"
                }`}
              >
                <span className={`text-[10px] font-bold block ${isCurrent ? "text-[#1E050B]" : "text-stone-400"}`}>
                  Beat {item.num}
                </span>
                <span className="text-xs sm:text-sm font-bold font-serif-luxury block mt-0.5">
                  {item.sol}
                </span>
                <span className={`text-[9px] block ${isCurrent ? "text-[#1E050B] font-semibold" : "text-stone-500"}`}>
                  {item.action}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
