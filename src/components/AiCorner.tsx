"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, X } from "lucide-react";
import { ElianaChat } from "./ElianaChat";

export function AiCorner() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isChatting, setIsChatting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const welcomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Welcome: show big for 3s, then minimize
  useEffect(() => {
    welcomeTimerRef.current = setTimeout(() => {
      setShowWelcome(false);
      setIsExpanded(false);
    }, 3000);
    return () => {
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
    };
  }, []);

  // Idle detection: if chatting but no interaction for 30s, minimize
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isChatting) {
      idleTimerRef.current = setTimeout(() => {
        setIsChatting(false);
        setIsExpanded(false);
      }, 30000);
    }
  }, [isChatting]);

  useEffect(() => {
    if (isChatting) resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isChatting, resetIdleTimer]);

  const handleOpen = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setIsChatting(false);
  };

  const handleChat = () => {
    setIsChatting(true);
    setIsExpanded(true);
    resetIdleTimer();
  };

  const glowClass = "bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400";

  return (
    <>
      {/* Minimized: small floating icon */}
      <button
        onClick={handleOpen}
        aria-label="Abrir ELIANA"
        className={`fixed z-30 transition-all duration-500 ease-in-out cursor-pointer group ${
          isExpanded ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"
        }`}
        style={{ right: 12, bottom: 88 }}
      >
        <div className="relative w-14 h-14">
          <div className={`absolute inset-0 ${glowClass} rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity animate-pulse`} style={{ animationDuration: "3s" }} />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 dark:from-cyan-950 dark:via-purple-950 dark:to-indigo-950 border border-cyan-400/40 grid place-items-center shadow-lg">
            <span className="block w-6 h-6 rounded-md bg-[url(/assets/ai-logo.svg)] bg-cover bg-center" />
          </div>
        </div>
      </button>

      {/* Expanded: full chat panel */}
      <aside
        className={`fixed z-30 transition-all duration-500 ease-in-out ${
          isExpanded
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-75 pointer-events-none"
        }`}
        style={{
          right: 8, bottom: 84,
          width: "min(340px, calc(100% - 16px))",
          height: "min(480px, calc(100vh - 100px))",
          borderRadius: 20,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          boxShadow: "0 18px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.06)",
        }}
      >
        {/* Gradient background that's NEVER pure black/white */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100/90 to-slate-100 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/5 to-transparent" />

        {/* Glass overlay for depth */}
        <div className="absolute inset-0 backdrop-blur-2xl" />

        {/* Border glow */}
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/20 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-cyan-400/10 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className={`absolute -inset-1 ${glowClass} rounded-lg blur-md opacity-60 animate-pulse`} style={{ animationDuration: "3s" }} />
                <span className="relative block w-6 h-6 rounded-lg bg-[url(/assets/ai-logo.svg)] bg-cover bg-center" />
              </div>
              <div>
                <strong className="text-sm tracking-widest uppercase bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  ELIANA
                </strong>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">IA Cuántica · Zafiro</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClose}
                className="w-8 h-8 grid place-items-center rounded-xl text-sm font-bold border border-gray-300/30 dark:border-white/15 bg-gray-200/50 dark:bg-white/10 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300/50 dark:hover:bg-white/20 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-hidden">
            <ElianaChat onChat={handleChat} />
          </div>
        </div>
      </aside>
    </>
  );
}
