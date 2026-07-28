import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Bot,
  FileText,
  Edit3,
  RotateCw,
  Crown,
  MoreVertical,
  X,
  Plus,
  Star,
  Eye,
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  Lock,
  Scissors,
  Minimize2,
  FileSpreadsheet,
  FileCode,
  Combine,
  KeyRound,
  FileCheck2,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { ToolId, ProcessedHistoryItem, UserAccount } from '../types';
import { RightPdfLogo } from './RightPdfLogo';

interface HomeScreenProps {
  currentUser: UserAccount | null;
  onSelectTool: (toolId: ToolId) => void;
  historyItems: ProcessedHistoryItem[];
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
  onOpenGeminiAi: () => void;
  onOpenPricing?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  onSelectTool,
  historyItems,
  onOpenPreview,
  onOpenGeminiAi,
  onOpenPricing,
}) => {
  const [showSpacesCard, setShowSpacesCard] = useState(true);
  const [activeFileTab, setActiveFileTab] = useState<'recent' | 'starred' | 'device'>('recent');
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userName = currentUser ? currentUser.name.split(' ')[0] : 'Shilpa';

  // Sample files matching the screenshot + live conversion history
  const sampleFiles: ProcessedHistoryItem[] = [
    {
      id: 'sample-1',
      title: 'Scanned_Doc_Receipt.pdf',
      toolId: 'camera-scanner',
      timestamp: Date.now() - 3600000 * 3,
      sizeBytes: 409702,
      fileName: 'Scanned_Doc_Receipt.pdf',
    },
    {
      id: 'sample-2',
      title: 'Image_Converted_Doc.pdf',
      toolId: 'image-to-pdf',
      timestamp: Date.now() - 86400000,
      sizeBytes: 1562310,
      fileName: 'Image_Converted_Doc.pdf',
    },
  ];

  const allDisplayFiles = [...historyItems, ...sampleFiles];

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const formatTime = (ts: number) => {
    const diffHours = (Date.now() - ts) / (1000 * 3600);
    if (diffHours < 24) {
      const d = new Date(ts);
      return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
    return 'Yesterday';
  };

  const handleOpenPdfClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onOpenPreview(result, file.name, file.size);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredFiles = allDisplayFiles.filter((file) => {
    if (activeFileTab === 'starred') return starredIds.includes(file.id);
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf,image/*"
        className="hidden"
      />

      {/* Top Welcome Greeting */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome, {userName} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            Your all-in-one PDF scanner, image converter & editor suite
          </p>
        </div>
      </div>

      {/* LAYOUT 1 - BLUE CORPORATE HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white p-6 sm:p-8 shadow-2xl border border-blue-400/30">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-3">
              <RightPdfLogo size="md" showText={false} />
              <button
                onClick={onOpenPricing}
                className="px-3.5 py-1.5 rounded-full bg-blue-900/60 hover:bg-blue-900/90 backdrop-blur-md text-amber-300 font-black text-xs border border-amber-300/30 flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-300" />
                <span>RightPDF Converter PRO (Buying Plans)</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Fast, Private & Powerful PDF Tools
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              All PDF tools you need in one place. 100% secure, offline-capable and easy to use.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenPdfClick}
                className="px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <span>Open PDF</span>
              </button>

              <button
                onClick={() => onSelectTool('camera-scanner')}
                className="px-5 py-3 rounded-xl bg-blue-500/40 hover:bg-blue-500/60 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm border border-white/30 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-white" />
                <span>Scan PDF</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative flex-shrink-0">
            <RightPdfLogo size="xl" showText={false} className="shadow-2xl hover:scale-110 transition-all" />
          </div>
        </div>
      </div>

      {/* TOP 3 PRIMARY TOOLS FEATURED ON FRONT PAGE (As requested) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Primary Front Tools</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              Free Access
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. SCAN TO PDF */}
          <div
            onClick={() => onSelectTool('camera-scanner')}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                Front Tool 1
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-white">Scan to PDF</h4>
              <p className="mt-1 text-xs text-cyan-100 line-clamp-2">
                Use your camera or device to auto-scan documents into crisp PDF files.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>Start Scanning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. IMAGE TO PDF */}
          <div
            onClick={() => onSelectTool('image-to-pdf')}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-pink-500/25 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                Front Tool 2
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-white">Image to PDF</h4>
              <p className="mt-1 text-xs text-pink-100 line-clamp-2">
                Convert JPG, PNG, WEBP photos into a single organized PDF document.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>Convert Images</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. PDF EDITOR FREE */}
          <div
            onClick={() => onSelectTool('sign-annotate')}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0">
                <Edit3 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow">
                100% Free
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-white">PDF Editor (Free)</h4>
              <p className="mt-1 text-xs text-emerald-100 line-clamp-2">
                Sign, annotate, draw, insert text and edit your PDF pages for free.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
              <span>Open Editor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CONVERSION TOOL GRID (Matching Layout 1 screenshot) */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          All Quick PDF Tools
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* PDF to Word */}
          <div
            onClick={() => onSelectTool('pdf-to-word')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0 font-extrabold text-xs">
              DOC
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 truncate">
                PDF to Word
              </h4>
              <p className="text-[10px] text-slate-500 truncate">Editable DOCX</p>
            </div>
          </div>

          {/* PDF to Excel */}
          <div
            onClick={() => onSelectTool('pdf-to-excel')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 truncate">
                PDF to Excel
              </h4>
              <p className="text-[10px] text-slate-500 truncate">Spreadsheets</p>
            </div>
          </div>

          {/* Merge PDF */}
          <div
            onClick={() => onSelectTool('merge-pdf')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
              <Combine className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 truncate">
                Merge PDF
              </h4>
              <p className="text-[10px] text-slate-500 truncate">Combine files</p>
            </div>
          </div>

          {/* Split PDF */}
          <div
            onClick={() => onSelectTool('split-pdf')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 truncate">
                Split PDF
              </h4>
              <p className="text-[10px] text-slate-500 truncate">Extract pages</p>
            </div>
          </div>

          {/* Compress PDF */}
          <div
            onClick={() => onSelectTool('compress-pdf')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
              <Minimize2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-purple-600 truncate">
                Compress PDF
              </h4>
              <p className="text-[10px] text-slate-500 truncate">Reduce file size</p>
            </div>
          </div>

          {/* PDF to Image */}
          <div
            onClick={() => onSelectTool('pdf-to-image')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 truncate">
                PDF to Image
              </h4>
              <p className="text-[10px] text-slate-500 truncate">Export JPG/PNG</p>
            </div>
          </div>

          {/* Protect PDF */}
          <div
            onClick={() => onSelectTool('lock-unlock')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-rose-600 truncate">
                Protect PDF
              </h4>
              <p className="text-[10px] text-slate-500 truncate">Encrypt & Password</p>
            </div>
          </div>

          {/* OCR / Scan */}
          <div
            onClick={() => onSelectTool('ocr-pdf')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-teal-600 truncate">
                OCR / Scan
              </h4>
              <p className="text-[10px] text-slate-500 truncate">Text recognition</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Trust Badges (Matching bottom banner in screenshot) */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>100% Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-500" />
          <span>No Data Stored</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span>Gemini AI Smart Engines</span>
        </div>
      </div>

      {/* Navigation Subtabs (Recent, Starred, On device) */}
      <div className="pt-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveFileTab('recent')}
            className={`pb-2 relative transition-colors ${
              activeFileTab === 'recent'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span>Recent Documents</span>
            {activeFileTab === 'recent' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveFileTab('starred')}
            className={`pb-2 relative transition-colors ${
              activeFileTab === 'starred'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span>Starred</span>
            {activeFileTab === 'starred' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveFileTab('device')}
            className={`pb-2 relative transition-colors ${
              activeFileTab === 'device'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span>On device</span>
            {activeFileTab === 'device' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
            )}
          </button>
        </div>

        <button className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* File Items List */}
      <div className="space-y-3">
        {filteredFiles.map((file) => {
          const isStarred = starredIds.includes(file.id);
          const isMenuOpen = activeMenuId === file.id;

          return (
            <div
              key={file.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 relative"
            >
              {/* File Icon & Info */}
              <div
                className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                onClick={() => {
                  if (file.dataUrl) {
                    onOpenPreview(file.dataUrl, file.fileName, file.sizeBytes);
                  } else {
                    onSelectTool(file.toolId);
                  }
                }}
              >
                {/* Thumbnail / Icon container */}
                <div className="w-10 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {file.title || file.fileName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-semibold text-red-600 dark:text-red-400">PDF</span>
                    <span>•</span>
                    <span>{formatTime(file.timestamp)}</span>
                    <span>•</span>
                    <span>{formatSize(file.sizeBytes)}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Icons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => toggleStar(file.id, e)}
                  className={`p-2 rounded-lg transition-colors ${
                    isStarred ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                  }`}
                  title={isStarred ? 'Unstar' : 'Star file'}
                >
                  <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(isMenuOpen ? null : file.id);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* 3-Dots Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-4 top-12 z-20 w-44 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 text-xs">
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      if (file.dataUrl) {
                        onOpenPreview(file.dataUrl, file.fileName, file.sizeBytes);
                      }
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview File</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      onSelectTool(file.toolId);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Open in Tool</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Button (+) matching Acrobat mobile app */}
      <button
        id="btn-floating-create-plus"
        onClick={() => onSelectTool('camera-scanner')}
        className="fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-2xl flex items-center justify-center transition-all border-2 border-white/30"
        title="Scan or Create New Document"
      >
        <Plus className="w-8 h-8 text-white stroke-[2.5]" />
      </button>
    </div>
  );
};

