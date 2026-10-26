"use client";
import React, { useState } from "react";
import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";
import { MapPin, ShieldCheck, HeartPulse, Sparkles, Activity, CheckCircle, ArrowRight } from "lucide-react";

export const AFRICAN_MEDICAL_HUBS: GlobeMarker[] = [
  // Nigeria - Core Focus Hubs
  {
    lat: 7.4912,
    lng: 4.5426,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "Ile-Ife (OSCA Hacktoberfest 2026 Innovation Base)",
    city: "Ile-Ife, Osun",
    country: "Nigeria 🇳🇬",
    details: "Birthplace of MedSure for OPEN//BUILD 2026. Real-time NAFDAC regex and open-weight model integration.",
    tag: "Core Innovation Hub",
    language: "Yorùbá & English"
  },
  {
    lat: 6.5244,
    lng: 3.3792,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "Lagos (Pediatric Acute Crisis & Emergency Caregiver Triage)",
    city: "Lagos",
    country: "Nigeria 🇳🇬",
    details: "High-density urban caregiver protection. One-touch respiratory crisis triage and 112 emergency routing.",
    tag: "Emergency Triage",
    language: "Naija Pidgin & English"
  },
  {
    lat: 12.0022,
    lng: 8.592,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Ajala Town & Kano (Substandard Chemist Drug Filter)",
    city: "Kano & Ajala",
    country: "Nigeria 🇳🇬",
    details: "Directly addressing the Ajala tragedy. Intercepts counterfeit antibiotics and expired antimalarials in local patent medicine shops.",
    tag: "Counterfeit Interception",
    language: "Hausa"
  },
  {
    lat: 4.8156,
    lng: 7.0498,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Port Harcourt & Niger Delta (18,000+ Allergy Safeguard)",
    city: "Port Harcourt & Delta",
    country: "Nigeria 🇳🇬",
    details: "Protects over 18,000 recorded allergy patients from hidden Sulfas, Aspirin, and NSAID complications.",
    tag: "Allergen Shield",
    language: "Pidgin & Igbo"
  },
  {
    lat: 7.2571,
    lng: 5.2058,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Akure & Ondo State (Migraine Overdose Prevention)",
    city: "Akure, Ondo",
    country: "Nigeria 🇳🇬",
    details: "Inspired by the 19-year-old student tragedy. Hard-coded cumulative analgesic threshold rules prevent accidental paracetamol liver toxicity.",
    tag: "Overdose Prevention",
    language: "Yorùbá & English"
  },
  {
    lat: 9.0765,
    lng: 7.3986,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "Abuja (NAFDAC & Federal Ministry of Health Regulatory Alignment)",
    city: "Abuja (FCT)",
    country: "Nigeria 🇳🇬",
    details: "Synchronized with official Nigerian Green Book standards and 43 Essential Medicines List.",
    tag: "Regulatory Standards",
    language: "English & Hausa"
  },
  {
    lat: 6.4483,
    lng: 7.5139,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Enugu (Southeastern Chronic Care & Igbo Audio Hub)",
    city: "Enugu",
    country: "Nigeria 🇳🇬",
    details: "Elderly chronic disease medication management with native Igbo phonetic voice guidance.",
    tag: "Chronic Care",
    language: "Igbo"
  },
  {
    lat: 7.3775,
    lng: 3.947,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Ibadan (UCH Clinical Pharmacy Drug Interaction Validation)",
    city: "Ibadan, Oyo",
    country: "Nigeria 🇳🇬",
    details: "Clinical validation testing ground for the 14 cross-drug interaction matrix with registered community pharmacists.",
    tag: "Clinical Validation",
    language: "Yorùbá"
  },

  // West & Central Africa
  {
    lat: 5.6037,
    lng: -0.187,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Accra (West African Essential Drug Network)",
    city: "Accra",
    country: "Ghana 🇬🇭",
    details: "Cross-border OTC validation aligned with the Ghana Food and Drugs Authority (FDA).",
    tag: "Cross-Border Safety",
    language: "English & Twi"
  },
  {
    lat: 14.7167,
    lng: -17.4677,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Dakar (Francophone West African Pharmacy Integration)",
    city: "Dakar",
    country: "Senegal 🇸🇳",
    details: "Extending open-weight AI medicine translation into Wolof and French for rural Sahel clinics.",
    tag: "Regional Expansion",
    language: "Wolof & French"
  },
  {
    lat: 5.36,
    lng: -4.0083,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "Abidjan (Gulf of Guinea Counterfeit Medicine Watch)",
    city: "Abidjan",
    country: "Côte d'Ivoire 🇨🇮",
    details: "Monitoring sub-standard imported generics across major West African coastal transport routes.",
    tag: "Port Anti-Counterfeit",
    language: "French & Dioula"
  },

  // East & Great Lakes Africa
  {
    lat: -1.2921,
    lng: 36.8219,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "Nairobi (Community Chemist Mobile Verification)",
    city: "Nairobi",
    country: "Kenya 🇰🇪",
    details: "Community pharmacy verification and Swahili plain-language translation for East African mothers.",
    tag: "Community Health",
    language: "Swahili & English"
  },
  {
    lat: -1.9441,
    lng: 30.0619,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Kigali (Digital Health & Medical Supply Chain Alignment)",
    city: "Kigali",
    country: "Rwanda 🇷🇼",
    details: "Tested against automated rural health dispensing units for instant patient verification.",
    tag: "Digital Health",
    language: "Kinyarwanda & English"
  },
  {
    lat: 0.3476,
    lng: 32.5825,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Kampala (Great Lakes Infectious Disease Triage)",
    city: "Kampala",
    country: "Uganda 🇺🇬",
    details: "Antimalarial and antibiotic course completion tracker preventing antimicrobial resistance.",
    tag: "Infectious Care",
    language: "Luganda & English"
  },
  {
    lat: -6.7924,
    lng: 39.2083,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Dar es Salaam (Coastal Dispenser & Maternal Guidance)",
    city: "Dar es Salaam",
    country: "Tanzania 🇹🇿",
    details: "Maternal medicine safety alerts during pregnancy and lactation in coastal dispensaries.",
    tag: "Maternal Health",
    language: "Swahili"
  },
  {
    lat: 9.032,
    lng: 38.7469,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "Addis Ababa (African Union CDC Governance Hub)",
    city: "Addis Ababa",
    country: "Ethiopia 🇪🇹",
    details: "Aligning digital medicine verification protocols with Africa CDC continental health guidelines.",
    tag: "Continental Standards",
    language: "Amharic & English"
  },

  // North & Southern Africa
  {
    lat: 30.0444,
    lng: 31.2357,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Cairo (North African Pharmacopoeia Standards)",
    city: "Cairo",
    country: "Egypt 🇪🇬",
    details: "North African pharmacopoeia cross-referencing and dialectal clinical voice synthesis.",
    tag: "North Africa Protocol",
    language: "Arabic & English"
  },
  {
    lat: -26.2041,
    lng: 28.0473,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Johannesburg (Southern African Drug Interaction Matrix)",
    city: "Johannesburg",
    country: "South Africa 🇿🇦",
    details: "Cross-drug interaction matrix safeguarding multi-drug chronic therapy for hypertension and diabetes.",
    tag: "Drug Interaction Matrix",
    language: "Zulu & English"
  }
];

export default function Globe3DDemo({ onLaunchApp }: { onLaunchApp?: () => void }) {
  const [selectedHub, setSelectedHub] = useState<GlobeMarker>(AFRICAN_MEDICAL_HUBS[0]);

  return (
    <section className="relative w-full py-16 px-4 md:px-8 border-t border-slate-800/80 bg-slate-950/80 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/35 text-emerald-300 text-xs font-semibold mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive Pan-African Health Network · 18 Active Hubs</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Touch &amp; Explore: Built for Nigeria, Scalable Across <span className="text-emerald-400">Africa</span>
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Hover with your mouse or <strong>touch any glowing pin</strong> on the globe to explore how MedSure solves real medicine tragedies across 18 regional hubs.
        </p>

        {/* Dynamic Interactive Spotlight Card (Updates instantly on mouse hover or touch) */}
        <div className="mt-6 max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl backdrop-blur-md text-left transition-all">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{selectedHub.country}</span>
                <span className="text-emerald-300 font-bold">{selectedHub.city}</span>
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              {selectedHub.tag}
            </span>
          </div>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {selectedHub.details}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono">
              <span>🗣️ Supported:</span>
              <strong className="text-emerald-300 font-semibold">{selectedHub.language}</strong>
            </div>

            {onLaunchApp && (
              <button
                onClick={onLaunchApp}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 active:scale-95"
              >
                <span>Test Protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3D Globe Canvas Container */}
        <div className="relative mt-2 w-full h-[540px] md:h-[640px] flex items-center justify-center">
          <Globe3D
            markers={AFRICAN_MEDICAL_HUBS}
            config={{
              atmosphereColor: "#10b981",
              atmosphereIntensity: 0.8,
              bumpScale: 2.0,
              autoRotateSpeed: 0.85,
            }}
            onMarkerClick={(marker) => {
              setSelectedHub(marker);
            }}
            onMarkerHover={(marker) => {
              if (marker) {
                setSelectedHub(marker);
              }
            }}
          />
        </div>

        {/* Touch / Click Hint for mobile & desktop */}
        <p className="mt-2 text-xs text-slate-400 font-mono">
          💡 Tip: Click, drag to rotate the globe, and tap any glowing beacon to inspect local clinical safeguards.
        </p>
      </div>
    </section>
  );
}
