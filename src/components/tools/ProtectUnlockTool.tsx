import React, { useState } from 'react';
import { Upload, Lock, Unlock, ArrowLeft, ShieldCheck, Key } from 'lucide-react';
import confetti from 'canvas-confetti';
import { protectPdfWithPassword, formatBytes } from '../../utils/pdfEngine';
import { ProcessedHistoryItem } from '../../types';

interface ProtectUnlockToolProps {
  mode: 'protect' | 'unlock';
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const ProtectUnlockTool: React.FC<ProtectUnlockToolProps> = ({
  mode,
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [fileData, setFileData] = useState<{ name: string; size: number; buffer: Uint8Array } | null>(
    null
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleAction = async () => {
    if (!fileData) return;
    if (mode === 'protect' && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsProcessing(true);

    try {
      const resultBytes = await protectPdfWithPassword(fileData.buffer, password);

      const blob = new Blob([resultBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `${mode === 'protect' ? 'protected' : 'unlocked'}_${Date.now()}.pdf`;

      confetti({ particleCount: 70, spread: 50 });

      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: mode === 'protect' ? 'Protect PDF' : 'Unlock PDF',
        toolId: mode === 'protect' ? 'protect-pdf' : 'unlock-pdf',
        timestamp: Date.now(),
        sizeBytes: resultBytes.length,
        dataUrl,
        fileName,
      });

      onOpenPreview(dataUrl, fileName, resultBytes.length);
    } catch (err) {
      console.error('Password operation error', err);
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
            {mode === 'protect' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            {mode === 'protect' ? 'Protect PDF with Password' : 'Unlock Encrypted PDF'}
          </h2>
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
            {mode === 'protect' ? 'Select PDF to Password Protect' : 'Select Protected PDF to Unlock'}
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{fileData.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(fileData.size)}</p>
            </div>
            <button
              onClick={() => setFileData(null)}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Change File
            </button>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {mode === 'protect' ? 'Set Password' : 'Enter PDF Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>

            {mode === 'protect' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            )}
          </div>

          <button
            id="btn-protect-unlock-action"
            onClick={handleAction}
            disabled={!password || isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
          >
            {mode === 'protect' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            <span>{mode === 'protect' ? 'Apply Password Protection' : 'Unlock PDF Document'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
