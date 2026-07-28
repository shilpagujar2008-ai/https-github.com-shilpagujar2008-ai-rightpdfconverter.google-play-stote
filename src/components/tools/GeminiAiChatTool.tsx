import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  FileText,
  Trash2,
  Download,
  ArrowLeft,
  Paperclip,
  RefreshCw,
  Lightbulb,
  FileCode,
  Globe,
  Zap,
} from 'lucide-react';
import { ProcessedHistoryItem, UserAccount } from '../../types';
import { convertTextToPdf } from '../../utils/pdfEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface GeminiAiChatToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes?: number) => void;
  historyItems?: ProcessedHistoryItem[];
  currentUser?: UserAccount | null;
}

const QUICK_PROMPTS = [
  {
    icon: Zap,
    label: 'Summarize Document',
    prompt: 'Please provide a comprehensive summary of this document, including key takeaways and top 5 bullet points.',
  },
  {
    icon: Lightbulb,
    label: 'Extract Action Items',
    prompt: 'Extract all important action items, dates, deadlines, and financial amounts mentioned in this context.',
  },
  {
    icon: Globe,
    label: 'Translate to Spanish',
    prompt: 'Please translate the provided document text into clear, fluent Spanish.',
  },
  {
    icon: FileCode,
    label: 'Explain Jargon & Terms',
    prompt: 'Explain the technical or legal terms in this text in simple, easy-to-understand language.',
  },
];

export const GeminiAiChatTool: React.FC<GeminiAiChatToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
  historyItems = [],
  currentUser,
}) => {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${currentUser ? currentUser.name.split(' ')[0] : 'there'}! 👋 I am **RightPDF Gemini AI**, powered by Google's **gemini-3.6-flash** model.\n\nI can help you analyze PDF documents, summarize lengthy reports, extract action items, translate languages, or draft custom text for your PDFs. How can I assist you today?`,
      timestamp: Date.now(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [contextText, setContextText] = useState('');
  const [contextFileName, setContextFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHistoryPicker, setShowHistoryPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputMessage).trim();
    if (!prompt || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      // Build history for backend
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-1')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          contextText: contextText,
          history: historyPayload,
          systemInstruction:
            'You are RightPDF Gemini AI, an expert document assistant. Format your answers clearly using Markdown headers, bullet points, and code blocks where helpful.',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'I analyzed your request.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      // Fallback message if server error or key issue
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Connection Note**: ${err.message || 'Unable to reach Gemini AI API'}.\n\nIf you are running in preview mode, make sure your server is running and GEMINI_API_KEY is configured in Settings > Secrets.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setContextFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContextText(text);
    };
    reader.readAsText(file);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAsPdf = async (text: string) => {
    try {
      const pdfBytes = convertTextToPdf(text, 'Gemini AI Response');

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `Gemini_AI_Response_${Date.now()}.pdf`;

      onAddHistory({
        id: `ai-doc-${Date.now()}`,
        title: 'Gemini AI Exported PDF',
        toolId: 'gemini-ai-chat',
        timestamp: Date.now(),
        sizeBytes: pdfBytes.byteLength,
        dataUrl,
        fileName,
      });

      onOpenPreview(dataUrl, fileName, pdfBytes.byteLength);
    } catch (e) {
      console.error('Failed to generate PDF from AI response:', e);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Conversation reset. I am ready for your next question or PDF document text!`,
        timestamp: Date.now(),
      },
    ]);
    setContextText('');
    setContextFileName('');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-from-gemini"
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            title="Back to tools"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg sm:text-xl tracking-tight">Gemini AI Assistant</h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-red-700 shadow-sm">
                gemini-3.6-flash
              </span>
            </div>
            <p className="text-xs text-rose-100 hidden sm:block">
              Intelligent PDF document analysis, summaries, translation & drafting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-clear-gemini-chat"
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Reset Conversation"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Quick Prompt Chips */}
        {messages.length <= 2 && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Suggested AI Tasks</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {QUICK_PROMPTS.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={idx}
                    id={`btn-quick-prompt-${idx}`}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-red-500/50 dark:hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-950/30 text-left transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.prompt}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Messages Stream */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-gradient-to-tr from-red-600 to-amber-500 text-white'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            {/* Bubble Content */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm text-sm ${
                msg.role === 'user'
                  ? 'bg-red-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed break-words font-sans">
                {msg.content}
              </div>

              {/* Action buttons for AI messages */}
              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px]">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-copy-msg-${msg.id}`}
                      onClick={() => handleCopyText(msg.id, msg.content)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors flex items-center gap-1 text-[11px]"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      id={`btn-export-pdf-msg-${msg.id}`}
                      onClick={() => handleExportAsPdf(msg.content)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                      title="Export this AI response as PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Gemini AI is generating answer...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Context Attachment Bar */}
      {contextText && (
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200/80 dark:border-amber-900/80 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">Attached Context:</span>
            <span className="truncate underline font-medium">
              {contextFileName || 'Pasted Document Text'}
            </span>
            <span className="text-[10px] opacity-75">
              ({contextText.length.toLocaleString()} chars)
            </span>
          </div>
          <button
            onClick={() => {
              setContextText('');
              setContextFileName('');
            }}
            className="p-1 rounded hover:bg-amber-200/50 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold"
          >
            Remove Context
          </button>
        </div>
      )}

      {/* Bottom Input Controls */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
        {/* Attachment Shortcuts */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.json,.csv"
              className="hidden"
            />
            <button
              id="btn-attach-text-file"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors font-medium text-[11px]"
              title="Attach text file or notes for context"
            >
              <Paperclip className="w-3.5 h-3.5 text-red-500" />
              <span>Attach File Context</span>
            </button>

            {historyItems.length > 0 && (
              <div className="relative">
                <button
                  id="btn-select-history-context"
                  onClick={() => setShowHistoryPicker(!showHistoryPicker)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors font-medium text-[11px]"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Attach History Item</span>
                </button>

                {showHistoryPicker && (
                  <div className="absolute bottom-full left-0 mb-2 w-64 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-20 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">
                      Select Recent Document
                    </div>
                    {historyItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setContextFileName(item.fileName);
                          setContextText(`Document Title: ${item.title}\nFile Name: ${item.fileName}\nCreated: ${new Date(item.timestamp).toLocaleString()}`);
                          setShowHistoryPicker(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-xs text-slate-800 dark:text-slate-200 truncate"
                      >
                        {item.fileName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Press Enter to send
          </span>
        </div>

        {/* Input Textarea & Send Button */}
        <div className="flex items-end gap-2">
          <textarea
            id="input-gemini-chat-message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask Gemini AI anything about your PDF document or request document drafting..."
            rows={2}
            className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
          />
          <button
            id="btn-send-gemini-message"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            title="Send message to Gemini AI"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
