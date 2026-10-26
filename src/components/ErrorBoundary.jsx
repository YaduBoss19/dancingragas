import React from "react";
import { RotateCcw, Home, AlertCircle } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("DancingRagas Uncaught Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#151515] text-[#F5F0E8] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#1A1A1A] border border-[#B99A63]/40 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#D4AF37]">
                Session Recovery
              </span>
              <h2 className="text-2xl font-bold font-serif-luxury text-white">
                Something went wrong
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                The portal encountered a transient display state. You can safely restore the application or return to the main academy homepage.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left text-[11px] font-mono text-rose-300/90 max-h-28 overflow-y-auto break-all">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B99A63] text-[#151515] font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#D4AF37]/20 hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Academy Home</span>
              </button>

              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch {
                    // Ignore
                  }
                  window.location.href = "/";
                }}
                className="text-xs text-stone-400 hover:text-[#D4AF37] transition-colors py-1 cursor-pointer"
              >
                Reset Saved Cache &amp; Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
