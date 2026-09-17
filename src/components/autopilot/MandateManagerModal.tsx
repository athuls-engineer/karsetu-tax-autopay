import React, { useState, useEffect } from 'react';
import { AutopayMode, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import {
  dispatchNativePushNotification,
  dispatchSovereignGateway,
  sanitizeIndianPhone,
  GatewayDeliveryReceipt,
} from '../../services/notificationService';
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
  Radio,
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
  const [gatewayReceipt, setGatewayReceipt] = useState<GatewayDeliveryReceipt | null>(null);
  const [callmebotKey, setCallmebotKey] = useState<string>(user.notifications?.callmebotApiKey || '');
  const [fast2smsKey, setFast2smsKey] = useState<string>(user.notifications?.fast2smsApiKey || '');
  const [showAdvancedGateway, setShowAdvancedGateway] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setPhone(user.phone || '9876543210');
      setWhatsappEnabled(user.notifications?.whatsappEnabled ?? true);
      setSmsEnabled(user.notifications?.smsEnabled ?? true);
      setCallmebotKey(user.notifications?.callmebotApiKey || '');
      setFast2smsKey(user.notifications?.fast2smsApiKey || '');
      setGatewayReceipt(null);
      setPushStatusMessage(null);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, user]);

  if (!isOpen) return null;

  const handleTriggerDevicePush = async () => {
    setIsDispatching(true);
    setPushStatusMessage(null);
    const sampleTax = mockUpcomingTaxes[0];
    const res = await dispatchNativePushNotification(user, sampleTax);
    onTriggerTestAlert?.(whatsappEnabled ? 'whatsapp' : 'sms');
    if (res.permission === 'granted') {
      setPushStatusMessage('✓ System notification pushed directly to your OS tray/screen!');
    } else if (res.permission === 'denied') {
      setPushStatusMessage('⚠️ Browser notifications blocked in your browser settings. In-app banner triggered!');
    } else {
      setPushStatusMessage('✓ Inbound alert simulated with chime and banner!');
    }
    setIsDispatching(false);
  };

  const handleDispatchGateway = async () => {
    setIsDispatching(true);
    const sampleTax = mockUpcomingTaxes[0];
    const channel = whatsappEnabled ? 'whatsapp' : 'sms';
    const receipt = await dispatchSovereignGateway(phone, user, sampleTax, channel, callmebotKey, fast2smsKey);
    setGatewayReceipt(receipt);
    onTriggerTestAlert?.(channel);
    setIsDispatching(false);
  };

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
        callmebotApiKey: callmebotKey.trim() || undefined,
        fast2smsApiKey: fast2smsKey.trim() || undefined,
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

            {/* Inbound Alert Test & Gateway Verification Actions */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <button
                  type="button"
                  onClick={handleTriggerDevicePush}
                  disabled={phone.length !== 10 || isDispatching}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Receive Real Alert on this Device</span>
                </button>

                <button
                  type="button"
                  onClick={handleDispatchGateway}
                  disabled={phone.length !== 10 || isDispatching}
                  className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Test Inbound Telecom Ping</span>
                </button>
              </div>

              {pushStatusMessage && (
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span>{pushStatusMessage}</span>
                </div>
              )}

              {gatewayReceipt && (
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/80 text-[11px] space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Inbound Notice Dispatched to {gatewayReceipt.recipientPhone}</span>
                    </span>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                      {gatewayReceipt.status}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px]">
                    {gatewayReceipt.details} (Ref: {gatewayReceipt.messageId} via {gatewayReceipt.carrier} at {gatewayReceipt.timestamp})
                  </p>
                </div>
              )}

              {/* Real Phone Delivery Guide & Gateway Connectors */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdvancedGateway(!showAdvancedGateway)}
                  className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{showAdvancedGateway ? '▾' : '▸'} How to receive REAL SMS & WhatsApp on your physical phone? (Click to view)</span>
                </button>
                {showAdvancedGateway && (
                  <div className="mt-2 p-3.5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
                    <div className="space-y-1 text-slate-600 dark:text-slate-300">
                      <p className="font-bold text-slate-900 dark:text-white">
                        ℹ️ Why static websites cannot send free cellular SMS without a gateway:
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Under Indian telecom law (TRAI DLT), cellular SMS incurs carrier charges and requires registered enterprise headers (like <code className="text-blue-500">[KARSETU]</code>). Meta also strictly restricts WhatsApp to verified business numbers to prevent spam. Below are 3 ways you can receive real alerts right now:
                      </p>
                    </div>

                    {/* Method 1: Real Mobile Push on Smartphone */}
                    <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300 text-xs">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Method 1: Open KarSetu on your Smartphone (Zero Setup)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Open <span className="font-mono font-bold text-blue-600 dark:text-blue-400">athuls-engineer.github.io/karsetu-tax-autopay</span> in Chrome on your phone, click <strong>"Receive Real Alert"</strong> and tap Allow. Your actual phone will ring and vibrate with the incoming alert!
                      </p>
                    </div>

                    {/* Method 2: Real WhatsApp via CallMeBot */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-700/80">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Method 2: Real WhatsApp Inbound Bot (CallMeBot)
                        </span>
                        <a
                          href="https://www.callmebot.com/blog/free-api-whatsapp-messages/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-600 dark:text-blue-400 underline font-semibold"
                        >
                          Get Free Key in 10s ↗
                        </a>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Send <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">I allow callmebot to send me messages</code> to CallMeBot on WhatsApp to get a key, then paste below:
                      </p>
                      <input
                        type="password"
                        value={callmebotKey}
                        onChange={(e) => setCallmebotKey(e.target.value)}
                        placeholder="Enter CallMeBot API key..."
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-mono"
                      />
                    </div>

                    {/* Method 3: Real Cellular SMS via Fast2SMS */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-700/80">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Method 3: Real Cellular SMS (Fast2SMS India)
                        </span>
                        <a
                          href="https://www.fast2sms.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-600 dark:text-blue-400 underline font-semibold"
                        >
                          Fast2SMS Portal ↗
                        </a>
                      </div>
                      <input
                        type="password"
                        value={fast2smsKey}
                        onChange={(e) => setFast2smsKey(e.target.value)}
                        placeholder="Enter Fast2SMS API key..."
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
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
