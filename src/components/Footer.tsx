"use client";
import React from "react";
import { ShieldCheck, Heart, Github, ExternalLink, Mail, MapPin, Sparkles } from "lucide-react";

interface FooterProps {
  onNavigateTab?: (tab: 'story' | 'patient' | 'pharmacist' | 'cabinet') => void;
}

export default function Footer({ onNavigateTab }: FooterProps) {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-8 mt-auto relative z-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <img src="/icon.svg" alt="MedSure Logo" className="w-6 h-6 rounded-md object-contain shadow-sm" />
              <span className="text-lg font-black text-white tracking-tight">MedSure</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                Nigeria
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open-weight AI and deterministic code guardrails safeguarding African families against counterfeit medicine and deadly drug clashes.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <MapPin className="w-3.5 h-3.5" />
              <span>Ile-Ife &amp; Lagos, Nigeria</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#human-crisis" className="hover:text-emerald-400 transition-colors">
                  The Crisis &amp; Mission
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#safety-engine" className="hover:text-emerald-400 transition-colors">
                  Deterministic Safety Engine
                </a>
              </li>
              <li>
                <a href="#africa-impact" className="hover:text-emerald-400 transition-colors">
                  18 Pan-African Hubs
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-emerald-400 transition-colors">
                  Patient &amp; Pharmacist Stories
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Clinical Features & Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Clinical Tools
            </h4>
            <ul className="space-y-2 text-xs">
              {onNavigateTab ? (
                <>
                  <li>
                    <button
                      onClick={() => onNavigateTab('patient')}
                      className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                    >
                      📸 Live Medicine Scanner
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('cabinet')}
                      className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                    >
                      💊 My Medicine Cabinet (Cross-Interaction)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigateTab('pharmacist')}
                      className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                    >
                      👨‍⚕️ Pharmacist-in-the-Loop Review Portal
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><span>📸 Live Medicine Scanner</span></li>
                  <li><span>💊 My Medicine Cabinet</span></li>
                  <li><span>👨‍⚕️ Pharmacist-in-the-Loop Review</span></li>
                </>
              )}
              <li className="pt-1 text-slate-500 font-mono text-[11px]">
                43 Nigerian Essential Medicines
              </li>
              <li className="text-slate-500 font-mono text-[11px]">
                14 Deterministic Contraindication Rules
              </li>
            </ul>
          </div>

          {/* Open Source & Challenge Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              OPEN//BUILD 2026
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built for the <strong>OSCA Ile-Ife Hacktoberfest Challenge: OPEN//BUILD 2026</strong>.
            </p>
            <div className="pt-1 space-y-2 text-xs">
              <a
                href="https://github.com/Cyb3rflex/medsure.git"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository (MIT)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="text-[11px] text-slate-500">
                Theme: &quot;AI belongs to everyone. Build for a world you understand. Make it open.&quot;
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>&copy; 2026 MedSure Nigeria. Released under the open-source MIT License.</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for African health equity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
