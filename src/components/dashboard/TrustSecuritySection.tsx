import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Landmark,
  Scale,
  FileCheck2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface TrustFaqItem {
  id: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  tag: string;
}

const trustFaqs: TrustFaqItem[] = [
  {
    id: 'upi-pin',
    question: 'Does KarSetu ever see or store my UPI PIN?',
    shortAnswer: 'NEVER. Your UPI PIN is entered solely within your bank’s NPCI-encrypted window.',
    detailedAnswer: 'Under NPCI UPI AutoPay regulations, mandate creation and any manual authorisations happen strictly inside the secure NPCI Common Library (CL) provided by your bank or PSP (Google Pay, PhonePe, BHIM, HDFC, SBI). KarSetu never receives, intercepts, logs, or stores your UPI PIN.',
    tag: 'NPCI Compliant',
  },
  {
    id: 'escrow',
    question: 'Where do my funds go? Does KarSetu hold my money in an escrow account?',
    shortAnswer: '100% Zero Escrow. Funds transfer directly to the Consolidated Fund of India (Article 266).',
    detailedAnswer: 'KarSetu operates strictly on a non-custodial orchestration model. When an auto-debit triggers, the funds move directly from your core banking account to the Reserve Bank of India / Sovereign Government Treasury account via TIN 2.0 ITNS 280 or BBPS Municipal Rails. KarSetu never operates an escrow or pooling wallet.',
    tag: 'Article 266 Safe',
  },
  {
    id: 'pan-storage',
    question: 'Do you store my PAN or bank login passwords?',
    shortAnswer: 'No passwords are ever requested. PAN and tax records remain isolated in on-device storage.',
    detailedAnswer: 'KarSetu never asks for net-banking passwords, debit card ATM PINs, or CVVs. Your PAN is utilized exclusively to fetch official TIN 2.0 challan schemas and is stored encrypted in your local browser sandbox, never resold to third-party ad networks or credit scoring aggregators.',
    tag: 'Client-Side Encryption',
  },
  {
    id: 'unauthorized-debit',
    question: 'Can KarSetu initiate payments without my approval or change amounts?',
    shortAnswer: 'Impossible. Every debit is bounded by a strict statutory cap and mandatory 72-hour notice.',
    detailedAnswer: 'Under RBI e-Mandate Circular RBI/2020-21/74, automated recurring debits are legally bounded by the user-defined maximum limit (default ₹1,00,000) and must issue an advance pre-debit notice 72 hours prior. If an unauthorized amount is attempted, the bank’s core switch rejects the transaction automatically.',
    tag: 'RBI 2023 Shield',
  },
  {
    id: 'cancel-autopay',
    question: 'How easily can I pause or cancel AutoPay?',
    shortAnswer: 'Instant 1-tap pause inside KarSetu or anytime inside your native UPI/Banking app.',
    detailedAnswer: 'You have dual-layer cancellation rights: you can click "Pause Autopay" inside KarSetu with a single tap, or revoke the mandate directly inside BHIM, Google Pay, PhonePe, or your bank net-banking mandate manager. Revocation is immediate and irreversible by the merchant.',
    tag: '1-Tap Freedom',
  },
  {
    id: 'hacked',
    question: 'What happens if KarSetu servers were ever compromised?',
    shortAnswer: 'Zero Custodial Risk: Attackers cannot steal funds that KarSetu never holds.',
    detailedAnswer: 'Because KarSetu is non-custodial and holds zero wallets, balances, or debit capabilities, a compromised frontend server contains no fund reserves and no banking credentials. The actual payment authorization token resides exclusively between your bank and NPCI.',
    tag: 'Non-Custodial Architecture',
  },
  {
    id: 'processor',
    question: 'Who actually processes and clears the tax payment?',
    shortAnswer: 'RBI-authorized Agency Banks: State Bank of India, HDFC Bank, ICICI Bank, and NPCI BBPS.',
    detailedAnswer: 'Payment clearing is executed exclusively over CBDT-authorized e-Pay Tax payment aggregator rails (TIN 2.0) and NPCI Bharat BillPay. The resulting Challan Identification Number (CIN) and 7-digit BSR code are generated directly by the Income Tax Department’s server.',
    tag: 'CBDT TIN 2.0',
  },
  {
    id: 'reconciliation',
    question: 'How do I prove to a Tax Officer that the payment was made?',
    shortAnswer: 'Instant official ITNS 280 / BBPS receipt permanently stamped with CIN and bank UTR.',
    detailedAnswer: 'Every successful execution generates an official CBDT-formatted tax challan receipt stored in your permanent Challan Vault. You can verify the BSR code and 5-digit sequence number directly on the Income Tax Department e-Filing portal (incometax.gov.in) at any time.',
    tag: 'Legally Verifiable',
  },
];

interface TrustSecuritySectionProps {
  onOpenSecurityModal: () => void;
}

export const TrustSecuritySection: React.FC<TrustSecuritySectionProps> = ({
  onOpenSecurityModal,
}) => {
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  return (
    <div className="p-6 sm:p-8 rounded-4xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              Institutional Security
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
              Zero-Trust Framework
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Trust & Security Architecture: What Happens to Your Money & Data?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Taxes deal with real sovereign obligations. Here is how KarSetu eliminates custodial risk, protects your credentials, and complies with RBI e-Mandate standards.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSecurityModal}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 self-start sm:self-center"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Test Rogue Debit Defense</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Pillars of Sovereign Security */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Zero Escrow / Zero Float</h4>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
            Funds route directly to the Consolidated Fund of India (Article 266). KarSetu never holds, escrows, or pools your capital.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Zero-Knowledge PIN</h4>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
            Your UPI PIN is entered solely within NPCI’s bank-encrypted window. KarSetu never sees, asks for, or stores your PIN.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">72h Pre-Debit Control</h4>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
            RBI-mandated advance notification dispatched 72 hours before any debit. Taxpayers retain the right to pause with 1 tap.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Permanent Audit CIN</h4>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
            Every sweep yields an official government CIN and BSR challan slip verifiable on the Income Tax Department portal.
          </p>
        </div>
      </div>

      {/* 8 Core Security Questions (Accordion) */}
      <div className="space-y-2.5 pt-2">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Frequently Asked Security & Privacy Questions
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trustFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-blue-50/50 dark:bg-[#0C1E3D]/70 border-blue-300 dark:border-blue-700'
                    : 'bg-slate-50/70 dark:bg-[#1E293B]/70 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-3.5 text-left flex items-start justify-between gap-2 cursor-pointer"
                >
                  <div className="space-y-1 pr-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[9px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        {faq.tag}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block leading-snug">
                      {faq.question}
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {faq.shortAnswer}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 mt-1 ${
                      isExpanded ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 mt-1 animate-in fade-in">
                    {faq.detailedAnswer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
