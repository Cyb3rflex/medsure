"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";
import { SupportedLanguage } from "@/lib/gemini";
import { LANGUAGES } from "@/components/Header";
import { Menu, X, ArrowRight, ShieldCheck, HeartPulse, Activity, Sparkles, HelpCircle, Users } from "lucide-react";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for styling only — NEVER hide the navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const storyNavLinks = [
    { name: "Crisis", link: "#human-crisis", icon: "🚨", desc: "The Ajala & Ondo tragedies" },
    { name: "How It Works", link: "#how-it-works", icon: "⚡", desc: "5-second multimodal scan" },
    { name: "Architecture", link: "#safety-engine", icon: "🛡️", desc: "Deterministic code guardrails" },
    { name: "Africa Hubs", link: "#africa-impact", icon: "🌍", desc: "18 regional medical networks" },
    { name: "Stories", link: "#testimonials", icon: "💬", desc: "Caregivers & pharmacists" },
    { name: "FAQ", link: "#faq", icon: "❓", desc: "Clinical safety & models" },
  ];

  const handleMobileNavClick = (link: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== 'story') {
      onTabChange?.('story');
      setTimeout(() => {
        const el = document.querySelector(link);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div
      ref={navRef}
      className={cn(
        "fixed top-2 sm:top-4 inset-x-0 mx-auto z-[5000] flex flex-col items-center px-2 sm:px-4 max-w-fit pointer-events-auto select-none",
        className
      )}
    >
      {/* Main Pill Navbar (Always Visible, Never Disappears) */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "flex items-center gap-1 sm:gap-2.5 rounded-full border px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-300",
          isScrolled
            ? "border-emerald-500/40 bg-slate-950/95 shadow-2xl shadow-emerald-950/70 backdrop-blur-2xl ring-1 ring-white/10"
            : "border-slate-800/90 bg-slate-950/90 shadow-xl backdrop-blur-xl ring-1 ring-white/5"
        )}
      >
        {/* Brand Logo (Always links to home/story) */}
        <button
          onClick={() => {
            onTabChange?.('story');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-white font-bold text-xs sm:text-sm tracking-tight hover:bg-emerald-500/25 transition-all cursor-pointer"
        >
          <img src="/icon.svg" alt="MedSure Logo" className="w-5 h-5 rounded-md object-contain shadow-sm" />
          <span className="text-emerald-400 font-black">MedSure</span>
        </button>

        {/* MODE A: LANDING PAGE NAVIGATION */}
        {activeTab === 'story' ? (
          <>
            {/* Desktop Section Links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {storyNavLinks.map((item, idx) => (
                <a
                  key={`story-nav-${idx}`}
                  href={item.link}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-emerald-300 hover:bg-slate-850/80 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Direct Shortcuts: Cabinet & Pharmacist */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => {
                  onTabChange?.('cabinet');
                  setMobileMenuOpen(false);
                }}
                className="relative px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-emerald-300 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                title="My Medicine Cabinet"
              >
                <span>💊</span>
                <span className="hidden md:inline">Cabinet</span>
                {cabinetCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                    {cabinetCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onTabChange?.('pharmacist');
                  setMobileMenuOpen(false);
                }}
                className="relative px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                title="Pharmacist Escalation Queue"
              >
                <span>👨‍⚕️</span>
                <span className="hidden md:inline">Pharmacist</span>
                {flaggedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                    {flaggedCount}
                  </span>
                )}
              </button>
            </div>

            <div className="h-4 w-px bg-slate-800" />

            {/* Primary Action Button */}
            <button
              onClick={() => {
                onTabChange?.('patient');
                setMobileMenuOpen(false);
              }}
              className="relative rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-black transition-all shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95 flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span className="hidden sm:inline">Scan Medicine</span>
              <span className="inline sm:hidden">Scan</span>
              <span className="text-xs">📸</span>
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-emerald-400" /> : <Menu className="w-4 h-4" />}
            </button>
          </>
        ) : (
          /* MODE B: CLINICAL APP TABS (Always visible, fits perfectly on mobile screens) */
          <>
            {/* Back to Home / Story Button */}
            <button
              onClick={() => {
                onTabChange?.('story');
                setMobileMenuOpen(false);
              }}
              className="px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              title="Return to Story Landing Page"
            >
              <span>←</span>
              <span className="hidden xs:inline sm:inline">Home</span>
            </button>

            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* 1. Scanner Tab */}
              <button
                onClick={() => onTabChange?.('patient')}
                className={cn(
                  "px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer",
                  activeTab === 'patient'
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                )}
              >
                <span>📸</span>
                <span className="hidden xs:inline sm:inline">Scanner</span>
              </button>

              {/* 2. Cabinet Tab */}
              <button
                onClick={() => onTabChange?.('cabinet')}
                className={cn(
                  "relative px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer",
                  activeTab === 'cabinet'
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                )}
              >
                <span>💊</span>
                <span className="hidden xs:inline sm:inline">Cabinet</span>
                {cabinetCount > 0 && (
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center",
                      activeTab === 'cabinet' ? "bg-slate-950 text-emerald-300" : "bg-emerald-500 text-slate-950"
                    )}
                  >
                    {cabinetCount}
                  </span>
                )}
              </button>

              {/* 3. Pharmacist Queue Tab */}
              <button
                onClick={() => onTabChange?.('pharmacist')}
                className={cn(
                  "relative px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer",
                  activeTab === 'pharmacist'
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                )}
              >
                <span>👨‍⚕️</span>
                <span className="hidden xs:inline sm:inline">Queue</span>
                {flaggedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                    {flaggedCount}
                  </span>
                )}
              </button>
            </div>

            <div className="h-4 w-px bg-slate-800" />

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
              >
                <span>{LANGUAGES.find((l) => l.id === currentLanguage)?.flag}</span>
                <span className="hidden sm:inline">{LANGUAGES.find((l) => l.id === currentLanguage)?.label}</span>
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
                        "w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer",
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
      </motion.nav>

      {/* Mobile Navigation Dropdown Drawer (Smoothly expandable when tapping Menu) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[calc(100vw-1.5rem)] max-w-sm mt-2 rounded-2xl border border-emerald-500/35 bg-slate-950/95 shadow-2xl shadow-emerald-950/80 backdrop-blur-2xl p-3.5 space-y-3 z-[5001]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs text-slate-400 font-mono">
              <span className="text-emerald-400 font-bold">Quick Navigation</span>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                18 Hubs Active
              </span>
            </div>

            {/* Quick Section Links */}
            <div className="grid grid-cols-2 gap-1.5">
              {storyNavLinks.map((item, idx) => (
                <a
                  key={`mob-link-${idx}`}
                  href={item.link}
                  onClick={() => handleMobileNavClick(item.link)}
                  className="p-2 rounded-xl bg-slate-900/60 hover:bg-emerald-950/50 border border-slate-800/60 hover:border-emerald-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                </a>
              ))}
            </div>

            {/* Action Buttons in Drawer */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
              <button
                onClick={() => {
                  onTabChange?.('patient');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/25 active:scale-98"
              >
                <span>📸 Launch AI Medicine Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onTabChange?.('cabinet');
                    setMobileMenuOpen(false);
                  }}
                  className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5"
                >
                  <span>💊 Cabinet</span>
                  {cabinetCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      {cabinetCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    onTabChange?.('pharmacist');
                    setMobileMenuOpen(false);
                  }}
                  className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5"
                >
                  <span>👨‍⚕️ Pharmacist</span>
                  {flaggedCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                      {flaggedCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Language Quick-Selector in Mobile Drawer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Audio Language:</span>
              <div className="flex items-center gap-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={`mob-lang-${lang.id}`}
                    onClick={() => {
                      onLanguageChange?.(lang.id);
                    }}
                    className={cn(
                      "px-1.5 py-0.5 rounded-lg text-xs transition-all",
                      currentLanguage === lang.id
                        ? "bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                    title={lang.label}
                  >
                    <span>{lang.flag}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
