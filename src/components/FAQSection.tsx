"use client";
import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "Safety & Accuracy",
    question: "How does MedSure ensure it never hallucinates safe dosages?",
    answer:
      "MedSure enforces a strict two-tier architectural boundary: deterministic code makes 100% of the safety, expiry, NAFDAC registration, and cross-drug interaction decisions. The AI (Google Gemma 2 & Vision models) is strictly restricted to plain-language explanation and OCR text extraction.",
  },
  {
    category: "Safety & Accuracy",
    question: "What is the Ajala tragedy and how does MedSure prevent it?",
    answer:
      "In rural Ajala town, counterfeit antibiotics with fake NAFDAC numbers led to tragic fatalities. MedSure cross-checks official Nigerian Green Book regex formats (e.g. 04-1234, A4-5678, NR-0123) and matches active compounds against 43 vetted Nigerian Essential Medicines to block fake packs immediately.",
  },
  {
    category: "Accessibility & Languages",
    question: "Does MedSure work for users who cannot read English?",
    answer:
      "Yes! MedSure features native voice synthesis and plain-language explanations in Yorùbá, Hausa, Igbo, Nigerian Pidgin, Swahili, and French. Complex pharmacological terms are translated into natural body terms anyone can understand.",
  },
  {
    category: "Clinical Escalation",
    question: "What happens when a suspicious or flagged drug is detected?",
    answer:
      "The user receives an immediate clear red warning. Concurrently, the suspect medicine package is automatically queued for our licensed Pharmacist-in-the-Loop review portal, enabling verification and regulatory reporting before consumption.",
  },
  {
    category: "Privacy & Open Source",
    question: "Is patient medical data sold or stored on centralized cloud servers?",
    answer:
      "Never. MedSure stores patient medicine cabinets locally in browser localStorage. MedSure is 100% open source under the MIT License for the OSCA Ile-Ife Hacktoberfest Challenge (OPEN//BUILD 2026).",
  },
  {
    category: "Pan-African Scale",
    question: "Can MedSure be used outside Nigeria?",
    answer:
      "Yes. While optimized for Nigeria's essential medicines and regulatory standards, MedSure's modular open-weight architecture connects 18 regional hubs across West, East, North, and Southern Africa.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="story-section relative w-full py-16 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-950/90">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3 backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Got Questions? We Have Transparent Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked <span className="text-emerald-400">Questions</span>
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            Everything you need to know about our deterministic safety guardrails, open-weight models, and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={`faq-${idx}`}
                className={cn(
                  "rounded-2xl border transition-all duration-200 overflow-hidden",
                  isOpen
                    ? "bg-slate-900/90 border-emerald-500/40 shadow-xl shadow-emerald-950/30"
                    : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70"
                )}
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-emerald-400 shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-180 text-emerald-300" : "text-slate-500"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-mono">
                      <Sparkles className="w-3 h-3" />
                      <span>{faq.category}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
