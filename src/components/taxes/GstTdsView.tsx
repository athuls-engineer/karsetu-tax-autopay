import React from 'react';
import { LanguageMode, TaxDueItem, UserProfile } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { translations } from '../../data/translations';
import { LanguageBadge } from '../common/LanguageBadge';
import { FileCheck, Shield, CheckCircle2, ArrowRight, Building2, Receipt, Clock } from 'lucide-react';

interface GstTdsViewProps {
  user: UserProfile;
  lang: LanguageMode;
  onOpenVaultWithId: (challanId: string) => void;
  onTriggerGstAutopay?: (item: TaxDueItem) => void;
}

export const GstTdsView: React.FC<GstTdsViewProps> = ({
  user,
  lang,
  onOpenVaultWithId,
  onTriggerGstAutopay,
}) => {
  const t = translations[lang] || translations.en;
  const gstin = user.gstin || '27BPYPP9871M1Z5';

  const getLabels = () => {
    if (lang === 'ml') {
      return {
        title: 'ജിഎസ്ടി ചെല്ലാനുകൾ & 26AS ടിഡിഎസ് നികുതി പൊരുത്തപ്പെടുത്തൽ',
        sub: 'സർക്കാർ ജിഎസ്ടി പോർട്ടലിലെ ബാധ്യതയും ഉപഭോക്താക്കൾ പിടിച്ച ടിഡിഎസും നേരിട്ട് ഒത്തുനോക്കുന്നു.',
        activeGstin: 'സജീവ ജിഎസ്ടി നമ്പർ',
        qrmp: 'പ്രതിമാസ PMT-06 ചെല്ലാൻ സജീവം',
        gstCardTitle: 'പ്രതിമാസ ക്യാഷ് ലെഡ്ജർ നിക്ഷേപം (PMT-06)',
        gstCardSub: '₹3,400 ഇൻപുട്ട് ടാക്സ് ക്രെഡിറ്റ് കുറച്ച ശേഷമുള്ള തുക',
        mandateLinked: 'മാൻഡേറ്റ് ബന്ധിപ്പിച്ചു',
        pastReceipt: 'കഴിഞ്ഞ PMT-06 രസീത്',
        testPay: 'ഓട്ടോപേ PMT-06 പരിശോധിക്കുക',
        tdsTitle: 'അവകാശപ്പെട്ട ടിഡിഎസ് ക്രെഡിറ്റുകൾ',
        tdsSub: 'സെക്ഷൻ 194J, 194A പ്രകാരം ക്ലയന്റുകളും ബാങ്കുകളും നിക്ഷേപിച്ച ടിഡിഎസ്',
        matched: '100% ടാക്സ് ക്രെഡിറ്റ് പരിശോധിച്ചു',
      };
    }
    if (lang === 'hi') {
      return {
        title: 'जीएसटी चालान व 26AS टीडीएस मिलान केंद्र',
        sub: 'ग्राहकों द्वारा काटे गए टीडीएस और जीएसटी पोर्टल की देनदारी का स्वचालित मिलान।',
        activeGstin: 'सक्रिय जीएसटी पहचान संख्या',
        qrmp: 'मासिक PMT-06 चालान सक्षम',
        gstCardTitle: 'मासिक कैश लेज़र जमा (PMT-06)',
        gstCardSub: '₹3,400 इनपुट टैक्स क्रेडिट घटाने के बाद शुद्ध देनदारी',
        mandateLinked: 'मैन्डेट लिंक है',
        pastReceipt: 'पिछली PMT-06 रसीद',
        testPay: 'ऑटोपे PMT-06 टेस्ट करें',
        tdsTitle: 'दावा किए गए टीडीएस क्रेडिट्स',
        tdsSub: 'धारा 194J और 194A के तहत बैंकों व कंपनियों द्वारा काटा गया टैक्स',
        matched: '100% टैक्स क्रेडिट सत्यापित',
      };
    }
    return {
      title: 'GST Challans & 26AS TDS Reconciler',
      sub: 'Automatic matching between taxes your clients deducted (TDS) and your direct liability on the GST portal.',
      activeGstin: 'Active GSTIN',
      qrmp: 'QRMP Monthly Challan Enabled',
      gstCardTitle: 'Monthly Cash Ledger Deposit',
      gstCardSub: 'Net liability after ₹3,400 input tax credit',
      mandateLinked: 'Mandate Linked',
      pastReceipt: 'Past PMT-06 Receipt',
      testPay: 'Test Autopay PMT-06',
      tdsTitle: 'TDS Credits Claimed',
      tdsSub: 'Deductions reported by clients & banks under Section 194J & 194A',
      matched: '100% Tax Credit Verified',
    };
  };

  const labels = getLabels();

  const handlePayGst = () => {
    if (onTriggerGstAutopay) {
      const gstItem: TaxDueItem = {
        id: `due_gst_${Date.now()}`,
        title: 'GST Monthly Cash Challan (PMT-06)',
        category: 'gst',
        dueDate: '25 Sep 2026',
        daysRemaining: 10,
        amount: 7800,
        status: 'autopay_ready',
        tag: 'GSTN Ledger',
        easyDesc: {
          en: 'Monthly GST payment for consulting revenue. Calculated after input credit deduction.',
          hinglish: 'Mahine ka GST challan. Kharchon ka credit ghatane ke baad bacha hua amount.',
        },
        bureaucraticTerm: 'Rule 87(7) Form GST PMT-06 Electronic Cash Ledger deposit',
        savings: {
          label: 'Late Fee Averted',
          amount: 500,
        },
        challanId: 'GSTN-PMT06-2918',
      };
      onTriggerGstAutopay(gstItem);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-4xl p-6 sm:p-8 border border-slate-200 dark:border-white/[0.08] shadow-m3-1 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                GSTN & TDS Reconciliation Rail
              </span>
              <LanguageBadge
                term="GST PMT-06 Autopilot"
                simpleEn="Calculates monthly GST output minus input tax credit (ITC) and creates the PMT-06 cash challan for auto-debit before the 25th deadline."
                simpleHinglish="Har mahine ka GST challan apne aap create aur clear ho jata hai."
                bureaucraticName="Rule 87(7) of CGST Rules 2017 & Electronic Cash Ledger Form PMT-06"
                lang={lang}
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
              {labels.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-xl">
              {labels.sub}
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-right shrink-0">
            <span className="text-xs text-purple-900 dark:text-purple-300 font-semibold block">{labels.activeGstin}</span>
            <span className="text-base font-mono font-black text-purple-950 dark:text-purple-100">{gstin}</span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400 block mt-0.5">{labels.qrmp}</span>
          </div>
        </div>
      </div>

      {/* Grid of GST and TDS cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next GST Challan */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-4xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-m3-1 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              Form GST PMT-06
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              AutoPay Ready
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{labels.gstCardTitle}</h4>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatINR(7800)}</div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{labels.gstCardSub}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] flex justify-between items-center text-xs">
            <span className="text-slate-600 dark:text-neutral-400 font-medium">{t.dueLabel} 25 Sep 2026</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {labels.mandateLinked}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onOpenVaultWithId('GSTN-PMT06-2918')}
              className="text-xs font-bold text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-slate-200 underline"
            >
              {labels.pastReceipt}
            </button>
            <button
              onClick={handlePayGst}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>{labels.testPay}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 26AS / AIS Sync */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-4xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-m3-1 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              Form 26AS & AIS Sync
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              Live Matched
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{labels.tdsTitle}</h4>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatINR(user.salaryTds)}</div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              {labels.tdsSub}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] flex justify-between items-center text-xs">
            <span className="text-slate-600 dark:text-neutral-400 font-medium">Zero Unmatched Entries</span>
            <span className="text-blue-700 dark:text-blue-400 font-bold">{labels.matched}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
