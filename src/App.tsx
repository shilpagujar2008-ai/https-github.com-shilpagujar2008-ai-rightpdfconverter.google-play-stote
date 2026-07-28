import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, MessageCircle, Send } from 'lucide-react';
import { Header } from './components/Header';
import { ToolGrid, TOOLS_LIST } from './components/ToolGrid';
import { RecentHistory } from './components/RecentHistory';
import { AndroidPackageModal } from './components/AndroidPackageModal';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';
import { BottomNav, NavTabId } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { TemplateGallery } from './components/TemplateGallery';

// Tools
import { ImageToPdfTool } from './components/tools/ImageToPdfTool';
import { CameraScannerTool } from './components/tools/CameraScannerTool';
import { MergePdfTool } from './components/tools/MergePdfTool';
import { SplitPdfTool } from './components/tools/SplitPdfTool';
import { OrganizeRotateTool } from './components/tools/OrganizeRotateTool';
import { PdfToImageTool } from './components/tools/PdfToImageTool';
import { CompressPdfTool } from './components/tools/CompressPdfTool';
import { ProtectUnlockTool } from './components/tools/ProtectUnlockTool';
import { WatermarkTool } from './components/tools/WatermarkTool';
import { TextToPdfTool } from './components/tools/TextToPdfTool';
import { SignAnnotateTool } from './components/tools/SignAnnotateTool';
import { OcrTool } from './components/tools/OcrTool';
import { GeminiAiChatTool } from './components/tools/GeminiAiChatTool';
import { CreateResumeTool } from './components/tools/CreateResumeTool';
import { CreatePodcastTool } from './components/tools/CreatePodcastTool';
import { CreateFlyerTool } from './components/tools/CreateFlyerTool';
import { WhatsappGreetingTool } from './components/tools/WhatsappGreetingTool';
import { RemoveBgTool } from './components/tools/RemoveBgTool';

import { ToolId, ProcessedHistoryItem, UserAccount } from './types';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState<NavTabId>('home');

  const handleBottomNavSelect = (tab: NavTabId) => {
    setBottomNavTab(tab);
    if (tab === 'home' || tab === 'tools' || tab === 'create') {
      setActiveToolId(null);
    } else if (tab === 'pdf-spaces') {
      setActiveToolId('gemini-ai-chat');
    } else if (tab === 'files' || tab === 'history') {
      setIsHistoryOpen(true);
    } else if (tab === 'profile') {
      setIsAuthModalOpen(true);
    }
  };

  // Email Accounts & Login Memory
  const [savedAccounts, setSavedAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('rightpdf_saved_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Pre-seed initial default account memory
    return [
      {
        email: 'shilpagujar2008@gmail.com',
        name: 'Shilpa Gujar',
        provider: 'google',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        history: [],
      },
    ];
  });

  const [currentEmail, setCurrentEmail] = useState<string | null>(() => {
    return localStorage.getItem('rightpdf_current_email') || 'shilpagujar2008@gmail.com';
  });

  const currentUser = savedAccounts.find((a) => a.email === currentEmail) || null;

  // Conversion History for active email profile
  const [historyItems, setHistoryItems] = useState<ProcessedHistoryItem[]>(() => {
    if (currentUser && currentUser.history) {
      return currentUser.history;
    }
    const savedGlobal = localStorage.getItem('rightpdf_history');
    return savedGlobal ? JSON.parse(savedGlobal) : [];
  });

  // Preview Modal state
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    dataUrl: string | null;
    fileName: string;
    bytes?: number;
  }>({
    isOpen: false,
    dataUrl: null,
    fileName: '',
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Persist accounts and active email memory
  useEffect(() => {
    localStorage.setItem('rightpdf_saved_accounts', JSON.stringify(savedAccounts));
  }, [savedAccounts]);

  useEffect(() => {
    if (currentEmail) {
      localStorage.setItem('rightpdf_current_email', currentEmail);
    } else {
      localStorage.removeItem('rightpdf_current_email');
    }
  }, [currentEmail]);

  // Sync conversion history to current user account memory
  useEffect(() => {
    localStorage.setItem('rightpdf_history', JSON.stringify(historyItems));

    if (currentEmail) {
      setSavedAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.email === currentEmail ? { ...acc, history: historyItems, lastLoginAt: Date.now() } : acc
        )
      );
    }
  }, [historyItems, currentEmail]);

  const handleLogin = (email: string, name: string, provider: 'google' | 'email') => {
    const existing = savedAccounts.find((a) => a.email === email);
    if (existing) {
      setCurrentEmail(email);
      setHistoryItems(existing.history || []);
    } else {
      const newAccount: UserAccount = {
        email,
        name,
        provider,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        history: historyItems,
      };
      setSavedAccounts((prev) => [newAccount, ...prev]);
      setCurrentEmail(email);
    }
  };

  const handleSwitchAccount = (email: string) => {
    const target = savedAccounts.find((a) => a.email === email);
    if (target) {
      setCurrentEmail(email);
      setHistoryItems(target.history || []);
    }
  };

  const handleLogout = () => {
    setCurrentEmail(null);
    setHistoryItems([]);
  };

  const handleRemoveAccount = (email: string) => {
    setSavedAccounts((prev) => prev.filter((a) => a.email !== email));
    if (currentEmail === email) {
      setCurrentEmail(null);
      setHistoryItems([]);
    }
  };

  const handleAddHistory = (item: ProcessedHistoryItem) => {
    setHistoryItems((prev) => [item, ...prev]);
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
  };

  const handleRedownloadHistoryItem = (item: ProcessedHistoryItem) => {
    if (item.dataUrl) {
      const link = document.createElement('a');
      link.href = item.dataUrl;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openPreview = (dataUrl: string, fileName: string, bytes: number) => {
    setPreviewModal({
      isOpen: true,
      dataUrl,
      fileName,
      bytes,
    });
  };

  const handleSelectTool = (toolId: ToolId) => {
    if (toolId === 'android-package') {
      setIsAndroidModalOpen(true);
    } else {
      setActiveToolId(toolId);
    }
  };

  const activeToolObj = TOOLS_LIST.find((t) => t.id === activeToolId);

  const handleUpdateUserPro = (planName: string, paymentMethod: string) => {
    if (currentEmail) {
      setSavedAccounts((prev) =>
        prev.map((acc) =>
          acc.email === currentEmail
            ? { ...acc, isPro: true, subscriptionPlan: planName, subscriptionMethod: paymentMethod }
            : acc
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAndroidPackage={() => setIsAndroidModalOpen(true)}
        activeToolName={activeToolObj?.name}
        onBackToHome={() => setActiveToolId(null)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenGeminiAi={() => setActiveToolId('gemini-ai-chat')}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!activeToolId && bottomNavTab === 'home' && (
          <HomeScreen
            currentUser={currentUser}
            onSelectTool={handleSelectTool}
            historyItems={historyItems}
            onOpenPreview={openPreview}
            onOpenGeminiAi={() => setActiveToolId('gemini-ai-chat')}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        )}

        {!activeToolId && bottomNavTab === 'create' && (
          <TemplateGallery
            onSelectTool={handleSelectTool}
            onOpenPreview={openPreview}
          />
        )}

        {!activeToolId && bottomNavTab === 'tools' && <ToolGrid onSelectTool={handleSelectTool} />}

        {activeToolId === 'gemini-ai-chat' && (
          <GeminiAiChatTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
            historyItems={historyItems}
            currentUser={currentUser}
          />
        )}

        {activeToolId === 'create-resume' && (
          <CreateResumeTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'create-podcast' && (
          <CreatePodcastTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'create-flyer' && (
          <CreateFlyerTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'whatsapp-greeting' && (
          <WhatsappGreetingTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'bg-remover' && (
          <RemoveBgTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'image-to-pdf' && (
          <ImageToPdfTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'camera-scanner' && (
          <CameraScannerTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
            currentUser={currentUser}
          />
        )}

        {activeToolId === 'merge-pdf' && (
          <MergePdfTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'split-pdf' && (
          <SplitPdfTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'organize-rotate' && (
          <OrganizeRotateTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'pdf-to-image' && (
          <PdfToImageTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
          />
        )}

        {activeToolId === 'compress-pdf' && (
          <CompressPdfTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'protect-pdf' && (
          <ProtectUnlockTool
            mode="protect"
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'unlock-pdf' && (
          <ProtectUnlockTool
            mode="unlock"
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'watermark-pdf' && (
          <WatermarkTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'text-to-pdf' && (
          <TextToPdfTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'sign-annotate' && (
          <SignAnnotateTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}

        {activeToolId === 'pdf-ocr' && (
          <OcrTool
            onBack={() => setActiveToolId(null)}
            onAddHistory={handleAddHistory}
            onOpenPreview={openPreview}
          />
        )}
      </main>

      {/* Fixed WhatsApp Share Button at Bottom Left (Positioned above Bottom Nav) */}
      <a
        id="btn-floating-whatsapp-share"
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
          '✨ RightPDF Converter & AI Studio: Create PDFs, Resumes, Flyers, Podcasts, WhatsApp Greetings & Remove Image Backgrounds online!'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 sm:bottom-20 left-4 sm:left-6 z-40 p-3 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border border-emerald-300/30"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform fill-white/20" />
        <span className="hidden sm:inline text-xs sm:text-sm font-extrabold tracking-tight">WhatsApp Share</span>
        <Send className="w-3.5 h-3.5 text-emerald-100 hidden sm:inline" />
      </a>

      {/* Floating Gemini AI Quick Trigger */}
      {activeToolId !== 'gemini-ai-chat' && (
        <button
          id="btn-floating-open-gemini-ai"
          onClick={() => setActiveToolId('gemini-ai-chat')}
          className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 z-40 p-3 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-blue-500 to-purple-500 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border border-white/30"
          title="Open Gemini AI Document Assistant"
        >
          <Bot className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-xs sm:text-sm font-extrabold tracking-tight">Open Gemini AI 🌈</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        </button>
      )}

      {/* Footer (Padded at bottom so content isn't obscured by fixed BottomNav) */}
      <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 mb-14 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-blue-500 to-purple-500" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-emerald-500 to-purple-500">RightPDF Converter PRO 🌈</span>. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">com.iims.rightpdfconverter</span>
            <span>•</span>
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="hover:text-purple-600 dark:hover:text-purple-400 font-bold underline"
            >
              Play Store Specification
            </button>
          </div>
        </div>
      </footer>

      {/* Fixed Bottom Navigation Bar (As shown in Blue Corporate mockup) */}
      <BottomNav
        activeTab={bottomNavTab}
        onSelectTab={handleBottomNavSelect}
      />

      {/* Modals & Drawers */}
      <RecentHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyItems={historyItems}
        onClearHistory={handleClearHistory}
        onRedownload={handleRedownloadHistoryItem}
      />

      <AndroidPackageModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      <PdfPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        pdfDataUrl={previewModal.dataUrl}
        fileName={previewModal.fileName}
        fileSizeBytes={previewModal.bytes}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        savedAccounts={savedAccounts}
        onLogin={handleLogin}
        onSwitchAccount={handleSwitchAccount}
        onLogout={handleLogout}
        onRemoveAccount={handleRemoveAccount}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        currentUser={currentUser}
        onUpdateUserPro={handleUpdateUserPro}
      />
    </div>
  );
}
