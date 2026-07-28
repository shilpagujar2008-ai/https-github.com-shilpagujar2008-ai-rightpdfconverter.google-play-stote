import React, { useState } from 'react';
import { X, History, Trash2, Download, FileText, Search } from 'lucide-react';
import { ProcessedHistoryItem } from '../types';
import { formatBytes } from '../utils/pdfEngine';

interface RecentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: ProcessedHistoryItem[];
  onClearHistory: () => void;
  onRedownload: (item: ProcessedHistoryItem) => void;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  isOpen,
  onClose,
  historyItems,
  onClearHistory,
  onRedownload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredItems = historyItems.filter((item) =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                Conversion History
              </h2>
            </div>
            <button
              id="btn-close-history"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          {historyItems.length > 0 && (
            <div className="mt-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-search-history"
                type="text"
                placeholder="Search history by file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* List of items */}
          <div className="mt-4 space-y-3 flex-1 overflow-y-auto pr-1">
            {historyItems.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">No conversion history yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Files you create or edit will appear here for easy access.
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No files found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-red-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.fileName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{formatBytes(item.sizeBytes)}</span>
                        <span>•</span>
                        <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  </div>

                  {item.dataUrl && (
                    <button
                      onClick={() => onRedownload(item)}
                      className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors shrink-0"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {historyItems.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {filteredItems.length} of {historyItems.length} stored file{historyItems.length === 1 ? '' : 's'}
            </span>
            <button
              id="btn-clear-history"
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
