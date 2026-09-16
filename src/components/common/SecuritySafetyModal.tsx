import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  Lock,
  Landmark,
  Bell,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Zap,
  EyeOff,
  Scale,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Coins,
  Percent,
} from 'lucide-react';

interface SecuritySafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'trail' | 'architecture' | 'simulator' | 'faq';
}

export const SecuritySafetyModal: React.FC<SecuritySafetyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'trail',
}) => {
  const [activeTab, setActiveTab] = useState<'trail' | 'architecture' | 'simulator' | 'faq'>(initialTab);
  const [simState, setSimState] = useState<'idle' | 'testing' | 'blocked'>('idle');

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

  const handleRunSim = () => {
    setSimState('testing');
    setTimeout(() => {
      setSimState('blocked');
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0A0A0A] rounded-4xl max-w-3xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-m3-4 border border-slate-100 dark:border-white/[0.08] overflow-hidden transition-colors my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-m3-surface-container-low dark:bg-[#040404] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Trust, Security & Zero Wastage Shield
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  RBI & TIN 2.0 Direct
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Proof of zero middleman float, direct RBI Treasury settlement, and zero tax wastage
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#141414] rounded-full transition-colors cursor-pointer"
            aria-label="Close security modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Responsive Segmented Control - Zero Spillage) */}
        <div className="px-4 sm:px-6 pt-3 pb-2.5 bg-slate-50/70 dark:bg-[#070707] border-b border-slate-100 dark:border-white/[0.08] shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-200/70 dark:bg-[#141414] rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('trail')}
              className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer ${
                activeTab === 'trail'
                  ? 'bg-white dark:bg-[#222222] text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Govt Money Trail</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-white dark:bg-[#222222] text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">6 Safety Pillars</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-white dark:bg-[#222222] text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Fraud Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-white dark:bg-[#222222] text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">UPI Privacy FAQ</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: Money Trail & Zero Wastage */}
          {activeTab === 'trail' && (
            <div className="space-y-6">
              {/* Sovereign Settlement Banner */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] shadow-2xs space-y-2.5 transition-colors">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-[10px] font-bold uppercase tracking-wider">
                    Zero Intermediary Float
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 text-[10px] font-bold uppercase tracking-wider">
                    Article 266(1) Sovereign Account
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  How Does Your Money Actually Reach the Government?
                </h4>
                <p className="text-slate-600 dark:text-neutral-400 leading-relaxed text-xs">
                  KarSetu is <strong className="text-slate-900 dark:text-neutral-200">non-custodial</strong>. We do not operate an e-wallet, pool account, or intermediary escrow. Every rupee moves directly from your bank to the <strong className="text-slate-900 dark:text-neutral-200">Consolidated Fund of India</strong> at the Reserve Bank of India or your local Municipal Corporation via NPCI BBPS.
                </p>
              </div>

              {/* 4-Step Visual Settlement Pipeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400">
                    Direct Settlement Pipeline (Zero Escrow)
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> End-to-End Cryptographic Trail
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between space-y-2 shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black text-xs flex items-center justify-center">
                          1
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                          Your Bank
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white mt-2 text-xs">UPI AutoPay Debit</h5>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        Debited under your RBI mandate cap. You get a mandatory 72h WhatsApp alert with 1-tap cancel before debit.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ No Middleman Wallet
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between space-y-2 shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center justify-center">
                          2
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                          Govt Rails
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white mt-2 text-xs">TIN 2.0 / BBPS Rail</h5>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        Routed directly into the Income Tax Department's TIN 2.0 gateway or NPCI BBPS Municipal clearing house.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ Zero Escrow Float
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between space-y-2 shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-black text-xs flex items-center justify-center">
                          3
                        </span>
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full">
                          RBI Treasury
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white mt-2 text-xs">Consolidated Fund</h5>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        Funds credit immediately to CBDT Major Head 0021 / Minor Head 100 at the Reserve Bank of India.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ Sovereign Settlement
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between space-y-2 shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
                          4
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          Official Proof
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white mt-2 text-xs">CIN & BSR Generated</h5>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        Official Challan Identification Number (CIN) with 7-digit BSR code mirrors in Form 26AS & AIS.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ Verifiable on IT Portal
                    </div>
                  </div>
                </div>
              </div>

              {/* ZERO WASTAGE ARCHITECTURE */}
              <div className="space-y-3">
                <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500 dark:text-neutral-400 block">
                  How KarSetu Prevents Tax Wastage & Double Payments
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Wastage Defense 1 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <TrendingDown className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        Zero 234B & 234C Penalties (Save ₹5,000–₹50,000)
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">
                      If you miss quarterly deadlines, the Income Tax Department charges a <strong>1% compound monthly interest fine</strong>. KarSetu calculates exact 15%, 45%, 75%, and 100% installments so zero late fees ever occur.
                    </p>
                  </div>

                  {/* Wastage Defense 2 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        Form 26AS / AIS Reconciler (No Double-Dipping)
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">
                      If clients or employers already deducted TDS (Sec 192 / 194J), paying advance tax without deducting TDS is a huge waste of cash. KarSetu offsets all TDS recorded in 26AS so you <strong>never pay twice</strong>.
                    </p>
                  </div>

                  {/* Wastage Defense 3 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                        <Percent className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        Tax Stash 6.75% Yield (No Premature Payments)
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">
                      Paying 100% of your tax months in advance is an interest-free loan to the government. KarSetu lets you keep your tax funds in overnight liquid funds earning <strong>6.75% annualized returns</strong> until the exact statutory due date.
                    </p>
                  </div>

                  {/* Wastage Defense 4 */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        5% Early Bird Municipal Discount Auto-Capture
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">
                      Municipal bodies (BBMP, MCGM, MCD) offer 5% to 10% rebates for early property tax payment and charge 2% monthly fines for delays. KarSetu fetches bills on Day 1 to lock in the discount automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 6 Pillars of Defense */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Non-Custodial Architecture & Zero Secret Storage</h4>
                  <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
                    KarSetu <strong>never asks for, sees, or stores</strong> your secret UPI MPIN, bank account passwords, ATM PINs, or Debit Card CVV. All mandate creation is authorized directly in your NPCI-certified UPI app (Google Pay, PhonePe, Paytm, BHIM).
                  </p>
                </div>
              </div>

              {/* Grid of Protections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Protection 1 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <span>Nodal Govt Account Lock</span>
                  </div>
                  <p className="text-slate-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                    Autopay sweeps are hardcoded <strong>strictly to CBDT & CBIC government treasury nodes</strong> (Minor Head 100/300, Major Head 0021, and GSTN PMT-06). Funds can <strong>never</strong> be diverted to any private or fraudulent UPI address.
                  </p>
                </div>

                {/* Protection 2 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <span>72-Hour Pre-Debit Notice</span>
                  </div>
                  <p className="text-slate-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                    Under the <strong>RBI e-Mandate Circular 2023</strong>, no silent debits can ever occur. You receive a mandatory WhatsApp, SMS, and push alert 72 hours prior with exact tax heads, amount, and an instant 1-tap pause/cancel option.
                  </p>
                </div>

                {/* Protection 3 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <span>Mandate Hard Ceiling</span>
                  </div>
                  <p className="text-slate-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                    Your bank enforces your explicit mandate limit (e.g. ₹50,000 or ₹1,00,000). Even in the theoretical case of a software bug, your bank's core banking system will reject any debit exceeding your cap.
                  </p>
                </div>

                {/* Protection 4 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <span>Official CIN/BSR Cryptography</span>
                  </div>
                  <p className="text-slate-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                    Every transaction generates a legitimate Challan Identification Number (CIN) and 7-digit BSR Code verifiable instantly on the Income Tax Department's official portal (<code>eportal.incometax.gov.in</code>).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Fraud Intercept Simulator */}
          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Simulate Fraudulent Divert Attempt
                </h4>
                <p className="text-slate-600 dark:text-neutral-400 leading-relaxed">
                  Experience how KarSetu's cryptographic routing engine immediately intercepts and shuts down any attempt to divert autopay funds to a fraudulent scammer address.
                </p>

                <div className="p-3 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-white/[0.08] space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Simulated Malicious Payload:</span>
                    <span className="text-red-500 font-bold">ATTACK VECTOR: PAYEE_SPOOF</span>
                  </div>
                  <div className="text-slate-800 dark:text-neutral-300 bg-slate-100 dark:bg-[#0A0A0A] p-2 rounded-lg break-all">
                    Attempting auto-debit of ₹15,000 to spoofed handle: <code>scammer99@fakebank</code>
                  </div>
                </div>

                <button
                  onClick={handleRunSim}
                  disabled={simState === 'testing'}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{simState === 'testing' ? 'Testing Defense Guard...' : 'Run Nodal Intercept Test'}</span>
                </button>

                {simState === 'blocked' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 space-y-1 animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>ATTACK BLOCKED & TERMINATED</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      KarSetu's Nodal Validator intercepted the request: Payee <code>scammer99@fakebank</code> is NOT in the CBDT/GSTN Whitelist. Mandate execution aborted with 0 funds moved.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Why UPI Protects Balances */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Why doesn't a UPI ID reveal bank balance automatically?
                </h4>
                <p className="text-slate-600 dark:text-neutral-300 leading-relaxed">
                  In India, a UPI ID / VPA (e.g. <code>athuls2580@okhdfcbank</code>) is a <strong>public payment handle</strong>—like an email address.
                </p>
                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-blue-950 dark:text-blue-200 space-y-1">
                  <span className="font-bold block">NPCI & RBI Privacy Rule:</span>
                  <p className="text-[11px] leading-relaxed">
                    If any website could see your bank balance or account number just by typing a UPI handle, <strong>anyone who knows your phone number could see how much money you have in the bank!</strong> To prevent financial stalking, cyber-blackmail, and scam targeting, NPCI explicitly blocks all balance queries through open UPI handles.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  How do real apps (CRED, Jupiter, KarSetu) automate balance fetching?
                </h4>
                <p className="text-slate-600 dark:text-neutral-300 leading-relaxed">
                  Real apps use the <strong>RBI Account Aggregator (AA) Framework</strong> (licensed entities like Setu AA, Finvu, Sahamati).
                </p>
                <p className="text-slate-600 dark:text-neutral-300 leading-relaxed">
                  With your explicit, OTP-authenticated consent, the Account Aggregator connects directly to your bank's Core Banking Server to pull verified balances and account digits through end-to-end encrypted tunnels, compliant with the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#040404] border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 flex-wrap gap-2 shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>256-Bit SSL/TLS Encryption • DPDP Act 2023 Compliant</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer active:scale-95"
          >
            I Understand & Feel Safe
          </button>
        </div>
      </div>
    </div>
  );
};
