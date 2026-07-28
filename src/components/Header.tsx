import React from 'react';
import { FileText, History, Smartphone, Moon, Sun, ShieldCheck, Mail, Bot, Sparkles, Crown, Bell, Search } from 'lucide-react';
import { UserAccount } from '../types';
import { RightPdfLogo } from './RightPdfLogo';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenHistory: () => void;
  onOpenAndroidPackage: () => void;
  activeToolName?: string;
  onBackToHome: () => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onOpenGeminiAi?: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenHistory,
  onOpenAndroidPackage,
  activeToolName,
  onBackToHome,
  currentUser,
  onOpenAuth,
  onOpenGeminiAi,
  onOpenPricing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBackToHome}>
          <RightPdfLogo size="md" showText={true} />
        </div>

        {/* Center: Subscribe / Buying Plan Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPricing || onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-md hover:scale-105 transition-all border border-purple-400/30"
          >
            <span>{currentUser?.isPro ? 'VIP Active' : 'Subscribe'}</span>
            <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          </button>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Bell Notifications */}
          <button
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>
          {/* Gemini AI Conversation Button */}
          {onOpenGeminiAi && (
            <button
              id="btn-header-open-gemini-ai"
              onClick={onOpenGeminiAi}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-red-500 via-amber-500 via-emerald-500 via-blue-500 to-purple-500 text-white shadow-md shadow-purple-500/20 hover:scale-105 transition-all border border-white/20"
              title="Open Gemini AI Document Assistant"
            >
              <Bot className="w-4 h-4 text-amber-200" />
              <span className="hidden md:inline">Gemini AI</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </button>
          )}

          {/* Email / Google User Account Button */}
          <button
            id="btn-user-auth"
            onClick={onOpenAuth}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${
              currentUser
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/80'
                : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent hover:shadow'
            }`}
            title={currentUser ? `Logged in as ${currentUser.email}` : 'Sign in with Gmail / Email'}
          >
            {currentUser ? (
              <>
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] sm:max-w-[140px] truncate">
                  {currentUser.email.split('@')[0]}
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-blue-100" />
                <span>Mail Login</span>
              </>
            )}
          </button>

          {/* Android Package Badge & Play Store Button */}
          <button
            id="btn-android-package-spec"
            onClick={onOpenAndroidPackage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all shadow-sm"
            title="Google Play Package Configuration: com.iims.rightpdfconverter"
          >
            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">com.iims.rightpdfconverter</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </button>

          {/* History Button */}
          <button
            id="btn-conversion-history"
            onClick={onOpenHistory}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Conversion History"
          >
            <History className="w-5 h-5" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
