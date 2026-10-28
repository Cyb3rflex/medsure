'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '@/lib/gemini';
import { LANGUAGES } from '@/components/Header';

interface VoicePlayerProps {
  textToRead: string;
  language: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  medicineName?: string;
}

const SPEED_PRESETS = [
  { label: '0.8x', value: 0.8, desc: 'Clear' },
  { label: '0.9x', value: 0.9, desc: 'Gentle' },
  { label: '1.0x', value: 1.0, desc: 'Normal' },
  { label: '1.2x', value: 1.2, desc: 'Fast' },
];

export default function VoicePlayer({
  textToRead,
  language,
  onLanguageChange,
  medicineName
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState<number>(0.9);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize and load browser voices across desktop & mobile
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speaking when the text or language changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [textToRead, language]);

  // Core speak function that uses exact speed rate and robust African voice resolution
  const startSpeaking = (speedRate: number = rate) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    if (!textToRead || textToRead.trim().length === 0) {
      return;
    }

    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // 1. Detect native or compatible African dialect voice
    let matchedVoice: SpeechSynthesisVoice | null = null;
    let targetLangTag = 'en-US';

    if (language === 'pidgin') {
      matchedVoice =
        voices.find(v => v.lang.includes('NG') || v.name.toLowerCase().includes('nigeria')) ||
        voices.find(v => v.lang.includes('en-ZA')) ||
        voices.find(v => v.lang.includes('en-GB')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null;
      targetLangTag = matchedVoice?.lang || 'en-NG';
      utterance.pitch = 1.05;
    } else if (language === 'yoruba') {
      // Check for native Yoruba voice first
      const nativeYo = voices.find(v => v.lang.toLowerCase().startsWith('yo'));
      if (nativeYo) {
        matchedVoice = nativeYo;
        targetLangTag = nativeYo.lang;
      } else {
        // Fallback to Nigerian / African / Commonwealth voice with tonal calibration
        matchedVoice =
          voices.find(v => v.lang.includes('NG') || v.name.toLowerCase().includes('nigeria')) ||
          voices.find(v => v.lang.includes('en-ZA')) ||
          voices.find(v => v.lang.includes('en-GB')) ||
          voices.find(v => v.lang.startsWith('en')) ||
          null;
        targetLangTag = matchedVoice?.lang || 'en-GB';
      }
      utterance.pitch = 1.1; // Warm African vocal tone
    } else if (language === 'hausa') {
      const nativeHa = voices.find(v => v.lang.toLowerCase().startsWith('ha'));
      if (nativeHa) {
        matchedVoice = nativeHa;
        targetLangTag = nativeHa.lang;
      } else {
        matchedVoice =
          voices.find(v => v.lang.includes('NG') || v.name.toLowerCase().includes('nigeria')) ||
          voices.find(v => v.lang.includes('en-ZA')) ||
          voices.find(v => v.lang.includes('en-GB')) ||
          voices.find(v => v.lang.startsWith('en')) ||
          null;
        targetLangTag = matchedVoice?.lang || 'en-GB';
      }
      utterance.pitch = 1.03;
    } else if (language === 'igbo') {
      const nativeIg = voices.find(v => v.lang.toLowerCase().startsWith('ig'));
      if (nativeIg) {
        matchedVoice = nativeIg;
        targetLangTag = nativeIg.lang;
      } else {
        matchedVoice =
          voices.find(v => v.lang.includes('NG') || v.name.toLowerCase().includes('nigeria')) ||
          voices.find(v => v.lang.includes('en-ZA')) ||
          voices.find(v => v.lang.includes('en-GB')) ||
          voices.find(v => v.lang.startsWith('en')) ||
          null;
        targetLangTag = matchedVoice?.lang || 'en-GB';
      }
      utterance.pitch = 1.08;
    } else {
      matchedVoice =
        voices.find(v => v.lang.includes('en-GB')) ||
        voices.find(v => v.lang.includes('en-US')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null;
      targetLangTag = matchedVoice?.lang || 'en-US';
      utterance.pitch = 1.0;
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    // Set the language tag to the matched voice's language to prevent 'language-unavailable' errors
    utterance.lang = targetLangTag;
    // Exact user-chosen speed rate (0.8x, 0.9x, 1.0x, 1.2x)
    utterance.rate = Math.max(0.5, Math.min(2.0, speedRate));

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;

    // Mobile Safari / Chrome audio wakeup
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      startSpeaking(rate);
    }
  };

  // Instant rate change: update state and, if playing, immediately apply speed
  const handleRateSelect = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      startSpeaking(newRate);
    }
  };

  const getLanguageLabel = () => {
    const langObj = LANGUAGES.find(l => l.id === language);
    return langObj ? `${langObj.flag} ${langObj.label}` : language.toUpperCase();
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg">
      {/* 1. Language Quick-Picker row */}
      {onLanguageChange && (
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Spoken Language:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  onLanguageChange(l.id);
                  if (isPlaying) {
                    window.speechSynthesis.cancel();
                    setIsPlaying(false);
                  }
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  language === l.id
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={`Vocalize in ${l.label}`}
              >
                <span>{l.flag}</span> <span className="hidden xs:inline">{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Main Play / Pause & Waveform Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSpeak}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-95'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95'
            }`}
            title={isPlaying ? 'Pause spoken explanation' : `Play spoken explanation in ${getLanguageLabel()}`}
            aria-label={isPlaying ? 'Pause speech' : 'Play speech'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {isPlaying ? 'Speaking Voice Note...' : 'Listen in ' + getLanguageLabel()}
              </span>
              {isPlaying && (
                <div className="flex items-center gap-1 h-3.5">
                  <div className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.45s]" />
                  <div className="w-1 h-3.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              {language === 'pidgin'
                ? 'Naija voice reading clinical guide'
                : language === 'yoruba'
                ? 'Apejuwe ni ede Yorùbá fun alafia yin'
                : language === 'hausa'
                ? 'Bayanin magani a yaren Hausa'
                : language === 'igbo'
                ? 'Nkọwa ọgwụ n\'asụsụ Igbo'
                : 'Clear spoken patient safety advice'}
            </p>
          </div>
        </div>

        {/* 3. Speed Rate Selector Pills (0.8x, 0.9x, 1.0x, 1.2x) */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {SPEED_PRESETS.map((p) => {
            const isSelected = rate === p.value;
            return (
              <button
                key={p.value}
                onClick={() => handleRateSelect(p.value)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`Play at ${p.label} speed (${p.desc})`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
