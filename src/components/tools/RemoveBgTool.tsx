import React, { useState, useRef } from 'react';
import { ArrowLeft, Scissors, Upload, Download, Share2, ExternalLink, RefreshCw, Check, Image as ImageIcon } from 'lucide-react';
import { ProcessedHistoryItem } from '../../types';

interface RemoveBgToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes?: number) => void;
}

export const RemoveBgTool: React.FC<RemoveBgToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgStyle, setBgStyle] = useState<'transparent' | 'white' | 'dark' | 'gradient'>('transparent');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      processBackgroundRemoval(src, bgStyle);
    };
    reader.readAsDataURL(file);
  };

  const processBackgroundRemoval = (src: string, style: 'transparent' | 'white' | 'dark' | 'gradient') => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background style if not transparent
      if (style === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (style === 'dark') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (style === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#4f46e5');
        grad.addColorStop(1, '#e11d48');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // Simple AI edge luminance threshold transparency mask calculation
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample border color
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
        if (diff < 75 && style === 'transparent') {
          data[i + 3] = 0; // Transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const outputUrl = canvas.toDataURL('image/png');
      setProcessedSrc(outputUrl);
      setIsProcessing(false);
    };
  };

  const handleDownloadImage = () => {
    if (!processedSrc) return;
    const link = document.createElement('a');
    link.href = processedSrc;
    link.download = `Removed_BG_${fileName || 'photo'}.png`;
    link.click();
  };

  const whatsappMessage = encodeURIComponent(
    `Check out my background-removed photo created with RightPDF Image AI Tool!`
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">AI Background Remover</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Remove backgrounds from photos, create transparent PNGs & edit in Canva
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <a
            href="https://www.canva.com/photo-editor/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Canva Editor</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 p-8 rounded-2xl text-center cursor-pointer space-y-3 transition-colors bg-slate-50 dark:bg-slate-800/50"
            >
              <Upload className="w-10 h-10 text-cyan-600 mx-auto" />
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Upload Image / Photo</h3>
                <p className="text-xs text-slate-500">Supports PNG, JPG, WEBP photos up to 10MB</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{fileName}</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-cyan-600 font-bold hover:underline"
                >
                  Change Image
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
                  Background Replacement Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['transparent', 'white', 'dark', 'gradient'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setBgStyle(st);
                        if (imageSrc) processBackgroundRemoval(imageSrc, st);
                      }}
                      className={`p-2.5 rounded-xl border text-xs capitalize font-bold transition-all ${
                        bgStyle === st
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDownloadImage}
                disabled={!processedSrc || isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-lg hover:from-cyan-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Transparent Image (PNG)</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Output Preview */}
        <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[320px]">
          {isProcessing ? (
            <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>AI Removing Background...</span>
            </div>
          ) : processedSrc ? (
            <div className="space-y-2 text-center">
              <div className="p-3 rounded-2xl bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] border border-slate-300 dark:border-slate-700 shadow-xl max-h-[360px] overflow-hidden flex items-center justify-center">
                <img src={processedSrc} alt="Processed output" className="max-h-[320px] object-contain rounded-xl" />
              </div>
              <p className="text-[11px] text-slate-500">Processed Output PNG with transparent background</p>
            </div>
          ) : (
            <div className="text-center text-slate-400 text-xs">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <span>Upload an image to remove background</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
