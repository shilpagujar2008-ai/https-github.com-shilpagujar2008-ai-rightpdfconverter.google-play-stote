import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Download,
  Eye,
  FileText,
  Edit3,
  Check,
  Crown,
  X,
  Palette,
  Share2,
  Printer,
} from 'lucide-react';
import { ToolId } from '../types';

interface TemplateItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Invoice' | 'Invitation' | 'Brochure' | 'Flyer' | 'Resume' | 'Certificate';
  tag: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  badge?: string;
  previewImage?: string;
  description: string;
  sections: { header: string; content: string }[];
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl-1',
    title: "Exploring North India's Majestic Natural Beauty",
    subtitle: "NorthNomad Travels - Custom Itinerary & Tour Packages",
    category: 'Brochure',
    tag: 'Travel & Tourism',
    bgColor: 'from-amber-700 via-orange-800 to-amber-950',
    textColor: 'text-amber-100',
    accentColor: 'bg-amber-500',
    badge: 'Popular',
    description: '3-fold travel brochure detailing North India heritage, Taj Mahal, mountains, and contact offerings.',
    sections: [
      { header: 'ABOUT US', headerVal: 'NorthNomad Travels', content: 'Specializing in authentic heritage and nature tours.' },
      { header: 'OFFERINGS', content: '• Heritage Treks\n• Magical Forts\n• Spiritual Journeys' },
      { header: 'CONTACT', content: 'Email: info@northnomad.com | Phone: +91 98765 43210' },
    ],
  } as any,
  {
    id: 'tpl-2',
    title: 'Admissions Open for 20XX-20XX',
    subtitle: 'Top Public School - The Dawn of Knowledge & Development',
    category: 'Brochure',
    tag: 'Education',
    bgColor: 'from-blue-700 via-indigo-800 to-slate-900',
    textColor: 'text-blue-100',
    accentColor: 'bg-blue-500',
    badge: 'Trending',
    description: 'Academic admissions brochure with curriculum details, purpose statement, and enrollment contacts.',
    sections: [
      { header: 'OUR PURPOSE', content: 'To mold young minds into independent thinkers and responsible citizens.' },
      { header: 'OPPORTUNITIES', content: 'State of the art science labs, sports arena, and holistic art curriculum.' },
      { header: 'CONTACT', content: 'Admissions Office | Uttar Pradesh, India | admissions@publicschool.edu' },
    ],
  },
  {
    id: 'tpl-3',
    title: 'Beacon Diabetes Foundation',
    subtitle: 'Lighting the Way to Health',
    category: 'Brochure',
    tag: 'Healthcare',
    bgColor: 'from-teal-700 via-cyan-800 to-teal-950',
    textColor: 'text-teal-100',
    accentColor: 'bg-teal-500',
    badge: 'Featured',
    description: 'Healthcare & foundation brochure highlighting care commitment, support groups, and appointment booking.',
    sections: [
      { header: 'OUR COMMITMENT', content: 'Providing compassionate diabetes care and continuous monitoring.' },
      { header: 'SCHEDULE APPOINTMENT', content: 'Mon - Fri: 8am - 6pm | Call: (800) 555-CARE' },
    ],
  },
  {
    id: 'tpl-4',
    title: 'Welcome to Mind Studio',
    subtitle: 'The Oasis of Tranquility - Spa & Meditation',
    category: 'Brochure',
    tag: 'Spa & Wellness',
    bgColor: 'from-emerald-700 via-teal-800 to-emerald-950',
    textColor: 'text-emerald-100',
    accentColor: 'bg-emerald-500',
    description: 'Relaxation & spa brochure featuring holistic treatments, meditation sessions, and contact info.',
    sections: [
      { header: 'CONTACT US', content: '1676 Kimberly Drive, Chicago, IL | mindstudio@site.com' },
      { header: 'OUR PHILOSOPHY', content: 'Complete transformation of your well-being in serene tranquility.' },
    ],
  },
  {
    id: 'tpl-5',
    title: 'Inspiring Home Decor',
    subtitle: 'Transform Your Space with Style',
    category: 'Brochure',
    tag: 'Interior Design',
    bgColor: 'from-stone-700 via-amber-900 to-stone-950',
    textColor: 'text-amber-100',
    accentColor: 'bg-amber-600',
    description: 'Modern interior design & decor catalog with living room ideas, contact cards, and order forms.',
    sections: [
      { header: 'CONTACT', content: 'Address: 1676 Kimberly Drive, Chicago, IL | Email: info@homedecor.com' },
      { header: 'SERVICES', content: 'Full interior architecture, spatial styling, and custom furniture curation.' },
    ],
  },
  {
    id: 'tpl-6',
    title: 'Palladian Community College',
    subtitle: 'Your Future Career Awaits',
    category: 'Brochure',
    tag: 'College',
    bgColor: 'from-slate-900 via-cyan-950 to-black',
    textColor: 'text-cyan-100',
    accentColor: 'bg-cyan-500',
    badge: 'PRO',
    description: 'Higher education brochure outlining degree courses, campus culture, and registration requirements.',
    sections: [
      { header: 'STUDY AT PALLADIAN', content: 'Setting standards for excellence in higher technical education.' },
      { header: 'HOW TO APPLY', content: 'Visit www.palladiancollege.edu or email admissions@palladian.edu' },
    ],
  },
  {
    id: 'tpl-7',
    title: 'Join Our Team - Here\'s Why',
    subtitle: 'Recruitment & Competitive Benefits',
    category: 'Flyer',
    tag: 'Recruitment',
    bgColor: 'from-amber-500 via-yellow-600 to-stone-900',
    textColor: 'text-stone-900',
    accentColor: 'bg-stone-900',
    description: 'Bold recruitment flyer highlighting competitive pay, unmatched benefits, and WFH flexibility.',
    sections: [
      { header: 'BENEFITS', content: '• Competitive Pay\n• Unmatched Health Cover\n• Flexible WFH Balance' },
      { header: 'APPLY NOW', content: 'Send resume to careers@company.com or call 1800-JOIN-US' },
    ],
  },
  {
    id: 'tpl-8',
    title: 'School Counseling & Guidance',
    subtitle: 'Yellow Mountain High School',
    category: 'Brochure',
    tag: 'Education',
    bgColor: 'from-blue-800 via-indigo-900 to-purple-950',
    textColor: 'text-blue-100',
    accentColor: 'bg-amber-400',
    description: 'Student guidance brochure with personal development counseling and meeting appointment slots.',
    sections: [
      { header: 'COUNSELING SERVICES', content: '• Socializing support\n• Academic planning\n• Personal development' },
      { header: 'SCHEDULE MEETING', content: 'Counseling Office, Main Building | counseling@yellowmountain.edu' },
    ],
  },
  {
    id: 'tpl-9',
    title: 'Modern Business Tax Invoice',
    subtitle: 'Itemized Professional Statement',
    category: 'Invoice',
    tag: 'Finance',
    bgColor: 'from-slate-800 via-slate-900 to-black',
    textColor: 'text-slate-100',
    accentColor: 'bg-emerald-500',
    badge: 'Popular',
    description: 'Clean tax invoice template with company logo, itemized billings, tax calculation, and payment terms.',
    sections: [
      { header: 'INVOICE DETAILS', content: 'Invoice #INV-2026-9081 | Date: July 27, 2026' },
      { header: 'TOTAL DUE', content: '$1,450.00 | Net 30 Terms' },
    ],
  },
  {
    id: 'tpl-10',
    title: 'Royal Floral Wedding Invitation',
    subtitle: 'Save The Date & Celebration Details',
    category: 'Invitation',
    tag: 'Events',
    bgColor: 'from-rose-900 via-pink-950 to-stone-900',
    textColor: 'text-pink-100',
    accentColor: 'bg-amber-400',
    description: 'Luxury wedding invitation card with elegant floral design, venue map, and RSVP timeline.',
    sections: [
      { header: 'THE CELEBRATION', content: 'Together with their families, invite you to celebrate their wedding.' },
      { header: 'VENUE & DATE', content: 'Saturday, November 14th | Grand Heritage Palace, Jaipur' },
    ],
  },
];

const CATEGORIES = ['All', 'Invoice', 'Invitation', 'Brochure', 'Flyer', 'Resume', 'Certificate'] as const;

interface TemplateGalleryProps {
  onSelectTool: (toolId: ToolId) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTool,
  onOpenPreview,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Brochure');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplateModal, setActiveTemplateModal] = useState<TemplateItem | null>(null);

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === 'All' || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadPdf = (tpl: TemplateItem) => {
    // Generate a clean HTML canvas data URL for demo template export
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 600, 800);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(tpl.title.slice(0, 35), 40, 80);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText(tpl.subtitle.slice(0, 45), 40, 110);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      let y = 180;
      tpl.sections.forEach((sec) => {
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(sec.header, 40, y);
        y += 25;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(sec.content.slice(0, 60), 40, y);
        y += 45;
      });
      ctx.fillStyle = '#10b981';
      ctx.fillText('Generated by RightPDF Express Templates', 40, 750);
    }
    const dataUrl = canvas.toDataURL('image/png');
    onOpenPreview(dataUrl, `${tpl.title.replace(/\s+/g, '_')}.pdf`, 120400);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Top Banner Header matching Acrobat / Express template view */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create from a template
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-r from-red-600 via-amber-500 to-purple-600 flex items-center justify-center text-white font-black text-[10px]">
              A
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Powered by RightPDF & Express Templates
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Horizontal Filter Chips (Invoice, Invitation, Brochure, Flyer, etc.) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Visual Template Cards (Matching screenshot layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => setActiveTemplateModal(tpl)}
            className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Visual Card Header Preview */}
            <div className={`p-6 bg-gradient-to-br ${tpl.bgColor} ${tpl.textColor} relative min-h-[180px] flex flex-col justify-between overflow-hidden`}>
              {/* Background decorative geometry */}
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20">
                  {tpl.tag}
                </span>

                {tpl.badge && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-slate-900" />
                    <span>{tpl.badge}</span>
                  </span>
                )}
              </div>

              <div className="space-y-1 relative z-10 my-3">
                <h3 className="font-extrabold text-lg leading-tight line-clamp-2 drop-shadow-sm">
                  {tpl.title}
                </h3>
                <p className="text-xs opacity-90 line-clamp-1 font-medium">
                  {tpl.subtitle}
                </p>
              </div>

              {/* Sample Mini Folders visual simulation */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/20 relative z-10">
                <div className="h-2 rounded bg-white/30" />
                <div className="h-2 rounded bg-white/40" />
                <div className="h-2 rounded bg-white/20" />
              </div>
            </div>

            {/* Card Footer Details */}
            <div className="p-4 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {tpl.category} Template
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTemplateModal(tpl);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">
            No templates found
          </h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or selecting a different category.
          </p>
        </div>
      )}

      {/* Template Preview & Customizer Modal */}
      {activeTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${activeTemplateModal.bgColor} ${activeTemplateModal.textColor} flex items-center justify-between`}>
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-black/40 text-white">
                  {activeTemplateModal.category}
                </span>
                <h3 className="font-black text-xl mt-1 leading-tight">
                  {activeTemplateModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveTemplateModal(null)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {activeTemplateModal.description}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Included Sections:
                </h4>
                {activeTemplateModal.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      {sec.header}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line font-medium">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveTemplateModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const tpl = activeTemplateModal;
                    setActiveTemplateModal(null);
                    handleDownloadPdf(tpl);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export as PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
