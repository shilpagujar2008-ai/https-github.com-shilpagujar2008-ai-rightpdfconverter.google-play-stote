import React, { useState } from 'react';
import {
  X,
  Mail,
  UserCheck,
  LogOut,
  Sparkles,
  ShieldCheck,
  Clock,
  Trash2,
  Key,
  CheckCircle2,
  Users,
  ArrowRight,
} from 'lucide-react';
import { UserAccount } from '../types';
import { RightPdfLogo } from './RightPdfLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  savedAccounts: UserAccount[];
  onLogin: (email: string, name: string, provider: 'google' | 'email') => void;
  onSwitchAccount: (email: string) => void;
  onLogout: () => void;
  onRemoveAccount: (email: string) => void;
  onOpenPricing?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  savedAccounts,
  onLogin,
  onSwitchAccount,
  onLogout,
  onRemoveAccount,
  onOpenPricing,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'accounts'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSimulatingGoogle, setIsSimulatingGoogle] = useState(false);
  const [googleSelectStep, setGoogleSelectStep] = useState(false);

  if (!isOpen) return null;

  const handleCustomEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    // Default name from email prefix if empty
    const derivedName = nameInput.trim() || emailInput.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

    onLogin(emailInput.trim().toLowerCase(), formattedName, 'email');
    setEmailInput('');
    setNameInput('');
    setPasswordInput('');
    onClose();
  };

  const handleGoogleSignInClick = () => {
    setGoogleSelectStep(true);
  };

  const handleSelectGoogleAccount = (gmail: string, name: string) => {
    setIsSimulatingGoogle(true);
    setTimeout(() => {
      onLogin(gmail, name, 'google');
      setIsSimulatingGoogle(false);
      setGoogleSelectStep(false);
      onClose();
    }, 800);
  };

  const handleCustomGoogleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    let gmail = emailInput.trim().toLowerCase();
    if (!gmail.includes('@')) {
      gmail = `${gmail}@gmail.com`;
    }

    const name = gmail.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    setIsSimulatingGoogle(true);
    setTimeout(() => {
      onLogin(gmail, formattedName, 'google');
      setIsSimulatingGoogle(false);
      setGoogleSelectStep(false);
      setEmailInput('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <RightPdfLogo size="sm" showText={false} />
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                RightPDF Account & Memory
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Email profile cloud synchronization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => {
              setActiveTab('signin');
              setGoogleSelectStep(false);
            }}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'signin'
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Sign In / Add Mail
            {activeTab === 'signin' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`ml-6 pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'accounts'
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <span>Saved Mail Memory ({savedAccounts.length})</span>
            {activeTab === 'accounts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Active Logged In Status Banner */}
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 dark:from-red-950/40 dark:via-rose-950/30 dark:to-slate-900 border border-red-200/60 dark:border-red-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm shadow">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-xs text-slate-900 dark:text-white">
                      {currentUser.name}
                    </p>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenPricing?.();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1"
                >
                  <span>{currentUser.isPro ? 'Pro Active' : 'Buying Plan'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                  title="Sign out of current account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'signin' && (
            <div className="space-y-4">
              {!googleSelectStep ? (
                <>
                  {/* Google OAuth Quick Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignInClick}
                    className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-sm flex items-center justify-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-750"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                      />
                    </svg>
                    <span>Sign in with Google / Gmail</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                    <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                      or mail login
                    </span>
                  </div>

                  {/* Standard Custom Email Form */}
                  <form onSubmit={handleCustomEmailSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address (Gmail / Any Email ID)
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="shilpagujar2008@gmail.com or your email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-red-500/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name / Alias (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Shilpa Gujar"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Account Access Password / PIN
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Log In & Sync Memory</span>
                    </button>
                  </form>
                </>
              ) : (
                /* Google Email Selection Popup View */
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                          <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                        </svg>
                        <span>Choose Google Account</span>
                      </span>

                      <button
                        onClick={() => setGoogleSelectStep(false)}
                        className="text-[11px] font-semibold text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Select an existing Google email or type your Gmail address:
                    </p>

                    {/* Pre-suggested quick Google emails */}
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          handleSelectGoogleAccount('shilpagujar2008@gmail.com', 'Shilpa Gujar')
                        }
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                            S
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-red-600">
                              Shilpa Gujar
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              shilpagujar2008@gmail.com
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                      </button>

                      <button
                        onClick={() =>
                          handleSelectGoogleAccount('user.work@gmail.com', 'Work Account')
                        }
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            W
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-red-600">
                              Work Account
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              user.work@gmail.com
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                      </button>
                    </div>

                    {/* Or enter custom gmail */}
                    <form onSubmit={handleCustomGoogleEmailSubmit} className="pt-2 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Or enter another Gmail account:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="another.user@gmail.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isSimulatingGoogle || !emailInput}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition-colors disabled:opacity-50"
                        >
                          {isSimulatingGoogle ? 'Connecting...' : 'Connect'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Accounts & Memory Tab */}
          {activeTab === 'accounts' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                RightPDF preserves conversion history, files, and preferences in memory for each email login profile:
              </p>

              {savedAccounts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <Users className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No email logins stored in memory yet
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Sign in with any Gmail or email address above to save its document history.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {savedAccounts.map((acc) => {
                    const isCurrent = currentUser?.email === acc.email;
                    return (
                      <div
                        key={acc.email}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                          isCurrent
                            ? 'bg-red-50/60 dark:bg-red-950/40 border-red-300 dark:border-red-900/80 shadow-sm'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          onClick={() => {
                            onSwitchAccount(acc.email);
                            onClose();
                          }}
                        >
                          <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                            {acc.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {acc.name}
                              </p>
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300">
                                  Current Profile
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {acc.email}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Saved History: {acc.history ? acc.history.length : 0} item(s)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isCurrent ? (
                            <button
                              onClick={() => {
                                onSwitchAccount(acc.email);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors shadow-sm"
                            >
                              Switch Memory
                            </button>
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          )}

                          <button
                            onClick={() => onRemoveAccount(acc.email)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Remove account from memory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              100% Client-side sandbox. All email profile histories are kept strictly in isolated local memory.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
