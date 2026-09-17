import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/tax';
import {
  calculateAdvanceTaxInstallments,
  calculateNewRegimeTax,
  calculateOldRegimeTax,
  formatINR,
} from '../../services/taxCalculator';
import {
  X,
  Calculator,
  Sparkles,
  Check,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaxPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onApplyCustomTax: (updatedProfile: Partial<UserProfile>) => void;
}

export const TaxPlaygroundModal: React.FC<TaxPlaygroundModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onApplyCustomTax,
}) => {
  const [grossSalary, setGrossSalary] = useState(currentUser.grossIncome);
  const [freelanceIncome, setFreelanceIncome] = useState(currentUser.otherIncome);
  const [stcg, setStcg] = useState(currentUser.capitalGains.stcg);
  const [ltcg, setLtcg] = useState(currentUser.capitalGains.ltcg);
  const [employerTds, setEmployerTds] = useState(currentUser.salaryTds);
  const [sec80C] = useState(150000);
  const [sec80D] = useState(25000);
  const [homeLoan24b] = useState(0);

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

  // Build a preview user
  const previewUser: UserProfile = {
    ...currentUser,
    grossIncome: grossSalary,
    otherIncome: freelanceIncome,
    salaryTds: employerTds,
    capitalGains: {
      stcg,
      ltcg,
    },
  };

  const normalIncome = grossSalary + freelanceIncome;
  const isSalaried = currentUser.profileType === 'salaried';

  // Budget 2024 Special Rate Capital Gains:
  const stcgTax = Math.round(stcg * 0.20 * 1.04);
  const taxableLtcg = Math.max(0, ltcg - 125000);
  const ltcgTax = Math.round(taxableLtcg * 0.125 * 1.04);
  const totalGainsTax = stcgTax + ltcgTax;

  const newTax = calculateNewRegimeTax(normalIncome, isSalaried) + totalGainsTax;
  const oldTax =
    calculateOldRegimeTax(normalIncome, {
      stdDeduction: isSalaried ? 50000 : 0,
      sec80C,
      sec80D,
      homeLoan24b,
    }) + totalGainsTax;

  const advanceData = calculateAdvanceTaxInstallments(previewUser);
  const recommendedRegime = newTax <= oldTax ? 'new' : 'old';

  const handleApply = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0B57D0', '#146C2E'],
    });

    onApplyCustomTax({
      grossIncome: grossSalary,
      otherIncome: freelanceIncome,
      salaryTds: employerTds,
      capitalGains: {
        stcg,
        ltcg,
      },
      regime: recommendedRegime,
    });
    onClose();
  };

  const handleReset = () => {
    setGrossSalary(currentUser.grossIncome);
    setFreelanceIncome(currentUser.otherIncome);
    setStcg(currentUser.capitalGains.stcg);
    setLtcg(currentUser.capitalGains.ltcg);
    setEmployerTds(currentUser.salaryTds);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-m3-4 border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-m3-surface-container-low dark:bg-[#090D16] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-m3-primary-container dark:bg-blue-950/60 text-m3-on-primary-container dark:text-blue-300 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-m3-primary dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Interactive Tax & Autopay Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Adjust your real income numbers to see dynamic advance tax milestones and regime savings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title="Reset to current user numbers"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              aria-label="Close simulator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Section (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
              1. Your Income & Deductions (FY 2026-27)
            </span>

            {/* Annual Salary / Business Revenue */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Gross Annual Salary / Primary Income:</span>
                <span className="font-black text-blue-800 dark:text-blue-400 text-sm">{formatINR(grossSalary)}</span>
              </div>
              <input
                type="range"
                min={500000}
                max={5000000}
                step={50000}
                value={grossSalary}
                onChange={(e) => setGrossSalary(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-400 font-mono">
                <span>₹5 Lakhs</span>
                <span>₹25 Lakhs</span>
                <span>₹50 Lakhs</span>
              </div>
            </div>

            {/* Employer TDS deducted */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Employer TDS (Already Deducted):</span>
                <span className="font-black text-emerald-800 dark:text-emerald-400 text-sm">{formatINR(employerTds)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000000}
                step={10000}
                value={employerTds}
                onChange={(e) => setEmployerTds(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-300">
                Directly reduces your advance tax liability in Form 26AS.
              </p>
            </div>

            {/* Freelance & Capital Gains grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Short Term Capital Gains */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Equity STCG (20%):</span>
                  <span>{formatINR(stcg)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={10000}
                  value={stcg}
                  onChange={(e) => setStcg(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Long Term Capital Gains */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Equity LTCG (12.5%):</span>
                  <span>{formatINR(ltcg)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1500000}
                  step={25000}
                  value={ltcg}
                  onChange={(e) => setLtcg(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Freelance / Consulting */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Freelancing & Other Income:</span>
                <span>{formatINR(freelanceIncome)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1500000}
                step={20000}
                value={freelanceIncome}
                onChange={(e) => setFreelanceIncome(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Real-time Dynamic Result Panel (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
              2. Dynamic Autopilot Projections
            </span>

            {/* Regime Recommendation Badge */}
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-2 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-700 dark:text-blue-400 uppercase font-bold tracking-wider text-[10px]">
                  Optimal Selection
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/40 text-[10px]">
                  ★ Best Choice
                </span>
              </div>

              <h4 className="text-lg font-black text-slate-900 dark:text-white capitalize">
                {recommendedRegime} Tax Regime Recommended
              </h4>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/80 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-300 text-[11px] block">New Regime Tax:</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{formatINR(newTax)}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-300 text-[11px] block">Old Regime Tax:</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{formatINR(oldTax)}</span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold pt-1">
                Saves {formatINR(Math.abs(newTax - oldTax))} automatically!
              </p>
            </div>

            {/* Quarterly Installments Preview */}
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Net Advance Tax Payable:</span>
                <span className="font-extrabold text-blue-900 dark:text-blue-400 text-sm">
                  {formatINR(advanceData.netAdvanceTaxDue)}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {advanceData.installments.map((inst) => (
                  <div
                    key={inst.quarter}
                    className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-700"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {inst.quarter} ({inst.deadline}):
                    </span>
                    <span className="font-black text-slate-900 dark:text-white">
                      {formatINR(inst.installmentDue)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-[11px] text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Penalty Shield:</strong> Prevents ~{formatINR(advanceData.penaltiesPrevented)} in Section 234C fines.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0F172A] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-m3-primary hover:bg-m3-primary-hover text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply to My Active Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
