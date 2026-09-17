import React from 'react';
import { LanguageMode, QuarterlyInstallment, TaxDueItem, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { translations } from '../../data/translations';
import { LanguageBadge } from '../common/LanguageBadge';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';

interface TaxRadarTimelineProps {
  user: UserProfile;
  installments: QuarterlyInstallment[];
  propertyDue?: TaxDueItem;
  lang: LanguageMode;
  onSelectInstallment: (inst: QuarterlyInstallment) => void;
  onOpenVaultWithId: (challanId: string) => void;
  onOpenCalendar?: () => void;
}

export const TaxRadarTimeline: React.FC<TaxRadarTimelineProps> = ({
  user,
  installments,
  propertyDue,
  lang,
  onSelectInstallment,
  onOpenVaultWithId,
  onOpenCalendar,
}) => {
  const t = translations[lang] || translations.en;

  const getMilestoneLabel = (pct: number) => {
    if (lang === 'ml') return `${pct}% ലക്ഷ്യം`;
    if (lang === 'hi') return `${pct}% माइलस्टोन`;
    if (lang === 'ta') return `${pct}% இலக்கு`;
    if (lang === 'te') return `${pct}% మైలురాయి`;
    if (lang === 'kn') return `${pct}% ಮೈಲಿಗಲ್ಲು`;
    if (lang === 'bn') return `${pct}% লক্ষ্যমাত্রা`;
    if (lang === 'mr') return `${pct}% टप्पा`;
    if (lang === 'gu') return `${pct}% લક્ષ્ય`;
    return `${pct}% Milestone`;
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-4xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-m3-1 space-y-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {t.radarTitle}
            </h3>
            <LanguageBadge
              term="Quarterly Advance Tax Schedule"
              simpleEn="Indian law requires paying tax in 4 steps (15%, 45%, 75%, 100%) so you never pay interest penalties."
              simpleHinglish="Sarkar har 3 mahine thoda tax leti hai taaki aakhri me fine na bharna pade."
              bureaucraticName="Section 208 read with Section 211 of Income Tax Act 1961"
              lang={lang}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
            {t.radarSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {onOpenCalendar && (
            <button
              onClick={onOpenCalendar}
              className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700/60 flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Deadlines & iCal</span>
            </button>
          )}
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            {t.penaltyShieldActive}
          </span>
        </div>
      </div>

      {/* Visual Step Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {installments.map((inst) => {
          const isPaid = inst.status === 'paid';
          const isScheduled = inst.status === 'scheduled';

          return (
            <div
              key={inst.quarter}
              onClick={() => onSelectInstallment(inst)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isScheduled
                  ? 'bg-blue-50/80 dark:bg-[#0C1E3D] border-blue-500 dark:border-blue-400/60 shadow-m3-2 ring-2 ring-blue-500/20 dark:shadow-[0_0_20px_-5px_rgba(59,130,246,0.35)]'
                  : isPaid
                  ? 'bg-emerald-50/50 dark:bg-[#062417] border-emerald-200 dark:border-emerald-500/40 hover:border-emerald-300'
                  : 'bg-slate-50 dark:bg-[#1E293B] border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Top Row: Quarter & Target */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 shadow-2xs">
                  {inst.quarter} ({inst.periodLabel})
                </span>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isPaid
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : isScheduled
                      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-extrabold'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {getMilestoneLabel(inst.targetPercentage)}
                </span>
              </div>

              {/* Installment Amount & Status */}
              <div className="space-y-1 mb-4">
                <span className="text-xs text-slate-500 dark:text-slate-300 block">
                  {isPaid ? t.amountAutopaid : t.scheduledInstallment}
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white block tracking-tight">
                  {formatINR(isPaid ? inst.paidAmount : inst.installmentDue)}
                </span>
              </div>

              {/* Deadline & Action */}
              <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/80 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{inst.deadline}</span>
                </div>

                {isPaid ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (inst.challanId) onOpenVaultWithId(inst.challanId);
                    }}
                    className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5 hover:underline"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t.receiptBtn}
                  </button>
                ) : isScheduled ? (
                  <span className="text-blue-700 dark:text-blue-400 font-bold flex items-center gap-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {t.tomorrowBadge}
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-400 font-medium">{t.upcomingBadge}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Row: BBPS Municipal Property Tax Card */}
      {propertyDue && user.propertyDetails && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50/80 to-orange-50/60 dark:from-[#211606] dark:to-[#160E03] border border-amber-200/80 dark:border-amber-500/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 flex items-center justify-center border border-amber-200 dark:border-amber-500/40 shrink-0">
              <Building className="w-6 h-6 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {t.bbpsRailBadge}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border dark:border-emerald-500/30">
                  {t.earlyBirdActive}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                {user.propertyDetails.municipality} ({user.propertyDetails.ward})
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Property ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{user.propertyDetails.propertyId}</span> • {t.dueLabel} {propertyDue.dueDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-300 block">{t.annualTaxLabel}</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{formatINR(propertyDue.amount)}</span>
            </div>

            <button
              onClick={() => onOpenVaultWithId('BBPS-BBMP-8841')}
              className="px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              {t.inspectBbpsBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
