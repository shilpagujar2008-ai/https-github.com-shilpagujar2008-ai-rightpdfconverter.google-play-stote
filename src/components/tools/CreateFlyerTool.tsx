import React, { useState } from 'react';
import { ArrowLeft, Layout, Sparkles, Download, Share2, Palette, Image as ImageIcon, ExternalLink, Send } from 'lucide-react';
import { ProcessedHistoryItem } from '../../types';
import { convertTextToPdf } from '../../utils/pdfEngine';

interface CreateFlyerToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes?: number) => void;
}

export const CreateFlyerTool: React.FC<CreateFlyerToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [title, setTitle] = useState('GRAND TECH SUMMIT 2026');
  const [subtitle, setSubtitle] = useState('Innovation, AI & Future Technologies');
  const [date, setDate] = useState('SATURDAY, AUGUST 15 | 10:00 AM');
  const [venue, setVenue] = useState('Grand Convention Center, Tech Park');
  const [description, setDescription] = useState(
    'Join 500+ industry leaders, developers, and founders for keynote sessions, AI workshops, and networking.'
  );
  const [contactInfo, setContactInfo] = useState('Register now: www.techsummit2026.com | +1 (555) 019-2831');
  const [theme, setTheme] = useState<'neon' | 'gold' | 'vibrant' | 'minimal'>('neon');

  const THEMES = {
    neon: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white border-purple-500',
    gold: 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-amber-100 border-amber-500',
    vibrant: 'bg-gradient-to-br from-rose-600 via-red-600 to-amber-500 text-white border-rose-300',
    minimal: 'bg-white text-slate-900 border-slate-300',
  };

  const handleExportFlyerPdf = () => {
    const flyerText = `
================================================================================
${title.toUpperCase()}
${subtitle}
================================================================================

DATE & TIME: ${date}
VENUE: ${venue}

--------------------------------------------------------------------------------
ABOUT THE EVENT
--------------------------------------------------------------------------------
${description}

--------------------------------------------------------------------------------
CONTACT & REGISTRATION
--------------------------------------------------------------------------------
${contactInfo}
`;

    const fileName = `${title.replace(/\s+/g, '_')}_Flyer.pdf`;
    const pdfBytes = convertTextToPdf(flyerText, title);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const dataUrl = URL.createObjectURL(blob);

    onAddHistory({
      id: `flyer-${Date.now()}`,
      title: `${title} - Event Flyer`,
      toolId: 'create-flyer',
      timestamp: Date.now(),
      sizeBytes: pdfBytes.byteLength,
      dataUrl,
      fileName,
    });

    onOpenPreview(dataUrl, fileName, pdfBytes.byteLength);
  };

  const whatsappMessage = encodeURIComponent(
    `📢 *${title}*\n${subtitle}\n🗓️ ${date}\n📍 ${venue}\n\n${description}\n\n${contactInfo}`
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Flyer & Poster Designer</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create striking event flyers with Canva design integration & WhatsApp sharing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <a
            href="https://www.canva.com/create/flyers/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open Canva</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-rose-600" />
            <span>Flyer Details</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Event Main Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-extrabold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tagline / Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Date & Time</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Venue / Location</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Event Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Registration / Contact Info</label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Theme Preset</label>
            <div className="grid grid-cols-4 gap-2">
              {(['neon', 'gold', 'vibrant', 'minimal'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-2 rounded-xl border text-xs capitalize font-bold transition-all ${
                    theme === t
                      ? 'border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleExportFlyerPdf}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-lg hover:from-rose-700 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download Flyer PDF</span>
          </button>
        </div>

        {/* Live Visual Poster Sheet */}
        <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <div
            className={`w-full max-w-sm rounded-2xl p-8 shadow-2xl border-2 flex flex-col justify-between text-center min-h-[460px] transition-all ${THEMES[theme]}`}
          >
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                SPECIAL EVENT
              </span>
              <h1 className="text-2xl font-black uppercase tracking-tight leading-tight mt-2">{title}</h1>
              <p className="text-xs opacity-90 font-medium italic">{subtitle}</p>
            </div>

            <div className="my-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
              <div className="text-xs font-bold">{date}</div>
              <div className="text-[11px] opacity-80">{venue}</div>
            </div>

            <p className="text-xs opacity-90 leading-relaxed mb-4">{description}</p>

            <div className="pt-4 border-t border-white/20 text-[10px] font-mono opacity-80">
              {contactInfo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
