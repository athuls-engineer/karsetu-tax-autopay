import React, { useState, useEffect } from 'react';
import { AutopayMode, ProfileType, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { allMunicipalities } from '../../data/municipalities';
import {
  X,
  Check,
  ShieldCheck,
  Briefcase,
  Laptop,
  TrendingUp,
  Building,
  Landmark,
  Wallet,
  Smartphone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSetup: (newProfile: Partial<UserProfile>) => void;
}

const personas = [
  {
    id: 'salaried',
    title: 'Salaried Employee',
    sub: 'MNC / Startup techie with PF, TDS, ESOPs or mutual funds',
    icon: Briefcase,
    color: 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/60',
  },
  {
    id: 'freelancer',
    title: 'Freelancer / Creator',
    sub: 'Remote consultant, design, dev or international client receipts',
    icon: Laptop,
    color: 'text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/60',
  },
  {
    id: 'investor',
    title: 'Investor / Trader',
    sub: 'Active stock trader, mutual fund swings, F&O and crypto',
    icon: TrendingUp,
    color: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/60',
  },
  {
    id: 'business',
    title: 'Business / Landlord',
    sub: 'Rental property owners, MSME firms, GST registered shops',
    icon: Building,
    color: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/60',
  },
];

export const SetupWizardModal: React.FC<SetupWizardModalProps> = ({
  isOpen,
  onClose,
  onCompleteSetup,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profileType, setProfileType] = useState<ProfileType>('salaried');
  const [pan, setPan] = useState('ABCPS1234F');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState('bbmp');
  const [propertyCity, setPropertyCity] = useState('Bruhat Bengaluru Mahanagara Palike (BBMP)');
  const [propertyPid, setPropertyPid] = useState('BBMP-EST-2024-8841');
  const [customMunicipalityName, setCustomMunicipalityName] = useState('');
  const [hasProperty, setHasProperty] = useState(true);
  const [autopayMode, setAutopayMode] = useState<AutopayMode>('direct_sweep');
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [phone, setPhone] = useState('9876543210');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStepNext = () => {
    if (step < 3) {
      setStep((step + 1) as 2 | 3);
    } else {
      // Complete setup
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#0B57D0', '#146C2E', '#E8710A'],
        });
        const selectedMun = allMunicipalities.find((m) => m.id === selectedMunicipalityId);
        const municipalityTitle = selectedMunicipalityId === 'other'
          ? (customMunicipalityName || 'Local Municipal Corporation')
          : (selectedMun?.name || propertyCity);
        const pid = propertyPid || selectedMun?.samplePid || 'PROP-2026-9812';

        onCompleteSetup({
          profileType,
          pan,
          phone: phone.replace(/\D/g, '').slice(-10),
          notifications: {
            whatsappEnabled: true,
            smsEnabled: true,
            emailEnabled: false,
            preNoticeHours: 72,
            verified: true,
          },
          linkedBank: {
            bankName: selectedBank,
            accountNoMasked: '•••8902',
            ifsc: 'HDFC0000240',
            upiId,
          },
          propertyDetails: hasProperty ? {
            propertyId: pid,
            municipality: municipalityTitle,
            ward: selectedMun?.ward || 'Central Zone - Ward 1',
            annualTax: selectedMun?.rawTax || 12500,
            earlyBirdDiscount: Math.round((selectedMun?.rawTax || 12500) * (selectedMun?.rebatePct || 0.05)),
          } : undefined,
          mandate: {
            isActive: true,
            mode: autopayMode,
            maxSingleLimit: 100000,
            linkedUpi: upiId,
            preNoticeHours: 72,
            stashBalance: autopayMode === 'tax_stash' ? 50000 : 0,
            interestYieldPct: 6.75,
          },
        });
        onClose();
      }, 1000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl max-w-xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-m3-4 border border-slate-100 dark:border-slate-800 flex flex-col transition-colors my-auto">
        {/* Progress Bar & Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-m3-surface-container-low dark:bg-[#0B1325] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-m3-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                {step}/3
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {step === 1 && 'Step 1: Tell us about yourself'}
                  {step === 2 && 'Step 2: Connect Tax Sources (60s)'}
                  {step === 3 && 'Step 3: Activate 1-Click Autopilot'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {step === 1 && 'Pick your income type so we know which taxes apply to you'}
                  {step === 2 && '100% RBI Account Aggregator safe — zero netbanking passwords'}
                  {step === 3 && 'Set your safety limit and authorize UPI AutoPay'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer shrink-0"
              title="Close Setup Wizard (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Dots */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden flex">
            <div
              className="bg-m3-primary h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Scrollable Step Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Step 1: Profile Type */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personas.map((item) => {
                  const Icon = item.icon;
                  const isSelected = profileType === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProfileType(item.id as ProfileType)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-600'
                          : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#1E293B]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        {/* Step 2: Connect Sources */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Permanent Account Number (PAN)
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="ABCPS1234F"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-800 dark:text-white font-mono font-bold text-sm tracking-widest focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Used strictly to verify Form 26AS & calculate Advance Tax installments.
              </p>
            </div>

            {/* Account Aggregator Consent */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-[#0C1E3D] border border-blue-200 dark:border-blue-700/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-blue-900 dark:text-blue-300 block mb-0.5">
                  1-Click RBI Account Aggregator Connect
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Silently fetches your bank interest & broker capital gains (Zerodha, Groww, INDmoney) via encrypted Sahamati rails.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    100% Encrypted
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                    Revocable Anytime
                  </span>
                </div>
              </div>
            </div>

            {/* Property Tax BBPS toggle */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 dark:bg-[#1E293B] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Link Municipal Property Tax?</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Connect via Bharat Bill Payment System (BBPS) for 5-10% early-bird rebate
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasProperty}
                  onChange={(e) => setHasProperty(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0"
                />
              </div>

              {hasProperty && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                      Select Municipal Corporation (70+ Pan-India Cities via BBPS)
                    </label>
                    <select
                      value={selectedMunicipalityId}
                      onChange={(e) => {
                        const mId = e.target.value;
                        setSelectedMunicipalityId(mId);
                        const m = allMunicipalities.find((item) => item.id === mId);
                        if (m) {
                          setPropertyCity(m.name);
                          setPropertyPid(m.samplePid);
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-800 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <optgroup label="🌟 South India (Karnataka, Tamil Nadu, Kerala, AP, Telangana)">
                        {allMunicipalities.filter((m) => m.region === 'South').map((m) => (
                          <option key={m.id} value={m.id}>{m.city} — {m.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🏢 West India (Maharashtra, Gujarat, Goa)">
                        {allMunicipalities.filter((m) => m.region === 'West').map((m) => (
                          <option key={m.id} value={m.id}>{m.city} — {m.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🏛️ North India (Delhi NCR, UP, Rajasthan, Punjab, Haryana, J&K)">
                        {allMunicipalities.filter((m) => m.region === 'North').map((m) => (
                          <option key={m.id} value={m.id}>{m.city} — {m.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🌉 East & North-East (Bengal, Bihar, Odisha, Assam, Jharkhand)">
                        {allMunicipalities.filter((m) => m.region === 'East').map((m) => (
                          <option key={m.id} value={m.id}>{m.city} — {m.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🏙️ Central India (Madhya Pradesh, Chhattisgarh)">
                        {allMunicipalities.filter((m) => m.region === 'Central').map((m) => (
                          <option key={m.id} value={m.id}>{m.city} — {m.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🔍 Other / Unlisted">
                        <option value="other">Other Municipality (Pan-India BBPS Biller Search)</option>
                      </optgroup>
                    </select>
                  </div>

                  {selectedMunicipalityId === 'other' ? (
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Enter Municipal Body / Nagar Palika Name
                      </label>
                      <input
                        type="text"
                        value={customMunicipalityName}
                        onChange={(e) => setCustomMunicipalityName(e.target.value)}
                        placeholder="e.g. Kozhikode Corporation / Shimla Municipal Corporation"
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#062417] border border-emerald-200/80 dark:border-emerald-500/40 text-[11px] text-emerald-900 dark:text-emerald-300 font-medium">
                      <span>✓ BBPS Biller: {allMunicipalities.find((m) => m.id === selectedMunicipalityId)?.bbpsBillerId}</span>
                      <span className="font-bold">{allMunicipalities.find((m) => m.id === selectedMunicipalityId)?.rebateLabel || '5% Early Bird Rebate'}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Property ID (PID) / Assessment Number
                    </label>
                    <input
                      type="text"
                      value={propertyPid}
                      onChange={(e) => setPropertyPid(e.target.value)}
                      placeholder="e.g. BBMP-EST-2024-8841"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-800 dark:text-white font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Autopilot Mandate Activation */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center pb-2">
              <div className="w-12 h-12 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2 border border-emerald-200 dark:border-emerald-800/40">
                <Sparkles className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Set Up Your Tax Shield Mandate</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You will always receive a WhatsApp alert 72 hours before any tax is debited.
              </p>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAutopayMode('direct_sweep')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  autopayMode === 'direct_sweep'
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-[#0C1E3D] dark:border-blue-400/60 ring-1 ring-blue-500/50'
                    : 'border-slate-200 dark:border-slate-700/80 dark:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white mb-1">
                  <Landmark className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  <span>Direct Bank Sweep</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Pay directly from bank account via UPI</p>
              </button>

              <button
                type="button"
                onClick={() => setAutopayMode('tax_stash')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  autopayMode === 'tax_stash'
                    ? 'border-emerald-600 bg-emerald-50/80 dark:bg-[#062417] dark:border-emerald-500/50 ring-1 ring-emerald-500/50'
                    : 'border-slate-200 dark:border-slate-700/80 dark:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white mb-1">
                  <Wallet className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Tax Stash (6.75%)</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Earn interest on tax money till due date</p>
              </button>
            </div>

            {/* UPI ID field */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Your UPI ID for AutoPay Mandate
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okhdfcbank"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-800 dark:text-white font-mono text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Mobile Number for WhatsApp & SMS Pre-Debit Notices */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mobile Number for Mandatory 72h Pre-Debit Notices
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  RBI Required
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-3 rounded-xl bg-slate-100 dark:bg-[#0B1325] border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-800 dark:text-white font-mono text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Under RBI e-Mandate Circular 2023, you receive an automated WhatsApp & SMS alert 72 hours before any debit with an instant 1-tap pause button.
              </p>
            </div>

            {/* Safety Guarantee Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-[#062417] border border-emerald-200 dark:border-emerald-500/40 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Zero Penalty Guarantee:</strong> If KarSetu ever delays an installment, we refund 100% of any government penalty.
              </span>
            </div>
          </div>
        )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0B1325] shrink-0">
          {step > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel & Close
            </button>
          )}

          <button
            type="button"
            onClick={handleStepNext}
            disabled={isVerifying}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-m3-primary hover:bg-m3-primary-hover text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            {isVerifying ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : step === 3 ? (
              <>
                <Check className="w-4 h-4" />
                Activate Tax Autopilot
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
