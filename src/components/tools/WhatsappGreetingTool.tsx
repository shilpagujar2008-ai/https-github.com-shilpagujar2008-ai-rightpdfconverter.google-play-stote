import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Sparkles, Send, Download, Share2, ExternalLink, Heart, Gift, Smile } from 'lucide-react';
import { ProcessedHistoryItem } from '../../types';
import { convertTextToPdf } from '../../utils/pdfEngine';

interface WhatsappGreetingToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes?: number) => void;
}

const OCCASIONS = [
  { id: 'diwali', label: '🪔 Diwali / Deepavali', defaultWish: 'May the festival of lights bring prosperity, health, peace, and joy to you and your family!' },
  { id: 'newyear', label: '🎆 Happy New Year', defaultWish: 'Wishing you 365 days of happiness, success, and breakthroughs in the coming year!' },
  { id: 'birthday', label: '🎂 Happy Birthday', defaultWish: 'May your special day be filled with laughter, love, cake, and unforgettable moments!' },
  { id: 'anniversary', label: '💖 Happy Anniversary', defaultWish: 'Wishing a lifetime of love, togetherness, and happiness to a wonderful couple!' },
  { id: 'goodmorning', label: '🌅 Good Morning Wish', defaultWish: 'Sending you warm morning sunshine and positive energy for a fantastic day ahead!' },
  { id: 'custom', label: '✨ Custom Wishes', defaultWish: 'Sending you heartfelt wishes and blessings for a joyous and triumphant season!' },
];

export const WhatsappGreetingTool: React.FC<WhatsappGreetingToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [recipient, setRecipient] = useState('Dear Friend & Family');
  const [sender, setSender] = useState('Shilpa & Family');
  const [occasion, setOccasion] = useState('diwali');
  const [greetingText, setGreetingText] = useState(OCCASIONS[0].defaultWish);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleSelectOccasion = (id: string) => {
    setOccasion(id);
    const item = OCCASIONS.find((o) => o.id === id);
    if (item) setGreetingText(item.defaultWish);
  };

  const handleAiWriteWish = async () => {
    setIsGeneratingAi(true);
    try {
      const prompt = `Write a beautiful, warm, 2-sentence WhatsApp greeting wish for ${occasion} addressed to ${recipient} from ${sender}. Include festive emojis.`;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      if (data.text) {
        setGreetingText(data.text.trim());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `✨ *${greetingText}*\n\nWarmest Regards,\n*${sender}*`
  );

  const handleExportGreetingPdf = () => {
    const cardText = `
================================================================================
GREETING CARD
================================================================================

To: ${recipient}

${greetingText}

--------------------------------------------------------------------------------
With Warmest Wishes & Regards,
${sender}
`;

    const fileName = `WhatsApp_Greeting_${occasion}_${Date.now()}.pdf`;
    const pdfBytes = convertTextToPdf(cardText, `${occasion.toUpperCase()} Greeting`);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const dataUrl = URL.createObjectURL(blob);

    onAddHistory({
      id: `greeting-${Date.now()}`,
      title: `${occasion} WhatsApp Greeting`,
      toolId: 'whatsapp-greeting',
      timestamp: Date.now(),
      sizeBytes: pdfBytes.byteLength,
      dataUrl,
      fileName,
    });

    onOpenPreview(dataUrl, fileName, pdfBytes.byteLength);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">WhatsApp Greetings & Wishes</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create festive greetings, birthday wishes & direct WhatsApp message cards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Send on WhatsApp</span>
          </a>
          <a
            href="https://www.canva.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Canva</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Column */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Gift className="w-4 h-4 text-emerald-600" />
            <span>Greeting Details</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Occasion</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => handleSelectOccasion(occ.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    occasion === occ.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {occ.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">To (Recipient Name)</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">From (Your Name)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Greeting Wish Message</label>
              <button
                onClick={handleAiWriteWish}
                disabled={isGeneratingAi}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isGeneratingAi ? 'AI Writing...' : 'AI Custom Wish'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={greetingText}
              onChange={(e) => setGreetingText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed"
            />
          </div>

          <div className="flex gap-2">
            <a
              href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Direct on WhatsApp</span>
            </a>
            <button
              onClick={handleExportGreetingPdf}
              className="px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Live Visual Card */}
        <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <div className="w-full max-w-sm rounded-3xl p-8 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white border-2 border-emerald-500 shadow-2xl text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
              <Sparkles className="w-6 h-6 text-emerald-400 animate-bounce" />
            </div>

            <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
              {recipient}
            </div>

            <p className="text-sm font-medium leading-relaxed italic text-emerald-100">
              "{greetingText}"
            </p>

            <div className="pt-4 border-t border-emerald-800 text-xs font-semibold text-emerald-300">
              Warmest Regards,<br />
              <span className="text-sm font-bold text-white">{sender}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
