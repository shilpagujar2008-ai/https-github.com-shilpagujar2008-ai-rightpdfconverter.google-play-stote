import React, { useState } from 'react';
import { Upload, Stamp, ArrowLeft, Type, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { watermarkPdf, formatBytes } from '../../utils/pdfEngine';
import { ProcessedHistoryItem } from '../../types';

interface WatermarkToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const WatermarkTool: React.FC<WatermarkToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [fileData, setFileData] = useState<{ name: string; size: number; buffer: Uint8Array } | null>(
    null
  );
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState<number>(42);
  const [opacity, setOpacity] = useState<number>(0.3);
  const [rotation, setRotation] = useState<number>(45);
  const [colorHex, setColorHex] = useState('#dc2626');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleApplyWatermark = async () => {
    if (!fileData || !watermarkText) return;
    setIsProcessing(true);

    try {
      const watermarkedBytes = await watermarkPdf(fileData.buffer, watermarkText, {
        fontSize,
        opacity,
        rotation,
        colorHex,
      });

      const blob = new Blob([watermarkedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `watermarked_${Date.now()}.pdf`;

      confetti({ particleCount: 70, spread: 50 });

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: 'Watermark PDF',
        toolId: 'watermark-pdf',
        timestamp: Date.now(),
        sizeBytes: watermarkedBytes.length,
        dataUrl,
        fileName,
      });

      onOpenPreview(dataUrl, fileName, watermarkedBytes.length);
    } catch (err) {
      console.error('Watermark error', err);
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
            <Stamp className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Add PDF Watermark</h2>
        </div>
      </div>

      {!fileData ? (
        <div className="relative border-2 border-dashed border-red-300 dark:border-red-900/60 hover:border-red-500 rounded-2xl p-8 text-center bg-red-50/40 dark:bg-red-950/20 transition-all cursor-pointer group">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white dark:bg-slate-800 text-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <p className="mt-4 font-bold text-slate-900 dark:text-white">
            Upload PDF to Add Watermark
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {fileData.name}
              </span>
              <button
                onClick={() => setFileData(null)}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Change File
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Preset Stamps
              </label>
              <div className="flex flex-wrap gap-2">
                {['CONFIDENTIAL', 'APPROVED', 'DRAFT', 'SAMPLE', 'DO NOT COPY'].map((stamp) => (
                  <button
                    key={stamp}
                    onClick={() => setWatermarkText(stamp)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    {stamp}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Custom Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>

            {/* Font Size & Opacity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Font Size ({fontSize}pt)
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Opacity ({Math.round(opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-red-600"
                />
              </div>
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                />
                <span className="text-xs font-mono uppercase text-slate-500">{colorHex}</span>
              </div>
            </div>

            <button
              id="btn-apply-watermark"
              onClick={handleApplyWatermark}
              disabled={!watermarkText || isProcessing}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
            >
              <Stamp className="w-4 h-4" />
              <span>Apply Watermark to PDF</span>
            </button>
          </div>

          {/* Live Stylized Preview */}
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px]">
            <div className="text-center opacity-20 pointer-events-none mb-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">PDF Page Overlay</p>
              <p className="text-lg font-bold text-slate-200">Sample Page Content</p>
            </div>

            {/* Watermark Overlay Simulation */}
            <div
              className="font-bold tracking-wider select-none pointer-events-none transition-all duration-200 text-center"
              style={{
                fontSize: `${fontSize * 0.8}px`,
                color: colorHex,
                opacity,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {watermarkText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
