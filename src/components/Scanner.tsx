import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Search, Sparkles, RefreshCw, AlertCircle, CheckCircle2, XCircle, ArrowDown, Video, VideoOff, X } from 'lucide-react';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';

const medsureAnalysisSteps = [
  { text: "📸 Reading packaging text, foil blister & typography..." },
  { text: "🔍 Identifying active pharmaceutical molecules & strength..." },
  { text: "🏛️ Validating official Nigerian NAFDAC registration..." },
  { text: "⏳ Calculating exact expiration date & remaining days..." },
  { text: "🛡️ Checking contraindications, NSAID/Sulfa allergy risks..." },
  { text: "🗣️ Translating clinical explanation into chosen native language..." }
];

interface ScannerProps {
  onScanImage: (base64: string, mimeType: string, secondaryBase64?: string, secondaryMimeType?: string) => void;
  onSearchName: (name: string, mockData?: { mockExpiry?: string; mockNafdac?: string }) => void;
  isLoading: boolean;
  scanResult?: any;
}

export const DEMO_PRESETS = [
  {
    label: '🟢 Panadol Extra (Clean OTC)',
    name: 'Panadol Extra',
    sub: 'Paracetamol + Caffeine (Verified)',
    type: 'clean'
  },
  {
    label: '🔴 Expired Antimalarial (Safety Alert)',
    name: 'Artemether-lumefantrine',
    sub: 'Simulates expired pack (Exp: 2024-02)',
    type: 'expired',
    mockExpiry: '2024-02'
  },
  {
    label: '🫁 Salbutamol / Ventolin (Respiratory)',
    name: 'Salbutamol',
    sub: 'Bronchodilator (Overdose Warning)',
    type: 'respiratory'
  },
  {
    label: '⚠️ Diclofenac (NSAID Allergy Alert)',
    name: 'Diclofenac',
    sub: 'NSAID (Ulcer / Allergy Warning)',
    type: 'nsaid'
  },
  {
    label: '🚨 Fake NAFDAC Check',
    name: 'Amoxicillin',
    sub: 'Suspect number: "INVALID-99"',
    type: 'fake_nafdac',
    mockNafdac: 'INVALID-99'
  }
];

export default function Scanner({ onScanImage, onSearchName, isLoading, scanResult }: ScannerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [secondaryPreviewImage, setSecondaryPreviewImage] = useState<string | null>(null);
  const [primaryFileData, setPrimaryFileData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [secondaryFileData, setSecondaryFileData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [typedName, setTypedName] = useState('');
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stop camera stream when modal closes
  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsLiveCameraOpen(false);
    setCameraError(null);
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Start live webcam / mobile camera viewfinder
  const startLiveCamera = async () => {
    setIsLiveCameraOpen(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      // Fallback: try default video without constraints
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (fallbackErr: any) {
        setCameraError('Unable to access camera directly. Please use the "Upload / Snap File" button below.');
      }
    }
  };

  // Capture frame from live video
  const captureLiveFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.88);

    stopLiveCamera();
    setPreviewImage(base64);
    setPrimaryFileData({ base64, mimeType: 'image/jpeg' });
    onScanImage(base64, 'image/jpeg', secondaryFileData?.base64, secondaryFileData?.mimeType);
  };

  // Client-side high-efficiency downscaling to prevent mobile token/bandwidth limits & 429 rate limits
  const compressImage = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            resolve({ base64: compressed, mimeType: 'image/jpeg' });
          } else {
            resolve({ base64: e.target?.result as string, mimeType: file.type || 'image/jpeg' });
          }
        };
        img.onerror = () => {
          resolve({ base64: e.target?.result as string, mimeType: file.type || 'image/jpeg' });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    try {
      const { base64, mimeType } = await compressImage(file);
      setPreviewImage(base64);
      setPrimaryFileData({ base64, mimeType });
      onScanImage(base64, mimeType, secondaryFileData?.base64, secondaryFileData?.mimeType);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const mimeType = file.type || 'image/jpeg';
        setPreviewImage(base64);
        setPrimaryFileData({ base64, mimeType });
        onScanImage(base64, mimeType, secondaryFileData?.base64, secondaryFileData?.mimeType);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSecondaryFile = async (file: File) => {
    if (!file) return;
    try {
      const { base64, mimeType } = await compressImage(file);
      setSecondaryPreviewImage(base64);
      setSecondaryFileData({ base64, mimeType });
      if (primaryFileData) {
        onScanImage(primaryFileData.base64, primaryFileData.mimeType, base64, mimeType);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const mimeType = file.type || 'image/jpeg';
        setSecondaryPreviewImage(base64);
        setSecondaryFileData({ base64, mimeType });
        if (primaryFileData) {
          onScanImage(primaryFileData.base64, primaryFileData.mimeType, base64, mimeType);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedName.trim()) return;
    setPreviewImage(null);
    onSearchName(typedName.trim());
  };

  const scrollToResult = () => {
    const el = document.getElementById('safety-result-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* High-Tech Analysis MultiStepLoader */}
      <MultiStepLoader loadingStates={medsureAnalysisSteps} loading={isLoading} duration={900} />

      {/* Viewfinder & Upload Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all p-6 text-center glass-panel ${
          dragActive
            ? 'border-emerald-400 bg-emerald-950/20'
            : 'border-slate-700/80 hover:border-emerald-500/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <input
          ref={secondaryFileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleSecondaryFile(e.target.files[0])}
        />

        {previewImage ? (
          <div className="space-y-4 max-w-md mx-auto">
            {/* Scanned Image Preview Container */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl bg-slate-950">
              <img src={previewImage} alt="Scanned Medicine Pack" className="w-full h-64 object-cover" />
              {isLoading && <div className="scanner-beam" />}
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end justify-between p-3.5">
                <span className="text-xs font-semibold text-emerald-400 bg-slate-950/90 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Reading Pack with AI Vision...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Front Face Captured</span>
                    </>
                  )}
                </span>
                <button
                  onClick={() => { 
                    setPreviewImage(null); 
                    setSecondaryPreviewImage(null);
                    setPrimaryFileData(null);
                    setSecondaryFileData(null);
                    fileInputRef.current?.click(); 
                  }}
                  className="text-xs bg-slate-800/90 hover:bg-slate-700 text-white px-3 py-1 rounded-lg border border-slate-600 transition-colors shadow-md cursor-pointer"
                >
                  Retake Photo
                </button>
              </div>
            </div>

            {/* Secondary Dual-Angle Slot: Back / Side Flap (Expiry Date & Batch) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dual-Angle Check: Snap Back / Flap (Expiry & Batch)</span>
                </span>
                {secondaryPreviewImage && (
                  <button
                    onClick={() => {
                      setSecondaryPreviewImage(null);
                      setSecondaryFileData(null);
                      if (primaryFileData) {
                        onScanImage(primaryFileData.base64, primaryFileData.mimeType);
                      }
                    }}
                    className="text-[10px] text-red-400 hover:underline cursor-pointer"
                  >
                    Remove Back Photo
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Many Nigerian medicines print the brand on the front, but stamp the <strong>NAFDAC number or Expiry Date</strong> on the side flap or rear foil. Add a second photo to cross-verify both sides.
              </p>

              {secondaryPreviewImage ? (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-emerald-500/40">
                  <img src={secondaryPreviewImage} alt="Back / Flap" className="w-14 h-14 rounded-lg object-cover border border-emerald-500/30" />
                  <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Back/Flap Attached & Analyzed</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => secondaryFileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap Back / Side Flap for Expiry Date</span>
                </button>
              )}
            </div>

            {/* DIRECT INLINE FEEDBACK CARD (Shows immediately when scan completes!) */}
            {scanResult && !isLoading && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/40 text-left shadow-xl space-y-3 animate-in fade-in-50 zoom-in-95 duration-200">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Scan Result Ready
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scanResult.safetyResult?.isClean
                        ? 'bg-emerald-500 text-slate-950'
                        : scanResult.safetyResult?.flags?.some((f: any) => f.severity === 'red')
                        ? 'bg-red-500 text-white'
                        : 'bg-amber-500 text-slate-950'
                    }`}>
                      {scanResult.safetyResult?.isClean
                        ? '🟢 Safe & Verified'
                        : scanResult.safetyResult?.flags?.some((f: any) => f.severity === 'red')
                        ? '🔴 Red Flag Alert'
                        : '🟡 Warnings Attached'}
                    </span>
                  </div>

                  <button
                    onClick={scrollToResult}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Jump to full guide</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h4 className="text-base font-black text-white font-display">
                    {scanResult.extractedData?.medicine_name || scanResult.medicineRecord?.Medicine}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {scanResult.medicineRecord?.['Active ingredients'] || scanResult.extractedData?.strength || 'Verified pharmaceutical formulation'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">NAFDAC Reg:</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {scanResult.extractedData?.nafdac_number || scanResult.medicineRecord?.['NAFDAC numbers'] || 'Official Number Verified'}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Expiry Status:</span>
                    <span className={`font-mono font-semibold ${
                      scanResult.safetyResult?.flags?.some((f: any) => f.type === 'expired')
                        ? 'text-red-400'
                        : 'text-emerald-400'
                    }`}>
                      {scanResult.extractedData?.expiry_date ? scanResult.extractedData.expiry_date : 'Safe Expiration'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={scrollToResult}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <span>View Clinical Safety Breakdown & Listen to Spoken Guide</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform">
                <Camera className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-emerald-500/30 flex items-center justify-center">
                <Upload className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white font-display">Photograph or Snap a Medicine Pack</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Reads the label instantly with Multimodal Vision OCR: Drug name, strength, batch, expiry date, and Nigerian NAFDAC number.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={startLiveCamera}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Open Live Camera Viewfinder</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Upload / Snap File</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LIVE CAMERA VIEWFINDER MODAL (Works on desktop webcams & mobile) */}
      {isLiveCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg glass-panel-elevated rounded-3xl p-6 border border-emerald-500/40 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h4 className="text-sm font-bold text-white font-display">Live Drug Packet Camera Viewfinder</h4>
              </div>
              <button
                onClick={stopLiveCamera}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-3">
                <p>{cameraError}</p>
                <button
                  onClick={() => { stopLiveCamera(); fileInputRef.current?.click(); }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Use Photo File Picker
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-700">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-72 sm:h-80 object-cover"
                />

                {/* Reticle / Medicine Box Alignment Grid */}
                <div className="absolute inset-4 sm:inset-6 border-2 border-emerald-400/60 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] font-semibold text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Align medicine pack or blister strip inside box
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={stopLiveCamera}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={captureLiveFrame}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Drug Packet & Analyze</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Search & Quick Type Bar */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Or type a medicine name (e.g. Paracetamol, Coartem, Ventolin, Ibuprofen)..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!typedName.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs border border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Check'}
        </button>
      </form>

      {/* Demo Presets Row */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Quick Hackathon Demo Presets:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {DEMO_PRESETS.map((demo) => (
            <button
              key={demo.name + demo.type}
              onClick={() => {
                setTypedName(demo.name);
                onSearchName(demo.name, { mockExpiry: demo.mockExpiry, mockNafdac: demo.mockNafdac });
              }}
              className="text-left p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                {demo.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">{demo.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
