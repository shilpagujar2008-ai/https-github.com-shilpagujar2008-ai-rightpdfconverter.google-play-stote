import React, { useState } from 'react';
import { Upload, Split, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { splitPdfFile, formatBytes } from '../../utils/pdfEngine';
import { ProcessedHistoryItem } from '../../types';

interface SplitPdfToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const SplitPdfTool: React.FC<SplitPdfToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [pdfFile, setPdfFile] = useState<{
    name: string;
    size: number;
    buffer: Uint8Array;
    totalPages: number;
  } | null>(null);
  const [rangeString, setRangeString] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const buffer = new Uint8Array(event.target.result as ArrayBuffer);
        try {
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          const totalPages = doc.getPageCount();

          setPdfFile({
            name: file.name,
            size: file.size,
            buffer,
            totalPages,
          });

          setRangeString(`1-${Math.min(2, totalPages)}`);
        } catch (err) {
          console.error('Failed to load PDF', err);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSplit = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);

    try {
      const splitBytes = await splitPdfFile(pdfFile.buffer, rangeString);

      const blob = new Blob([splitBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `split_pages_${Date.now()}.pdf`;

      confetti({ particleCount: 70, spread: 50 });

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: 'Split PDF',
        toolId: 'split-pdf',
        timestamp: Date.now(),
        sizeBytes: splitBytes.length,
        dataUrl,
        fileName,
      });

      onOpenPreview(dataUrl, fileName, splitBytes.length);
    } catch (err) {
      console.error('Split PDF error', err);
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
            <Split className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Split PDF Document</h2>
        </div>
      </div>

      {/* Upload Zone */}
      {!pdfFile ? (
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
            Select a PDF file to split
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Extract custom page ranges or specific pages.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
          {/* File Selected Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-red-600" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{pdfFile.name}</p>
                <p className="text-xs text-slate-400">
                  {formatBytes(pdfFile.size)} • Total Pages: {pdfFile.totalPages}
                </p>
              </div>
            </div>

            <button
              onClick={() => setPdfFile(null)}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Change File
            </button>
          </div>

          {/* Range Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Page Range to Extract (e.g. 1-3, 5, 7-10)
            </label>
            <input
              type="text"
              value={rangeString}
              onChange={(e) => setRangeString(e.target.value)}
              placeholder="1-3, 5"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
            <p className="text-xs text-slate-400">
              Enter page numbers or ranges separated by commas. Max available pages: 1 to {pdfFile.totalPages}.
            </p>
          </div>

          {/* Split Action */}
          <button
            id="btn-split-pdf"
            onClick={handleSplit}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
          >
            <Split className="w-5 h-5" />
            <span>Extract & Split Specified Pages</span>
          </button>
        </div>
      )}
    </div>
  );
};
