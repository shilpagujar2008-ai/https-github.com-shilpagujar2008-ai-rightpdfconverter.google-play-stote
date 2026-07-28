import React, { useState } from 'react';
import { ArrowLeft, Mic, Sparkles, Play, Square, Download, Share2, Volume2, Radio, FileText, ExternalLink } from 'lucide-react';
import { ProcessedHistoryItem } from '../../types';
import { convertTextToPdf } from '../../utils/pdfEngine';

interface CreatePodcastToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes?: number) => void;
}

interface ScriptTurn {
  speaker: 'Host A (Alex)' | 'Host B (Sam)';
  text: string;
}

export const CreatePodcastTool: React.FC<CreatePodcastToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [topic, setTopic] = useState('The Future of Artificial Intelligence & Smart PDF Automation in 2026');
  const [podcastTitle, setPodcastTitle] = useState('Tech Talks: AI Revolution');
  const [hostType, setHostType] = useState<'dual' | 'solo'>('dual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [script, setScript] = useState<ScriptTurn[]>([
    {
      speaker: 'Host A (Alex)',
      text: "Welcome back to Tech Talks! Today we're diving into how AI models like Gemini 3.6 are changing the way we work with documents.",
    },
    {
      speaker: 'Host B (Sam)',
      text: "That's right Alex. Imagine transforming complex multi-page contracts into concise 1-page summaries or generating podcasts in seconds!",
    },
    {
      speaker: 'Host A (Alex)',
      text: 'Exactly! Let us break down the top 3 productivity breakthroughs you can use today.',
    },
  ]);

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const prompt = `Generate an engaging 4-turn conversational podcast script about "${topic}". Speaker 1 is Host A (Alex) and Speaker 2 is Host B (Sam). Return as plain JSON array of objects with keys "speaker" ("Host A (Alex)" or "Host B (Sam)") and "text".`;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();

      if (data.text) {
        // Parse JSON or format text
        try {
          const match = data.text.match(/\[[\s\S]*\]/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            setScript(parsed);
          } else {
            // fallback plain text lines
            const lines = data.text.split('\n').filter((l: string) => l.trim().length > 0);
            const turns: ScriptTurn[] = lines.map((l: string, idx: number) => ({
              speaker: idx % 2 === 0 ? 'Host A (Alex)' : 'Host B (Sam)',
              text: l.replace(/^(Host A|Host B|Alex|Sam):/i, '').trim(),
            }));
            setScript(turns);
          }
        } catch (err) {
          console.error(err);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPodcastAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlaying(true);

    script.forEach((turn, idx) => {
      const utterance = new SpeechSynthesisUtterance(turn.text);
      utterance.pitch = turn.speaker.includes('Alex') ? 1.0 : 1.2;
      utterance.rate = 1.0;
      if (idx === script.length - 1) {
        utterance.onend = () => setIsPlaying(false);
      }
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleExportPdf = () => {
    const fullText = `PODCAST SCRIPT: ${podcastTitle.toUpperCase()}\nTOPIC: ${topic}\n\n` +
      script.map((s) => `[${s.speaker}]\n${s.text}`).join('\n\n');

    const fileName = `${podcastTitle.replace(/\s+/g, '_')}_Podcast_Script.pdf`;
    const pdfBytes = convertTextToPdf(fullText, podcastTitle);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const dataUrl = URL.createObjectURL(blob);

    onAddHistory({
      id: `podcast-${Date.now()}`,
      title: `${podcastTitle} - Podcast Script`,
      toolId: 'create-podcast',
      timestamp: Date.now(),
      sizeBytes: pdfBytes.byteLength,
      dataUrl,
      fileName,
    });

    onOpenPreview(dataUrl, fileName, pdfBytes.byteLength);
  };

  const whatsappMessage = encodeURIComponent(
    `Check out our new podcast script "${podcastTitle}" created with RightPDF AI Studio!`
  );

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">AI Podcast Studio</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate audio scripts, synthetic voice previews & podcast transcript PDFs
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Input Column */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Mic className="w-4 h-4 text-purple-600" />
            <span>Podcast Topic</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Podcast Title</label>
            <input
              type="text"
              value={podcastTitle}
              onChange={(e) => setPodcastTitle(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Topic or Discussion Points</label>
            <textarea
              rows={4}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'AI Writing Script...' : 'AI Generate Podcast Script'}</span>
          </button>
        </div>

        {/* Script & Voice Preview Player Column */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Podcast Audio & Script</h3>
              </div>
              <button
                onClick={handlePlayPodcastAudio}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md ${
                  isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Listen Podcast Voice</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {script.map((turn, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs ${
                    turn.speaker.includes('Alex')
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
                      : 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800'
                  }`}
                >
                  <span className="font-bold text-purple-700 dark:text-purple-300 block mb-1">
                    🎙️ {turn.speaker}
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{turn.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleExportPdf}
            className="w-full py-3.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Podcast Script as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
