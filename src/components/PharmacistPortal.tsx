'use client';

import React, { useState } from 'react';
import { 
  Stethoscope, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  FileText, 
  ChevronRight, 
  Mic, 
  HeartPulse, 
  Sparkles, 
  Send,
  Phone,
  PhoneCall,
  MessageSquare,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  X,
  User,
  MapPin,
  BadgeCheck
} from 'lucide-react';

export interface PharmacistReviewItem {
  id: string;
  timestamp: string;
  medicineName: string;
  extractedData: any;
  flags: any[];
  status: 'pending' | 'approved' | 'rejected';
  pharmacistNotes?: string;
  reviewedAt?: string;
  caseType?: 'flagged_drug' | 'voice_complaint';
  patientComplaint?: string;
  triageLevel?: string;
  immediateActions?: string[];
  patientName?: string;
  patientPhone?: string;
  patientLocation?: string;
  pharmacistName?: string;
  pcnLicense?: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Responsive action feedback toast/modal
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'approved' | 'rejected';
    caseId: string;
    patientName: string;
    patientPhone: string;
    patientLocation: string;
    timestamp: string;
    message: string;
    notes: string;
  } | null>(null);

  const selectedItem = queue.find(q => q.id === selectedId) || queue[0];

  const handleSelectCase = (item: PharmacistReviewItem) => {
    setSelectedId(item.id);
    setNotes(item.pharmacistNotes || '');
    setIsEditing(false);
  };

  const handleApproveAction = () => {
    if (!selectedItem) return;
    const finalNotes = notes.trim() || 
      (selectedItem.caseType === 'voice_complaint' 
        ? 'Consultation approved: Patient advised to take safe pediatric oral rehydration, maintain fluid intake, and monitor temperature. Avoid splitting adult antimalarial or NSAID tablets.' 
        : 'Medication verification completed: NAFDAC registration confirmed and batch certified for safe patient administration.');
    
    onApprove(selectedItem.id, finalNotes);
    setIsEditing(false);

    const patientName = selectedItem.patientName || 'Mrs. Fatima Aliyu';
    const patientPhone = selectedItem.patientPhone || '+234 803 456 7890';
    const patientLocation = selectedItem.patientLocation || 'Ikeja, Lagos State';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setActionFeedback({
      type: 'approved',
      caseId: selectedItem.id,
      patientName,
      patientPhone,
      patientLocation,
      timestamp: timeStr,
      notes: finalNotes,
      message: `Consultation session #${selectedItem.id} has been clinically approved and signed off by Pharm. Dr. Musa Ibrahim (PCN Reg: #049281). Patient SMS & In-App summary dispatched.`
    });
  };

  const handleRejectAction = () => {
    if (!selectedItem) return;
    const finalNotes = notes.trim() || 
      'Urgent physical clinical evaluation required: Patient advised to immediately present at the nearest primary healthcare clinic or hospital emergency room. Medication withheld for safety.';
    
    onReject(selectedItem.id, finalNotes);
    setIsEditing(false);

    const patientName = selectedItem.patientName || 'Mrs. Fatima Aliyu';
    const patientPhone = selectedItem.patientPhone || '+234 803 456 7890';
    const patientLocation = selectedItem.patientLocation || 'Ikeja, Lagos State';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setActionFeedback({
      type: 'rejected',
      caseId: selectedItem.id,
      patientName,
      patientPhone,
      patientLocation,
      timestamp: timeStr,
      notes: finalNotes,
      message: `Dispensing declined for Case #${selectedItem.id}. Emergency clinic referral alert sent to patient with directions to the nearest hospital.`
    });
  };

  const copyPatientNumber = (num: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(num);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in relative">
      {/* Header */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Licensed Pharmacist Clinical Queue</h2>
            <p className="text-xs text-slate-400">
              Human-in-the-loop clinical review for patient voice complaints and escalated medicines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Pending Cases: <strong className="text-amber-400">{queue.filter(q => q.status === 'pending').length}</strong>
          </span>
          <span className="text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Approved: <strong className="text-emerald-400">{queue.filter(q => q.status === 'approved').length}</strong>
          </span>
        </div>
      </div>

      {/* TOP RESPONSIVE ACTION CONFIRMATION BANNER / MODAL */}
      {actionFeedback && (
        <div className={`p-5 rounded-3xl border shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
          actionFeedback.type === 'approved'
            ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-emerald-500/50 shadow-emerald-950/50'
            : 'bg-gradient-to-r from-red-950/80 via-slate-900 to-rose-950/80 border-red-500/50 shadow-red-950/50'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                actionFeedback.type === 'approved'
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400'
                  : 'bg-red-500/20 border-red-400/40 text-red-400'
              }`}>
                {actionFeedback.type === 'approved' ? (
                  <CheckCircle className="w-6 h-6 animate-pulse" />
                ) : (
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black text-white tracking-tight">
                    {actionFeedback.type === 'approved'
                      ? 'Consultation Approved & Clinically Signed Off!'
                      : 'Urgent Clinic Referral Dispatched!'}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Case #{actionFeedback.caseId} • {actionFeedback.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
                  {actionFeedback.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActionFeedback(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Patient Direct Contact & Follow-up Actions */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            {/* Patient Info */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 font-bold text-xs">
                {actionFeedback.patientName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Patient Contact</span>
                <span className="text-xs font-bold text-white truncate block">{actionFeedback.patientName}</span>
                <span className="text-[11px] font-mono text-emerald-400 block">{actionFeedback.patientPhone}</span>
              </div>
            </div>

            {/* Direct Calling & Messaging Buttons */}
            <div className="md:col-span-2 flex flex-wrap items-center gap-2">
              <a
                href={`tel:${actionFeedback.patientPhone.replace(/\s+/g, '')}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Patient via Phone ({actionFeedback.patientPhone})</span>
              </a>

              <a
                href={`https://wa.me/${actionFeedback.patientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${actionFeedback.patientName}, this is Pharm. Dr. Musa Ibrahim from MedSure regarding your consultation (Case #${actionFeedback.caseId}). Your review notes: ${actionFeedback.notes}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Follow-up</span>
              </a>

              <button
                type="button"
                onClick={() => copyPatientNumber(actionFeedback.patientPhone)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {queue.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Queue is Clear</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No patient complaints or escalated medicines are waiting for review. When a patient voices an emergency complaint or scans a suspect pack, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Queue List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
              <span>Consultation & Review Queue:</span>
              <span className="text-[10px] text-slate-500 font-normal">{queue.length} cases</span>
            </h4>
            {queue.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectCase(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedItem?.id === item.id
                    ? 'bg-slate-800 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[180px]">
                      {item.medicineName}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      item.caseType === 'voice_complaint'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {item.caseType === 'voice_complaint' ? 'Voice Case' : 'Drug Pack'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{item.timestamp}</span>
                    <span>•</span>
                    <span className={`font-bold uppercase ${
                      item.status === 'approved' 
                        ? 'text-emerald-400' 
                        : item.status === 'rejected' 
                        ? 'text-red-400' 
                        : 'text-amber-400'
                    }`}>
                      {item.status === 'approved' ? '✓ Approved' : item.status === 'rejected' ? '✗ Escalated' : '⏳ Pending'}
                    </span>
                  </div>

                  {item.patientPhone && (
                    <span className="text-[10px] font-mono text-slate-400 block">
                      📞 {item.patientName || 'Patient'}: {item.patientPhone}
                    </span>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedItem?.id === item.id ? 'text-amber-400 translate-x-1' : 'text-slate-500'}`} />
              </div>
            ))}
          </div>

          {/* Review Details Pane */}
          {selectedItem && (
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Case ID: {selectedItem.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedItem.caseType === 'voice_complaint'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {selectedItem.caseType === 'voice_complaint' ? '🎤 Patient Voice Complaint' : '📦 Scanned Medicine Pack'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedItem.medicineName}</h3>
                  <span className="text-xs text-slate-400">Escalated to clinical queue at {selectedItem.timestamp}</span>
                </div>

                <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase flex items-center gap-1.5 ${
                  selectedItem.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : selectedItem.status === 'rejected'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                }`}>
                  {selectedItem.status === 'approved' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  {selectedItem.status === 'rejected' && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  {selectedItem.status === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Status: {selectedItem.status}</span>
                </span>
              </div>

              {/* Patient Contact Card */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{selectedItem.patientName || 'Mrs. Fatima Aliyu'}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {selectedItem.patientLocation || 'Ikeja, Lagos'}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 block mt-0.5 font-semibold">
                      📞 {selectedItem.patientPhone || '+234 803 456 7890'}
                    </span>
                  </div>
                </div>

                {/* Quick Phone Call & WhatsApp Links */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`tel:${(selectedItem.patientPhone || '+2348034567890').replace(/\s+/g, '')}`}
                    className="flex-1 sm:flex-none py-1.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Patient</span>
                  </a>
                  <a
                    href={`https://wa.me/${(selectedItem.patientPhone || '2348034567890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, this is Pharm. Dr. Musa Ibrahim regarding Case #${selectedItem.id}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Case 1: Voice Consultation Details */}
              {selectedItem.caseType === 'voice_complaint' ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5" />
                      <span>Patient Voice Complaint:</span>
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-mono italic">
                      "{selectedItem.patientComplaint || selectedItem.extractedData?.complaint}"
                    </p>
                  </div>

                  {selectedItem.immediateActions && selectedItem.immediateActions.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        First-Aid Actions Guided:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {selectedItem.immediateActions.map((action: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                /* Case 2: Drug Extraction Specs */
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
              )}

              {/* Guardrail Flags */}
              {selectedItem.flags && selectedItem.flags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Clinical Triage Observations:
                  </span>
                  {selectedItem.flags.map((flag, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-100">{typeof flag === 'string' ? flag : flag.title}</strong>
                        {typeof flag !== 'string' && flag.message && (
                          <span className="text-slate-300 mt-0.5 block">{flag.message}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* REVIEW / SIGN-OFF SECTION */}
              {selectedItem.status !== 'pending' && !isEditing ? (
                /* STATE A: ALREADY SIGNED OFF OR DECLINED - SHOW OFFICIAL CERTIFICATE */
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  selectedItem.status === 'approved'
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-red-950/20 border-red-500/40'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        selectedItem.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {selectedItem.status === 'approved' ? (
                          <ShieldCheck className="w-5 h-5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          {selectedItem.status === 'approved' 
                            ? 'Consultation Approved & Clinically Signed Off' 
                            : 'Physical Clinic Escalation Dispatched'}
                        </h4>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {selectedItem.pharmacistName || 'Pharm. Dr. Musa Ibrahim, B.Pharm, MPSN'} • {selectedItem.pcnLicense || 'PCN Reg #049281'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Update Clinical Advice</span>
                    </button>
                  </div>

                  {/* Signed Advice Box */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">
                      Signed Clinical Advice &amp; Patient Instructions:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                      "{selectedItem.pharmacistNotes || notes || 'Consultation reviewed and certified under standard PCN community pharmacy guidelines.'}"
                    </p>
                  </div>

                  {/* Direct Action Hub */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="text-[11px] text-slate-400">
                      Sign-off registered at: <strong className="text-slate-200">{selectedItem.reviewedAt || selectedItem.timestamp}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${(selectedItem.patientPhone || '+2348034567890').replace(/\s+/g, '')}`}
                        className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Place Call to Patient ({selectedItem.patientPhone || '+234 803 456 7890'})</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* STATE B: PENDING OR EDITING - SHOW ACTION FORM & PRESETS */
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Licensed Pharmacist Clinical Assessment &amp; Advice:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNotes('Review completed: Patient advised to take safe pediatric oral rehydration and monitor temperature. Avoid adult tablet formulations.')}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        + Pediatric Advice
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotes('Dosage confirmed safe for patient age and weight. Take medication after meals and complete the prescribed 5-day regimen.')}
                        className="text-[10px] text-teal-400 hover:underline"
                      >
                        + Dosage Advice
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter licensed pharmacist recommendation, alternative prescription guidance, or referral notes..."
                    className="w-full h-24 bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none placeholder:text-slate-500"
                  />

                  <div className="flex flex-wrap items-center justify-end gap-2.5">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleRejectAction}
                      className="px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline / Advise Clinic Rush</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleApproveAction}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Consultation &amp; Sign Off</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
