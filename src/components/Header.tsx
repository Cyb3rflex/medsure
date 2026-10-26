'use client';

import React from 'react';
import { ShieldCheck, Stethoscope, Globe, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '@/lib/gemini';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeTab: 'story' | 'patient' | 'pharmacist' | 'cabinet';
  onTabChange: (tab: 'story' | 'patient' | 'pharmacist' | 'cabinet') => void;
  flaggedCount: number;
  cabinetCount: number;
}

export const LANGUAGES: { id: SupportedLanguage; label: string; flag: string }[] = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'pidgin', label: 'Naija Pidgin', flag: '🇳🇬' },
  { id: 'yoruba', label: 'Yorùbá', flag: '🇳🇬' },
  { id: 'hausa', label: 'Hausa', flag: '🇳🇬' },
  { id: 'igbo', label: 'Igbo', flag: '🇳🇬' },
];

export default function Header({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  flaggedCount,
  cabinetCount
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => onTabChange('patient')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-display">MedSure</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Nigeria</span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Plain-Language Medicine Safety Guardrail</p>
          </div>
        </div>

        {/* View Switcher Navigation */}
        <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => onTabChange('story')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'story'
                ? 'bg-purple-600 text-white shadow-md font-bold'
                : 'text-purple-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>✨ 3D Story</span>
          </button>

          <button
            onClick={() => onTabChange('patient')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'patient'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Check Medicine</span>
          </button>

          <button
            onClick={() => onTabChange('cabinet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 relative ${
              activeTab === 'cabinet'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>My Cabinet</span>
            {cabinetCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'cabinet' ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {cabinetCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('pharmacist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 relative ${
              activeTab === 'pharmacist'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Pharmacist Queue</span>
            <span className="md:hidden">Queue</span>
            {flaggedCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                {flaggedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Multilingual Selector */}
        <div className="flex items-center gap-2">
          <div className="relative group">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 hover:border-emerald-500/40 transition-colors">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer pr-1 font-medium"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-slate-900 text-white py-1">
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
