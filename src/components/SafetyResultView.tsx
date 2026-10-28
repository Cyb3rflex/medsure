'use client';

import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Share2, 
  Check, 
  Info,
  Pill,
  Sparkles,
  Flame,
  UserCheck
} from 'lucide-react';
import VoicePlayer from './VoicePlayer';
import FollowUpQuestions from './FollowUpQuestions';
import { SupportedLanguage } from '@/lib/gemini';
import { buildSpokenExplanation } from '@/lib/translations';
import confetti from 'canvas-confetti';

interface SafetyResultViewProps {
  scanData: any;
  currentLanguage: SupportedLanguage;
  onAddToCabinet: (med: any) => void;
  isInCabinet: boolean;
  onEscalateToPharmacist: (data: any) => void;
  isEscalated: boolean;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export default function SafetyResultView({
  scanData,
  currentLanguage,
  onAddToCabinet,
  isInCabinet,
  onEscalateToPharmacist,
  isEscalated,
  onLanguageChange
}: SafetyResultViewProps) {
  const { extractedData, safetyResult, medicineRecord, explanation } = scanData;

  const [translatedExplanations, setTranslatedExplanations] = React.useState<Record<string, any>>({});
  const [isTranslating, setIsTranslating] = React.useState(false);

  // Dynamically fetch AI translation if user switches language and it's not yet cached
  React.useEffect(() => {
    if (currentLanguage === 'en' || !medicineRecord) return;
    if (translatedExplanations[currentLanguage]) return;

    let isMounted = true;
    setIsTranslating(true);

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medicine: medicineRecord,
        safetyResult,
        language: currentLanguage
      })
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.explanation) {
          setTranslatedExplanations(prev => ({
            ...prev,
            [currentLanguage]: data.explanation
          }));
        }
      })
      .catch(err => {
        console.warn('Dynamic translation failed:', err);
      })
      .finally(() => {
        if (isMounted) setIsTranslating(false);
      });

    return () => { isMounted = false; };
  }, [currentLanguage, medicineRecord?.ID]);

  const activeExplanation =
    (currentLanguage !== 'en' && translatedExplanations[currentLanguage])
      ? translatedExplanations[currentLanguage]
      : explanation;

  const spokenText = buildSpokenExplanation({
    medicine: medicineRecord,
    safetyResult,
    explanation: activeExplanation,
    language: currentLanguage
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#059669']
    });
  };

  const handleAddCabinet = () => {
    onAddToCabinet(medicineRecord);
    triggerConfetti();
  };

  const isClean = safetyResult?.isClean;
  const redFlags = safetyResult?.flags?.filter((f: any) => f.severity === 'red') || [];
  const amberFlags = safetyResult?.flags?.filter((f: any) => f.severity === 'amber') || [];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 1. Primary Safety Guardrail Banner */}
      <div className={`p-5 rounded-3xl border transition-all ${
        !isClean
          ? 'bg-gradient-to-r from-red-950/70 via-red-900/40 to-slate-900 border-red-500/50 glow-crimson'
          : amberFlags.length > 0
          ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-amber-500/40 glow-amber'
          : 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/40 glow-emerald'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              !isClean
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : amberFlags.length > 0
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
            }`}>
              {!isClean ? <XCircle className="w-7 h-7 stroke-[2.5]" /> : <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-base font-extrabold uppercase tracking-wide font-display ${
                  !isClean ? 'text-red-300' : amberFlags.length > 0 ? 'text-amber-300' : 'text-emerald-300'
                }`}>
                  {!isClean ? 'RED FLAGS DETECTED — DO NOT TAKE' : amberFlags.length > 0 ? 'CAUTION: WARNINGS ATTACHED' : 'SAFETY GUARDRAIL: VERIFIED CLEAN'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/80 font-mono text-slate-300 border border-slate-700">
                  Code Guardrail v1.0
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {!isClean
                  ? 'Deterministic safety rules caught critical risks. No dosage is recommended until approved by a pharmacist.'
                  : 'Passed automated expiration, NAFDAC pattern check, and multi-drug interaction analysis.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {!isInCabinet && (
              <button
                onClick={handleAddCabinet}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Cabinet</span>
              </button>
            )}

            {!isClean && !isEscalated && (
              <button
                onClick={() => onEscalateToPharmacist(scanData)}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md animate-pulse"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Escalate to Pharmacist</span>
              </button>
            )}

            {isEscalated && (
              <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Sent to Pharmacist Queue</span>
              </span>
            )}
          </div>
        </div>

        {/* Detailed Flags List */}
        {safetyResult?.flags?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
            {safetyResult.flags.map((flag: any, idx: number) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl flex items-start gap-2.5 text-xs ${
                  flag.severity === 'red'
                    ? 'bg-red-950/80 border border-red-500/40 text-red-200'
                    : 'bg-amber-950/70 border border-amber-500/40 text-amber-200'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${flag.severity === 'red' ? 'text-red-400' : 'text-amber-400'}`} />
                <div>
                  <span className="font-bold block">{flag.title}</span>
                  <span className="text-slate-300 mt-0.5 block">{flag.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Medicine Identity & Extracted Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Core Identity */}
        <div className="md:col-span-2 glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xl font-extrabold text-white font-display">
                  {medicineRecord.Medicine || extractedData.medicine_name}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {medicineRecord.Class || 'Pharmaceutical formulation'}
              </p>
            </div>

            {/* Allergy & Group Badges */}
            <div className="flex flex-wrap gap-1.5 justify-end">
              {safetyResult.allergensDetected?.map((allergen: string) => (
                <span
                  key={allergen}
                  className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1"
                >
                  <Flame className="w-3 h-3 text-red-400" />
                  {allergen}
                </span>
              ))}
              {medicineRecord['Prescription only']?.toLowerCase() === 'yes' && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wide">
                  Prescription Only
                </span>
              )}
            </div>
          </div>

          {/* Quick Specifications Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Strength</span>
              <span className="text-xs font-semibold text-white mt-0.5 block">
                {extractedData.strength || 'Standard Dose'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Expiry Date</span>
              <span className="text-xs font-semibold text-white mt-0.5 block">
                {extractedData.expiry_date || 'Not extracted'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">NAFDAC No.</span>
              <span className="text-xs font-mono font-semibold text-emerald-400 mt-0.5 block">
                {extractedData.nafdac_number || 'Missing from pack'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Batch No.</span>
              <span className="text-xs font-mono text-slate-300 mt-0.5 block">
                {extractedData.batch_number || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Voice Note & Speech Player */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block mb-1">
              Audio Accessibility
            </span>
            <h4 className="text-sm font-bold text-white mb-2">Spoken Explanation</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              MedSure vocalizes all warnings and active ingredient functions for elderly or low-literacy family members.
            </p>
          </div>

          <VoicePlayer
            textToRead={spokenText}
            language={currentLanguage}
            onLanguageChange={onLanguageChange}
            medicineName={medicineRecord.Medicine}
          />
        </div>
      </div>

      {/* 3. Plain-Language Active Ingredient Mechanism & Panic Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                How the Active Ingredients Work &amp; What They Do
              </h3>
              <p className="text-xs text-slate-400">Plain-language medical breakdown to prevent confusion and panic</p>
            </div>
          </div>
          {isTranslating && (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full animate-pulse">
              Translating to {currentLanguage.toUpperCase()}...
            </span>
          )}
        </div>

        {/* Core summary */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs leading-relaxed">
          <p className="font-semibold text-white mb-1">What this medicine does:</p>
          <p>{activeExplanation?.what_it_does || medicineRecord.Uses}</p>
        </div>

        {/* Ingredient by Ingredient Component Cards */}
        {activeExplanation?.how_it_works_components?.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Chemical Components:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeExplanation.how_it_works_components.map((comp: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 font-mono">{comp.component}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Active Drug</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    <strong className="text-slate-100">Mechanism:</strong> {comp.mechanism_plain}
                  </p>
                  <p className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2 rounded-xl border border-amber-500/20">
                    <strong>⚠️ Panic Overdose Warning:</strong> {comp.panic_warning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Allergy and Key Warnings */}
        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/20 text-xs space-y-1.5">
          <span className="font-bold text-red-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Important Allergies &amp; Precautions</span>
          </span>
          <p className="text-slate-300 leading-relaxed">
            {activeExplanation?.allergy_and_cautions || medicineRecord['Key warnings']}
          </p>
        </div>
      </div>

      {/* 4. Coursera-Style Follow-Up Questions */}
      <FollowUpQuestions
        medicine={medicineRecord}
        suggestedQuestions={activeExplanation?.suggested_questions || []}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}
