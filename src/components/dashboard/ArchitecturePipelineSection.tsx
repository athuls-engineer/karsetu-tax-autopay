import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Cpu,
  BellRing,
  CreditCard,
  Landmark,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ArchitectureStep {
  id: string;
  stepNumber: string;
  title: string;
  subTitle: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  spec: {
    protocol: string;
    latency: string;
    security: string;
    custody: string;
  };
  desc: string;
}

const pipelineSteps: ArchitectureStep[] = [
  {
    id: 'ingest',
    stepNumber: '01',
    title: 'Tax Ingestion',
    subTitle: 'AIS & Form 26AS',
    icon: FileSpreadsheet,
    color: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/50',
    borderLight: 'border-blue-200',
    borderDark: 'dark:border-blue-800/60',
    spec: {
      protocol: 'CBDT TIN 2.0 API & AIS Feed',
      latency: '< 450ms fetch',
      security: 'TLS 1.3 + SHA-256 Checksum',
      custody: 'Client-Side In-Memory Only',
    },
    desc: 'Ingests salary TDS, dividend income, and capital gains from government tax reports to determine accurate gross quarterly liabilities.',
  },
  {
    id: 'engine',
    stepNumber: '02',
    title: 'Liability Engine',
    subTitle: 'Sec 234C Optimizer',
    icon: Cpu,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/50',
    borderLight: 'border-indigo-200',
    borderDark: 'dark:border-indigo-800/60',
    spec: {
      protocol: 'Statutory 15%-45%-75%-100% Slabs',
      latency: '< 1ms computation',
      security: 'Strict Client-Side WASM/JS',
      custody: 'Zero External Leakage',
    },
    desc: 'Calculates the exact installment needed to hit statutory thresholds (15 Jun, 15 Sep, 15 Dec, 15 Mar), saving 1% monthly interest penalties under Section 234C.',
  },
  {
    id: 'alert',
    stepNumber: '03',
    title: '72h Pre-Debit Buffer',
    subTitle: 'RBI Mandate Notice',
    icon: BellRing,
    color: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/50',
    borderLight: 'border-amber-200',
    borderDark: 'dark:border-amber-800/60',
    spec: {
      protocol: 'TRAI DLT SMS & Push Notification',
      latency: '72-Hour Advance Window',
      security: 'Cryptographic Auth Token',
      custody: '1-Tap Taxpayer Pause Option',
    },
    desc: 'Compliant with RBI Circular RBI/2020-21/74: Dispatches a mandatory pre-debit notice 72 hours prior to execution. Taxpayer retains full control to pause or review.',
  },
  {
    id: 'rail',
    stepNumber: '04',
    title: 'Core Banking Sweep',
    subTitle: 'NPCI UPI AutoPay',
    icon: CreditCard,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/50',
    borderLight: 'border-emerald-200',
    borderDark: 'dark:border-emerald-800/60',
    spec: {
      protocol: 'NPCI UPI AutoPay 2.0 / e-NACH',
      latency: 'Instant Real-Time Settlement',
      security: 'Bank-Grade AES-256 + HSM',
      custody: 'Direct Bank-to-Treasury Flow',
    },
    desc: 'Executes the scheduled auto-debit directly through your authorized bank account (HDFC, SBI, ICICI) without passing through any intermediate wallet.',
  },
  {
    id: 'treasury',
    stepNumber: '05',
    title: 'Sovereign Treasury',
    subTitle: 'Article 266 Deposit',
    icon: Landmark,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgLight: 'bg-cyan-50',
    bgDark: 'dark:bg-cyan-950/50',
    borderLight: 'border-cyan-200',
    borderDark: 'dark:border-cyan-800/60',
    spec: {
      protocol: 'RBI Sovereign Treasury Gateway',
      latency: 'T+0 Same-Day Clearance',
      security: 'NSDL & Protean Direct Wire',
      custody: '100% Zero Escrow / Zero Float',
    },
    desc: '100% of the funds are deposited straight into the Consolidated Fund of India at the Reserve Bank of India. KarSetu never holds custody of taxpayer funds.',
  },
  {
    id: 'recon',
    stepNumber: '06',
    title: 'CIN Reconciliation',
    subTitle: 'Official ITNS 280 Slip',
    icon: FileCheck,
    color: 'text-blue-600 dark:text-blue-300',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/50',
    borderLight: 'border-blue-200',
    borderDark: 'dark:border-blue-800/60',
    spec: {
      protocol: 'CBDT Challan Identification No (CIN)',
      latency: 'Instant Verifiable Receipt',
      security: 'Signed BSR + Challan Sequence',
      custody: 'Permanent Local Challan Vault',
    },
    desc: 'Instantly generates the official government challan receipt with BSR code and CIN. Pre-populates Challan Reference Numbers directly into your annual ITR filing.',
  },
];

export const ArchitecturePipelineSection: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<ArchitectureStep>(pipelineSteps[2]);

  return (
    <div className="p-6 sm:p-8 rounded-4xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
              Technical Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              Zero-Escrow Sovereign Rail
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            How KarSetu Works: The Sovereign Payment Pipeline
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            A transparent breakdown of how tax liabilities are detected, notified under RBI guidelines, and settled straight into the Government Treasury.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-[11px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Non-Custodial Architecture</span>
          </div>
        </div>
      </div>

      {/* 6-Stage Pipeline Flow Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {pipelineSteps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = selectedStep.id === step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setSelectedStep(step)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between min-h-[140px] ${
                isSelected
                  ? 'bg-blue-50/80 dark:bg-[#0C1E3D] border-blue-500 shadow-md ring-1 ring-blue-500'
                  : 'bg-slate-50/70 dark:bg-[#1E293B]/60 hover:bg-slate-100 dark:hover:bg-[#1E293B] border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[10px] font-black text-slate-400 group-hover:text-blue-500 transition-colors">
                  {step.stepNumber}
                </span>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${step.bgLight} ${step.bgDark} ${step.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-3">
                <span className="font-bold text-xs text-slate-900 dark:text-white block leading-tight">
                  {step.title}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                  {step.subTitle}
                </span>
              </div>

              {idx < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-600 pointer-events-none">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Step Deep Dive Inspector */}
      <div className="p-5 rounded-3xl bg-slate-50/80 dark:bg-[#1E293B]/80 border border-slate-200 dark:border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${selectedStep.bgLight} ${selectedStep.bgDark} ${selectedStep.color}`}
            >
              <selectedStep.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Stage {selectedStep.stepNumber} Deep Dive
              </span>
              <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                {selectedStep.title} — {selectedStep.subTitle}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>CBDT & RBI Compliant Specification</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          {selectedStep.desc}
        </p>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
              Protocol / Standard
            </span>
            <span className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-0.5 block truncate">
              {selectedStep.spec.protocol}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
              Processing Latency
            </span>
            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block truncate">
              {selectedStep.spec.latency}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
              Security Standard
            </span>
            <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5 block truncate">
              {selectedStep.spec.security}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
              Custody Principle
            </span>
            <span className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-0.5 block truncate">
              {selectedStep.spec.custody}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
