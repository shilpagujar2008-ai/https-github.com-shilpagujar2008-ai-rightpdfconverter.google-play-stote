import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  Sparkles,
  Check,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
  HardDrive,
  FolderDown,
  Save,
  Clock,
  Layers,
  FileCheck,
  Plus,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { convertImagesToPdf, formatBytes } from '../../utils/pdfEngine';
import { ProcessedHistoryItem, ScannedDocMemory, ScannedPageItem, UserAccount } from '../../types';
import { GoogleDriveModal } from '../GoogleDriveModal';

interface CameraScannerToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
  currentUser?: UserAccount | null;
}

export const CameraScannerTool: React.FC<CameraScannerToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
  currentUser,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [attachMode, setAttachMode] = useState<'camera' | 'gallery' | 'drive'>('camera');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  const [docTitle, setDocTitle] = useState('Scanned Document ' + new Date().toLocaleDateString());
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPages, setCapturedPages] = useState<ScannedPageItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'original' | 'magic' | 'bw' | 'grayscale'>('magic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'scanner' | 'memory'>('scanner');

  // Persistent Scan Files Memory Store
  const [scanMemories, setScanMemories] = useState<ScannedDocMemory[]>(() => {
    const saved = localStorage.getItem('rightpdf_scan_file_memory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Save scanMemories to localStorage
  useEffect(() => {
    localStorage.setItem('rightpdf_scan_file_memory', JSON.stringify(scanMemories));
  }, [scanMemories]);

  // Camera Management
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access restriction or fallback:', err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (attachMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [attachMode]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const originalUrl = canvas.toDataURL('image/jpeg', 0.9);
    const filteredUrl = applyFilterToDataUrl(canvas, selectedFilter);

    const newPage: ScannedPageItem = {
      id: Math.random().toString(36).substring(2, 9),
      originalUrl,
      filteredUrl,
      filter: selectedFilter,
      source: 'camera',
    };

    setCapturedPages((prev) => [...prev, newPage]);
  };

  const applyFilterToDataUrl = (
    sourceCanvas: HTMLCanvasElement,
    filter: 'original' | 'magic' | 'bw' | 'grayscale'
  ): string => {
    const ctx = sourceCanvas.getContext('2d');
    if (!ctx) return sourceCanvas.toDataURL('image/jpeg');

    const imgData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const d = imgData.data;

    if (filter === 'grayscale') {
      for (let i = 0; i < d.length; i += 4) {
        const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
        d[i] = avg;
        d[i + 1] = avg;
        d[i + 2] = avg;
      }
    } else if (filter === 'bw') {
      for (let i = 0; i < d.length; i += 4) {
        const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
        const v = avg > 128 ? 255 : 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
      }
    } else if (filter === 'magic') {
      for (let i = 0; i < d.length; i += 4) {
        let r = d[i];
        let g = d[i + 1];
        let b = d[i + 2];
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        gray = gray < 100 ? gray * 0.7 : Math.min(255, gray * 1.25);
        d[i] = gray;
        d[i + 1] = gray;
        d[i + 2] = gray;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return sourceCanvas.toDataURL('image/jpeg', 0.9);
  };

  // Attach option: Mobile Photo Gallery
  const handleFileUploadGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target!.result as string;
          const newPage: ScannedPageItem = {
            id: Math.random().toString(36).substring(2, 9),
            originalUrl: dataUrl,
            filteredUrl: dataUrl,
            filter: 'original',
            source: 'gallery',
          };
          setCapturedPages((prev) => [...prev, newPage]);
        }
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  // Attach option: Google Drive
  const handleSelectDriveFiles = (dataUrls: string[], titles: string[]) => {
    const newPages: ScannedPageItem[] = dataUrls.map((url, i) => ({
      id: Math.random().toString(36).substring(2, 9),
      originalUrl: url,
      filteredUrl: url,
      filter: 'original',
      source: 'drive',
    }));

    if (titles.length > 0) {
      setDocTitle(titles[0].replace(/\.[^/.]+$/, ''));
    }

    setCapturedPages((prev) => [...prev, ...newPages]);
  };

  // Save current active scan project into persistent memory
  const handleSaveScanToMemory = () => {
    if (capturedPages.length === 0) return;

    const memoryItem: ScannedDocMemory = {
      id: Math.random().toString(36).substring(2, 9),
      docTitle: docTitle || 'Scanned File',
      pages: capturedPages,
      timestamp: Date.now(),
      ownerEmail: currentUser?.email,
    };

    setScanMemories((prev) => [memoryItem, ...prev]);
    confetti({ particleCount: 50, spread: 40 });
    setActiveTab('memory');
  };

  // Load a scan file memory back into active scanner workspace
  const handleLoadScanMemory = (memory: ScannedDocMemory) => {
    setDocTitle(memory.docTitle);
    setCapturedPages(memory.pages);
    setActiveTab('scanner');
  };

  // Delete a scan file memory
  const handleDeleteScanMemory = (id: string) => {
    setScanMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Generate & Export final PDF Document
  const handleCompilePdf = async () => {
    if (capturedPages.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfBytes = await convertImagesToPdf(
        capturedPages.map((p) => ({ dataUrl: p.filteredUrl })),
        { pageSize: 'a4', orientation: 'portrait', margin: 10 }
      );

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `${docTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`;

      confetti({ particleCount: 70, spread: 50 });

      // Save to global history
      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: `Scan: ${docTitle}`,
        toolId: 'camera-scanner',
        timestamp: Date.now(),
        sizeBytes: pdfBytes.length,
        dataUrl,
        fileName,
      });

      // Also preserve in scan memory store with compiled PDF data URL
      const memoryItem: ScannedDocMemory = {
        id: Math.random().toString(36).substring(2, 9),
        docTitle: docTitle || 'Scanned File',
        pages: capturedPages,
        pdfDataUrl: dataUrl,
        pdfFileName: fileName,
        sizeBytes: pdfBytes.length,
        timestamp: Date.now(),
        ownerEmail: currentUser?.email,
      };

      setScanMemories((prev) => [memoryItem, ...prev]);

      onOpenPreview(dataUrl, fileName, pdfBytes.length);
    } catch (err) {
      console.error('Scan PDF compile error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
        <button
          onClick={() => {
            stopCamera();
            onBack();
          }}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            Document Camera & Multi-Source Scanner
          </h2>
        </div>

        {/* Workspace vs Memory Vault Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'scanner'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Active Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'memory'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Scan Memory ({scanMemories.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'scanner' ? (
        <div className="space-y-6">
          {/* Attach Option Mode Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Attach Source:
              </span>

              {/* Camera Tab */}
              <button
                onClick={() => setAttachMode('camera')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  attachMode === 'camera'
                    ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-300 dark:border-red-900 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Live Camera</span>
              </button>

              {/* Gallery Tab */}
              <label
                onClick={() => setAttachMode('gallery')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  attachMode === 'gallery'
                    ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-300 dark:border-red-900 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUploadGallery}
                  className="hidden"
                />
                <ImageIcon className="w-4 h-4" />
                <span>Mobile Gallery</span>
              </label>

              {/* Google Drive Tab */}
              <button
                onClick={() => {
                  setAttachMode('drive');
                  setIsDriveModalOpen(true);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  attachMode === 'drive'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-900 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <HardDrive className="w-4 h-4 text-blue-500" />
                <span>Google Drive</span>
              </button>
            </div>

            {/* Document Title Header */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                File Title:
              </span>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-red-500/50 focus:outline-none w-full sm:w-56"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Capture Stream / Gallery Uploader */}
            <div className="lg:col-span-2 space-y-4">
              {attachMode === 'camera' && (
                <div className="relative aspect-[4/3] rounded-2xl bg-slate-900 overflow-hidden shadow-xl border border-slate-800 flex items-center justify-center">
                  <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />

                  {!isCameraActive && (
                    <div className="absolute inset-0 bg-slate-900/90 p-6 flex flex-col items-center justify-center text-center text-slate-300 space-y-3">
                      <Camera className="w-12 h-12 text-slate-500 mb-1" />
                      <p className="text-sm font-semibold">Live Camera Standby</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Grant web camera permission or use the Gallery / Google Drive attach options above.
                      </p>

                      <button
                        onClick={startCamera}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md"
                      >
                        Activate Camera Stream
                      </button>
                    </div>
                  )}

                  {isCameraActive && (
                    <div className="absolute inset-8 border-2 border-dashed border-red-500/60 rounded-xl pointer-events-none flex items-center justify-center">
                      <span className="text-xs font-bold text-red-400 bg-slate-900/70 px-3 py-1 rounded-full backdrop-blur-md">
                        Align Document inside frame
                      </span>
                    </div>
                  )}
                </div>
              )}

              {attachMode === 'gallery' && (
                <div className="relative border-2 border-dashed border-red-300 dark:border-red-900/60 hover:border-red-500 rounded-2xl p-10 text-center bg-red-50/30 dark:bg-red-950/20 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUploadGallery}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <ImageIcon className="w-12 h-12 text-red-600 mx-auto" />
                  <p className="mt-3 font-bold text-sm text-slate-900 dark:text-white">
                    Tap to Select Photos from Mobile / Photo Gallery
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports selecting multiple camera photos at once.
                  </p>
                </div>
              )}

              {attachMode === 'drive' && (
                <div className="p-8 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border-2 border-dashed border-blue-300 dark:border-blue-900 text-center space-y-3">
                  <HardDrive className="w-12 h-12 text-blue-600 mx-auto" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    Google Drive Scanner Integration
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Attach files from your connected Google Drive account, cloud documents, or shareable link.
                  </p>
                  <button
                    onClick={() => setIsDriveModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                  >
                    Open Google Drive Picker
                  </button>
                </div>
              )}

              {/* Filter Controls & Snap Button (when camera active) */}
              {attachMode === 'camera' && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {[
                      { id: 'magic', label: 'Magic Color' },
                      { id: 'bw', label: 'B&W Contrast' },
                      { id: 'grayscale', label: 'Grayscale' },
                      { id: 'original', label: 'Original' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedFilter === f.id
                            ? 'bg-red-600 text-white border-red-600 shadow'
                            : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <button
                    id="btn-snap-photo"
                    onClick={capturePhoto}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-500/30"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Page</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Scanned Pages & Memory Actions */}
            <div className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg h-fit">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-600" />
                  <span>Scanned Pages ({capturedPages.length})</span>
                </h3>

                {capturedPages.length > 0 && (
                  <button
                    onClick={() => setCapturedPages([])}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Scanned pages gallery list */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {capturedPages.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No pages scanned yet. Use Camera, Gallery, or Google Drive above to attach pages.
                  </div>
                ) : (
                  capturedPages.map((page, index) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={page.filteredUrl}
                          alt={`Page ${index + 1}`}
                          className="w-12 h-16 object-cover rounded-md border border-slate-300 dark:border-slate-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Page #{index + 1}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-400 capitalize px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">
                            {page.source} • {page.filter}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setCapturedPages((prev) => prev.filter((p) => p.id !== page.id))
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Primary Actions */}
              <div className="space-y-2 pt-2">
                <button
                  id="btn-compile-scanned-pdf"
                  onClick={handleCompilePdf}
                  disabled={capturedPages.length === 0 || isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs transition-all shadow-lg shadow-red-500/25 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Generate Scanned PDF ({capturedPages.length} Pages)</span>
                </button>

                <button
                  onClick={handleSaveScanToMemory}
                  disabled={capturedPages.length === 0}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Save className="w-4 h-4 text-emerald-600" />
                  <span>Save Scan File to Memory Vault</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Memory Vault Tab View */
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Scan Document Memory Vault</span>
              </h3>
              <p className="text-xs text-slate-400">
                All multi-page scan files preserved with complete page structures and export options.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('scanner')}
              className="px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Scan Session</span>
            </button>
          </div>

          {scanMemories.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
              <FolderDown className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                No scan file memories stored yet
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Scan pages using camera or upload from gallery / drive and click "Save Scan File to Memory Vault" to preserve them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scanMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {mem.docTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {mem.pages.length} Scanned Page(s) • {new Date(mem.timestamp).toLocaleString()}
                      </p>
                      {mem.ownerEmail && (
                        <p className="text-[10px] text-red-600 dark:text-red-400 font-mono mt-0.5">
                          Owner: {mem.ownerEmail}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteScanMemory(mem.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete scan memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Page previews row */}
                  <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    {mem.pages.slice(0, 5).map((page, i) => (
                      <img
                        key={page.id || i}
                        src={page.filteredUrl}
                        alt={`Page ${i + 1}`}
                        className="w-12 h-16 object-cover rounded border border-slate-200 dark:border-slate-700 flex-shrink-0"
                      />
                    ))}
                    {mem.pages.length > 5 && (
                      <div className="w-12 h-16 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        +{mem.pages.length - 5}
                      </div>
                    )}
                  </div>

                  {/* Memory Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 gap-2">
                    <button
                      onClick={() => handleLoadScanMemory(mem)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-red-600" />
                      <span>Continue Scan</span>
                    </button>

                    {mem.pdfDataUrl && (
                      <a
                        href={mem.pdfDataUrl}
                        download={mem.pdfFileName || 'scanned_doc.pdf'}
                        className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 text-center shadow"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Google Drive Picker Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onSelectDriveFiles={handleSelectDriveFiles}
      />
    </div>
  );
};
