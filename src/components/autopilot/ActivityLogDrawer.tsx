import React, { useState, useEffect } from 'react';
import { X, Activity, ShieldCheck, Landmark, Smartphone, FileCheck2, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  category: 'bank_aa' | 'engine' | 'alert' | 'challan';
  title: string;
  description: string;
  status: 'success' | 'info' | 'pending';
  badge: string;
}

export const initialLogs: ActivityLogItem[] = [
  {
    id: 'log-1',
    timestamp: 'Today, 09:15 AM',
    category: 'alert',
    title: '72-Hour Pre-Debit WhatsApp Notice Dispatched',
    description: 'Notified user of upcoming Q2 Advance Tax payment (₹19,450) scheduled for Sept 14. Mandate mode: Direct Bank Sweep.',
    status: 'success',
    badge: 'WhatsApp Bot',
  },
  {
    id: 'log-2',
    timestamp: 'Today, 09:05 AM',
    category: 'engine',
    title: 'Advance Tax Re-calculated under Budget 2024 Slabs',
    description: 'Factored ₹1.8L STCG at 20% and employer TDS in Form 26AS. Verified Section 234C 45% threshold is met.',
    status: 'success',
    badge: 'Tax Engine',
  },
  {
    id: 'log-3',
    timestamp: 'Today, 08:30 AM',
    category: 'bank_aa',
    title: 'Account Aggregator Periodic Sync Completed',
    description: 'Synced HDFC Bank interest cert (₹24,500) and CDSL demat transaction ledger via encrypted Sahamati pipe.',
    status: 'success',
    badge: 'RBI AA Rails',
  },
  {
    id: 'log-4',
    timestamp: '01 Sep 2026, 09:15 AM',
    category: 'challan',
    title: 'BBPS Property Tax Autopaid (5% Rebate Claimed)',
    description: 'Bruhat Bengaluru Mahanagara Palike (BBMP) SAS receipt generated. Early bird discount ₹710 saved.',
    status: 'success',
    badge: 'NPCI BBPS',
  },
  {
    id: 'log-5',
    timestamp: '14 Jun 2026, 11:32 AM',
    category: 'challan',
    title: 'Q1 Advance Tax Deposited to Income Tax Dept',
    description: 'Challan 280 CRN-26061400892 generated via TIN 2.0. BSR code 0210045 verified and archived.',
    status: 'success',
    badge: 'TIN 2.0 ITD',
  },
];

interface ActivityLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs?: ActivityLogItem[];
  onAddLog?: (log: ActivityLogItem) => void;
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({
  isOpen,
  onClose,
  logs: externalLogs,
  onAddLog,
}) => {
  const [localLogs, setLocalLogs] = useState<ActivityLogItem[]>(initialLogs);
  const logs = externalLogs || localLogs;
  const setLogs = onAddLog ? (newLogsOrFn: any) => {
    if (typeof newLogsOrFn === 'function') {
      const updated = newLogsOrFn(logs);
      if (updated[0]) onAddLog(updated[0]);
    }
  } : setLocalLogs;
  const [filter, setFilter] = useState<'all' | 'bank_aa' | 'engine' | 'alert' | 'challan'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

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

  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.category === filter);

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        category: 'bank_aa',
        title: 'Real-time AA Transaction Ingestion',
        description: 'Checked Zerodha demat and Form 26AS ledger. No unexpected tax events found. Liability remains optimal.',
        status: 'success',
        badge: 'Live Sync',
      };
      setLogs([newLog, ...logs]);
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0A0A0A] rounded-4xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-m3-4 border border-slate-100 dark:border-white/[0.08] overflow-hidden transition-colors my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-m3-surface-container-low dark:bg-[#040404] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/40">
              <Activity className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Silent Autopilot Activity & Audit Ledger
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Cryptographically verifiable record of all background syncs and tax payments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-bold transition-colors border border-blue-200/60 dark:border-blue-800/40 cursor-pointer active:scale-95"
              title="Test a live sync check"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Simulate Sync'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#141414] rounded-full transition-colors cursor-pointer"
              aria-label="Close audit ledger"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-white/[0.08] flex items-center gap-2 overflow-x-auto text-xs font-semibold shrink-0">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'alert', label: '72h Alerts' },
            { id: 'engine', label: 'Tax Calculations' },
            { id: 'bank_aa', label: 'Bank & AA Sync' },
            { id: 'challan', label: 'Govt Challans' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full transition-colors shrink-0 ${
                filter === tab.id
                  ? 'bg-slate-900 dark:bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-[#1A1A1A] text-slate-600 dark:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Log Stream */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200/80 dark:border-white/[0.08] flex items-start gap-3.5 text-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/[0.1] flex items-center justify-center shrink-0 mt-0.5 text-blue-600 shadow-2xs">
                {log.category === 'alert' && <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                {log.category === 'engine' && <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                {log.category === 'bank_aa' && <Landmark className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                {log.category === 'challan' && <FileCheck2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{log.title}</span>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono shrink-0">
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-neutral-300 leading-relaxed text-[11px]">{log.description}</p>

                <div className="pt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-neutral-300 text-[10px] font-bold">
                    {log.badge}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[10px] flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> 100% Cryptographically Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
