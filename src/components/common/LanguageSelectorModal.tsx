import React from 'react';
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#0A0A0A] rounded-4xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-m3-4 border border-slate-100 dark:border-white/[0.08] overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-m3-surface-container-low dark:bg-[#040404]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Choose Language / ഭാഷ തിരഞ്ഞെടുക്കുക
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                10 Indian subcontinent languages with 100% complete translation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#141414] rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
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
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-white/[0.1] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#1A263D] bg-white dark:bg-[#0E0E0E]'
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
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mt-0.5 font-medium">
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
        <div className="p-4 bg-slate-50 dark:bg-[#040404] border-t border-slate-100 dark:border-white/[0.08] text-center text-xs text-slate-500 dark:text-neutral-400">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Zero-jargon translations crafted specifically for effortless Indian tax compliance.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
