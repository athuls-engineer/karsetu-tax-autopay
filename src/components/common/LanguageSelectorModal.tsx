import React, { useEffect } from 'react';
import { LanguageMode } from '../../types/tax';
import { supportedLanguages } from '../../data/translations';
import { X, Globe2, Check, Sparkles } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageMode;
  onSelectLang: (lang: LanguageMode) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLang,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl max-w-xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-m3-4 border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-m3-surface-container-low dark:bg-[#0B1325] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Choose Language / ഭാഷ തിരഞ്ഞെടുക്കുക
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                10 Indian subcontinent languages with 100% complete translation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto flex-1">
          {supportedLanguages.map((lang) => {
            const isSelected = currentLang === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLang(lang.code);
                  onClose();
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-[#0C1E3D] dark:border-blue-400/60 shadow-sm ring-1 ring-blue-500/50'
                    : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 bg-white dark:bg-[#1E293B]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-slate-900 dark:text-white tracking-tight">
                      {lang.nativeName}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
                    {lang.englishName} • {lang.region}
                  </span>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Select
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Tip */}
        <div className="p-4 bg-slate-50 dark:bg-[#0B1325] border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Zero-jargon translations crafted specifically for effortless Indian tax compliance.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
