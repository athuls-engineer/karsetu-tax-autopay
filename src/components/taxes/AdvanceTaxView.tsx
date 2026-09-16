import React from 'react';
import { LanguageMode, QuarterlyInstallment, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { translations } from '../../data/translations';
import { LanguageBadge } from '../common/LanguageBadge';
import { Calendar, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface AdvanceTaxViewProps {
  user: UserProfile;
  installments: QuarterlyInstallment[];
  lang: LanguageMode;
  onOpenVaultWithId: (challanId: string) => void;
  onTriggerAutopay: (inst: QuarterlyInstallment) => void;
  onOpen26As?: () => void;
}

export const AdvanceTaxView: React.FC<AdvanceTaxViewProps> = ({
  user,
  installments,
  lang,
  onOpenVaultWithId,
  onTriggerAutopay,
  onOpen26As,
}) => {
  const t = translations[lang] || translations.en;

  const getActionLabels = () => {
    if (lang === 'ml') {
      return {
        viewChallan: 'ഔദ്യോഗിക ചെല്ലാൻ 280 കാണുക',
        payNow: '1-ക്ലിക്ക് വഴി ഇപ്പോൾ അടയ്ക്കുക',
        cumTarget: 'ആകെ ലക്ഷ്യം:',
      };
    }
    if (lang === 'hi') {
      return {
        viewChallan: 'आधिकारिक चालान 280 देखें',
        payNow: '1-क्लिक अभी भुगतान करें',
        cumTarget: 'संचयी लक्ष्य:',
      };
    }
    if (lang === 'ta') {
      return {
        viewChallan: 'அதிகாரப்பூர்வ சலான் 280 பார்க்க',
        payNow: '1-கிளிக் இப்போது செலுத்துங்கள்',
        cumTarget: 'மொத்த இலக்கு:',
      };
    }
    return {
      viewChallan: 'View Official Challan 280',
      payNow: 'Test 1-Click Pay Now',
      cumTarget: 'Cumulative Target:',
    };
  };

  const actionLabels = getActionLabels();

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-4xl p-6 sm:p-8 border border-slate-200 dark:border-white/[0.08] shadow-m3-1 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300">
                Direct Tax Rail (TIN 2.0)
              </span>
              <LanguageBadge
                term="Advance Tax Autopilot"
                simpleEn="Pays your income tax in 4 quarterly installments (15%, 45%, 75%, 100%) so the government charges zero 1% monthly interest penalty."
                simpleHinglish="Quarterly tax auto-pay hota hai taaki late fee byaaj na bharna pade."
                bureaucraticName="Section 208 of Income Tax Act 1961"
                lang={lang}
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
              {t.tabAdvance} (Challan 280)
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-xl">
              {t.radarSubtitle}
            </p>
          </div>

          <div
            onClick={onOpen26As}
            className={`p-4 rounded-3xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-right shrink-0 transition-all ${
              onOpen26As
                ? 'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:scale-[1.02] active:scale-95 shadow-2xs group'
                : ''
            }`}
          >
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs text-blue-800 dark:text-blue-300 font-semibold block">
                Employer TDS Already Paid
              </span>
              {onOpen26As && (
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100">
                  ↗
                </span>
              )}
            </div>
            <span className="text-xl font-black text-blue-950 dark:text-blue-100">
              {formatINR(user.salaryTds)}
            </span>
            <span className="text-[11px] text-blue-700 dark:text-blue-400 block mt-0.5 group-hover:underline">
              {onOpen26As ? 'View Form 26AS & AIS Sync →' : 'Credited in Form 26AS'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quarter Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {installments.map((inst) => {
          const isPaid = inst.status === 'paid';
          const isScheduled = inst.status === 'scheduled';

          return (
            <div
              key={inst.quarter}
              className={`p-6 rounded-4xl border transition-all flex flex-col justify-between ${
                isScheduled
                  ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 dark:border-blue-500/70 shadow-m3-2 ring-1 ring-blue-500/20'
                  : isPaid
                  ? 'bg-white dark:bg-[#0A0A0A] border-emerald-200 dark:border-emerald-800/40'
                  : 'bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {inst.quarter} ({inst.periodLabel})
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-neutral-400">
                      {inst.targetPercentage}%
                    </span>
                  </div>

                  {isPaid ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t.amountAutopaid}
                    </span>
                  ) : isScheduled ? (
                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {t.tomorrowBadge}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-neutral-400 text-xs font-medium">
                      {t.upcomingBadge}
                    </span>
                  )}
                </div>

                <div className="space-y-1 mb-4">
                  <span className="text-xs text-slate-500 dark:text-neutral-400">
                    {isPaid ? t.amountAutopaid : t.scheduledInstallment}
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatINR(isPaid ? inst.paidAmount : inst.installmentDue)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    {actionLabels.cumTarget} {formatINR(inst.cumulativeLiability)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-neutral-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {t.dueLabel} <strong className="text-slate-900 dark:text-slate-200">{inst.deadline}</strong>
                </span>

                {isPaid && inst.challanId ? (
                  <button
                    onClick={() => onOpenVaultWithId(inst.challanId!)}
                    className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {actionLabels.viewChallan} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : isScheduled ? (
                  <button
                    onClick={() => onTriggerAutopay(inst)}
                    className="font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {actionLabels.payNow} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
