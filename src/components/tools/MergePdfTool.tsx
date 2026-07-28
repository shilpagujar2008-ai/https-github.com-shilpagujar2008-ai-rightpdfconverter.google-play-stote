import React, { useState } from 'react';
import { Upload, Merge, Trash2, ArrowUp, ArrowDown, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { mergePdfFiles, formatBytes } from '../../utils/pdfEngine';
import { ProcessedHistoryItem } from '../../types';

interface MergePdfToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const MergePdfTool: React.FC<MergePdfToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [pdfFiles, setPdfFiles] = useState<{ id: string; name: string; size: number; buffer: Uint8Array }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const buffer = new Uint8Array(event.target.result as ArrayBuffer);
          setPdfFiles((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              name: file.name,
              size: file.size,
              buffer,
            },
          ]);
        }
      };
      reader.readAsArrayBuffer(file as Blob);
    });
  };

  const removeFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...pdfFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pdfFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setPdfFiles(newFiles);
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) return;
    setIsProcessing(true);

    try {
      const mergedBytes = await mergePdfFiles(pdfFiles.map((f) => f.buffer));

      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `merged_document_${Date.now()}.pdf`;

      confetti({ particleCount: 70, spread: 60 });

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: 'Merge PDF',
        toolId: 'merge-pdf',
        timestamp: Date.now(),
        sizeBytes: mergedBytes.length,
        dataUrl,
        fileName,
      });

      onOpenPreview(dataUrl, fileName, mergedBytes.length);
    } catch (err) {
      console.error('Failed to merge PDFs', err);
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
            <Merge className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Merge PDF Files</h2>
        </div>
      </div>

      {/* File Upload Dropzone */}
      <div className="relative border-2 border-dashed border-red-300 dark:border-red-900/60 hover:border-red-500 rounded-2xl p-8 text-center bg-red-50/40 dark:bg-red-950/20 transition-all cursor-pointer group">
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        />
        <div className="w-14 h-14 mx-auto rounded-2xl bg-white dark:bg-slate-800 text-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <p className="mt-4 font-bold text-slate-900 dark:text-white">
          Select multiple PDF files to merge
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Drag and drop PDF files or click to browse.
        </p>
      </div>

      {/* Selected PDF List */}
      {pdfFiles.length > 0 && (
        <div className="space-y-3 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Files to Merge ({pdfFiles.length})
            </span>
            <button onClick={() => setPdfFiles([])} className="text-xs text-red-600 hover:underline">
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {pdfFiles.map((file, idx) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-950 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <FileText className="w-5 h-5 text-red-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => moveFile(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFile(idx, 'down')}
                    disabled={idx === pdfFiles.length - 1}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Action Button */}
          <button
            id="btn-merge-pdfs"
            onClick={handleMerge}
            disabled={pdfFiles.length < 2 || isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            <Merge className="w-5 h-5" />
            <span>Merge {pdfFiles.length} PDF Files</span>
          </button>
        </div>
      )}
    </div>
  );
};
