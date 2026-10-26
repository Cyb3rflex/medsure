'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { SupportedLanguage } from '@/lib/gemini';

interface VoicePlayerProps {
  textToRead: string;
  language: SupportedLanguage;
}

export default function VoicePlayer({ textToRead, language }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(0.9);

  useEffect(() => {
    // Stop speaking if text or language changes
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [textToRead, language]);

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    const voices = window.speechSynthesis.getVoices();

    // Intelligent voice matching for African dialects
    let matchedVoice: SpeechSynthesisVoice | null = null;

    if (language === 'pidgin') {
      utterance.lang = 'en-NG';
      matchedVoice = voices.find(v => v.lang.includes('NG') || v.name.toLowerCase().includes('nigeria')) ||
                     voices.find(v => v.lang.includes('en-ZA') || v.lang.includes('en-GB')) || null;
      utterance.pitch = 1.06; // Vibrant Nigerian cadence
      utterance.rate = rate * 0.95;
    } else if (language === 'yoruba') {
      utterance.lang = 'yo-NG';
      matchedVoice = voices.find(v => v.lang.startsWith('yo')) ||
                     voices.find(v => v.lang.includes('NG')) ||
                     voices.find(v => v.lang.includes('en-GB')) || null;
      utterance.pitch = 1.12; // Tonal variation for Yoruba vowels
      utterance.rate = rate * 0.85; // Slower, clearer syllable spacing
    } else if (language === 'hausa') {
      utterance.lang = 'ha-NG';
      matchedVoice = voices.find(v => v.lang.startsWith('ha')) ||
                     voices.find(v => v.lang.includes('NG')) || null;
      utterance.pitch = 1.02;
      utterance.rate = rate * 0.9;
    } else if (language === 'igbo') {
      utterance.lang = 'ig-NG';
      matchedVoice = voices.find(v => v.lang.startsWith('ig')) ||
                     voices.find(v => v.lang.includes('NG')) || null;
      utterance.pitch = 1.08;
      utterance.rate = rate * 0.88;
    } else {
      utterance.lang = 'en-GB';
      matchedVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US')) || null;
      utterance.pitch = 1.0;
      utterance.rate = rate;
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleSpeak}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
          }`}
          title={isPlaying ? 'Pause voice explanation' : 'Play voice explanation'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Voice Note Explanation</span>
            {isPlaying && (
              <div className="flex items-center gap-1 h-4">
                <div className="wave-bar" />
                <div className="wave-bar" />
                <div className="wave-bar" />
                <div className="wave-bar" />
                <div className="wave-bar" />
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            {language === 'pidgin' ? 'Naija voice reading explanation' : `Reading plain audio in ${language.toUpperCase()}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="bg-slate-800 text-[11px] text-slate-300 rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
        >
          <option value="0.8">0.8x (Clear)</option>
          <option value="0.9">0.9x</option>
          <option value="1.0">1.0x (Normal)</option>
        </select>
      </div>
    </div>
  );
}
