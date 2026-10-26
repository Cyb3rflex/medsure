'use client';

import React, { useState } from 'react';
import { AlertTriangle, Mic, MicOff, PhoneCall, HeartPulse, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { SupportedLanguage } from '@/lib/gemini';

interface EmergencyBannerProps {
  currentLanguage: SupportedLanguage;
  onAskSymptom: (symptomText: string) => void;
}

export default function EmergencyBanner({ currentLanguage, onAskSymptom }: EmergencyBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [symptomText, setSymptomText] = useState('');
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  // Web Speech Recognition for voice symptom intake
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your situation.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = currentLanguage === 'en' ? 'en-NG' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSymptomText(transcript);
      setIsListening(false);
      processEmergencySituation(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processEmergencySituation = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('breath') || lower.includes('asthma') || lower.includes('respiratory') || lower.includes('choking') || lower.includes('chest')) {
      setEmergencyAlert('RESPIRATORY ALERT: Help the individual sit upright immediately. Loosen tight clothing around neck. Do NOT force pills down if gasping. If they have a prescribed rescue inhaler (Salbutamol/Ventolin), administer 2-4 puffs with a spacer. Call emergency medical help immediately.');
    } else if (lower.includes('allergy') || lower.includes('swelling') || lower.includes('rash') || lower.includes('nsaid')) {
      setEmergencyAlert('ALLERGIC REACTION ALERT: Stop any suspected medicine immediately. Watch for tongue/lip swelling or breathing stridor. Rush to nearest clinic if airways are tightening.');
    } else {
      setEmergencyAlert(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;
    processEmergencySituation(symptomText);
    onAskSymptom(symptomText);
    setIsOpen(false);
  };

  const handleQuickTrigger = (scenario: string, medicineTarget?: string) => {
    setSymptomText(scenario);
    processEmergencySituation(scenario);
    onAskSymptom(medicineTarget || scenario);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border border-amber-500/30 p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Emergency / Home Attack Assistant</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 font-semibold px-2 py-0.5 rounded-full border border-red-500/30">
                  Critical Guidance
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Struggling with what medicine to give right now during a respiratory attack or allergic reaction?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <Mic className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Voice What You Are Going Through</span>
            </button>
          </div>
        </div>

        {emergencyAlert && (
          <div className="mt-3 p-3 rounded-xl bg-red-900/60 border border-red-500/40 text-xs text-red-100 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{emergencyAlert}</p>
            </div>
            <button onClick={() => setEmergencyAlert(null)} className="text-red-300 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Emergency Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg glass-panel-elevated rounded-3xl p-6 border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">What is the Patient Experiencing?</h3>
                <p className="text-xs text-slate-400">Speak or type symptoms to check medicine suitability and avoid panic overdose</p>
              </div>
            </div>

            {/* Quick Trigger Scenarios */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Common Urgent Situations:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: 'Sudden respiratory wheezing / asthma', med: 'Salbutamol' },
                  { text: 'Allergic to NSAIDs / painkiller rash', med: 'Diclofenac' },
                  { text: 'Fever with stomach ulcer history', med: 'Paracetamol' },
                  { text: 'Overdose panic: took double dose', med: 'Paracetamol' }
                ].map((s) => (
                  <button
                    key={s.text}
                    onClick={() => handleQuickTrigger(s.text, s.med)}
                    className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>


            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="e.g., My mum is having a respiratory attack, breathing hard. We have Ventolin and Paracetamol at home, what do they do and what dose is safe?"
                  className="w-full h-28 bg-slate-900/90 border border-slate-700 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
                  }`}
                  title={isListening ? 'Listening... click to stop' : 'Click to speak'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              {isListening && (
                <div className="flex items-center gap-2 text-xs text-red-400 justify-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Listening... please speak clearly about what is happening</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Nigeria Emergency: 112 / 199</span>
                </div>
                <button
                  type="submit"
                  disabled={!symptomText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>Analyze Situation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
