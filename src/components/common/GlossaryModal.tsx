import React, { useEffect } from 'react';
import { LanguageMode } from '../../types/tax';
import { taxGlossary } from '../../data/taxGlossary';
import { X, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageMode;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  lang,
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
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-m3-4 border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-m3-surface-container-low dark:bg-[#0B1325] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 flex items-center justify-center border border-amber-200 dark:border-amber-800/40">
              <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Tax Jargon-Buster (Zero-Confusion Dictionary)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Government terms translated into everyday human language
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Glossary Items List */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {taxGlossary.map((item) => (
            <div
              key={item.term}
              className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-sm font-black text-slate-900 dark:text-white">{item.term}</span>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-400 italic">
                  Govt: {item.bureaucraticName}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-[#0C1E3D] border border-blue-100 dark:border-blue-700/60 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                <span className="font-bold text-blue-900 dark:text-blue-300 block text-[11px] mb-0.5">
                  In Plain Words:
                </span>
                {lang === 'hinglish' ? item.simpleMeaning.hinglish : item.simpleMeaning.en}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="text-rose-900 dark:text-rose-300 bg-rose-50/60 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/40">
                  <strong className="block text-rose-950 dark:text-rose-200 mb-0.5">Why it matters:</strong>
                  {item.whyItMatters}
                </div>
                <div className="text-emerald-900 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <strong className="block text-emerald-950 dark:text-emerald-200 mb-0.5">How KarSetu handles it:</strong>
                  {item.autoSolution}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
