import React from 'react';
import { LanguageMode, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { translations } from '../../data/translations';
import { LanguageBadge } from '../common/LanguageBadge';
import { TrendingUp, Wallet, Sparkles, PieChart, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface CapitalGainsViewProps {
  user: UserProfile;
  lang: LanguageMode;
  onOpenSettings: () => void;
}

export const CapitalGainsView: React.FC<CapitalGainsViewProps> = ({
  user,
  lang,
  onOpenSettings,
}) => {
  const t = translations[lang] || translations.en;
  const stcg = user.capitalGains.stcg;
  const ltcg = user.capitalGains.ltcg;

  // New Budget rates: STCG is 20%, LTCG is 12.5% above 1.25L exemption
  const taxableLtcg = Math.max(0, ltcg - 125000);
  const stcgTax = Math.round(stcg * 0.20);
  const ltcgTax = Math.round(taxableLtcg * 0.125);
  const totalGainsTax = stcgTax + ltcgTax;

  const getLabels = () => {
    if (lang === 'ml') {
      return {
        title: 'ഓഹരികൾ & മ്യൂച്വൽ ഫണ്ട് നികുതി ട്രാക്കർ',
        sub: 'അക്കൗണ്ട് അഗ്രഗേറ്റർ വഴി ഡിമാറ്റ് അക്കൗണ്ടുകൾ നേരിട്ട് ബന്ധിപ്പിച്ചിരിക്കുന്നു.',
        autoAllocated: 'അഡ്വാൻസ് നികുതിയിലേക്ക് മാറ്റിയത്:',
        stcgTitle: 'ഹ്രസ്വകാല മൂലധന നേട്ടം (STCG)',
        ltcgTitle: 'ദീർഘകാല മൂലധന നേട്ടം (LTCG)',
        stashTitle: 'നികുതി അടയ്ക്കുന്നതിന് മുൻപ് 6.75% ലാഭം നേടണോ?',
        stashSub: 'ടാക്സ് സ്റ്റാഷ് മോഡ് സജീവമാക്കി അവസാന തീയതി വരെ പണം ലിക്വിഡ് ഫണ്ടുകളിൽ നിക്ഷേപിക്കാം.',
        stashBtn: 'ടാക്സ് സ്റ്റാഷ് ക്രമീകരിക്കുക',
      };
    }
    if (lang === 'hi') {
      return {
        title: 'शेयर, म्यूचुअल फंड व पूंजीगत लाभ ट्रैकर',
        sub: 'आरबीआई अकाउंट एग्रीगेटर से डीमैट कनेक्टेड। मार्च में कोई टैक्स झटका नहीं।',
        autoAllocated: 'Q2 एडवांस टैक्स में आवंटित:',
        stcgTitle: 'अल्पकालिक पूंजीगत लाभ (STCG)',
        ltcgTitle: 'दीर्घकालिक पूंजीगत लाभ (LTCG)',
        stashTitle: 'टैक्स भुगतान से पहले 6.75% ब्याज कमाना चाहते हैं?',
        stashSub: 'सरकारी डेडलाइन तक पैसे को ओवरनाइट लिक्विड फंड में रखकर रिटर्न पाएं।',
        stashBtn: 'टैक्स स्टैश कॉन्फ़िगर करें',
      };
    }
    return {
      title: 'Stocks, Mutual Funds & Capital Gains Tracker',
      sub: 'Connected via Account Aggregator to your demat accounts. Never face an unexpected tax shock in March.',
      autoAllocated: 'Auto-Allocated to Q2 Advance Tax:',
      stcgTitle: 'Short-Term Gains (STCG)',
      ltcgTitle: 'Long-Term Gains (LTCG)',
      stashTitle: 'Want your capital gains tax to earn 6.75% interest before payment?',
      stashSub: "Switch your autopay mode to 'Tax Stash' to keep money in overnight liquid mutual funds until the government deadline.",
      stashBtn: 'Configure Tax Stash',
    };
  };

  const labels = getLabels();

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-m3-1 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                Broker Auto-Sync (CAMS / KFintech / CDSL)
              </span>
              <LanguageBadge
                term="Capital Gains Autopilot"
                simpleEn="When you sell shares or mutual funds at a profit, KarSetu calculates the 20% short-term or 12.5% long-term tax and sweeps it into your Advance Tax installment."
                simpleHinglish="Shares bechne par hone wale munafey ka tax apne aap calculate ho jata hai."
                bureaucraticName="Section 111A (STCG) and Section 112A (LTCG) with Budget 2024 revised rates"
                lang={lang}
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
              {labels.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 max-w-xl">
              {labels.sub}
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-emerald-50/80 dark:bg-[#1E293B] border border-emerald-200 dark:border-emerald-500/30 text-right shrink-0">
            <span className="text-xs text-emerald-900 dark:text-emerald-300 font-semibold block">Total Estimated Gains Tax</span>
            <span className="text-xl font-black text-emerald-950 dark:text-emerald-100">{formatINR(totalGainsTax)}</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block mt-0.5">Budget 2024 Slabs Applied</span>
          </div>
        </div>
      </div>

      {/* Slices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Short Term Capital Gains */}
        <div className="bg-white dark:bg-[#0F172A] rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-m3-1 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Equity Held &lt; 12 Months
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              Flat 20% Tax Rate
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{labels.stcgTitle}</h4>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatINR(stcg)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">From Zerodha / Groww demat trades</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 flex justify-between items-center text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">{labels.autoAllocated}</span>
            <span className="font-extrabold text-blue-700 dark:text-blue-400">{formatINR(stcgTax)}</span>
          </div>
        </div>

        {/* Long Term Capital Gains */}
        <div className="bg-white dark:bg-[#0F172A] rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-m3-1 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Equity Held &gt; 12 Months
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
              12.5% Tax (&gt; ₹1.25L)
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{labels.ltcgTitle}</h4>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatINR(ltcg)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">₹1.25 Lakh zero-tax rebate applied</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 flex justify-between items-center text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">{labels.autoAllocated}</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{formatINR(ltcgTax)}</span>
          </div>
        </div>
      </div>

      {/* Tax Stash Promotion Banner */}
      <div className="p-6 rounded-4xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/40">
            <Wallet className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {labels.stashTitle}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
              {labels.stashSub}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 cursor-pointer"
        >
          {labels.stashBtn}
        </button>
      </div>
    </div>
  );
};
