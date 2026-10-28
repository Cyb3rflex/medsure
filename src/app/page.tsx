'use client';

import React, { useState, useEffect } from 'react';
import { FloatingNav } from '@/components/ui/floating-navbar';
import Footer from '@/components/Footer';
import EmergencyBanner from '@/components/EmergencyBanner';
import Scanner from '@/components/Scanner';
import SafetyResultView from '@/components/SafetyResultView';
import CabinetView from '@/components/CabinetView';
import PharmacistPortal, { PharmacistReviewItem } from '@/components/PharmacistPortal';
import MedSureLanding3D from '@/components/MedSureLanding3D';
import { SupportedLanguage } from '@/lib/gemini';
import { MedicineRecord, MEDICINES } from '@/lib/safetyRules';
import { ShieldCheck, HeartPulse, RefreshCw, AlertTriangle, AlertCircle, X, Camera, Pill } from 'lucide-react';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<'story' | 'patient' | 'pharmacist' | 'cabinet'>('story');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [nonMedicineWarning, setNonMedicineWarning] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

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
    setNonMedicineWarning(null);
    setScanError(null);
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
        setNonMedicineWarning(null);
        setScanError(null);
        // Automatically queue if red flags exist
        if (!data.safetyResult.isClean) {
          queueForPharmacist(data);
        }
      } else if (data.isNotMedicine) {
        setScanResult(null);
        setScanError(null);
        setNonMedicineWarning(data.rejectionReason || data.error || 'The uploaded photo does not appear to be a medicine package or pharmaceutical product.');
      } else {
        setScanResult(null);
        setNonMedicineWarning(null);
        setScanError(data.error || 'Failed to scan medicine pack.');
      }
    } catch (err: any) {
      setScanResult(null);
      setNonMedicineWarning(null);
      setScanError('Error scanning medicine: ' + (err.message || 'Please check your connection and try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Search / Demo Preset by name
  const handleSearchName = async (name: string, mockData?: { mockExpiry?: string; mockNafdac?: string }) => {
    setIsLoading(true);
    setNonMedicineWarning(null);
    setScanError(null);
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
        setNonMedicineWarning(null);
        setScanError(null);
        if (!data.safetyResult.isClean) {
          queueForPharmacist(data);
        }
      } else {
        setScanResult(null);
        setNonMedicineWarning(null);
        setScanError(data.error || 'Failed to check medicine.');
      }
    } catch (err: any) {
      setScanResult(null);
      setNonMedicineWarning(null);
      setScanError('Error searching medicine: ' + (err.message || 'Please check your connection and try again.'));
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
      {/* Universal Floating Navbar across the whole site */}
      <FloatingNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        flaggedCount={pharmacistQueue.filter(q => q.status === 'pending').length}
        cabinetCount={cabinet.length}
      />

      {/* Tab 0: Inbuilt 3D Story Landing Page */}
      {activeTab === 'story' && (
        <MedSureLanding3D onOpenApp={() => setActiveTab('patient')} />
      )}

      {/* Main Clinical Dashboard Tabs */}
      {activeTab !== 'story' && (
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 pt-24 sm:pt-28 space-y-6">
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
                  Running Gemini 3.8 Flash Vision OCR, comparing against 43 Nigerian Essential Medicines, and testing deterministic code safety rules.
                </p>
              </div>
            )}

            {/* Non-Medicine / Irrelevant Image Warning Card */}
            {nonMedicineWarning && !isLoading && (
              <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                        <span>Image Not Recognized as Medicine</span>
                      </div>
                      <h3 className="text-lg font-bold text-white font-display">
                        This doesn't appear to be a medicine or drug package
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                        {nonMedicineWarning}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        MedSure is engineered specifically for pharmaceutical safety — verifying packaging labels, blister foils, syrup bottles, Nigerian NAFDAC numbers, batch codes, and expiration dates.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNonMedicineWarning(null)}
                    className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
                    aria-label="Close warning"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Helpful Guidance */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <Camera className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div className="text-xs space-y-1">
                      <span className="font-semibold text-slate-200 block">How to scan a medicine</span>
                      <span className="text-slate-400 leading-normal block">Point your camera directly at the front of the medicine box, blister pack foil, or syrup bottle with clear lighting.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <Pill className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                    <div className="text-xs space-y-1">
                      <span className="font-semibold text-slate-200 block">Or try a verified demo preset</span>
                      <span className="text-slate-400 leading-normal block">Instantly test MedSure with verified Nigerian medicines like Panadol, Coartem, Ventolin, or Diclofenac.</span>
                    </div>
                  </div>
                </div>

                {/* Quick Presets Action */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium mr-1">Quick Presets:</span>
                  <button
                    onClick={() => handleSearchName('Panadol Extra')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-600/20 hover:border-emerald-500/40 border border-slate-700 text-xs font-medium text-emerald-300 transition-colors"
                  >
                    Panadol Extra (OTC)
                  </button>
                  <button
                    onClick={() => handleSearchName('Artemether-lumefantrine', { mockExpiry: '2024-02' })}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-600/20 hover:border-rose-500/40 border border-slate-700 text-xs font-medium text-rose-300 transition-colors"
                  >
                    Expired Antimalarial
                  </button>
                  <button
                    onClick={() => handleSearchName('Salbutamol')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-blue-600/20 hover:border-blue-500/40 border border-slate-700 text-xs font-medium text-blue-300 transition-colors"
                  >
                    Ventolin / Salbutamol
                  </button>
                </div>
              </div>
            )}

            {/* General Scan Error Card */}
            {scanError && !isLoading && (
              <div className="relative overflow-hidden rounded-3xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-950 p-6 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white font-display">
                        Scan Verification Notice
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {scanError}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setScanError(null)}
                    className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
                    aria-label="Dismiss error"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
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

      {/* Well Organised Footer */}
      <Footer onNavigateTab={setActiveTab} />
    </div>
  );
}
