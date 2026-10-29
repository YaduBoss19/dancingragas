import React, { useState, useEffect, useRef } from "react";
import { Music, Volume2, VolumeX, Sparkles, Sliders } from "lucide-react";

/**
 * Authentic Electronic Tanpura / Shruti Box Drone
 * Synthesizes pure classical Indian Sa-Pa harmonics via Web Audio API.
 * Provides disciples with a real-time practice drone for Adavu drills & Carnatic vocal riyaz.
 */
export default function TanpuraDroneWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState("C#"); // Common classical pitch
  const [tuning, setTuning] = useState("Pa"); // 'Pa' (5th) or 'Ma' (4th)
  const [volume, setVolume] = useState(0.4);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const timerRef = useRef(null);

  // Pitch base frequencies (Hz) for Middle Sa
  const PITCH_FREQS = {
    "A": 220.00,
    "A#": 233.08,
    "B": 246.94,
    "C": 261.63,
    "C#": 277.18,
    "D": 293.66,
    "D#": 311.13,
    "E": 329.63,
    "F": 349.23,
    "F#": 369.99,
    "G": 392.00,
    "G#": 415.30
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
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      const baseFreq = PITCH_FREQS[pitch] || 277.18; // Sa

      // Tanpura strings sequence:
      // String 1: Pa (or Ma)
      // String 2: Sa (higher octave)
      // String 3: Sa (higher octave)
      // String 4: Kharaj Sa (lower octave)
      const firstNoteRatio = tuning === "Pa" ? 1.5 : 1.3333; // 3/2 (Pa) or 4/3 (Ma)
      const notes = [
        baseFreq * firstNoteRatio,  // Pa / Ma
        baseFreq * 2,               // Sa higher
        baseFreq * 2,               // Sa higher
        baseFreq                    // Sa lower
      ];

      let noteIdx = 0;

      const pluckString = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const now = audioCtxRef.current.currentTime;
        const freq = notes[noteIdx];

        // Complex overtone oscillator for rich Indian bronze string resonance
        const osc1 = audioCtxRef.current.createOscillator();
        const osc2 = audioCtxRef.current.createOscillator();
        const stringGain = audioCtxRef.current.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq, now);

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 2, now); // 1st harmonic overtone

        // Pluck envelope: gentle attack, long meditative decay
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

      // Continuous Tanpura cycle (every 750ms next string plucks)
      pluckString();
      timerRef.current = setInterval(pluckString, 750);
      setIsPlaying(true);
    } catch (e) {
      console.error("AudioContext initialization failed:", e);
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

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#1E050B] via-[#2A0812] to-[#1E050B] border border-[#B99A63]/50 text-white p-4 sm:p-5 shadow-xl relative overflow-hidden font-sans">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3D0B16] to-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-md shrink-0">
            <Music className={`w-5 h-5 ${isPlaying ? "animate-pulse text-amber-300" : ""}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm font-serif-luxury text-white">Electronic Tanpura &bull; Shruti Drone</h4>
              {isPlaying && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase tracking-wider animate-pulse border border-emerald-500/40">
                  Resonating ({pitch} {tuning})
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-300">Continuous Indian classical Sa-Pa drone for Adavu drills &amp; swara sadhana.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDrone}
            className={`silk-zari-btn px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer tap-bounce ${
              isPlaying
                ? "bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-600"
                : "bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#1E050B] hover:brightness-105"
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Drone</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#1E050B]" />
                <span>Start Tanpura</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-all cursor-pointer"
            title="Tuning Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Tuning Settings */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-stone-300 font-bold block mb-1">Base Pitch (Sa)</label>
            <div className="grid grid-cols-6 gap-1">
              {["C", "C#", "D", "D#", "E", "G"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPitch(p)}
                  className={`py-1 rounded-lg font-bold text-[10px] cursor-pointer transition-all ${
                    pitch === p
                      ? "bg-[#D4AF37] text-[#1E050B] shadow-xs"
                      : "bg-white/10 text-stone-300 hover:bg-white/20"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-stone-300 font-bold block mb-1">String Tuning</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setTuning("Pa")}
                className={`py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                  tuning === "Pa" ? "bg-[#D4AF37] text-[#1E050B]" : "bg-white/10 text-stone-300 hover:bg-white/20"
                }`}
              >
                Pa - Panchama (Default)
              </button>
              <button
                type="button"
                onClick={() => setTuning("Ma")}
                className={`py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                  tuning === "Ma" ? "bg-[#D4AF37] text-[#1E050B]" : "bg-white/10 text-stone-300 hover:bg-white/20"
                }`}
              >
                Ma - Madhyama
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-stone-300 font-bold">Drone Volume</label>
              <span className="font-mono text-stone-400">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
