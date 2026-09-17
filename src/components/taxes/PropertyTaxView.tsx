import React, { useState } from 'react';
import { LanguageMode, TaxDueItem, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { LanguageBadge } from '../common/LanguageBadge';
import { allMunicipalities, MunicipalityInfo } from '../../data/municipalities';
import { Building, CheckCircle2, Search, ArrowRight, RefreshCw } from 'lucide-react';

interface PropertyTaxViewProps {
  user: UserProfile;
  lang: LanguageMode;
  onOpenVaultWithId: (challanId: string) => void;
  onTriggerPropertyAutopay?: (item: TaxDueItem) => void;
}

export const PropertyTaxView: React.FC<PropertyTaxViewProps> = ({
  user,
  lang,
  onOpenVaultWithId,
  onTriggerPropertyAutopay,
}) => {
  const initialMun = allMunicipalities.find((m) => m.id === 'bbmp') || allMunicipalities[0];
  const [selectedCityKey, setSelectedCityKey] = useState<string>(initialMun.id);
  const [pidInput, setPidInput] = useState(initialMun.samplePid);
  const [isSearching, setIsSearching] = useState(false);
  const [activeProperty, setActiveProperty] = useState<MunicipalityInfo>(initialMun);

  const rawTax = activeProperty.rawTax;
  const discount = Math.round(rawTax * activeProperty.rebatePct);
  const finalTax = rawTax - discount;

  const handleCityChange = (cityKey: string) => {
    setSelectedCityKey(cityKey);
    const preset = allMunicipalities.find((m) => m.id === cityKey) || allMunicipalities[0];
    setPidInput(preset.samplePid);
    setIsSearching(true);
    setTimeout(() => {
      setActiveProperty(preset);
      setIsSearching(false);
    }, 300);
  };

  const handleFetchBill = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 600);
  };

  const handleTriggerPay = () => {
    if (onTriggerPropertyAutopay) {
      const propertyTaxItem: TaxDueItem = {
        id: `due_property_${Date.now()}`,
        title: `${activeProperty.name.split('(')[0]} Property Tax`,
        category: 'property_tax',
        dueDate: '30 Sep 2026',
        daysRemaining: 15,
        amount: finalTax,
        status: 'autopay_ready',
        tag: 'BBPS Municipal',
        easyDesc: {
          en: `Yearly house tax for ${activeProperty.ward}. Auto-claimed ${(activeProperty.rebatePct * 100).toFixed(0)}% early discount.`,
          hinglish: `Ghar ka saalana tax. ${(activeProperty.rebatePct * 100).toFixed(0)}% early-bird discount shamil hai.`,
        },
        bureaucraticTerm: 'State Municipal Property Assessment Act',
        savings: {
          label: 'Early Bird Rebate Claimed',
          amount: discount,
        },
        challanId: 'BBPS-BBMP-8841',
      };
      onTriggerPropertyAutopay(propertyTaxItem);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-m3-1 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                NPCI BBPS Municipal Rail
              </span>
              <LanguageBadge
                term="BBPS Property Tax Autopilot"
                simpleEn="Once you connect your Property ID or Ward, KarSetu auto-fetches the annual municipal bill and pays early to capture the early bird discount."
                simpleHinglish="Ghar ka property tax auto-pay hota hai aur early-bird chhoot bhi claim ho jaati hai."
                bureaucraticName="State Municipal Corporation Property Assessment & Water Cess"
                lang={lang}
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
              House & Municipal Property Tax
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 max-w-xl">
              Covers 4,000+ urban local bodies across India via Bharat Bill Payment System (BBPS) with native recurring mandates.
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-[#1E293B] border border-amber-200 dark:border-amber-500/30 text-right shrink-0">
            <span className="text-xs text-amber-900 dark:text-amber-300 font-semibold block">Early Bird Rebate Saved</span>
            <span className="text-xl font-black text-emerald-800 dark:text-emerald-400">{formatINR(discount)}</span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 block mt-0.5">
              {(activeProperty.rebatePct * 100).toFixed(0)}% Early-Filing Reward
            </span>
          </div>
        </div>
      </div>

      {/* Interactive City & Property Search Bar */}
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-m3-1 space-y-4 transition-colors">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
          Select Your Municipal Body & Property ID (PID)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <select
              value={selectedCityKey}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-[#1E293B] focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
            </select>
          </div>

          <div className="md:col-span-5">
            <input
              type="text"
              value={pidInput}
              onChange={(e) => setPidInput(e.target.value)}
              placeholder="Enter Assessment Number / PID"
              className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold text-slate-800 dark:text-white bg-white dark:bg-[#1E293B] focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleFetchBill}
              disabled={isSearching}
              className="w-full h-full min-h-[44px] rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              {isSearching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Fetch Bill</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Linked Property Details Card */}
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-m3-1 space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 flex items-center justify-center border border-amber-200 dark:border-amber-800/40 shrink-0">
              <Building className="w-7 h-7 text-amber-800 dark:text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Verified Municipal Demand
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{activeProperty.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                {activeProperty.ward} • PID: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{pidInput}</span> • Owner: {user.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              BBPS Auto-Mandate Linked
            </span>
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-300 block mb-1">Gross Annual Municipal Demand</span>
            <span className="text-lg font-black text-slate-800 dark:text-white">{formatINR(rawTax)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30">
            <span className="text-emerald-800 dark:text-emerald-300 font-semibold block mb-1">
              Early-Bird {(activeProperty.rebatePct * 100).toFixed(0)}% Instant Rebate
            </span>
            <span className="text-lg font-black text-emerald-800 dark:text-emerald-300">- {formatINR(discount)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30">
            <span className="text-blue-800 dark:text-blue-300 font-semibold block mb-1">Net Autopay Amount</span>
            <span className="text-lg font-black text-blue-950 dark:text-blue-200">{formatINR(finalTax)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Due Date: 30 Sep 2026. AutoPay scheduled 48 hours prior via UPI AutoPay.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenVaultWithId('BBPS-BBMP-8841')}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              Past Receipt
            </button>

            <button
              onClick={handleTriggerPay}
              className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>Test Autopay This Bill Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
