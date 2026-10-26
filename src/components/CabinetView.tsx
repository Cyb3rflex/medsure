'use client';

import React from 'react';
import { Pill, Trash2, AlertTriangle, ShieldCheck, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { MedicineRecord, evaluateSafety, INTERACTIONS } from '@/lib/safetyRules';

interface CabinetViewProps {
  cabinet: MedicineRecord[];
  onRemoveFromCabinet: (id: string) => void;
  onSelectMedicine: (med: MedicineRecord) => void;
  onOpenScanner: () => void;
}

export default function CabinetView({
  cabinet,
  onRemoveFromCabinet,
  onSelectMedicine,
  onOpenScanner
}: CabinetViewProps) {
  // Check for cross-interactions across all cabinet items
  const crossCollisions: { medA: string; medB: string; message: string; severity: string }[] = [];

  for (let i = 0; i < cabinet.length; i++) {
    for (let j = i + 1; j < cabinet.length; j++) {
      const a = cabinet[i];
      const b = cabinet[j];

      const aGroups = (a.Groups || '').split(',').map(g => g.trim().toLowerCase());
      const bGroups = (b.Groups || '').split(',').map(g => g.trim().toLowerCase());

      // Check group-based collisions
      for (const g of aGroups) {
        if (g && bGroups.includes(g)) {
          const rule = INTERACTIONS.find(r => 
            r['Medicine or group A'] === `group:${g}` && r['Medicine or group B'] === `group:${g}`
          );
          if (rule) {
            crossCollisions.push({
              medA: a.Medicine,
              medB: b.Medicine,
              message: rule['Message shown to user'],
              severity: rule.Severity
            });
          }
        }
      }

      // Check direct collisions
      const directRule = INTERACTIONS.find(r => 
        (r['Medicine or group A'] === a.ID && r['Medicine or group B'] === b.ID) ||
        (r['Medicine or group A'] === b.ID && r['Medicine or group B'] === a.ID)
      );
      if (directRule) {
        crossCollisions.push({
          medA: a.Medicine,
          medB: b.Medicine,
          message: directRule['Message shown to user'],
          severity: directRule.Severity
        });
      }
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-display">My Medicine Cabinet</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-checks all medicines in your home to prevent duplicate active ingredients or toxic interactions
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Another Medicine</span>
        </button>
      </div>

      {/* Dangerous Interaction Matrix Warnings */}
      {crossCollisions.length > 0 && (
        <div className="p-5 rounded-3xl bg-red-950/60 border border-red-500/50 glow-crimson space-y-3">
          <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>CRITICAL DRUG COMBINATION CONFLICT DETECTED IN YOUR CABINET</span>
          </div>
          <div className="space-y-2">
            {crossCollisions.map((col, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-red-900/60 border border-red-500/30 text-xs text-red-100 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white mb-0.5">
                    {col.medA} + {col.medB} ({col.severity.toUpperCase()})
                  </strong>
                  <span>{col.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cabinet Drug List */}
      {cabinet.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Pill className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Your Cabinet is Currently Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Scan or search your home medicines to build your profile. MedSure will automatically monitor them for dangerous drug pairings.
          </p>
          <button
            onClick={onOpenScanner}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-colors"
          >
            Scan First Medicine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cabinet.map((med) => (
            <div
              key={med.ID + med.Medicine}
              className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 
                    onClick={() => onSelectMedicine(med)}
                    className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    {med.Medicine}
                  </h4>
                  <button
                    onClick={() => onRemoveFromCabinet(med.ID)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Remove from cabinet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {med.Uses}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {med['Active ingredients']}
                </span>
                <button
                  onClick={() => onSelectMedicine(med)}
                  className="text-slate-400 hover:text-white font-semibold"
                >
                  View Details &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
