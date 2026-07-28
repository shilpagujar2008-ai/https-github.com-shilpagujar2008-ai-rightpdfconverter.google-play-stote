import React, { useState } from 'react';
import { X, HardDrive, Check, Search, FileText, Image as ImageIcon, Link as LinkIcon, Sparkles } from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDriveFiles: (dataUrls: string[], titles: string[]) => void;
}

const SAMPLE_DRIVE_DOCUMENTS = [
  {
    id: 'drive-1',
    title: 'Business Contract 2026.pdf',
    type: 'pdf',
    size: '1.4 MB',
    modified: '2 hours ago',
    // Generate realistic document canvas snapshot
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 800);
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('GOOGLE DRIVE ATTACHED DOC', 40, 60);
        ctx.fillStyle = '#4285F4';
        ctx.fillRect(40, 80, 520, 4);
        ctx.fillStyle = '#64748b';
        ctx.font = '16px sans-serif';
        ctx.fillText('Service Agreement & Terms of Execution', 40, 120);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(40, 150, 520, 580);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px monospace';
        ctx.fillText('[Google Drive Cloud Document Page #1]', 120, 400);
      }
      return canvas.toDataURL('image/jpeg', 0.9);
    },
  },
  {
    id: 'drive-2',
    title: 'Scanned Invoice #9042.jpg',
    type: 'image',
    size: '850 KB',
    modified: 'Yesterday',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 800);
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('TAX INVOICE - DRAG & SCAN', 40, 70);
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(40, 100, 520, 640);
        ctx.fillStyle = '#475569';
        ctx.font = '16px monospace';
        ctx.fillText('Item: Cloud Sync Storage', 70, 160);
        ctx.fillText('Amount: $149.00 PAID', 70, 200);
      }
      return canvas.toDataURL('image/jpeg', 0.9);
    },
  },
  {
    id: 'drive-3',
    title: 'ID Card Front & Back Scan.png',
    type: 'image',
    size: '2.1 MB',
    modified: '3 days ago',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 800);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(40, 40, 520, 300);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('NATIONAL IDENTIFICATION CARD', 60, 90);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(60, 120, 100, 130);
        ctx.font = '14px sans-serif';
        ctx.fillText('Name: Verified Holder', 180, 150);
        ctx.fillText('ID No: 8842-1092-49', 180, 180);
      }
      return canvas.toDataURL('image/jpeg', 0.9);
    },
  },
];

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  onSelectDriveFiles,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['drive-1']);
  const [searchQuery, setSearchQuery] = useState('');
  const [driveUrlInput, setDriveUrlInput] = useState('');

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleImportSelected = () => {
    const selectedDocs = SAMPLE_DRIVE_DOCUMENTS.filter((doc) => selectedIds.includes(doc.id));
    const urls = selectedDocs.map((doc) => doc.generateDataUrl());
    const titles = selectedDocs.map((doc) => doc.title);
    onSelectDriveFiles(urls, titles);
    onClose();
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrlInput.trim()) return;

    // Create a mock imported document from the link
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, 800);
      ctx.fillStyle = '#4285F4';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('IMPORTED FROM GOOGLE DRIVE LINK', 40, 60);
      ctx.fillStyle = '#64748b';
      ctx.font = '13px monospace';
      ctx.fillText(`URL: ${driveUrlInput.substring(0, 45)}...`, 40, 90);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(40, 120, 520, 620);
    }

    onSelectDriveFiles([canvas.toDataURL('image/jpeg', 0.9)], ['Drive Linked Document.pdf']);
    setDriveUrlInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900">
              <svg className="w-5 h-5" viewBox="0 0 87.3 78">
                <path
                  fill="#4285F4"
                  d="M6.6 66.85l12.8 22.2c1.3 2.2 3.1 3.9 5.3 5.1L54.1 42.6 24.7 0H0l6.6 66.85z"
                  transform="scale(0.8)"
                />
                <path
                  fill="#0F9D58"
                  d="M43.65 25L24.7 0l-12.8 22.2c-1.3 2.2-1.9 4.7-1.9 7.2v51.3l29.4-50.8h4.25z"
                  transform="scale(0.8)"
                />
                <path
                  fill="#FFC107"
                  d="M73.55 78c2.2 0 4.5-.6 6.5-1.7l12.8-22.2c1.3-2.2 1.9-4.7 1.9-7.2h-58.8l12.8 22.2c1.3 2.2 3.1 3.9 5.3 5.1h19.5z"
                  transform="scale(0.8)"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                Google Drive Scanner Attachment
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Select documents directly from your Google Drive storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Search Drive */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Google Drive scans and documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            />
          </div>

          {/* Document list */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {SAMPLE_DRIVE_DOCUMENTS.filter((doc) =>
              doc.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((doc) => {
              const isSelected = selectedIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleSelect(doc.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-900 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        doc.type === 'pdf'
                          ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                          : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                      }`}
                    >
                      {doc.type === 'pdf' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{doc.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {doc.size} • Modified {doc.modified}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drive Share Link */}
          <form onSubmit={handleUrlSubmit} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Or import via Google Drive Shareable Link</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                value={driveUrlInput}
                onChange={(e) => setDriveUrlInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!driveUrlInput.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors disabled:opacity-40"
              >
                Import Link
              </button>
            </div>
          </form>

          {/* Action button */}
          <button
            onClick={handleImportSelected}
            disabled={selectedIds.length === 0}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <HardDrive className="w-4 h-4" />
            <span>Attach {selectedIds.length} Google Drive File(s) to Scanner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
