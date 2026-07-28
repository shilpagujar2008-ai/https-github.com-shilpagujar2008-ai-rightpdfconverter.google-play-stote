import React from 'react';
import { Home, Grid, FileText, History, User } from 'lucide-react';

export type NavTabId = 'home' | 'tools' | 'files' | 'history' | 'profile' | 'create' | 'pdf-spaces';

interface BottomNavProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'tools' as const, label: 'Tools', icon: Grid },
    { id: 'files' as const, label: 'Files', icon: FileText },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-xl px-2 py-1.5 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-bottom-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-blue-600 dark:text-blue-400' : 'stroke-2'}`} />
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -top-0.5 w-6 h-1 rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-blue-500 to-purple-500 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

