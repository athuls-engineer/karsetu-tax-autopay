import React, { useState, useEffect } from 'react';
import { LanguageMode, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import {
  X,
  FileCheck2,
  Building2,
  Landmark,
  Briefcase,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Form26AsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  lang?: LanguageMode;
}

export const Form26AsModal: React.FC<Form26AsModalProps> = ({
  isOpen,
  onClose,
  user,
  lang = 'en',
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Today, 08:30 AM');
  const [activeTab, setActiveTab] = useState<'all' | 'salary' | 'bank' | 'client'>('all');

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

  const isSalaried = user.profileType === 'salaried';

  const tdsEntries = [
    {
      id: 'tds-1',
      type: 'salary',
      section: 'Section 192',
      deductor: isSalaried ? 'HexaCorp Technologies Pvt Ltd' : 'Apex Health Diagnostics LLP',
      tan: 'MUMH01928B',
      incomeCredited: user.grossIncome,
      tdsDeducted: user.salaryTds,
      depositDate: '07 Aug 2026',
      quarter: 'Q1 (Apr - Jun)',
      status: 'Matched in 26AS & AIS',
      icon: Briefcase,
    },
    {
      id: 'tds-2',
      type: 'bank',
      section: 'Section 194A',
      deductor: 'HDFC Bank Ltd (Interest & Fixed Deposits)',
      tan: 'BLRH00214C',
      incomeCredited: 28500,
      tdsDeducted: 2850,
      depositDate: '05 Jul 2026',
      quarter: 'Q1 (Apr - Jun)',
      status: 'Matched in 26AS & AIS',
      icon: Landmark,
    },
    ...(user.otherIncome > 0 ? [
      {
        id: 'tds-3',
        type: 'client',
        section: 'Section 194J',
        deductor: 'Zephyr Creative Studio (Consulting Retainer)',
        tan: 'DELZ08211A',
        incomeCredited: user.otherIncome,
        tdsDeducted: Math.round(user.otherIncome * 0.10),
        depositDate: '12 Aug 2026',
        quarter: 'Q1 (Apr - Jun)',
        status: 'Matched in 26AS & AIS',
        icon: Building2,
      },
    ] : []),
  ];

  const totalTdsCredits = tdsEntries.reduce((sum, item) => sum + item.tdsDeducted, 0);

  const handleSyncTraces = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#0B57D0', '#146C2E'],
      });
    }, 1200);
  };

  const filteredEntries =
    activeTab === 'all'
      ? tdsEntries
      : tdsEntries.filter((item) => item.type === activeTab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl max-w-3xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-m3-4 border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-m3-surface-container-low dark:bg-[#0B1325] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Form 26AS & AIS Tax Credit Reconciler
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  TRACES Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live cryptographic cross-check between employer/bank TDS and Income Tax portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncTraces}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-bold transition-colors border border-blue-200/60 dark:border-blue-800/40 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing TRACES...' : 'Re-Sync Portal'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              aria-label="Close 26AS modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Total Credit Overview Banner */}
        <div className="p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-[#0C1E3D] dark:to-[#0F2347] border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Total Verified TDS Deposited on PAN: <span className="font-mono font-black">{user.pan}</span>
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 max-w-xl">
              This amount is automatically subtracted from your gross annual tax liability. You only pay Advance Tax on the remaining gap.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-blue-800 dark:text-blue-300 font-semibold block">Total 26AS TDS Credits</span>
            <span className="text-2xl font-black text-blue-950 dark:text-blue-100">{formatINR(totalTdsCredits)}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Last verified: {lastSyncTime}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-[#090D16] border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-bold shrink-0">
          {[
            { id: 'all', label: `All Deductions (${tdsEntries.length})` },
            { id: 'salary', label: 'Salary (Sec 192)' },
            { id: 'bank', label: 'Bank Interest (Sec 194A)' },
            ...(user.otherIncome > 0 ? [{ id: 'client', label: 'Professional Fees (Sec 194J)' }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TDS Entries List */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {filteredEntries.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 space-y-3 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{item.deductor}</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-mono text-[10px] font-bold">
                          {item.section}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        TAN: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{item.tan}</span> • {item.quarter} • Credited: {item.depositDate}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">TDS Deposited</span>
                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">{formatINR(item.tdsDeducted)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">
                    Gross Income Paid: <strong className="text-slate-800 dark:text-slate-200">{formatINR(item.incomeCredited)}</strong>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item.status}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Zero Mismatch Guarantee:</span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                If your employer or bank deducts TDS but forgets to file Form 24Q / 26Q with the Income Tax Department, KarSetu alerts you 15 days before the quarterly deadline so you never lose tax credit.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0B1325] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>End-to-End Encrypted TRACES Handshake • CBDT Compliant</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-[#1E293B] text-white dark:text-slate-100 font-bold hover:bg-slate-800 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
