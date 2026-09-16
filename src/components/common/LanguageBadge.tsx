import React, { useState } from 'react';
import { HelpCircle, Sparkles, X } from 'lucide-react';
import { LanguageMode } from '../../types/tax';

interface LanguageBadgeProps {
  term: string;
  simpleEn: string;
  simpleHinglish: string;
  bureaucraticName?: string;
  lang: LanguageMode;
}

const badgeLabels: Record<LanguageMode, { btn: string; header: string; govt: string }> = {
  en: { btn: 'Easy Explain', header: 'Zero-Jargon Explainer', govt: 'Government Bureaucratic Term:' },
  ml: { btn: 'ലളിത വിവരണം', header: 'ലളിതമായ വിശദീകരണം', govt: 'ഔദ്യോഗിക സർക്കാർ പദം:' },
  hi: { btn: 'सरल व्याख्या', header: 'सरल भाषा में समझें', govt: 'सरकारी कानूनी नाम:' },
  hinglish: { btn: 'Aasaan Bhasha', header: 'Zero-Jargon Explainer', govt: 'Sarkari Kagazi Naam:' },
  ta: { btn: 'எளிய விளக்கம்', header: 'எளிய தமிழ் விளக்கம்', govt: 'அரசு அதிகாரப்பூர்வ சொல்:' },
  te: { btn: 'సులభ వివరణ', header: 'సులభ తెలుగు వివరణ', govt: 'ప్రభుత్వ అధికారిక పదం:' },
  kn: { btn: 'ಸುಲಭ ವಿವರಣೆ', header: 'ಸುಲಭ ಕನ್ನಡ ವಿವರಣೆ', govt: 'ಸರ್ಕಾರಿ ಕಾಗದಪತ್ರದ ಹೆಸರು:' },
  bn: { btn: 'সহজ ব্যাখ্যা', header: 'সহজ ভাষার ব্যাখ্যা', govt: 'সরকারি দাপ্তরিক পরিভাষা:' },
  mr: { btn: 'सोपे स्पष्टीकरण', header: 'सोप्या भाषेत अर्थ', govt: 'शासकीय तांत्रिक नाव:' },
  gu: { btn: 'સરળ સમજૂતી', header: 'સરળ ભાષામાં સમજૂતી', govt: 'સરકારી સત્તાવાર નામ:' },
};

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({
  term,
  simpleEn,
  simpleHinglish,
  bureaucraticName,
  lang,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const localized = badgeLabels[lang] || badgeLabels.en;

  return (
    <div className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-[#1A1A1A] text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-white/[0.1] transition-colors"
        title="Click for zero-jargon explanation"
      >
        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
        <span className="inline">{localized.btn}</span>
        <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 bottom-full mb-2 w-72 sm:w-80 p-4 bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-m3-3 border border-slate-200 dark:border-white/[0.08] z-50 animate-in fade-in zoom-in-95 text-left">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {localized.header}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-[#141414] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block mb-0.5">{term}</span>
                <p className="text-slate-700 dark:text-neutral-300 font-medium leading-relaxed bg-blue-50/70 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-100/60 dark:border-blue-900/40">
                  {lang === 'hinglish' ? simpleHinglish : simpleEn}
                </p>
              </div>

              {bureaucraticName && (
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-neutral-500 block">
                    {localized.govt}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 italic mt-0.5 font-mono">
                    "{bureaucraticName}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
