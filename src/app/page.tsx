'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import EmergencyBanner from '@/components/EmergencyBanner';
import Scanner from '@/components/Scanner';
import SafetyResultView from '@/components/SafetyResultView';
import CabinetView from '@/components/CabinetView';
import PharmacistPortal, { PharmacistReviewItem } from '@/components/PharmacistPortal';
import MedSureLanding3D from '@/components/MedSureLanding3D';
import { SupportedLanguage } from '@/lib/gemini';
import { MedicineRecord, MEDICINES } from '@/lib/safetyRules';
import { ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<'story' | 'patient' | 'pharmacist' | 'cabinet'>('story');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  // User's home medicine cabinet
  const [cabinet, setCabinet] = useState<MedicineRecord[]>([]);

  // Pharmacist review queue
  const [pharmacistQueue, setPharmacistQueue] = useState<PharmacistReviewItem[]>([]);

  // Initialize with sample cabinet items for instant hackathon demo interaction
  useEffect(() => {
    // Seed with 1 initial medicine to demonstrate interaction checker
    const defaultParacetamol = MEDICINES.find(m => m.ID === 'paracetamol');
    if (defaultParacetamol && cabinet.length === 0) {
      setCabinet([defaultParacetamol]);
    }
  }, []);

  // 1. Scan image with Gemini Flash Vision
  const handleScanImage = async (base64Image: string, mimeType: string) => {
    setIsLoading(true);
    setActiveTab('patient');

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          mimeType,
          language: currentLanguage,
          cabinet
        })
      });

      const data = await res.json();
      if (data.success) {
        setScanResult(data);
        // Automatically queue if red flags exist
        if (!data.safetyResult.isClean) {
          queueForPharmacist(data);
        }
      } else {
        alert(data.error || 'Failed to scan medicine pack.');
      }
    } catch (err: any) {
      alert('Error scanning medicine: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Search / Demo Preset by name
  const handleSearchName = async (name: string, mockData?: { mockExpiry?: string; mockNafdac?: string }) => {
    setIsLoading(true);
    setActiveTab('patient');

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineName: name,
          language: currentLanguage,
          cabinet,
          mockExpiry: mockData?.mockExpiry,
          mockNafdac: mockData?.mockNafdac
        })
      });

      const data = await res.json();
      if (data.success) {
        setScanResult(data);
        if (!data.safetyResult.isClean) {
          queueForPharmacist(data);
        }
      } else {
        alert(data.error || 'Failed to check medicine.');
      }
    } catch (err: any) {
      alert('Error searching medicine: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Queue item for Pharmacist Review
  const queueForPharmacist = (data: any) => {
    const newItem: PharmacistReviewItem = {
      id: 'RX-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      medicineName: data.medicineRecord?.Medicine || data.extractedData?.medicine_name || 'Flagged Medicine',
      extractedData: data.extractedData,
      flags: data.safetyResult?.flags || [],
      status: 'pending'
    };

    setPharmacistQueue(prev => [newItem, ...prev.filter(p => p.medicineName !== newItem.medicineName)]);
  };

  // 4. Cabinet management
  const handleAddToCabinet = (med: MedicineRecord) => {
    if (!cabinet.some(c => c.ID === med.ID)) {
      setCabinet(prev => [...prev, med]);
    }
  };

  const handleRemoveFromCabinet = (id: string) => {
    setCabinet(prev => prev.filter(c => c.ID !== id));
  };

  // 5. Pharmacist actions
  const handleApprove = (id: string, notes: string) => {
    setPharmacistQueue(prev =>
      prev.map(q => q.id === id ? { ...q, status: 'approved', pharmacistNotes: notes, reviewedAt: new Date().toLocaleTimeString() } : q)
    );
  };

  const handleReject = (id: string, notes: string) => {
    setPharmacistQueue(prev =>
      prev.map(q => q.id === id ? { ...q, status: 'rejected', pharmacistNotes: notes, reviewedAt: new Date().toLocaleTimeString() } : q)
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Global Navigation Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        flaggedCount={pharmacistQueue.filter(q => q.status === 'pending').length}
        cabinetCount={cabinet.length}
      />

      {/* Tab 0: Inbuilt 3D Story Landing Page */}
      {activeTab === 'story' && (
        <MedSureLanding3D onOpenApp={() => setActiveTab('patient')} />
      )}

      {/* Main Clinical Dashboard Tabs */}
      {activeTab !== 'story' && (
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Real-Life Emergency Banner (Addressing Home Panic & Respiratory Attacks) */}
          <EmergencyBanner
            currentLanguage={currentLanguage}
            onAskSymptom={(symptom) => {
              handleSearchName(symptom);
            }}
          />

          {/* Tab 1: Check Medicine (Patient Flow) */}
          {activeTab === 'patient' && (
          <div className="space-y-6">
            <Scanner
              onScanImage={handleScanImage}
              onSearchName={handleSearchName}
              isLoading={isLoading}
            />

            {isLoading && (
              <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 text-center space-y-3 glow-emerald animate-pulse">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <h3 className="text-base font-bold text-white font-display">Analyzing Medicine Package...</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Running Gemini 2.5 Flash Vision OCR, comparing against 43 Nigerian Essential Medicines, and testing deterministic code safety rules.
                </p>
              </div>
            )}

            {scanResult && !isLoading && (
              <SafetyResultView
                scanData={scanResult}
                currentLanguage={currentLanguage}
                onAddToCabinet={handleAddToCabinet}
                isInCabinet={cabinet.some(c => c.ID === scanResult.medicineRecord?.ID)}
                onEscalateToPharmacist={() => queueForPharmacist(scanResult)}
                isEscalated={pharmacistQueue.some(q => q.medicineName === scanResult.medicineRecord?.Medicine)}
              />
            )}
          </div>
        )}

        {/* Tab 2: My Medicine Cabinet (Cross-Interaction Checker) */}
        {activeTab === 'cabinet' && (
          <CabinetView
            cabinet={cabinet}
            onRemoveFromCabinet={handleRemoveFromCabinet}
            onSelectMedicine={(med) => {
              handleSearchName(med.Medicine);
            }}
            onOpenScanner={() => setActiveTab('patient')}
          />
        )}

        {/* Tab 3: Pharmacist-in-the-Loop Portal */}
        {activeTab === 'pharmacist' && (
          <PharmacistPortal
            queue={pharmacistQueue}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </main>
    )}

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">MedSure Nigeria</span>
            <span>— OPEN//BUILD Hackathon Practice &amp; Prototype</span>
          </div>
          <p className="text-[11px] text-slate-500 text-center sm:text-right">
            Deterministic Code Guardrails • Multilingual Audio • Pharmacist-in-the-Loop Escalation
          </p>
        </div>
      </footer>
    </div>
  );
}
