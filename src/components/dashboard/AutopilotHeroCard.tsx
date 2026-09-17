import React from 'react';
import { LanguageMode, TaxDueItem, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { translations } from '../../data/translations';
import {
  Zap,
  Calendar,
  Clock,
  ArrowUpRight,
  Smartphone,
  PauseCircle,
  PlayCircle,
  Sparkles,
} from 'lucide-react';

interface AutopilotHeroCardProps {
  user: UserProfile;
  nextTax: TaxDueItem;
  lang: LanguageMode;
  onOpenPreDebitAlert: () => void;
  onToggleMandatePause: () => void;
  onOpenSettings: () => void;
}

export const AutopilotHeroCard: React.FC<AutopilotHeroCardProps> = ({
  user,
  nextTax,
  lang,
  onOpenPreDebitAlert,
  onToggleMandatePause,
}) => {
  const isMandateActive = user.mandate.isActive;
  const t = translations[lang] || translations.en;

  const isAdvanceTax = nextTax.category === 'advance_tax';
  const displayTitle = isAdvanceTax ? t.heroTitle : nextTax.title;
  const displayDesc = isAdvanceTax ? t.heroDesc : (lang === 'hinglish' ? nextTax.easyDesc.hinglish : nextTax.easyDesc.en);

  return (
    <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-br from-[#0B57D0] via-[#0842A0] to-[#041E49] dark:from-[#0F2347] dark:via-[#0A162D] dark:to-[#081021] text-white p-4 sm:p-8 shadow-m3-3 dark:border dark:border-blue-500/30 dark:shadow-[0_0_50px_-15px_rgba(37,99,235,0.35)] transition-all duration-300">
      {/* Background Decorative Circles */}
      <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-blue-400/15 dark:bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-5 sm:space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold ${
                isMandateActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isMandateActive ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                }`}
              />
              {isMandateActive ? t.autopayActive : t.autopayPaused}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white/10 text-blue-100 border border-white/10 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              {user.mandate.mode === 'direct_sweep' ? t.directSweep : t.taxStash}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMandatePause}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer active:scale-95"
            >
              {isMandateActive ? (
                <>
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>{t.pauseBtn}</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>{t.resumeBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center: Next Scheduled Tax Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200/90 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              {t.nextScheduledLabel}
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {displayTitle}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              {displayDesc}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-blue-200">
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-blue-300" />
                {t.dueLabel} <strong className="text-white">{nextTax.dueDate}</strong>
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
                {t.sourceLabel} <strong className="text-white">{user.linkedBank.bankName}</strong>
              </span>
              <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                {t.savesSec234Badge}
              </span>
            </div>
          </div>

          {/* Amount & Direct Action */}
          <div className="lg:col-span-4 bg-white/10 dark:bg-[#0B1325]/90 backdrop-blur-md rounded-3xl p-5 border border-white/15 dark:border-blue-500/30 text-center flex flex-col items-center justify-center gap-3 shadow-lg">
            <div>
              <span className="text-xs uppercase font-bold text-blue-200 dark:text-blue-300/90 tracking-wider block">
                {t.calculatedLiability}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
                {formatINR(nextTax.amount)}
              </div>
              <span className="text-[11px] text-blue-200/80 dark:text-slate-300 block mt-0.5 font-medium whitespace-nowrap">
                {t.readyForChallan}
              </span>
            </div>

            <button
              onClick={onOpenPreDebitAlert}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-blue-50 text-blue-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-700 dark:text-emerald-600" />
              <span>{t.previewAlertBtn}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </button>
          </div>
        </div>

        {/* Bottom Stat Tickers */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-blue-200/70 dark:text-slate-300 block text-[11px]">{t.penaltiesSaved}</span>
            <span className="font-extrabold text-lg text-emerald-300 mt-0.5 block">
              {formatINR(user.stats.penaltiesSaved234)}
            </span>
          </div>

          <div>
            <span className="text-blue-200/70 dark:text-slate-300 block text-[11px]">{t.taxesAutopaid}</span>
            <span className="font-extrabold text-lg text-white mt-0.5 block">
              {user.stats.taxesAutopaidCount} {lang === 'en' ? 'Challans' : ''}
            </span>
          </div>

          <div>
            <span className="text-blue-200/70 dark:text-slate-300 block text-[11px]">{t.totalCompliant}</span>
            <span className="font-extrabold text-lg text-white mt-0.5 block">
              {formatINR(user.stats.totalAutopaidAmount)}
            </span>
          </div>

          <div>
            <span className="text-blue-200/70 dark:text-slate-300 block text-[11px]">{t.zeroLateFees}</span>
            <span className="font-extrabold text-lg text-emerald-300 mt-0.5 block">
              {t.zeroEver}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
