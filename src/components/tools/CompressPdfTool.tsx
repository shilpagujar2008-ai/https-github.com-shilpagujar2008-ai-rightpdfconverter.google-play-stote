import React, { useState } from 'react';
import { Upload, FileArchive, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { compressPdfFile, formatBytes } from '../../utils/pdfEngine';
import { ProcessedHistoryItem } from '../../types';

interface CompressPdfToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const CompressPdfTool: React.FC<CompressPdfToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [fileData, setFileData] = useState<{
    name: string;
    size: number;
    buffer: Uint8Array;
  } | null>(null);
  const [level, setLevel] = useState<'recommended' | 'extreme' | 'low'>('recommended');
  const [isCompressing, setIsCompressing] = useState(false);

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

  const handleCompress = async () => {
    if (!fileData) return;
    setIsCompressing(true);

    try {
      const compressedBytes = await compressPdfFile(fileData.buffer, level);

      const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `compressed_${Date.now()}.pdf`;

      confetti({ particleCount: 70, spread: 50 });

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: 'Compress PDF',
        toolId: 'compress-pdf',
        timestamp: Date.now(),
        sizeBytes: compressedBytes.length,
        dataUrl,
        fileName,
      });

      onOpenPreview(dataUrl, fileName, compressedBytes.length);
    } catch (err) {
      console.error('PDF Compress error', err);
    } finally {
      setIsCompressing(false);
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
            <FileArchive className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Compress PDF File</h2>
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
            Upload PDF to Optimize & Compress Size
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reduce PDF file size without losing document readability.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{fileData.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Original Size: <strong className="text-slate-700 dark:text-slate-200">{formatBytes(fileData.size)}</strong>
              </p>
            </div>
            <button
              onClick={() => setFileData(null)}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Change File
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Compression Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'recommended',
                  title: 'Recommended',
                  desc: 'Optimal balance between quality & file size reduction',
                  tag: 'Best Choice',
                },
                {
                  id: 'extreme',
                  title: 'Extreme Compression',
                  desc: 'Maximum size reduction for fast sharing',
                  tag: 'Smallest Size',
                },
                {
                  id: 'low',
                  title: 'Less Compression',
                  desc: 'High quality print optimization with mild compression',
                  tag: 'High Quality',
                },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setLevel(p.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    level === p.id
                      ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 shadow-md ring-2 ring-red-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-600">
                    {p.tag}
                  </span>
                  <p className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            id="btn-compress-pdf-action"
            onClick={handleCompress}
            disabled={isCompressing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            <span>Compress PDF File Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
