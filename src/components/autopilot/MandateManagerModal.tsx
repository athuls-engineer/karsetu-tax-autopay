import React, { useState, useEffect } from 'react';
import { AutopayMode, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { dispatchWhatsAppMessage, sanitizeIndianPhone } from '../../services/notificationService';
import { mockUpcomingTaxes } from '../../data/mockData';
import {
  X,
  Shield,
  Wallet,
  Landmark,
  CheckCircle2,
  TrendingUp,
  Sun,
  Moon,
  Sparkles,
  Smartphone,
  MessageSquare,
  Bell,
} from 'lucide-react';

interface MandateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onUpdateMandate: (updatedMandate: UserProfile['mandate']) => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onTriggerTestAlert?: (channel: 'whatsapp' | 'sms') => void;
}

export const MandateManagerModal: React.FC<MandateManagerModalProps> = ({
  isOpen,
  onClose,
  user,
  theme,
  onToggleTheme,
  onUpdateMandate,
  onUpdateUser,
  onTriggerTestAlert,
}) => {
  const [mode, setMode] = useState<AutopayMode>(user.mandate.mode);
  const [maxLimit, setMaxLimit] = useState<number>(user.mandate.maxSingleLimit);
  const [preNoticeHours, setPreNoticeHours] = useState<number>(user.mandate.preNoticeHours);
  const [isActive, setIsActive] = useState<boolean>(user.mandate.isActive);
  const [phone, setPhone] = useState<string>(user.phone || '9876543210');
  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(user.notifications?.whatsappEnabled ?? true);
  const [smsEnabled, setSmsEnabled] = useState<boolean>(user.notifications?.smsEnabled ?? true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setPhone(user.phone || '9876543210');
      setWhatsappEnabled(user.notifications?.whatsappEnabled ?? true);
      setSmsEnabled(user.notifications?.smsEnabled ?? true);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, user]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateMandate({
      ...user.mandate,
      mode,
      maxSingleLimit: maxLimit,
      preNoticeHours,
      isActive,
    });
    onUpdateUser?.({
      phone: sanitizeIndianPhone(phone),
      notifications: {
        whatsappEnabled,
        smsEnabled,
        emailEnabled: user.notifications?.emailEnabled ?? false,
        preNoticeHours,
        verified: true,
      },
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl max-w-lg w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300 my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-m3-surface-container-low dark:bg-[#0B1325] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-m3-secondary-container dark:bg-emerald-950/60 text-m3-on-secondary-container dark:text-emerald-300 flex items-center justify-center">
              <Shield className="w-5 h-5 text-m3-secondary dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Autopilot Settings & Appearance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure auto-debits, themes, and notification windows
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Theme & Appearance Setting */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">
                  Appearance / Theme
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Switch between Daylight Light Mode and Institutional Midnight Slate
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') onToggleTheme();
                }}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 border-blue-600 shadow-sm ring-1 ring-blue-600'
                    : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode (Default)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') onToggleTheme();
                }}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-[#090D16] text-white border-blue-500 shadow-[0_0_20px_-3px_rgba(59,130,246,0.3)] ring-1 ring-blue-500'
                    : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Midnight Slate (Dark)</span>
              </button>
            </div>
          </div>

          {/* Registered Mobile & Alert Channels */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block leading-tight">
                    Registered Mobile & Alert Channels
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mandatory 72h notice sent before any money leaves your bank
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                RBI 2023 Safe
              </span>
            </div>

            {/* Mobile Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Aadhaar / PAN Linked Mobile (+91)</span>
                <span className="text-[10px] font-normal text-slate-400">Used for WhatsApp & SMS notices</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="px-3 py-2.5 rounded-xl bg-slate-200/80 dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white font-mono text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              {phone.length === 10 ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid 10-digit Indian Mobile Number</span>
                </div>
              ) : (
                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                  Please enter all 10 digits of your mobile number
                </p>
              )}
            </div>

            {/* Delivery Channels Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <label className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                whatsappEnabled
                  ? 'bg-emerald-50/70 dark:bg-[#062417] border-emerald-500/60 dark:border-emerald-500/50'
                  : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Bot</span>
                    <span className="px-1 py-0.2 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[9px] font-extrabold">
                      Primary
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    Instant rich receipt preview with 1-tap pause button
                  </p>
                </div>
              </label>

              <label className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                smsEnabled
                  ? 'bg-blue-50/70 dark:bg-[#0C1E3D] border-blue-500/60 dark:border-blue-400/50'
                  : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="mt-0.5 accent-blue-600 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">SMS / Messages</span>
                    <span className="px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[9px] font-extrabold">
                      DLT Backup
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    TRAI registered official header [KARSETU]
                  </p>
                </div>
              </label>
            </div>

            {/* Test Notification Actions */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-stretch gap-2">
              <button
                type="button"
                onClick={() => {
                  const sampleTax = mockUpcomingTaxes[0];
                  dispatchWhatsAppMessage(phone, user, sampleTax);
                }}
                disabled={phone.length !== 10}
                className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <span>💬</span>
                <span>Send Live WhatsApp Notice</span>
              </button>

              <button
                type="button"
                onClick={() => onTriggerTestAlert?.('whatsapp')}
                className="py-2 px-3 rounded-xl bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulate Phone Ping</span>
              </button>
            </div>
          </div>

          {/* Main Master Switch */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm block">
                Master Autopilot Shield
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isActive
                  ? 'Autonomous tax clearing is actively guarding you'
                  : 'Paused — manual payment needed'}
              </span>
            </div>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                isActive ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Autopay Mode Selector: Direct vs Tax Stash */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Choose Autopay Mechanism
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Direct Bank Sweep */}
              <button
                type="button"
                onClick={() => setMode('direct_sweep')}
                className={`p-4 rounded-3xl border text-left transition-all relative ${
                  mode === 'direct_sweep'
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-[#0C1E3D] dark:border-blue-400/60 shadow-sm ring-1 ring-blue-500/50'
                    : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Direct Bank Sweep
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Debits your {user.linkedBank.bankName} account directly 24h before deadline via UPI AutoPay.
                </p>
                <span className="mt-3 inline-block text-[10px] font-bold text-blue-800 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                  Zero setup hassle
                </span>
              </button>

              {/* Option 2: Tax Stash Escrow */}
              <button
                type="button"
                onClick={() => setMode('tax_stash')}
                className={`p-4 rounded-3xl border text-left transition-all relative ${
                  mode === 'tax_stash'
                    ? 'border-emerald-600 bg-emerald-50/80 dark:bg-[#062417] dark:border-emerald-400/60 shadow-sm ring-1 ring-emerald-500/50'
                    : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Tax Stash (Liquid Fund)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Earns ~6.75% annual interest in a high-yield liquid mutual fund until tax due date.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" /> Earns Interest
                </span>
              </button>
            </div>
          </div>

          {/* Stash Balance Info if Mode is tax_stash */}
          {mode === 'tax_stash' && (
            <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-[#062417] border border-emerald-200/80 dark:border-emerald-500/40 text-xs text-emerald-950 dark:text-emerald-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                  Current Tax Stash Balance:
                </span>
                <span className="text-base font-extrabold text-emerald-950 dark:text-white">
                  {formatINR(user.mandate.stashBalance)}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Accruing ~₹{Math.round((user.mandate.stashBalance * 0.0675) / 12)} every month in liquid returns until next Advance Tax.
              </p>
            </div>
          )}

          {/* Max Single Debit Cap */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Maximum Single Transaction Cap
              </span>
              <span className="font-extrabold text-blue-700 dark:text-blue-400">
                {formatINR(maxLimit)}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={300000}
              step={5000}
              value={maxLimit}
              onChange={(e) => setMaxLimit(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Pre-Debit Alert Timing */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Pre-Debit WhatsApp Notice Window
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[24, 48, 72].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setPreNoticeHours(hours)}
                  className={`py-2 text-xs font-bold rounded-2xl border transition-all ${
                    preNoticeHours === hours
                      ? 'bg-blue-50 dark:bg-[#0C1E3D] border-blue-600 dark:border-blue-400 text-blue-800 dark:text-blue-200 font-extrabold shadow-xs ring-1 ring-blue-500/40'
                      : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {hours} Hours Prior
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-white dark:bg-[#0B1325] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-m3-primary hover:bg-m3-primary-hover text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
