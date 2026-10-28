'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Mic, 
  MicOff, 
  PhoneCall, 
  HeartPulse, 
  X, 
  ArrowRight, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw,
  Pill,
  ExternalLink
} from 'lucide-react';
import { SupportedLanguage } from '@/lib/gemini';

export interface SituationFeedback {
  triageLevel: 'critical' | 'caution' | 'guidance';
  urgencyTitle: string;
  feedbackMessage: string;
  immediateActions: string[];
  detectedMedicines: string[];
  spokenAudioScript: string;
  suggestedNextStep?: string;
}

interface EmergencyBannerProps {
  currentLanguage: SupportedLanguage;
  onReferToPharmacist?: (complaintData: {
    situation: string;
    triageLevel: string;
    urgencyTitle: string;
    immediateActions: string[];
    detectedMedicines: string[];
  }) => void;
  onScanMedicine?: (medName: string) => void;
  onAskSymptom?: (symptomText: string) => void;
}

export default function EmergencyBanner({ 
  currentLanguage, 
  onReferToPharmacist, 
  onScanMedicine, 
  onAskSymptom 
}: EmergencyBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [symptomText, setSymptomText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<SituationFeedback | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Stop speech synthesis when closing or unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech Recognition for voice symptom intake
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type what you are experiencing.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
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
      // Immediately analyze the situation once voice input finishes!
      analyzeSituation(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Analyze situation via API
  const analyzeSituation = async (textToAnalyze: string) => {
    if (!textToAnalyze || !textToAnalyze.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: textToAnalyze,
          language: currentLanguage
        })
      });

      const data = await res.json();
      if (data.success && data.feedback) {
        setFeedback(data.feedback);
        // Play vocal feedback
        if (data.feedback.spokenAudioScript) {
          playVoiceNote(data.feedback.spokenAudioScript);
        }
      }
    } catch (err) {
      console.error('Failed to analyze situation:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Human-like voice playback for feedback
  const playVoiceNote = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const nigerianVoice = voices.find(v => v.lang.includes('NG') || v.name.toLowerCase().includes('nigeria'));
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (nigerianVoice) {
      utterance.voice = nigerianVoice;
      utterance.lang = nigerianVoice.lang;
    } else if (englishVoice) {
      utterance.voice = englishVoice;
      utterance.lang = englishVoice.lang;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else if (feedback?.spokenAudioScript) {
      playVoiceNote(feedback.spokenAudioScript);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;
    analyzeSituation(symptomText);
  };

  const handleQuickTrigger = (scenario: string) => {
    setSymptomText(scenario);
    analyzeSituation(scenario);
  };

  const handleSendToScanner = (medName: string) => {
    if (onScanMedicine) {
      onScanMedicine(medName);
    } else if (onAskSymptom) {
      onAskSymptom(medName);
    }
    setIsOpen(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <>
      {/* Banner on Main Clinical Dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/50 via-amber-950/40 to-slate-900 border border-amber-500/30 p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Emergency Voice Assistant & Home Triage</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 font-semibold px-2 py-0.5 rounded-full border border-red-500/30">
                  Live Guidance
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Experiencing a sudden home health panic, asthma episode, or fever? Speak or describe your situation for instant clinical feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Voice What You Are Experiencing</span>
            </button>
          </div>
        </div>

        {/* Persistent Alert Banner if a situation has been assessed */}
        {feedback && (
          <div className={`mt-3 p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
            feedback.triageLevel === 'critical'
              ? 'bg-red-950/80 border-red-500/50 text-red-100'
              : feedback.triageLevel === 'caution'
              ? 'bg-amber-950/80 border-amber-500/50 text-amber-100'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold">{feedback.urgencyTitle}</span>
                <button
                  onClick={() => setIsOpen(true)}
                  className="underline hover:text-white font-semibold text-[11px]"
                >
                  View Full Feedback & Actions &rarr;
                </button>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{feedback.feedbackMessage}</p>
            </div>
            <button 
              onClick={() => setFeedback(null)} 
              className="text-slate-400 hover:text-white p-1"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Emergency & Voice Situation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl glass-panel-elevated rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsOpen(false);
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                }
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Voice Health Assistant & Home Triage</h3>
                <p className="text-xs text-slate-400">Speak or describe your situation to receive instant clinical feedback and first-aid guidance</p>
              </div>
            </div>

            {/* Quick Trigger Scenarios */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Common Urgent Situations (Tap to test):</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: 'Sudden respiratory attack / wheezing' },
                  { text: 'Allergic rash & lip swelling from painkiller' },
                  { text: 'Child high fever (39°C) & shivering' },
                  { text: 'Overdose panic: accidentally swallowed double dose' },
                  { text: 'Headache in 3rd month of pregnancy' }
                ].map((s) => (
                  <button
                    key={s.text}
                    onClick={() => handleQuickTrigger(s.text)}
                    className="text-xs bg-slate-800/80 hover:bg-emerald-600/20 hover:border-emerald-500/40 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition-all text-left"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Input & Text Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="Describe what you or your patient is experiencing right now (e.g., 'My sister is having an acute asthma attack, gasping for air. We have Ventolin at home, what do we do right now?')"
                  className="w-full h-28 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 pr-14 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none placeholder:text-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all cursor-pointer shadow-md ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                  }`}
                  title={isListening ? 'Listening... click to stop' : 'Click to speak your situation'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>

              {isListening && (
                <div className="flex items-center gap-2 text-xs text-red-400 justify-center p-2 rounded-xl bg-red-950/30 border border-red-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-medium">Listening to your voice... Speak clearly about your symptoms and medicines.</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Emergency: 112 / 199</span>
                </div>
                <button
                  type="submit"
                  disabled={!symptomText.trim() || isAnalyzing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Situation...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Clinical Feedback</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* SITUATION FEEDBACK CARD */}
            {feedback && (
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-4 animate-in fade-in-50 duration-200">
                {/* Triage Banner Header */}
                <div className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                  feedback.triageLevel === 'critical'
                    ? 'bg-red-950/60 border-red-500/50'
                    : feedback.triageLevel === 'caution'
                    ? 'bg-amber-950/60 border-amber-500/50'
                    : 'bg-emerald-950/60 border-emerald-500/50'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        feedback.triageLevel === 'critical'
                          ? 'bg-red-500 text-white'
                          : feedback.triageLevel === 'caution'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {feedback.triageLevel === 'critical' ? '🔴 Critical Emergency' : feedback.triageLevel === 'caution' ? '🟡 Caution Required' : '🟢 Clinical Guidance'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-display">
                      {feedback.urgencyTitle}
                    </h4>
                  </div>

                  {/* Audio Vocalization Button */}
                  {feedback.spokenAudioScript && (
                    <button
                      onClick={handleToggleAudio}
                      className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-md ${
                        isPlayingAudio
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
                      }`}
                      title={isPlayingAudio ? 'Pause spoken feedback' : 'Listen to spoken feedback'}
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Listen Voice</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Feedback Explanation Narrative */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Clinical Situation Feedback:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {feedback.feedbackMessage}
                  </p>
                </div>

                {/* Immediate Action Steps Checklist */}
                {feedback.immediateActions && feedback.immediateActions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Immediate First-Aid Action Steps:</span>
                    </span>
                    <ul className="space-y-2">
                      {feedback.immediateActions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CLINICAL POLICY: No Direct Prescriptions — Pharmacist Referral */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-300 block font-display">
                        Why MedSure Does Not Prescribe Drugs Directly
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        To protect your safety and prevent lethal drug clashes or organ toxicity, MedSure does not prescribe medicines automatically. Instead, we immediately triage your symptoms and connect your complaint directly to our licensed community pharmacists for formal review.
                      </p>
                    </div>
                  </div>

                  {/* Primary Call to Action: Refer Complaint to Pharmacist */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onReferToPharmacist) {
                        onReferToPharmacist({
                          situation: symptomText,
                          triageLevel: feedback.triageLevel,
                          urgencyTitle: feedback.urgencyTitle,
                          immediateActions: feedback.immediateActions,
                          detectedMedicines: feedback.detectedMedicines || []
                        });
                      }
                      setIsOpen(false);
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        setIsPlayingAudio(false);
                      }
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
                  >
                    <span>Refer My Complaint to Licensed Pharmacist (Queue for Review)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Detected Medicines Quick Scanner Link (Secondary) */}
                {feedback.detectedMedicines && feedback.detectedMedicines.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-teal-400" />
                      <span className="text-xs text-slate-300 font-medium">
                        Drug Mentioned in Complaint: <strong>{feedback.detectedMedicines.join(', ')}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {feedback.detectedMedicines.map((med) => (
                        <button
                          key={med}
                          type="button"
                          onClick={() => handleSendToScanner(med)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Check {med} Formulation</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
