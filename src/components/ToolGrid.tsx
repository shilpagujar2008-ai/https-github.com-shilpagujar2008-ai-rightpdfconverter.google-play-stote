import React, { useState } from 'react';
import {
  Image,
  Camera,
  Merge,
  Split,
  RotateCw,
  FileImage,
  FileArchive,
  Lock,
  Unlock,
  Stamp,
  FileCode,
  Edit3,
  ScanText,
  Smartphone,
  Search,
  Sparkles,
  ArrowRight,
  Bot,
  Briefcase,
  Radio,
  Layout,
  MessageSquare,
  Scissors,
  FileText,
  ShieldCheck,
  Palette,
  Check,
  Crown,
} from 'lucide-react';
import { PdfTool, ToolCategory, ToolId } from '../types';

interface ToolGridProps {
  onSelectTool: (toolId: ToolId) => void;
}

export const TOOLS_LIST: PdfTool[] = [
  {
    id: 'gemini-ai-chat',
    name: 'Gemini AI Assistant',
    description: 'Ask questions, summarize documents, translate text, & draft content with open Gemini AI.',
    iconName: 'Bot',
    category: 'ai',
    popular: true,
    badge: 'Gemini 3.6',
  },
  {
    id: 'create-resume',
    name: 'AI Resume Builder',
    description: 'Build professional CVs & resumes with AI summary polish, instant PDF & Canva export.',
    iconName: 'Briefcase',
    category: 'create',
    popular: true,
    badge: 'Important',
  },
  {
    id: 'create-podcast',
    name: 'AI Podcast Studio',
    description: 'Generate multi-host podcast scripts, synthetic audio previews, and transcript PDFs.',
    iconName: 'Radio',
    category: 'create',
    popular: true,
    badge: 'Podcast AI',
  },
  {
    id: 'create-flyer',
    name: 'Flyer & Poster Creator',
    description: 'Design event flyers, promotional posters with themes, Canva link, & WhatsApp share.',
    iconName: 'Layout',
    category: 'create',
    popular: true,
    badge: 'Canva Ready',
  },
  {
    id: 'whatsapp-greeting',
    name: 'WhatsApp Greeting & Wishes',
    description: 'Diwali, New Year, Birthday & Festival wishes with 1-click Direct WhatsApp sharing.',
    iconName: 'MessageSquare',
    category: 'create',
    popular: true,
    badge: 'WhatsApp Direct',
  },
  {
    id: 'bg-remover',
    name: 'AI Background Remover',
    description: 'Remove photo backgrounds automatically, create transparent PNGs & export to Canva.',
    iconName: 'Scissors',
    category: 'edit',
    popular: true,
    badge: 'AI Cutout',
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert JPG, PNG, WEBP photos to formatted PDF documents with custom layout.',
    iconName: 'Image',
    category: 'create',
    popular: true,
    badge: 'Popular',
  },
  {
    id: 'camera-scanner',
    name: 'Camera Scanner',
    description: 'Scan documents with live camera, crop, apply B&W/Magic filters & export PDF.',
    iconName: 'Camera',
    category: 'create',
    popular: true,
    badge: 'AI Filter',
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into a single organized PDF with drag reordering.',
    iconName: 'Merge',
    category: 'organize',
    popular: true,
    badge: 'Fast',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract custom page ranges or separate pages into individual PDF files.',
    iconName: 'Split',
    category: 'organize',
  },
  {
    id: 'organize-rotate',
    name: 'Organize & Rotate',
    description: 'Rotate individual pages, reorder pages visually, or delete unneeded pages.',
    iconName: 'RotateCw',
    category: 'organize',
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Convert PDF pages into high-resolution PNG or JPG images with batch export.',
    iconName: 'FileImage',
    category: 'convert',
    popular: true,
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size with Low, Recommended, or High compression presets.',
    iconName: 'FileArchive',
    category: 'convert',
    badge: 'Optimizer',
  },
  {
    id: 'protect-pdf',
    name: 'Protect / Password',
    description: 'Encrypt PDFs with user password protection and security restrictions.',
    iconName: 'Lock',
    category: 'security',
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove password protection and restrictions from encrypted PDF files.',
    iconName: 'Unlock',
    category: 'security',
  },
  {
    id: 'watermark-pdf',
    name: 'Add Watermark',
    description: 'Overlay custom text, date, or stamp watermark across pages with custom angle & opacity.',
    iconName: 'Stamp',
    category: 'edit',
  },
  {
    id: 'text-to-pdf',
    name: 'Text & Note to PDF',
    description: 'Create clean formatted PDF documents from plain text, notes, or Markdown.',
    iconName: 'FileCode',
    category: 'create',
  },
  {
    id: 'sign-annotate',
    name: 'Sign & Annotate',
    description: 'Draw digital signatures or insert text stamps directly onto PDF pages.',
    iconName: 'Edit3',
    category: 'edit',
    badge: 'E-Sign',
  },
  {
    id: 'pdf-ocr',
    name: 'PDF & Image OCR',
    description: 'Extract editable text from scanned PDFs and photos with multi-language AI OCR.',
    iconName: 'ScanText',
    category: 'convert',
    popular: true,
    badge: 'AI OCR',
  },
  {
    id: 'android-package',
    name: 'Android Studio Build',
    description: 'Google Play com.iims.rightpdfconverter spec, Jetpack Compose code & Play Store checklist.',
    iconName: 'Smartphone',
    category: 'android',
    badge: 'Google Play',
  },
];

interface ThemeConfig {
  id: string;
  name: string;
  bgClass: string;
  hex: string;
  heroGradient: string;
  textClass: string;
}

const COLOR_THEMES: ThemeConfig[] = [
  {
    id: 'blue',
    name: 'Primary Blue',
    bgClass: 'bg-blue-600',
    hex: '#2563EB',
    heroGradient: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900',
    textClass: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'navy',
    name: 'Dark Navy',
    bgClass: 'bg-blue-900',
    hex: '#1E3A8A',
    heroGradient: 'bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950',
    textClass: 'text-blue-900 dark:text-blue-300',
  },
  {
    id: 'orange',
    name: 'Vibrant Orange',
    bgClass: 'bg-orange-500',
    hex: '#F97316',
    heroGradient: 'bg-gradient-to-r from-orange-500 via-amber-600 to-red-600',
    textClass: 'text-orange-600 dark:text-orange-400',
  },
  {
    id: 'green',
    name: 'Emerald Green',
    bgClass: 'bg-emerald-500',
    hex: '#10B981',
    heroGradient: 'bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-900',
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    bgClass: 'bg-purple-600',
    hex: '#8B5CF6',
    heroGradient: 'bg-gradient-to-r from-purple-600 via-indigo-700 to-violet-900',
    textClass: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'pink',
    name: 'Hot Pink',
    bgClass: 'bg-pink-500',
    hex: '#EC4899',
    heroGradient: 'bg-gradient-to-r from-pink-600 via-rose-600 to-purple-800',
    textClass: 'text-pink-600 dark:text-pink-400',
  },
  {
    id: 'cyan',
    name: 'Electric Cyan',
    bgClass: 'bg-cyan-500',
    hex: '#06B6D4',
    heroGradient: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-slate-900',
    textClass: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'rainbow',
    name: 'Multi-Color Rainbow 🌈',
    bgClass: 'bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-blue-500 to-purple-500',
    hex: 'Multi-Color',
    heroGradient: 'bg-[linear-gradient(135deg,#ef4444_0%,#f59e0b_20%,#10b981_40%,#06b6d4_60%,#6366f1_80%,#ec4899_100%)] shadow-2xl shadow-pink-500/20',
    textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-blue-500 to-purple-500 font-extrabold',
  },
];

const TOOL_RAINBOW_PALETTES = [
  { iconBg: 'bg-gradient-to-tr from-red-500 via-amber-500 to-yellow-500', badgeBg: 'bg-gradient-to-r from-red-500 to-amber-500' },
  { iconBg: 'bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-500', badgeBg: 'bg-gradient-to-r from-amber-500 to-emerald-500' },
  { iconBg: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500', badgeBg: 'bg-gradient-to-r from-emerald-500 to-cyan-500' },
  { iconBg: 'bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500', badgeBg: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
  { iconBg: 'bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500', badgeBg: 'bg-gradient-to-r from-blue-500 to-purple-500' },
  { iconBg: 'bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-500', badgeBg: 'bg-gradient-to-r from-purple-500 to-rose-500' },
  { iconBg: 'bg-gradient-to-tr from-rose-500 via-red-500 to-amber-500', badgeBg: 'bg-gradient-to-r from-rose-500 to-amber-500' },
  { iconBg: 'bg-gradient-to-tr from-violet-600 via-purple-500 to-pink-500', badgeBg: 'bg-gradient-to-r from-violet-600 to-pink-500' },
  { iconBg: 'bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-orange-500', badgeBg: 'bg-gradient-to-r from-fuchsia-500 to-orange-500' },
  { iconBg: 'bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-500', badgeBg: 'bg-gradient-to-r from-teal-500 to-indigo-500' },
];

const CATEGORIES: { id: ToolCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'convert', label: 'Convert' },
  { id: 'ai', label: 'AI tools' },
  { id: 'organize', label: 'Organize' },
  { id: 'security', label: 'Security' },
  { id: 'android', label: 'Android' },
];

const PASTEL_BOX_COLORS = [
  { bg: 'bg-purple-100/90 dark:bg-purple-950/60', text: 'text-purple-600 dark:text-purple-400' },
  { bg: 'bg-amber-100/90 dark:bg-amber-950/60', text: 'text-amber-600 dark:text-amber-400' },
  { bg: 'bg-orange-100/90 dark:bg-orange-950/60', text: 'text-orange-600 dark:text-orange-400' },
  { bg: 'bg-blue-100/90 dark:bg-blue-950/60', text: 'text-blue-600 dark:text-blue-400' },
  { bg: 'bg-emerald-100/90 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-400' },
  { bg: 'bg-pink-100/90 dark:bg-pink-950/60', text: 'text-pink-600 dark:text-pink-400' },
  { bg: 'bg-cyan-100/90 dark:bg-cyan-950/60', text: 'text-cyan-600 dark:text-cyan-400' },
  { bg: 'bg-indigo-100/90 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-400' },
];

export const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool }) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('rainbow');

  const activeTheme = COLOR_THEMES.find((t) => t.id === selectedThemeId) || COLOR_THEMES[0];

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Bot':
        return <Bot {...props} />;
      case 'Briefcase':
        return <Briefcase {...props} />;
      case 'Radio':
        return <Radio {...props} />;
      case 'Layout':
        return <Layout {...props} />;
      case 'MessageSquare':
        return <MessageSquare {...props} />;
      case 'Scissors':
        return <Scissors {...props} />;
      case 'Image':
        return <Image {...props} />;
      case 'Camera':
        return <Camera {...props} />;
      case 'Merge':
        return <Merge {...props} />;
      case 'Split':
        return <Split {...props} />;
      case 'RotateCw':
        return <RotateCw {...props} />;
      case 'FileImage':
        return <FileImage {...props} />;
      case 'FileArchive':
        return <FileArchive {...props} />;
      case 'Lock':
        return <Lock {...props} />;
      case 'Unlock':
        return <Unlock {...props} />;
      case 'Stamp':
        return <Stamp {...props} />;
      case 'FileCode':
        return <FileCode {...props} />;
      case 'Edit3':
        return <Edit3 {...props} />;
      case 'ScanText':
        return <ScanText {...props} />;
      case 'Smartphone':
        return <Smartphone {...props} />;
      default:
        return <Image {...props} />;
    }
  };

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className={`relative overflow-hidden rounded-3xl ${activeTheme.heroGradient} p-6 sm:p-8 text-white shadow-2xl transition-all duration-500`}>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-3 text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>RightPDF Converter PRO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Fast, Private & Powerful PDF Tools
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
            All PDF tools you need in one place. 100% secure and easy to use.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              id="btn-quick-open-pdf"
              onClick={() => onSelectTool('image-to-pdf')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm transition-all shadow-md flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Open PDF</span>
            </button>

            <button
              id="btn-quick-scan-pdf"
              onClick={() => onSelectTool('camera-scanner')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm transition-all border border-white/20 flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-blue-200" />
              <span>Scan PDF</span>
            </button>

            <button
              id="btn-quick-start-gemini-ai"
              onClick={() => onSelectTool('gemini-ai-chat')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-950 font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Gemini AI</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </button>
          </div>
        </div>

        {/* PDF Illustration Graphic Accent */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center justify-center">
          <div className="relative w-44 h-48 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-2xl rotate-3 hover:rotate-0 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white font-extrabold flex items-center justify-center text-xs mb-2 shadow-md">
              PDF
            </div>
            <div className="space-y-2">
              <div className="h-2 w-3/4 bg-white/40 rounded-full"></div>
              <div className="h-2 w-full bg-white/30 rounded-full"></div>
              <div className="h-2 w-5/6 bg-white/30 rounded-full"></div>
            </div>
            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
              ✓
            </div>
          </div>
        </div>

        {/* Decorative background blur shape */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tools
        </h1>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-search-tools"
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Category Tabs (Text labels with active underline bar indicator) */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`tab-category-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`pb-3 text-sm font-bold whitespace-nowrap relative transition-colors ${
                isSelected
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              {isSelected && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tools Cards Grid (2-Column Mobile/Tablet Grid with Soft Pastel Icon Containers) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {filteredTools.map((tool, idx) => {
          const pastel = PASTEL_BOX_COLORS[idx % PASTEL_BOX_COLORS.length];
          return (
            <div
              key={tool.id}
              id={`card-tool-${tool.id}`}
              onClick={() => onSelectTool(tool.id)}
              className="group relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Pastel Icon Box & Pro Crown Badge */}
                <div className="flex items-start justify-between mb-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl ${pastel.bg} ${pastel.text} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    {renderIcon(tool.iconName)}
                  </div>

                  {tool.badge && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                      <span>{tool.badge}</span>
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {tool.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                <span>Use tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No PDF tools found matching "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs text-blue-600 dark:text-blue-400 font-semibold underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Theme Color Palette Bar (Including Multi-Color Rainbow Option) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-blue-500 to-purple-500" />
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
            <Palette className="w-4 h-4 text-purple-500" />
            <span>Theme & Accent Color Palette 🌈</span>
          </div>
          <div className="text-xs font-bold flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Selected Theme:</span>
            <span className={`px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 ${activeTheme.textClass}`}>
              {activeTheme.name}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {COLOR_THEMES.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <button
                key={theme.id}
                id={`btn-theme-select-${theme.id}`}
                onClick={() => setSelectedThemeId(theme.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'ring-2 ring-purple-500 dark:ring-amber-400 scale-105 shadow-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${theme.bgClass} shadow-sm border border-white/30 inline-block`} />
                <span>{theme.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 dark:text-blue-600 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust & Security Badges (Rainbow Styled Patterns Below Tools) */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs font-extrabold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-red-400 transition-colors">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span>100% Secure 🔒</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-amber-400 transition-colors">
          <Lock className="w-4 h-4 text-amber-500" />
          <span>No Data Stored 🛡️</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-400 transition-colors">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>Runs 100% in Browser ⚡</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-400 transition-colors">
          <Crown className="w-4 h-4 text-blue-500" />
          <span>GDPR Compliant 🌈</span>
        </div>
      </div>
    </div>
  );
};
