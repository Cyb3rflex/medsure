'use client';

import React, { useState } from 'react';
import { Stethoscope, CheckCircle, XCircle, AlertTriangle, UserCheck, Clock, FileText, ChevronRight } from 'lucide-react';

export interface PharmacistReviewItem {
  id: string;
  timestamp: string;
  medicineName: string;
  extractedData: any;
  flags: any[];
  status: 'pending' | 'approved' | 'rejected';
  pharmacistNotes?: string;
  reviewedAt?: string;
}

interface PharmacistPortalProps {
  queue: PharmacistReviewItem[];
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
}

export default function PharmacistPortal({
  queue,
  onApprove,
  onReject
}: PharmacistPortalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(queue[0]?.id || null);
  const [notes, setNotes] = useState('');

  const selectedItem = queue.find(q => q.id === selectedId) || queue[0];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Licensed Pharmacist Escalation Portal</h2>
            <p className="text-xs text-slate-400">
              Human-in-the-loop review for medicines flagged with expiration, suspect NAFDAC, or toxic interactions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Pending Cases: <strong className="text-amber-400">{queue.filter(q => q.status === 'pending').length}</strong>
          </span>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Queue is Clear</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No escalated medicines are waiting for review. When a patient scans an expired pack or an invalid NAFDAC number, it will queue here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Queue List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Escalated Submissions:</h4>
            {queue.map((item) => (
              <div
                key={item.id}
                onClick={() => { setSelectedId(item.id); setNotes(item.pharmacistNotes || ''); }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedItem?.id === item.id
                    ? 'bg-slate-800 border-amber-500/50 shadow-md'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.medicineName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      item.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.status === 'rejected'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {item.timestamp} • {item.flags.length} safety flag(s)
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>

          {/* Review Details Pane */}
          {selectedItem && (
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase">Case ID: {selectedItem.id}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedItem.medicineName}</h3>
                  <span className="text-xs text-slate-400">Escalated at {selectedItem.timestamp}</span>
                </div>

                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                  selectedItem.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : selectedItem.status === 'rejected'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                }`}>
                  Status: {selectedItem.status}
                </span>
              </div>

              {/* Extraction Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Strength</span>
                  <span className="text-xs text-white font-semibold mt-0.5 block">
                    {selectedItem.extractedData?.strength || 'Unspecified'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Expiry Date</span>
                  <span className="text-xs text-white font-semibold mt-0.5 block">
                    {selectedItem.extractedData?.expiry_date || 'N/A'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">NAFDAC No.</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold mt-0.5 block">
                    {selectedItem.extractedData?.nafdac_number || 'Missing'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Batch No.</span>
                  <span className="text-xs font-mono text-slate-300 mt-0.5 block">
                    {selectedItem.extractedData?.batch_number || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Guardrail Flags Triggering Escalation */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Violated Safety Guardrails:
                </span>
                {selectedItem.flags.map((flag, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-red-950/50 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-red-100">{flag.title}</strong>
                      <span className="text-slate-300 mt-0.5 block">{flag.message}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pharmacist Action & Clinical Notes */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Pharmacist Clinical Notes &amp; Patient Advice:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter pharmacist instructions, alternative medication recommendation, or reason for rejection..."
                  className="w-full h-24 bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none placeholder:text-slate-500"
                />

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => onReject(selectedItem.id, notes)}
                    className="px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Medicine</span>
                  </button>
                  <button
                    onClick={() => onApprove(selectedItem.id, notes)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve with Clinical Notes</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
