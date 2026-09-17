import React, { useState } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Server,
  Zap,
} from 'lucide-react';
import { formatINR } from '../../services/taxCalculator';

type FailureScenarioType = 'insufficient_funds' | 'liability_shift' | 'gateway_timeout';

export const FailureSimulationCard: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<FailureScenarioType>('insufficient_funds');
  const [resolvedStatus, setResolvedStatus] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState<boolean>(false);

  const handleResolve = (actionName: string, successMessage: string) => {
    setIsResolving(true);
    setResolvedStatus(null);
    setTimeout(() => {
      setIsResolving(false);
      setResolvedStatus(successMessage);
    }, 900);
  };

  return (
    <div className="p-6 sm:p-8 rounded-4xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">
              Self-Healing Resilience
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
              Interactive Stress Simulator
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Edge Cases & Failure Recovery: What Happens When Payments Fail?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            A real-world tax autopilot cannot crash when bank balances fall short or tax liabilities fluctuate. Test how KarSetu autonomously mitigates failure scenarios before interest penalties apply.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-[11px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 self-start sm:self-center">
          <span>Simulation Active</span>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => {
            setActiveScenario('insufficient_funds');
            setResolvedStatus(null);
          }}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeScenario === 'insufficient_funds'
              ? 'bg-rose-50/80 dark:bg-[#200E17] border-rose-400 dark:border-rose-500 shadow-xs ring-1 ring-rose-500'
              : 'bg-slate-50/70 dark:bg-[#1E293B]/60 hover:bg-slate-100 dark:hover:bg-[#1E293B] border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-xs text-slate-900 dark:text-white block leading-tight truncate">
              1. Insufficient Balance
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
              NPCI Code: U16 Decline
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveScenario('liability_shift');
            setResolvedStatus(null);
          }}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeScenario === 'liability_shift'
              ? 'bg-amber-50/80 dark:bg-[#241705] border-amber-400 dark:border-amber-500 shadow-xs ring-1 ring-amber-500'
              : 'bg-slate-50/70 dark:bg-[#1E293B]/60 hover:bg-slate-100 dark:hover:bg-[#1E293B] border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-xs text-slate-900 dark:text-white block leading-tight truncate">
              2. Dynamic Liability Shift
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
              Mandate Cap Exceeded
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveScenario('gateway_timeout');
            setResolvedStatus(null);
          }}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeScenario === 'gateway_timeout'
              ? 'bg-blue-50/80 dark:bg-[#0C1E3D] border-blue-400 dark:border-blue-500 shadow-xs ring-1 ring-blue-500'
              : 'bg-slate-50/70 dark:bg-[#1E293B]/60 hover:bg-slate-100 dark:hover:bg-[#1E293B] border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-xs text-slate-900 dark:text-white block leading-tight truncate">
              3. ITD Server Timeout
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
              TIN 2.0 HTTP 504
            </span>
          </div>
        </button>
      </div>

      {/* Interactive Scenario Sandbox Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/80 dark:bg-[#1E293B]/70 border border-slate-200 dark:border-slate-700/80 space-y-4">
        {activeScenario === 'insufficient_funds' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Failure Alert Banner */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-[#2A101A] border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-rose-900 dark:text-rose-200">
                      Payment Declined by Bank
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-200 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-mono font-bold">
                      NPCI ERR: U16
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                    Your scheduled advance tax of <strong>₹19,450</strong> was declined by HDFC Bank (••••4092) due to insufficient account balance.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0">
                Deadline: Tomorrow, 23:59 IST
              </span>
            </div>

            {/* Self-Healing Actions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Automated Self-Healing Action:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    handleResolve(
                      'fallback',
                      '🎉 Auto-switched to ICICI Bank (••••8192) via Secondary Mandate! Payment of ₹19,450 cleared with zero Sec 234C late fine.'
                    )
                  }
                  disabled={isResolving}
                  className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer space-y-1 group active:scale-95 disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.2 rounded">
                      Recommended
                    </span>
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-blue-600 transition-colors">
                    Switch to Secondary UPI
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Route through ICICI Mandate (••••8192) instantly
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleResolve(
                      'buffer',
                      '⏰ 24-Hour Buffer Activated! Notification dispatched to +91 98765 43210. Re-attempt scheduled for 09:00 AM before statutory cutoff.'
                    )
                  }
                  disabled={isResolving}
                  className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer space-y-1 group active:scale-95 disabled:opacity-50"
                >
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-amber-600 transition-colors">
                    24h Buffer Retry
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Hold sweep for 24h & alert user to top up bank funds
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleResolve(
                      'challan',
                      '📄 Pre-filled ITNS 280 challan generated! CIN reference CRN-26061400892 created for instant NetBanking clearing.'
                    )
                  }
                  disabled={isResolving}
                  className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer space-y-1 group active:scale-95 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-emerald-600 transition-colors">
                    Instant NetBanking Slip
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Generate 1-click RTGS/NetBanking challan
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeScenario === 'liability_shift' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Shift Alert Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#261B0B] border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-amber-900 dark:text-amber-200">
                      Quarterly Liability Revised Upward
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold">
                      CAP LIMIT REACHED
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                    Newly detected STCG on shares adjusted liability from <strong>₹19,450</strong> to <strong>₹28,500</strong>. This exceeds your configured auto-mandate limit of ₹25,000.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 shrink-0">
                Statutory Rule: Re-auth required
              </span>
            </div>

            {/* Self-Healing Actions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Compliance Orchestration Action:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    handleResolve(
                      'reauth',
                      '🔒 Biometric Re-auth confirmed! Mandate limit increased to ₹35,000 for this installment. ₹28,500 queued for direct treasury clearance.'
                    )
                  }
                  disabled={isResolving}
                  className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer space-y-1 group active:scale-95 disabled:opacity-50"
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-blue-600 transition-colors">
                    1-Tap Biometric Re-Authorize (₹28,500)
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Complies with RBI rules: Authorize higher cap with instant biometric/PIN token
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleResolve(
                      'split',
                      '✓ Multi-Rail Sweep Executed: ₹25,000 cleared via primary mandate + ₹3,500 cleared via instant UPI QR. Total ₹28,500 reconciled with 0 late fee.'
                    )
                  }
                  disabled={isResolving}
                  className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer space-y-1 group active:scale-95 disabled:opacity-50"
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-emerald-600 transition-colors">
                    Split Sweep: ₹25,000 AutoPay + ₹3,500 Instant UPI
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Automatically sweeps existing mandate maximum and prompts instant QR for balance
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeScenario === 'gateway_timeout' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Timeout Alert Banner */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-[#0C1E3D] border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-blue-900 dark:text-blue-200">
                      CBDT TIN 2.0 Gateway Timeout
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-200 dark:bg-blue-950 text-blue-900 dark:text-blue-300 text-[10px] font-mono font-bold">
                      HTTP 504 GATEWAY TIMEOUT
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                    Government tax server (tin.tin-nsdl.com) did not respond in 8,000ms due to high traffic before deadline.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
                Zero Double-Debit Protection
              </span>
            </div>

            {/* Self-Healing Actions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Resilient Failover Protocol:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    handleResolve(
                      'idempotent',
                      '🛡️ Idempotent Handshake Verified! Stamped with CRN-26061400892. Retried with exponential backoff — Payment successfully acknowledged by CBDT!'
                    )
                  }
                  disabled={isResolving}
                  className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer space-y-1 group active:scale-95 disabled:opacity-50"
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-blue-600 transition-colors">
                    Idempotent Retrial (Zero Double-Debit)
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Sends cryptographic challan hash preventing duplicate charge if original request went through
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleResolve(
                      'bbps_failover',
                      '⚡ Failover to SBI ePay Aggregator Rail successful! BSR Code 0210045 assigned and challan minted.'
                    )
                  }
                  disabled={isResolving}
                  className="p-3 rounded-2xl bg-white dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer space-y-1 group active:scale-95 disabled:opacity-50"
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-emerald-600 transition-colors">
                    Failover to SBI ePay / NPCI Rail
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Seamlessly reroutes through secondary authorized government payment gateway
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resolution Feedback Banner */}
        {isResolving && (
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            <span>Executing automated failover protocol...</span>
          </div>
        )}

        {resolvedStatus && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-[#062417] border border-emerald-300 dark:border-emerald-700/80 text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span>{resolvedStatus}</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-normal">
                Audit log updated with timestamp & bank reference UTR.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
