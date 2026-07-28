import React, { useState, useRef } from 'react';
import { Upload, Edit3, ArrowLeft, Check, RefreshCw, PenTool } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addSignatureToPdf, formatBytes } from '../../utils/pdfEngine';
import { ProcessedHistoryItem } from '../../types';

interface SignAnnotateToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const SignAnnotateTool: React.FC<SignAnnotateToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ name: string; size: number; buffer: Uint8Array } | null>(
    null
  );
  const [targetPageIndex, setTargetPageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Drawing Pad Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureDataUrl(canvasRef.current.toDataURL('image/png'));
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignaturePad = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setSignatureDataUrl(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const buffer = new Uint8Array(event.target.result as ArrayBuffer);
        setFileData({
          name: file.name,
          size: file.size,
          buffer,
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleApplySignature = async () => {
    if (!fileData || !signatureDataUrl) return;
    setIsProcessing(true);

    try {
      const signedBytes = await addSignatureToPdf(
        fileData.buffer,
        signatureDataUrl,
        targetPageIndex,
        { xPercent: 50, yPercent: 20, scale: 0.3 }
      );

      const blob = new Blob([signedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `signed_document_${Date.now()}.pdf`;

      confetti({ particleCount: 70, spread: 50 });

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: 'Sign & Annotate',
        toolId: 'sign-annotate',
        timestamp: Date.now(),
        sizeBytes: signedBytes.length,
        dataUrl,
        fileName,
      });

      onOpenPreview(dataUrl, fileName, signedBytes.length);
    } catch (err) {
      console.error('Signature application error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Digital Sign & Stamp PDF</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Draw Signature Pad */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <PenTool className="w-4 h-4 text-red-600" />
              <span>Step 1: Draw Signature</span>
            </span>

            <button
              onClick={clearSignaturePad}
              className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Pad</span>
            </button>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={400}
              height={180}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="w-full h-44 touch-none"
            />
          </div>
          <p className="text-xs text-slate-400">Use your mouse or touch screen to draw your signature.</p>
        </div>

        {/* Step 2: Upload & Apply */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
          <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-red-600" />
            <span>Step 2: Select PDF to Sign</span>
          </span>

          {!fileData ? (
            <div className="relative border-2 border-dashed border-red-300 dark:border-red-900/60 hover:border-red-500 rounded-xl p-6 text-center bg-red-50/40 dark:bg-red-950/20 transition-all cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <Upload className="w-8 h-8 text-red-600 mx-auto" />
              <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Upload PDF File</p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {fileData.name}
              </span>
              <button
                onClick={() => setFileData(null)}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Change
              </button>
            </div>
          )}

          <button
            id="btn-apply-signature"
            onClick={handleApplySignature}
            disabled={!fileData || !signatureDataUrl || isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs transition-all shadow-lg shadow-red-500/25 disabled:opacity-40 flex items-center justify-center gap-2 mt-4"
          >
            <Check className="w-4 h-4" />
            <span>Apply Signature & Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
