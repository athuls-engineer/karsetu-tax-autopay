import React, { useState, useEffect } from 'react';
import { TaxDueItem, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { dispatchWhatsAppMessage, formatDisplayPhone } from '../../services/notificationService';
import {
  X,
  Check,
  Bell,
  Shield,
  ArrowRight,
  Smartphone,
  AlertTriangle,
  Zap,
  Landmark,
  Building2,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PreDebitAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxItem: TaxDueItem | null;
  user: UserProfile;
  onConfirmAutoPay: (taxItem: TaxDueItem, openVaultWithChallanId?: string) => void;
  onTriggerSimulatedAlert?: (channel: 'whatsapp' | 'sms') => void;
}

export const PreDebitAlertModal: React.FC<PreDebitAlertModalProps> = ({
  isOpen,
  onClose,
  taxItem,
  user,
  onConfirmAutoPay,
  onTriggerSimulatedAlert,
}) => {
  const [settlementStage, setSettlementStage] = useState<'preview' | 'processing' | 'success'>('preview');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [generatedChallanId, setGeneratedChallanId] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && settlementStage !== 'processing') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, settlementStage]);

  if (!isOpen || !taxItem) return null;

  const isBBPS = taxItem.category === 'property_tax';
  const isGST = taxItem.category === 'gst';

  const settlementSteps = [
    {
      title: 'Validating NPCI UPI AutoPay Mandate',
      desc: `Verifying e-mandate cap with ${user.linkedBank.bankName}...`,
      icon: Smartphone,
    },
    {
      title: 'Executing Direct Core Banking Debit',
      desc: `A/C ••••${user.linkedBank.accountNoMasked.slice(-4)} debited ${formatINR(taxItem.amount)}. Zero escrow float.`,
      icon: Landmark,
    },
    {
      title: isBBPS
        ? 'Settling on NPCI BBPS Municipal Rail'
        : isGST
        ? 'Depositing to GST Electronic Cash Ledger'
        : 'Piping to Consolidated Fund of India (TIN 2.0)',
      desc: isBBPS
        ? 'Crediting Urban Local Body municipal treasury account.'
        : 'Direct credit to Reserve Bank of India (Major Head 0021).',
      icon: Building2,
    },
    {
      title: 'Issuing Cryptographic Challan & CIN',
      desc: 'Generating 7-digit BSR Code and syncing with Form 26AS & AIS.',
      icon: FileCheck2,
    },
  ];

  const handleStartRealPayment = () => {
    setSettlementStage('processing');
    setCurrentStepIndex(0);

    const generatedId = isBBPS
      ? `BBPS-${Date.now()}`
      : isGST
      ? `GST-${Date.now()}`
      : `CH-280-${Date.now()}`;
    setGeneratedChallanId(generatedId);

    // Step 1 -> 2
    setTimeout(() => {
      setCurrentStepIndex(1);
    }, 600);

    // Step 2 -> 3
    setTimeout(() => {
      setCurrentStepIndex(2);
    }, 1200);

    // Step 3 -> 4
    setTimeout(() => {
      setCurrentStepIndex(3);
    }, 1800);

    // Step 4 -> Complete
    setTimeout(() => {
      setSettlementStage('success');
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0B57D0', '#146C2E', '#E8710A', '#10B981'],
      });
    }, 2400);
  };

  const handleCompleteAndClose = (openVault: boolean) => {
    onConfirmAutoPay(taxItem, openVault ? generatedChallanId : undefined);
    setSettlementStage('preview');
    setCurrentStepIndex(0);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && settlementStage !== 'processing') onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl max-w-lg w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-m3-4 border border-slate-100 dark:border-slate-800 flex flex-col transition-colors my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-m3-surface-container-low dark:bg-[#090D16] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {settlementStage === 'preview' && '72-Hour Pre-Debit WhatsApp Alert'}
                  {settlementStage === 'processing' && 'Autonomous Treasury Clearing...'}
                  {settlementStage === 'success' && 'Deposit Finalized & Verified!'}
                </h3>
                {settlementStage === 'preview' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    72h Notice
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {settlementStage === 'preview' && 'Review the automated WhatsApp notification sent to your phone'}
                {settlementStage === 'processing' && 'Executing multi-rail settlement across NPCI, RBI & CBDT'}
                {settlementStage === 'success' && 'Sovereign challan generated with zero late penalties'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={settlementStage === 'processing'}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Close pre-debit alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {/* STAGE 1: WhatsApp Pre-Debit Notice Preview */}
          {settlementStage === 'preview' && (
          <>
            <div className="p-5 bg-slate-100 dark:bg-[#090D16] flex flex-col items-center transition-colors gap-3">
              <div className="w-full max-w-sm bg-[#EFEAE2] dark:bg-[#111B21] rounded-3xl p-4 shadow-sm border border-slate-300/60 dark:border-[#202C33] text-slate-800 dark:text-slate-200 text-xs space-y-3">
                {/* WhatsApp Bubble Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#075E54]/20 dark:border-[#202C33]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs">
                      KS
                    </div>
                    <div>
                      <span className="font-bold text-[#075E54] dark:text-[#25D366] block leading-tight">
                        KarSetu Verified Bot
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Official AutoPay Channel</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Today, 09:00 AM</span>
                </div>

                {/* Message Body */}
                <div className="bg-white dark:bg-[#202C33] rounded-2xl p-3.5 shadow-sm space-y-2 leading-relaxed border border-slate-200 dark:border-transparent text-slate-800 dark:text-white">
                  <div className="flex items-center gap-1.5 text-blue-900 dark:text-blue-300 font-bold">
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    <span>Upcoming Tax Autopilot Alert</span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-200">
                    Namaste <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>! 🙏
                  </p>

                  <p className="text-slate-700 dark:text-slate-200">
                    Your <span className="font-bold text-slate-900 dark:text-white">{taxItem.title}</span> of{' '}
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.5 rounded">
                      {formatINR(taxItem.amount)}
                    </span>{' '}
                    is scheduled to be deposited to the {isBBPS ? 'Municipal Corporation' : isGST ? 'GST Portal' : 'Income Tax Department'} on{' '}
                    <span className="font-bold text-slate-900 dark:text-white">{taxItem.dueDate}</span> via your {user.linkedBank.bankName} mandate.
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111B21] border border-slate-100 dark:border-[#2A3942] space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Settlement Rail:</span>
                      <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                        {isBBPS ? 'NPCI BBPS Municipal' : isGST ? 'GSTN PMT-06' : 'TIN 2.0 ITNS 280'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Benefit Protected:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {isBBPS ? '5% Early-Bird Rebate Saved' : 'Saves ₹1,750 Sec 234C Fine'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Account:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {user.linkedBank.bankName} (••••{user.linkedBank.accountNoMasked.slice(-4)})
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    *Zero float: Funds transfer directly into the Sovereign Government Treasury.
                  </p>
                </div>
              </div>

              {/* Real-world Live Phone Dispatch Card */}
              <div className="w-full max-w-sm p-3.5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2.5 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                    <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Live Phone Delivery</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                    {formatDisplayPhone(user.phone)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Want to verify this exact notice on your actual device? Test sending it to your phone via WhatsApp or trigger a lockscreen notification.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => dispatchWhatsAppMessage(user.phone, user, taxItem)}
                    className="py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span className="text-sm">💬</span>
                    <span>Send to WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTriggerSimulatedAlert?.('whatsapp')}
                    className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    <span>Lockscreen Ping</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartRealPayment}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span>Execute 1-Click Test AutoPay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    alert('Autopay paused for this tax item. You can resume anytime from the dashboard.');
                    onClose();
                  }}
                  className="py-3 px-4 rounded-2xl font-bold text-xs text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 transition-colors cursor-pointer"
                >
                  Pause Once
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>72 hours pre-debit buffer active. You maintain 100% control until execution.</span>
              </div>
            </div>
          </>
        )}

        {/* STAGE 2: Real-Time Clearing Console */}
        {settlementStage === 'processing' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800/40">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-2">
                Processing Sovereign Tax Settlement
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Executing {formatINR(taxItem.amount)} payment with zero middleman float
              </p>
            </div>

            {/* 4 Steps Timeline */}
            <div className="space-y-3 p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80">
              {settlementSteps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isPassed
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold ${
                            isCurrent
                              ? 'text-blue-600 dark:text-blue-400'
                              : isPassed
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-400 dark:text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        {isPassed && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Done</span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold animate-pulse">
                            Active...
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE 3: Settlement Success & Challan Verification */}
        {settlementStage === 'success' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-800 shadow-sm animate-in zoom-in-75">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-black text-lg text-slate-900 dark:text-white">
                Tax Successfully Deposited to Government!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Official Challan Identification Number (CIN) generated and recorded
              </p>
            </div>

            {/* Generated Receipt Voucher Badge */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-[#062417] border border-emerald-300 dark:border-emerald-500/40 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-200 dark:border-emerald-500/30">
                <span className="text-emerald-800 dark:text-emerald-300">Official CIN:</span>
                <span className="font-bold text-emerald-950 dark:text-white">
                  0210045091811409202600{taxItem.amount}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-200 dark:border-emerald-500/30">
                <span className="text-emerald-800 dark:text-emerald-300">BSR Code:</span>
                <span className="font-bold text-slate-900 dark:text-white">0210045 (State Bank of India)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-emerald-200 dark:border-emerald-500/30">
                <span className="text-emerald-800 dark:text-emerald-300">Total Deposited:</span>
                <span className="font-black text-emerald-950 dark:text-white text-sm">
                  {formatINR(taxItem.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-emerald-800 dark:text-emerald-300">Status on Form 26AS:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  ✓ Pre-populated & Active
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleCompleteAndClose(true)}
                className="w-full py-3 px-4 rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>View Official Challan in Vault (Scan QR)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCompleteAndClose(false)}
                className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Done & Return to Dashboard
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
