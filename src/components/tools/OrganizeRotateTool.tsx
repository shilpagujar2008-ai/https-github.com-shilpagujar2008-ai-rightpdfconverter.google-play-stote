import React, { useState } from 'react';
import { Upload, RotateCw, Trash2, ArrowLeft, ArrowUp, ArrowDown, FileText, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { organizePdfPages, formatBytes } from '../../utils/pdfEngine';
import { ProcessedHistoryItem } from '../../types';

interface OrganizeRotateToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const OrganizeRotateTool: React.FC<OrganizeRotateToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [pdfBuffer, setPdfBuffer] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState('');
  const [pages, setPages] = useState<{ originalIndex: number; rotation: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const buffer = new Uint8Array(event.target.result as ArrayBuffer);
        try {
          const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          const total = pdfDoc.getPageCount();

          const pageItems = Array.from({ length: total }, (_, i) => ({
            originalIndex: i,
            rotation: 0,
          }));

          setPdfBuffer(buffer);
          setFileName(file.name);
          setPages(pageItems);
        } catch (err) {
          console.error('Failed to load PDF for organize', err);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const rotatePage = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= pages.length) return;
    const newPages = [...pages];
    const temp = newPages[index];
    newPages[index] = newPages[target];
    newPages[target] = temp;
    setPages(newPages);
  };

  const deletePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!pdfBuffer || pages.length === 0) return;
    setIsProcessing(true);

    try {
      const organizedBytes = await organizePdfPages(
        pdfBuffer,
        pages.map((p) => ({ pageIndex: p.originalIndex, rotation: p.rotation }))
      );

      const blob = new Blob([organizedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const outFileName = `organized_${Date.now()}.pdf`;

      confetti({ particleCount: 70, spread: 50 });

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: 'Organize & Rotate',
        toolId: 'organize-rotate',
        timestamp: Date.now(),
        sizeBytes: organizedBytes.length,
        dataUrl,
        fileName: outFileName,
      });

      onOpenPreview(dataUrl, outFileName, organizedBytes.length);
    } catch (err) {
      console.error('Save organized PDF error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
            <RotateCw className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Organize & Rotate Pages</h2>
        </div>
      </div>

      {!pdfBuffer ? (
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
            Upload PDF to Rotate or Reorder Pages
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reorder pages, delete unwanted pages, or rotate individual pages.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Bar & Controls */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{fileName}</p>
                <p className="text-xs text-slate-400">{pages.length} Pages Remaining</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPdfBuffer(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Change File
              </button>
              <button
                id="btn-save-organized-pdf"
                onClick={handleSave}
                disabled={pages.length === 0 || isProcessing}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                Save PDF Changes
              </button>
            </div>
          </div>

          {/* Pages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex flex-col justify-between"
              >
                <div className="h-40 rounded-xl bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                  <div
                    className="p-4 bg-white dark:bg-slate-800 shadow-sm rounded-lg text-center transition-transform duration-200"
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                  >
                    <FileText className="w-10 h-10 text-red-600 mx-auto" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Page {p.originalIndex + 1}
                    </span>
                  </div>

                  {p.rotation !== 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                      {p.rotation}°
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => rotatePage(idx)}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePage(idx, 'down')}
                      disabled={idx === pages.length - 1}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => deletePage(idx)}
                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
