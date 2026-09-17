import React, { useState } from 'react';
import { LanguageMode, TaxRegime, UserProfile } from '../../types/tax';
import { calculateNewRegimeTax, calculateOldRegimeTax, formatINR } from '../../services/taxCalculator';
import { translations } from '../../data/translations';
import { LanguageBadge } from '../common/LanguageBadge';
import { Scale, Check, TrendingDown } from 'lucide-react';

interface RegimeBattleCardProps {
  user: UserProfile;
  lang: LanguageMode;
  onUpdateRegime: (regime: TaxRegime) => void;
}

export const RegimeBattleCard: React.FC<RegimeBattleCardProps> = ({
  user,
  lang,
  onUpdateRegime,
}) => {
  const [sec80C] = useState(150000);
  const [sec80D] = useState(25000);
  const [homeLoan24b] = useState(0);

  const t = translations[lang] || translations.en;

  const totalIncome =
    user.grossIncome +
    user.otherIncome +
    user.capitalGains.stcg * 0.20 +
    user.capitalGains.ltcg * 0.125;

  const isSalaried = user.profileType === 'salaried';

  const newTax = calculateNewRegimeTax(totalIncome, isSalaried);
  const oldTax = calculateOldRegimeTax(totalIncome, {
    stdDeduction: isSalaried ? 50000 : 0,
    sec80C,
    sec80D,
    homeLoan24b,
  });

  const difference = Math.abs(newTax - oldTax);
  const betterRegime: TaxRegime = newTax <= oldTax ? 'new' : 'old';

  const getSavesLabel = () => {
    const regimeName = betterRegime === 'new' ? t.newRegime : t.oldRegime;
    if (lang === 'ml') return `${regimeName} തിരഞ്ഞെടുത്താൽ ${formatINR(difference)} ലാഭം!`;
    if (lang === 'hi') return `${regimeName} में ${formatINR(difference)} की सीधी बचत!`;
    if (lang === 'ta') return `${regimeName} மூலம் ${formatINR(difference)} மிச்சம்!`;
    if (lang === 'te') return `${regimeName} ఎంచుకుంటే ${formatINR(difference)} ఆదా!`;
    if (lang === 'kn') return `${regimeName} ನಲ್ಲಿ ${formatINR(difference)} ಉಳಿತಾಯ!`;
    if (lang === 'bn') return `${regimeName} এ ${formatINR(difference)} সাশ্রয়!`;
    if (lang === 'mr') return `${regimeName} मध्ये ${formatINR(difference)} बचत!`;
    if (lang === 'gu') return `${regimeName} માં ${formatINR(difference)} બચત!`;
    return `Saves ${formatINR(difference)} in ${betterRegime.toUpperCase()} Regime`;
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-4xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-m3-1 space-y-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center">
            <Scale className="w-5 h-5 text-purple-700 dark:text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t.regimeTitle}
              </h3>
              <LanguageBadge
                term="Tax Regime Choice"
                simpleEn="New regime has lower tax rates with ₹75k standard deduction. Old regime lets you deduct PF, ELSS, insurance and home loans."
                simpleHinglish="Naya system aamtaur par zyada sasta padta hai bina bill/investments collect kiye."
                lang={lang}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {t.regimeSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-500/40">
          <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{getSavesLabel()}</span>
        </div>
      </div>

      {/* Side-by-side Regime Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* New Regime Card */}
        <div
          onClick={() => onUpdateRegime('new')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer relative flex flex-col justify-between ${
            user.regime === 'new'
              ? 'bg-blue-50/80 dark:bg-[#0C1E3D] border-blue-600 dark:border-blue-400/70 ring-2 ring-blue-600/20 shadow-sm dark:shadow-[0_0_20px_-5px_rgba(59,130,246,0.35)]'
              : 'bg-slate-50 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          {betterRegime === 'new' && (
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              {t.recommended}
            </span>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">{t.newRegime}</span>
              {user.regime === 'new' && (
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> {t.activeBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300 mb-4">
              {t.newRegimeDesc}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/80 flex items-end justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-300 block">{t.totalAnnualTax}</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{formatINR(newTax)}</span>
            </div>
            <span className="text-xs text-blue-700 dark:text-blue-300 font-bold hover:underline">
              {t.selectNew}
            </span>
          </div>
        </div>

        {/* Old Regime Card */}
        <div
          onClick={() => onUpdateRegime('old')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer relative flex flex-col justify-between ${
            user.regime === 'old'
              ? 'bg-blue-50/80 dark:bg-[#0C1E3D] border-blue-600 dark:border-blue-400/70 ring-2 ring-blue-600/20 shadow-sm dark:shadow-[0_0_20px_-5px_rgba(59,130,246,0.35)]'
              : 'bg-slate-50 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          {betterRegime === 'old' && (
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              {t.recommended}
            </span>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">{t.oldRegime}</span>
              {user.regime === 'old' && (
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> {t.activeBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300 mb-4">
              {t.oldRegimeDesc}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/80 flex items-end justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-300 block">{t.totalAnnualTax}</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{formatINR(oldTax)}</span>
            </div>
            <span className="text-xs text-blue-700 dark:text-blue-300 font-bold hover:underline">
              {t.selectOld}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
