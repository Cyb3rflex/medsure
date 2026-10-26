"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import { SupportedLanguage } from "@/lib/gemini";
import { LANGUAGES } from "@/components/Header";
import { Globe } from "lucide-react";

export interface FloatingNavProps {
  activeTab?: 'story' | 'patient' | 'pharmacist' | 'cabinet';
  onTabChange?: (tab: 'story' | 'patient' | 'pharmacist' | 'cabinet') => void;
  currentLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  flaggedCount?: number;
  cabinetCount?: number;
  className?: string;
}

export const FloatingNav = ({
  activeTab = 'story',
  onTabChange,
  currentLanguage = 'en',
  onLanguageChange,
  flaggedCount = 0,
  cabinetCount = 0,
  className,
}: FloatingNavProps) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const prev = scrollYProgress.getPrevious() ?? 0;
      const direction = current - prev;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "flex max-w-fit fixed top-4 sm:top-5 inset-x-0 mx-auto z-[5000] items-center justify-center px-2",
          className
        )}
      >
        <div className="flex items-center justify-center gap-1 sm:gap-2.5 rounded-full border border-emerald-500/30 bg-slate-950/90 px-2 sm:px-3 py-1.5 sm:py-2 shadow-2xl shadow-emerald-950/60 backdrop-blur-2xl ring-1 ring-white/10">
          {/* Brand Logo (Always links to story/home) */}
          <button
            onClick={() => onTabChange?.('story')}
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-white font-bold text-xs sm:text-sm tracking-tight hover:bg-emerald-500/25 transition-all select-none"
          >
            <span className="text-sm sm:text-base">🛡️</span>
            <span className="text-emerald-400 font-black">MedSure</span>
          </button>

          {/* MODE A: LANDING PAGE TABS */}
          {activeTab === 'story' ? (
            <>
              {/* Section Anchors */}
              <div className="hidden md:flex items-center gap-0.5">
                {[
                  { name: "The Crisis", link: "#human-crisis" },
                  { name: "How It Works", link: "#how-it-works" },
                  { name: "Architecture", link: "#safety-engine" },
                  { name: "Africa Hubs", link: "#africa-impact" },
                  { name: "Stories", link: "#testimonials" },
                  { name: "FAQ", link: "#faq" },
                ].map((item, idx) => (
                  <a
                    key={`story-nav-${idx}`}
                    href={item.link}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-emerald-300 hover:bg-slate-800/80 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Direct Cabinet & Pharmacist Portal Shortcuts */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onTabChange?.('cabinet')}
                  className="relative px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-emerald-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
                  title="My Medicine Cabinet"
                >
                  <span>💊</span>
                  <span className="hidden sm:inline">Cabinet</span>
                  {cabinetCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      {cabinetCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onTabChange?.('pharmacist')}
                  className="relative px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
                  title="Pharmacist Portal"
                >
                  <span>👨‍⚕️</span>
                  <span className="hidden sm:inline">Pharmacist</span>
                  {flaggedCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                      {flaggedCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="h-4 w-px bg-slate-800" />

              {/* Primary Call To Action Button */}
              <button
                onClick={() => onTabChange?.('patient')}
                className="relative rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-black transition-all shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95 flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span className="hidden xs:inline sm:inline">Scan Medicine</span>
                <span className="inline xs:hidden sm:hidden">Scan</span>
                <span className="text-xs">📸</span>
              </button>
            </>
          ) : (
            /* MODE B: CLINICAL APP TABS (Same floating design, adapting text to clinical features) */
            <>
              {/* Back to landing link */}
              <button
                onClick={() => onTabChange?.('story')}
                className="px-2.5 py-1 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:flex items-center gap-1"
              >
                <span>←</span>
                <span>Story</span>
              </button>

              <div className="flex items-center gap-1">
                {/* 1. Check Medicine Tab */}
                <button
                  onClick={() => onTabChange?.('patient')}
                  className={cn(
                    "px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5",
                    activeTab === 'patient'
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  )}
                >
                  <span>📸</span>
                  <span>Scanner</span>
                </button>

                {/* 2. My Cabinet Tab */}
                <button
                  onClick={() => onTabChange?.('cabinet')}
                  className={cn(
                    "relative px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5",
                    activeTab === 'cabinet'
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  )}
                >
                  <span>💊</span>
                  <span>Cabinet</span>
                  {cabinetCount > 0 && (
                    <span className={cn(
                      "w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center",
                      activeTab === 'cabinet' ? "bg-slate-950 text-emerald-300" : "bg-emerald-500 text-slate-950"
                    )}>
                      {cabinetCount}
                    </span>
                  )}
                </button>

                {/* 3. Pharmacist Queue Tab */}
                <button
                  onClick={() => onTabChange?.('pharmacist')}
                  className={cn(
                    "relative px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5",
                    activeTab === 'pharmacist'
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  )}
                >
                  <span>👨‍⚕️</span>
                  <span>Queue</span>
                  {flaggedCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                      {flaggedCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="h-4 w-px bg-slate-800" />

              {/* Language Selector Pill */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 transition-all"
                >
                  <span>{LANGUAGES.find(l => l.id === currentLanguage)?.flag}</span>
                  <span className="hidden sm:inline">{LANGUAGES.find(l => l.id === currentLanguage)?.label}</span>
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-36 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-1.5 z-[5001]">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          onLanguageChange?.(lang.id);
                          setLangMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors",
                          currentLanguage === lang.id
                            ? "bg-emerald-500/20 text-emerald-300 font-bold"
                            : "text-slate-300 hover:bg-slate-800"
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
