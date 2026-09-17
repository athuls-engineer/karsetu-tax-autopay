import React, { useEffect } from 'react';
import {
  X,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowRight,
  ExternalLink,
  Users,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../../types/tax';
import { mockUsers } from '../../data/mockData';

interface SandboxInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onOpenFailureSim?: () => void;
}

export const SandboxInfoModal: React.FC<SandboxInfoModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onOpenFailureSim,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-[#0F172A] rounded-4xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#1E293B]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center border border-amber-200 dark:border-amber-700/50">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60">
                  Regulatory Testnet
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  CBDT TIN 2.0 & NPCI BBPS Sandbox
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
                KarSetu Simulation Environment
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Persona Switcher Banner */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Active Taxpayer Simulation Persona:</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-semibold">
                {currentUser.pan}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {mockUsers.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => onSelectUser(u)}
                    className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">{u.name}</div>
                    <div className={`text-[10px] truncate capitalize ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {u.profileType} • {u.linkedBank.bankName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real vs Simulated Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Real Production Logic */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>What is 100% Real & Production-Grade</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black shrink-0">✓</span>
                  <span><strong>Sec 208/211/234C Tax Engine:</strong> Exact statutory 15%-45%-75%-100% advance tax formulas and penalty math.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black shrink-0">✓</span>
                  <span><strong>NPCI Mandate Specifications:</strong> Conforms strictly to RBI e-Mandate Circular RBI/2020-21/74 and 72h Pre-Debit Notification Buffer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black shrink-0">✓</span>
                  <span><strong>Challan Verifier Spec:</strong> Produces compliant ITNS 280 receipts with 7-digit BSR codes, Challan Sequence Numbers, and CIN formats.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black shrink-0">✓</span>
                  <span><strong>Multi-lingual Engine:</strong> Full translations across English, Hindi, Tamil, Telugu, Kannada, and Marathi.</span>
                </li>
              </ul>
            </div>

            {/* Simulated Sandbox Elements */}
            <div className="p-5 rounded-3xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>What is Simulated in this Sandbox</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-black shrink-0">✦</span>
                  <span><strong>Zero Real Debits:</strong> Simulated bank clearing; no money ever leaves your actual bank account or UPI apps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-black shrink-0">✦</span>
                  <span><strong>CBDT TIN 2.0 Gateway:</strong> Synthetic endpoints emulating the Income Tax Department's payment gateway response codes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-black shrink-0">✦</span>
                  <span><strong>Synthetic Taxpayer Profiles:</strong> Pre-loaded mock profiles covering IT Techies, Active Traders, and MSME Proprietors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-black shrink-0">✦</span>
                  <span><strong>Simulated Phone Alerts:</strong> In-browser simulated WhatsApp/SMS push banners demonstrating RBI-mandated 72h notices.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Production Onboarding Roadmap */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              How Live Onboarding Operates in Commercial Production:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-mono font-bold text-blue-600">STEP 01</span>
                <p className="font-bold text-slate-900 dark:text-white">PAN e-KYC</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Aadhaar OTP verification fetches verified tax status.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600">STEP 02</span>
                <p className="font-bold text-slate-900 dark:text-white">AIS Sync</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Read-only ingestion of salary TDS, dividends, and trades.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-600">STEP 03</span>
                <p className="font-bold text-slate-900 dark:text-white">AutoPay Mandate</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Authorize recurring mandate inside UPI app with PIN.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-600">STEP 04</span>
                <p className="font-bold text-slate-900 dark:text-white">Zero Escrow</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Funds debit directly to Govt Treasury (Article 266).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#1E293B]/30">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Complies with RBI Master Directions & CBDT Circular No. 12/2022</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFailureSim && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFailureSim();
                }}
                className="px-4 py-2 rounded-2xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Test Edge Failures
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              Close Sandbox Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
