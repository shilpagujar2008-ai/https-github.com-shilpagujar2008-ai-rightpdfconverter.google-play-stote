import React, { useState } from 'react';
import { FileCode, ArrowLeft, Check, Sparkles, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { convertTextToPdf } from '../../utils/pdfEngine';
import { ProcessedHistoryItem } from '../../types';

interface TextToPdfToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const TextToPdfTool: React.FC<TextToPdfToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [docTitle, setDocTitle] = useState('Document Notes');
  const [textContent, setTextContent] = useState(
    `RightPDF Converter Document\n\nDate: ${new Date().toLocaleDateString()}\n\nWelcome to RightPDF Converter!\n\nYou can type or paste any formatted plain text, notes, or structured markdown here to generate a clean, printable PDF document instantly.`
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreatePdf = async () => {
    if (!textContent.trim()) return;
    setIsProcessing(true);

    try {
      const pdfBytes = convertTextToPdf(textContent, docTitle);

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `${docTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`;

      confetti({ particleCount: 70, spread: 50 });

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: 'Text to PDF',
        toolId: 'text-to-pdf',
        timestamp: Date.now(),
        sizeBytes: pdfBytes.length,
        dataUrl,
        fileName,
      });

      onOpenPreview(dataUrl, fileName, pdfBytes.length);
    } catch (err) {
      console.error('Text to PDF error', err);
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
            <FileCode className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Text & Notes to PDF</h2>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Document Header Title
          </label>
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Document Content Body
          </label>
          <textarea
            rows={12}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Type or paste text content here..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        <button
          id="btn-create-text-pdf"
          onClick={handleCreatePdf}
          disabled={!textContent.trim() || isProcessing}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          <span>Generate Formatted PDF Document</span>
        </button>
      </div>
    </div>
  );
};
