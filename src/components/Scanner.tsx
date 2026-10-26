import React, { useState, useRef } from 'react';
import { Camera, Upload, Search, Sparkles, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';

const medsureAnalysisSteps = [
  { text: "📸 Reading packaging text, foil blister & typography..." },
  { text: "🔍 Identifying active pharmaceutical molecules & strength..." },
  { text: "🏛️ Validating official Nigerian NAFDAC registration..." },
  { text: "⏳ Calculating exact expiration date & remaining days..." },
  { text: "🛡️ Checking contraindications, NSAID/Sulfa allergy risks..." },
  { text: "🗣️ Translating clinical explanation into chosen native language..." }
];

interface ScannerProps {
  onScanImage: (base64: string, mimeType: string) => void;
  onSearchName: (name: string, mockData?: { mockExpiry?: string; mockNafdac?: string }) => void;
  isLoading: boolean;
}

export const DEMO_PRESETS = [
  {
    label: '🟢 Panadol Extra (Clean OTC)',
    name: 'Panadol Extra',
    sub: 'Paracetamol + Caffeine (Verified)',
    type: 'clean'
  },
  {
    label: '🔴 Expired Antimalarial (Safety Alert)',
    name: 'Artemether-lumefantrine',
    sub: 'Simulates expired pack (Exp: 2024-02)',
    type: 'expired',
    mockExpiry: '2024-02'
  },
  {
    label: '🫁 Salbutamol / Ventolin (Respiratory)',
    name: 'Salbutamol',
    sub: 'Bronchodilator (Overdose Warning)',
    type: 'respiratory'
  },
  {
    label: '⚠️ Diclofenac (NSAID Allergy Alert)',
    name: 'Diclofenac',
    sub: 'NSAID (Ulcer / Allergy Warning)',
    type: 'nsaid'
  },
  {
    label: '🚨 Fake NAFDAC Check',
    name: 'Amoxicillin',
    sub: 'Suspect number: "INVALID-99"',
    type: 'fake_nafdac',
    mockNafdac: 'INVALID-99'
  }
];

export default function Scanner({ onScanImage, onSearchName, isLoading }: ScannerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [typedName, setTypedName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewImage(base64);
      onScanImage(base64, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedName.trim()) return;
    setPreviewImage(null);
    onSearchName(typedName.trim());
  };

  return (
    <div className="w-full space-y-4">
      {/* High-Tech Analysis MultiStepLoader */}
      <MultiStepLoader loadingStates={medsureAnalysisSteps} loading={isLoading} duration={1000} />

      {/* Viewfinder & Upload Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all p-6 text-center glass-panel ${
          dragActive
            ? 'border-emerald-400 bg-emerald-950/20'
            : 'border-slate-700/80 hover:border-emerald-500/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {previewImage ? (
          <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-950">
            <img src={previewImage} alt="Scanned Pack" className="w-full h-56 object-cover" />
            {isLoading && <div className="scanner-beam" />}
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-3">
              <span className="text-[11px] font-semibold text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                {isLoading ? 'Scanning with Gemini Flash...' : 'Pack Image Captured'}
              </span>
              <button
                onClick={() => { setPreviewImage(null); fileInputRef.current?.click(); }}
                className="text-xs bg-slate-800/90 hover:bg-slate-700 text-white px-2.5 py-1 rounded-lg border border-slate-600 transition-colors"
              >
                Retake
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform">
                <Camera className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-emerald-500/30 flex items-center justify-center">
                <Upload className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white font-display">Photograph or Upload a Medicine Pack</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Reads the label instantly with Gemini Vision: Drug name, strength, batch, expiry date, and Nigerian NAFDAC number.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Snap Pack with Camera</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Search & Quick Type Bar */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Or type a medicine name (e.g. Paracetamol, Coartem, Ventolin, Ibuprofen)..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!typedName.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs border border-slate-700 transition-colors disabled:opacity-40"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Check'}
        </button>
      </form>

      {/* Demo Presets Row (Crucial for Hackathon Pitch) */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Quick Hackathon Demo Presets:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {DEMO_PRESETS.map((demo) => (
            <button
              key={demo.name + demo.type}
              onClick={() => {
                setTypedName(demo.name);
                onSearchName(demo.name, { mockExpiry: demo.mockExpiry, mockNafdac: demo.mockNafdac });
              }}
              className="text-left p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                {demo.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">{demo.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
