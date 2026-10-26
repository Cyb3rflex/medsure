"use client";
import React, { useState } from "react";
import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";
import { MapPin, ShieldCheck, HeartPulse, Sparkles } from "lucide-react";

const medicalMarkers: GlobeMarker[] = [
  {
    lat: 7.4912,
    lng: 4.5426,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "Ile-Ife (OSCA Hacktoberfest 2026)",
  },
  {
    lat: 6.5244,
    lng: 3.3792,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "Lagos (Community Caregiver Triage)",
  },
  {
    lat: 12.0022,
    lng: 8.592,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Kano & Ajala (Substandard Drug Prevention)",
  },
  {
    lat: 4.8156,
    lng: 7.0498,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Port Harcourt & Delta (18,000+ Allergy Safeguard)",
  },
  {
    lat: 5.6037,
    lng: -0.187,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Accra (West African Essential Drug Network)",
  },
  {
    lat: -1.2921,
    lng: 36.8219,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "Nairobi (Community Pharmacy Verification)",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "London (WHO & BNF Clinical Standards)",
  },
];

export default function Globe3DDemo() {
  const [activePin, setActivePin] = useState<string>("Hover or tap any pin on the globe");

  return (
    <section className="relative w-full py-16 px-4 md:px-8 border-t border-slate-800/80 bg-slate-950/70 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pan-African & Global Health Impact</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Built for Nigeria. Scalable Across <span className="text-emerald-400">Africa</span>.
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From the rural patent medicine shops of Northern Nigeria to the riverine coastal clinics, 
          MedSure democratizes pharmaceutical safety wherever low literacy and counterfeit risks cost lives.
        </p>

        {/* Live Active Pin Banner */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-xs md:text-sm font-medium shadow-lg backdrop-blur-sm">
          <MapPin className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>Active Focus:</span>
          <span className="text-emerald-300 font-semibold">{activePin}</span>
        </div>

        {/* 3D Globe Canvas Container */}
        <div className="relative mt-4 w-full h-[540px] md:h-[640px] flex items-center justify-center">
          <Globe3D
            markers={medicalMarkers}
            config={{
              atmosphereColor: "#10b981",
              atmosphereIntensity: 0.8,
              bumpScale: 2.0,
              autoRotateSpeed: 0.85,
            }}
            onMarkerClick={(marker) => {
              setActivePin(marker.label || "Selected medical hub");
            }}
            onMarkerHover={(marker) => {
              if (marker) {
                setActivePin(marker.label || "Hovering medical hub");
              }
            }}
          />
        </div>

        {/* Region impact badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/60 max-w-4xl mx-auto">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Northern Towns</p>
            <p className="text-sm font-bold text-emerald-400 mt-1">Ajala & Kano</p>
            <p className="text-xs text-slate-400 mt-0.5">Counterfeit filter</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Coastal Region</p>
            <p className="text-sm font-bold text-amber-400 mt-1">Riverine Delta</p>
            <p className="text-xs text-slate-400 mt-0.5">18,000+ allergy shield</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Origin</p>
            <p className="text-sm font-bold text-cyan-400 mt-1">OSCA Ile-Ife</p>
            <p className="text-xs text-slate-400 mt-0.5">Open source innovation</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Standards</p>
            <p className="text-sm font-bold text-purple-400 mt-1">WHO / NAFDAC</p>
            <p className="text-xs text-slate-400 mt-0.5">43 essential medicines</p>
          </div>
        </div>
      </div>
    </section>
  );
}
