import React, { useState } from 'react';
import { X, Download, Printer, ZoomIn, ZoomOut, FileText, CheckCircle2, Mail } from 'lucide-react';
import { formatBytes } from '../utils/pdfEngine';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfDataUrl: string | null;
  fileName: string;
  fileSizeBytes?: number;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfDataUrl,
  fileName,
  fileSizeBytes,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen || !pdfDataUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = fileName || 'converted_document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open(pdfDataUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[85vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-sm truncate">{fileName}</h3>
              {fileSizeBytes && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ready ({formatBytes(fileSizeBytes)})</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-1 text-slate-300">
              <button
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-2">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Share on WhatsApp */}
            <a
              id="btn-whatsapp-share-preview"
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Here is my document "${fileName}" created with RightPDF!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
              title="Share document link via WhatsApp"
            >
              <span className="text-sm font-bold">WhatsApp</span>
            </a>

            {/* Share via Gmail */}
            <a
              id="btn-gmail-share-preview"
              href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${encodeURIComponent(`Document: ${fileName}`)}&body=${encodeURIComponent(`Here is my document "${fileName}" created with RightPDF!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md"
              title="Compose email in Gmail"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm font-bold">Gmail</span>
            </a>

            {/* Open in Canva */}
            <a
              id="btn-canva-edit-preview"
              href="https://www.canva.com/design"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-md"
              title="Open Canva Design Studio"
            >
              <span className="text-sm font-bold">Canva</span>
            </a>

            {/* Download Button */}
            <button
              id="btn-download-pdf-preview"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Object Viewport */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 overflow-auto flex items-center justify-center">
          <div
            className="w-full h-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <iframe
              src={`${pdfDataUrl}#toolbar=0&navpanes=0`}
              title="PDF Preview"
              className="w-full h-full min-h-[500px] border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
