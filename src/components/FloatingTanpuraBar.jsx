import React, { useState, useEffect, useRef } from "react";
import { Music, Volume2, VolumeX, Sliders, X, Minimize2, Maximize2 } from "lucide-react";

/**
 * Global Persistent Tanpura Drone Sound Bar
 * Synthesizes pure Indian classical Sa-Pa harmonics using Web Audio API.
 * Floats in the bottom corner so students can listen while reading PDFs,
 * browsing lesson videos, or checking live schedules.
 */
export default function FloatingTanpuraBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState("C#");
  const [tuning, setTuning] = useState("Pa");
  const [volume, setVolume] = useState(0.35);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const timerRef = useRef(null);

  const PITCH_FREQS = {
    "A": 220.0,
    "A#": 233.08,
    "B": 246.94,
    "C": 261.63,
    "C#": 277.18,
    "D": 293.66,
    "D#": 311.13,
    "E": 329.63,
    "F": 349.23,
    "F#": 369.99,
    "G": 392.0,
    "G#": 415.3
  };

  const stopDrone = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const startDrone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      const baseFreq = PITCH_FREQS[pitch] || 277.18;
      const firstNoteRatio = tuning === "Pa" ? 1.5 : 1.3333;
      const notes = [
        baseFreq * firstNoteRatio, // Pa or Ma
        baseFreq * 2,              // Sa higher
        baseFreq * 2,              // Sa higher
        baseFreq                   // Sa lower
      ];

      let noteIdx = 0;

      const pluck = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const now = audioCtxRef.current.currentTime;
        const freq = notes[noteIdx];

        const osc1 = audioCtxRef.current.createOscillator();
        const osc2 = audioCtxRef.current.createOscillator();
        const stringGain = audioCtxRef.current.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq, now);

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 2, now);

        stringGain.gain.setValueAtTime(0.001, now);
        stringGain.gain.exponentialRampToValueAtTime(0.35, now + 0.12);
        stringGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

        osc1.connect(stringGain);
        osc2.connect(stringGain);
        stringGain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.9);
        osc2.stop(now + 2.9);

        noteIdx = (noteIdx + 1) % notes.length;
      };

      pluck();
      timerRef.current = setInterval(pluck, 750);
      setIsPlaying(true);
    } catch (e) {
      console.error("Audio initialization error:", e);
    }
  };

  const toggleDrone = () => {
    if (isPlaying) {
      stopDrone();
    } else {
      startDrone();
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      stopDrone();
      startDrone();
    }
  }, [pitch, tuning]);

  useEffect(() => {
    return () => stopDrone();
  }, []);

  if (!isVisible) return null;

  return (
    <aside aria-label="Persistent Tanpura Drone" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 font-sans select-none">
      {/* Minimized Pill or Expanded Bar */}
      {!isOpen ? (
        <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-full bg-[#1E050B]/95 text-[#D4AF37] border border-[#B99A63]/60 shadow-2xl backdrop-blur-md">
          <button
            type="button"
            onClick={toggleDrone}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isPlaying
                ? "bg-rose-900/80 text-white animate-pulse"
                : "bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] shadow-md"
            }`}
            title={isPlaying ? "Stop Tanpura Drone" : "Start Tanpura Drone"}
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 px-2 text-left cursor-pointer"
          >
            <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs font-bold text-white whitespace-nowrap">
              Tanpura ({pitch} {tuning})
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          </button>
        </div>
      ) : (
        <div className="w-72 sm:w-80 rounded-3xl bg-gradient-to-br from-[#1E050B] via-[#2A0812] to-[#1E050B] border border-[#B99A63]/60 text-white p-5 shadow-2xl backdrop-blur-xl space-y-3.5 text-left animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-[#1E050B] flex items-center justify-center font-bold">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-xs font-serif-luxury text-white">Continuous Tanpura Drone</h5>
                <span className="text-[10px] text-[#D4AF37]">Plays across all portal tabs</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-300 text-[11px] font-bold">Pitch (Sa):</span>
              <div className="flex items-center gap-1">
                {["C", "C#", "D", "D#", "E"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPitch(p)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                      pitch === p ? "bg-[#D4AF37] text-[#1E050B]" : "bg-white/10 text-stone-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-300 text-[11px] font-bold">Tuning:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setTuning("Pa")}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                    tuning === "Pa" ? "bg-[#D4AF37] text-[#1E050B]" : "bg-white/10 text-stone-300"
                  }`}
                >
                  Pa (5th)
                </button>
                <button
                  type="button"
                  onClick={() => setTuning("Ma")}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                    tuning === "Ma" ? "bg-[#D4AF37] text-[#1E050B]" : "bg-white/10 text-stone-300"
                  }`}
                >
                  Ma (4th)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-stone-300 text-[11px]">Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-32 accent-[#D4AF37] cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={toggleDrone}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer tap-bounce ${
              isPlaying
                ? "bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-600"
                : "bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] hover:brightness-105"
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Pause Tanpura Drone</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#1E050B]" />
                <span>Start Tanpura Drone</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
