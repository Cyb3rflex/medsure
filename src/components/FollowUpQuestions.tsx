'use client';

import React, { useState } from 'react';
import { HelpCircle, Send, Sparkles, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';
import { SupportedLanguage } from '@/lib/gemini';

interface FollowUpQuestionsProps {
  medicine: any;
  suggestedQuestions: string[];
  currentLanguage: SupportedLanguage;
}

export default function FollowUpQuestions({
  medicine,
  suggestedQuestions = [],
  currentLanguage
}: FollowUpQuestionsProps) {
  const [activeQuestion, setActiveQuestion] = useState<string>('');
  const [customInput, setCustomInput] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (question: string) => {
    if (!question.trim()) return;
    setActiveQuestion(question);
    setIsLoading(true);
    setAnswer(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicine,
          question,
          language: currentLanguage
        })
      });

      const data = await res.json();
      if (data.success) {
        setAnswer(data.answer);
      } else {
        setAnswer('Unable to generate an answer at this moment. Please consult a licensed pharmacist.');
      }
    } catch (err) {
      setAnswer('Network error occurred. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    handleAsk(customInput);
    setCustomInput('');
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white font-display uppercase tracking-wider">
            Have Questions About This Medicine?
          </h4>
          <p className="text-[11px] text-slate-400">
            Click a suggested question below or type what you need clarified:
          </p>
        </div>
      </div>

      {/* Suggested Question Chips */}
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(q)}
            disabled={isLoading}
            className={`text-left text-xs px-3.5 py-2 rounded-xl border transition-all flex items-center gap-2 ${
              activeQuestion === q
                ? 'bg-blue-600/30 border-blue-400 text-white font-semibold'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Custom Question Form */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Ask anything else (e.g., Can someone with asthma take this?)"
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!customInput.trim() || isLoading}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>

      {/* Loading & Answer Display */}
      {isLoading && (
        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 flex items-center gap-3">
          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-xs text-blue-300">Consulting MedSure clinical intelligence...</span>
        </div>
      )}

      {answer && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Answer for: &ldquo;{activeQuestion}&rdquo;</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              Pharmacist Referral Included
            </span>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
            {answer}
          </div>

          <div className="mt-2 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Always verify dosage adjustments with a licensed pharmacist</span>
            </div>
            <a
              href="#access"
              onClick={() => alert(`Your question: "${activeQuestion}" has been flagged for pharmacist consultation.`)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] border border-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <span>Speak to a Pharmacist</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
