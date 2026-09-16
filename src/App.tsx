import React, { useState, useEffect } from 'react';
import {
  ChallanReceipt,
  LanguageMode,
  TaxDueItem,
  TaxRegime,
  UpiAccount,
  UserProfile,
} from './types/tax';
import { mockChallans, mockUpcomingTaxes, mockUpiAccounts, mockUsers } from './data/mockData';
import { calculateAdvanceTaxInstallments, formatINR } from './services/taxCalculator';
import { translations } from './data/translations';

// Layout Components
import { Header } from './components/layout/Header';
import { AutopilotHeroCard } from './components/dashboard/AutopilotHeroCard';
import { TaxRadarTimeline } from './components/dashboard/TaxRadarTimeline';
import { RegimeBattleCard } from './components/dashboard/RegimeBattleCard';

// Tax Hub Components
import { AdvanceTaxView } from './components/taxes/AdvanceTaxView';
import { PropertyTaxView } from './components/taxes/PropertyTaxView';
import { CapitalGainsView } from './components/taxes/CapitalGainsView';
import { GstTdsView } from './components/taxes/GstTdsView';

// Modals & Drawers
import { PreDebitAlertModal } from './components/autopilot/PreDebitAlertModal';
import { MandateManagerModal } from './components/autopilot/MandateManagerModal';
import { ChallanVaultModal } from './components/vault/ChallanVaultModal';
import { SetupWizardModal } from './components/onboarding/SetupWizardModal';
import { GlossaryModal } from './components/common/GlossaryModal';
import { TaxPlaygroundModal } from './components/calculator/TaxPlaygroundModal';
import { ActivityLogDrawer, ActivityLogItem, initialLogs } from './components/autopilot/ActivityLogDrawer';
import { LanguageSelectorModal } from './components/common/LanguageSelectorModal';
import { UpiManagerModal } from './components/autopilot/UpiManagerModal';
import { SecuritySafetyModal } from './components/common/SecuritySafetyModal';
import { Form26AsModal } from './components/taxes/Form26AsModal';
import { CalendarExportModal } from './components/common/CalendarExportModal';

// Icons
import {
  Shield,
  CreditCard,
  Building,
  TrendingUp,
  Receipt,
  Sparkles,
  Calculator,
  Activity,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUsers[0]);
  const [lang, setLang] = useState<LanguageMode>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('karsetu_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'advance' | 'property' | 'gains' | 'gst'>('overview');

  // Interactive State
  const [upcomingTaxes, setUpcomingTaxes] = useState<TaxDueItem[]>(mockUpcomingTaxes);
  const [challans, setChallans] = useState<ChallanReceipt[]>(mockChallans);
  const [upiAccounts, setUpiAccounts] = useState<UpiAccount[]>(mockUpiAccounts);
  const [paidQuarters, setPaidQuarters] = useState<string[]>(['Q1']);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(initialLogs);

  // Modals state
  const [isPreDebitAlertOpen, setIsPreDebitAlertOpen] = useState(false);
  const [selectedPreDebitTax, setSelectedPreDebitTax] = useState<TaxDueItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [selectedVaultChallanId, setSelectedVaultChallanId] = useState<string | undefined>();
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [is26AsModalOpen, setIs26AsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Notifications toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const t = translations[lang] || translations.en;

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('karsetu_theme', theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  // Recalculate advance tax installments dynamically for current user, synchronized with paidQuarters
  const baseAdvanceData = calculateAdvanceTaxInstallments(currentUser);
  const advanceData = {
    ...baseAdvanceData,
    installments: baseAdvanceData.installments.map((inst, index, arr) => {
      const isPaid = paidQuarters.includes(inst.quarter);
      if (isPaid) {
        return {
          ...inst,
          status: 'paid' as const,
          paidAmount: inst.installmentDue,
          paidDate: inst.paidDate || `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
          challanId: inst.challanId || challans.find((c) => c.taxType.includes(inst.quarter) || c.id.includes(inst.quarter))?.id || challans[0]?.id,
        };
      }
      const firstUnpaidIndex = arr.findIndex((item) => !paidQuarters.includes(item.quarter));
      if (index === firstUnpaidIndex) {
        return {
          ...inst,
          status: 'scheduled' as const,
        };
      }
      return {
        ...inst,
        status: 'upcoming' as const,
      };
    }),
  };

  // Dynamic Autopay Confirmation for ANY Tax Category (Direct Tax, BBPS, GST)
  const handleConfirmAutoPay = (taxItem: TaxDueItem, openVaultWithChallanId?: string) => {
    let newChallan: ChallanReceipt;
    const primaryUpi = upiAccounts.find((u) => u.isPrimary) || upiAccounts[0];
    const isBBPS = taxItem.category === 'property_tax';
    const isGST = taxItem.category === 'gst';

    if (isBBPS) {
      // BBPS Municipal Receipt
      newChallan = {
        id: openVaultWithChallanId || `BBPS-${Date.now()}`,
        crn: `BBPS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-SAS`,
        bsrCode: 'BBPS-MUNI-01',
        challanNo: `SAS-${Math.floor(1000 + Math.random() * 9000)}`,
        panMasked: `${currentUser.pan.slice(0, 5)}••••${currentUser.pan.slice(-1)}`,
        taxpayerName: currentUser.name.toUpperCase(),
        assessmentYear: '2026-27',
        financialYear: '2026-27',
        majorHead: 'MUNICIPAL CORPORATION (NPCI BBPS)',
        minorHead: 'PROPERTY TAX - RESIDENTIAL',
        taxType: taxItem.title,
        amount: taxItem.amount,
        paymentMode: `NPCI BBPS via ${primaryUpi.vpa}`,
        bankRef: `BBPS/TXN/${Math.floor(100000000 + Math.random() * 900000000)}`,
        paidOn: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} IST`,
        cin: `BBPSMUNI${Date.now().toString().slice(-8)}00${taxItem.amount}`,
        bbpsRef: `BBPS${Date.now().toString().slice(-10)}`,
      };
    } else if (taxItem.category === 'gst') {
      // GST PMT-06 Receipt
      newChallan = {
        id: openVaultWithChallanId || `GST-${Date.now()}`,
        crn: `GSTN-CPIN-${Date.now().toString().slice(-10)}`,
        bsrCode: '0210045 (HDFC GST RAILS)',
        challanNo: `PMT06-${Math.floor(1000 + Math.random() * 9000)}`,
        panMasked: currentUser.gstin || '27BPYPP9871M1Z5',
        taxpayerName: currentUser.name.toUpperCase(),
        assessmentYear: '2026-27',
        financialYear: '2026-27',
        majorHead: 'GOODS AND SERVICES TAX (GSTN)',
        minorHead: 'ELECTRONIC CASH LEDGER (FORM PMT-06)',
        taxType: taxItem.title,
        amount: taxItem.amount,
        paymentMode: `GSTN E-Payment via ${primaryUpi.vpa}`,
        bankRef: `GSTN/UTR/${Date.now().toString().slice(-10)}`,
        paidOn: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} IST`,
        cin: `GSTNPMT06${Date.now().toString().slice(-8)}00${taxItem.amount}`,
      };
    } else {
      // ITNS 280 Direct Tax Receipt
      newChallan = {
        id: openVaultWithChallanId || `CH-280-${Date.now()}`,
        crn: `CRN-${Date.now().toString().slice(-11)}`,
        bsrCode: '0210045',
        challanNo: Math.floor(10000 + Math.random() * 90000).toString(),
        panMasked: `${currentUser.pan.slice(0, 5)}••••${currentUser.pan.slice(-1)}`,
        taxpayerName: currentUser.name.toUpperCase(),
        assessmentYear: '2027-28',
        financialYear: '2026-27',
        majorHead: '0021 - INCOME TAX (OTHER THAN COMPANIES)',
        minorHead: '100 - ADVANCE TAX',
        taxType: taxItem.title,
        amount: taxItem.amount,
        paymentMode: currentUser.mandate.mode === 'direct_sweep' ? `UPI AutoPay (${primaryUpi.vpa})` : 'Tax Stash Auto-Sweep',
        bankRef: `UPI/${Date.now().toString().slice(-12)}/${currentUser.linkedBank.bankName.slice(0, 4).toUpperCase()}`,
        paidOn: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} IST`,
        cin: `0210045091811409202600${taxItem.amount}`,
      };
      // Dynamically detect which advance tax quarter was paid
      let paidQuarter = 'Q2';
      if (taxItem.title.includes('Q3') || taxItem.id.includes('q3')) {
        paidQuarter = 'Q3';
      } else if (taxItem.title.includes('Q4') || taxItem.id.includes('q4')) {
        paidQuarter = 'Q4';
      } else if (taxItem.title.includes('Q1') || taxItem.id.includes('q1')) {
        paidQuarter = 'Q1';
      } else {
        const nextUnpaid = ['Q1', 'Q2', 'Q3', 'Q4'].find((q) => !paidQuarters.includes(q)) || 'Q2';
        paidQuarter = nextUnpaid;
      }
      setPaidQuarters((prev) => Array.from(new Set([...prev, paidQuarter])));
    }

    setChallans([newChallan, ...challans]);
    setUpcomingTaxes(upcomingTaxes.filter((t) => t.id !== taxItem.id));

    // Update primary UPI usage
    setUpiAccounts(
      upiAccounts.map((u) =>
        u.isPrimary ? { ...u, mandateUsed: u.mandateUsed + taxItem.amount } : u
      )
    );

    // Record activity audit log entry
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      category: 'challan',
      title: `${taxItem.title} Deposited to Government Treasury`,
      description: `Sovereign settlement of ${formatINR(taxItem.amount)} confirmed via ${primaryUpi.vpa}. CIN: ${newChallan.cin}. BSR Code: ${newChallan.bsrCode}. Form 26AS linked.`,
      status: 'success',
      badge: isBBPS ? 'NPCI BBPS' : isGST ? 'GSTN PMT-06' : 'TIN 2.0 ITD',
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    setCurrentUser({
      ...currentUser,
      stats: {
        ...currentUser.stats,
        taxesAutopaidCount: currentUser.stats.taxesAutopaidCount + 1,
        totalAutopaidAmount: currentUser.stats.totalAutopaidAmount + taxItem.amount,
        penaltiesSaved234: currentUser.stats.penaltiesSaved234 + (taxItem.savings?.amount || 1750),
      },
    });

    if (openVaultWithChallanId) {
      setSelectedVaultChallanId(openVaultWithChallanId);
      setIsVaultOpen(true);
    }

    showToast(`🎉 ${taxItem.title} of ${formatINR(taxItem.amount)} autopaid via ${primaryUpi.vpa}! Receipt in Vault.`);
  };

  // Open pre-debit alert for a specific tax
  const triggerPreDebitForTax = (taxItem: TaxDueItem) => {
    setSelectedPreDebitTax(taxItem);
    setIsPreDebitAlertOpen(true);
  };

  // Trigger pre-debit for a specific advance tax quarterly installment
  const handleTriggerInstallmentPayment = (inst: { quarter: string; installmentDue: number; deadline: string }) => {
    const targetTax: TaxDueItem = {
      id: `due_advance_${inst.quarter.toLowerCase()}`,
      title: `${inst.quarter} Advance Tax Installment (${inst.quarter === 'Q3' ? '75%' : inst.quarter === 'Q4' ? '100%' : '45%'} Target)`,
      category: 'advance_tax',
      dueDate: inst.deadline,
      daysRemaining: inst.quarter === 'Q3' ? 90 : inst.quarter === 'Q4' ? 180 : 1,
      amount: inst.installmentDue,
      status: 'autopay_ready',
      tag: 'TIN 2.0 Direct',
      easyDesc: {
        en: `Direct tax deposit for ${inst.quarter} quarterly cycle. Avoids Section 234C 1% interest penalty.`,
        hinglish: `${inst.quarter} cycle ka advance income tax. Section 234C byaaj penalty se bachat.`,
      },
      bureaucraticTerm: 'Section 208 read with Section 211 of Income Tax Act 1961',
      savings: {
        label: 'Section 234C Penalty Prevented',
        amount: 1750,
      },
    };
    triggerPreDebitForTax(targetTax);
  };

  // Toggle master mandate pause
  const handleToggleMandatePause = () => {
    const nextState = !currentUser.mandate.isActive;
    setCurrentUser({
      ...currentUser,
      mandate: {
        ...currentUser.mandate,
        isActive: nextState,
      },
    });
    showToast(nextState ? '🛡️ KarSetu Autopilot Resumed!' : '⏸️ Autopilot Paused. You can resume anytime.');
  };

  // Update regime
  const handleUpdateRegime = (regime: TaxRegime) => {
    setCurrentUser({ ...currentUser, regime });
    showToast(`Switched active regime to ${regime.toUpperCase()} Tax Regime!`);
  };

  // Handle setting primary UPI account
  const handleSetPrimaryUpi = (accountId: string) => {
    const selected = upiAccounts.find((u) => u.id === accountId);
    if (selected) {
      setUpiAccounts(
        upiAccounts.map((u) => ({
          ...u,
          isPrimary: u.id === accountId,
        }))
      );
      setCurrentUser({
        ...currentUser,
        mandate: {
          ...currentUser.mandate,
          linkedUpi: selected.vpa,
        },
      });
      showToast(`Set ${selected.vpa} (${selected.bankName}) as primary auto-sweep UPI!`);
    }
  };

  // Handle adding new UPI account
  const handleAddUpiAccount = (newAcc: UpiAccount) => {
    setUpiAccounts([...upiAccounts, newAcc]);
    showToast(`✅ Successfully linked ${newAcc.vpa} with NPCI mandate!`);
  };

  // Handle updating existing UPI account details
  const handleUpdateUpiAccount = (updatedAcc: UpiAccount) => {
    setUpiAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedAcc.id ? updatedAcc : acc))
    );
    // If updating the primary account, also sync user's linkedUpi
    if (updatedAcc.isPrimary) {
      setCurrentUser((prev) => ({
        ...prev,
        mandate: {
          ...prev.mandate,
          linkedUpi: updatedAcc.vpa,
        },
      }));
    }
    showToast(`✅ Updated details for ${updatedAcc.vpa}!`);
  };

  // Handle unlinking a UPI account
  const handleDeleteUpiAccount = (accountId: string) => {
    if (upiAccounts.length <= 1) {
      showToast(`⚠️ You must keep at least one active UPI mandate for tax autopay.`);
      return;
    }
    const target = upiAccounts.find((a) => a.id === accountId);
    const remaining = upiAccounts.filter((a) => a.id !== accountId);
    
    // If deleted was primary, assign first remaining as primary
    if (target?.isPrimary && remaining.length > 0) {
      remaining[0].isPrimary = true;
      setCurrentUser((prev) => ({
        ...prev,
        mandate: {
          ...prev.mandate,
          linkedUpi: remaining[0].vpa,
        },
      }));
    }
    setUpiAccounts(remaining);
    showToast(`🗑️ Unlinked ${target?.vpa || 'account'} successfully.`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-[#F8F9FA] text-[#1F1F1F] dark:bg-[#000000] dark:text-[#F1F5F9]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold shadow-m3-4 border border-slate-700/50 flex items-center gap-2.5 animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        user={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          showToast(`Switched profile to ${u.name} (${u.profileType})`);
        }}
        lang={lang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
        onOpenUpiManager={() => setIsUpiModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenVault={() => {
          setSelectedVaultChallanId(undefined);
          setIsVaultOpen(true);
        }}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        challansCount={challans.length}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        onOpen26As={() => setIs26AsModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-8 space-y-6">
        {/* Top Control Bar: Tabs + Quick Calculator & Audit buttons */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 w-full">
          {/* Navigation Tabs (Material 3 Expressive Pill Bar) */}
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              {[
                { id: 'overview', label: t.tabOverview, icon: Shield },
                { id: 'advance', label: t.tabAdvance, icon: CreditCard },
                { id: 'property', label: t.tabProperty, icon: Building },
                { id: 'gains', label: t.tabGains, icon: TrendingUp },
                { id: 'gst', label: t.tabGst, icon: Receipt },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 active:scale-95 whitespace-nowrap ${
                      isActive
                        ? 'bg-m3-primary text-white shadow-m3-1 dark:bg-blue-600 dark:shadow-[0_0_20px_-3px_rgba(37,99,235,0.5)]'
                        : 'bg-white dark:bg-[#0A0A0A] hover:bg-slate-100 dark:hover:bg-[#141414] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-neutral-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions (Calculator, UPI Hub & Audit Log) */}
          <div className="flex items-center gap-2 max-w-full overflow-x-auto pb-1 self-start xl:self-auto scrollbar-none">
            <button
              onClick={() => setIsUpiModalOpen(true)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-[#071328] text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-500/25 text-xs font-bold"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              <span>UPI</span>
            </button>

            <button
              onClick={() => setIsPlaygroundOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-50 dark:bg-[#071328] hover:bg-blue-100 dark:hover:bg-[#0D1E3D] text-xs font-bold text-blue-900 dark:text-blue-300 border border-blue-200/80 dark:border-blue-500/25 transition-colors shadow-2xs whitespace-nowrap"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              <span>{t.taxCalcBtn}</span>
            </button>

            <button
              onClick={() => setIsActivityLogOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 dark:bg-[#05170B] hover:bg-emerald-100 dark:hover:bg-[#092914] text-xs font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/25 transition-colors shadow-2xs whitespace-nowrap"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 animate-pulse" />
              <span>{t.auditLogBtn} ({activityLogs.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Overview Command Center */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Hero Card */}
            {upcomingTaxes.length > 0 ? (
              <AutopilotHeroCard
                user={currentUser}
                nextTax={upcomingTaxes[0]}
                lang={lang}
                onOpenPreDebitAlert={() => triggerPreDebitForTax(upcomingTaxes[0])}
                onToggleMandatePause={handleToggleMandatePause}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            ) : (
              <div className="p-8 rounded-4xl bg-emerald-50 dark:bg-[#04160A] border border-emerald-200 dark:border-emerald-500/30 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-100">{t.allTaxesPaid}</h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Zero pending liabilities. The system will auto-alert you before Q3 Advance Tax in December.
                </p>
              </div>
            )}

            {/* Tax Radar & Fiscal Timeline */}
            <TaxRadarTimeline
              user={currentUser}
              installments={advanceData.installments}
              propertyDue={upcomingTaxes.find((t) => t.category === 'property_tax')}
              lang={lang}
              onSelectInstallment={(inst) => {
                if (inst.challanId) {
                  setSelectedVaultChallanId(inst.challanId);
                  setIsVaultOpen(true);
                } else if (inst.status === 'scheduled') {
                  handleTriggerInstallmentPayment(inst);
                }
              }}
              onOpenVaultWithId={(id) => {
                setSelectedVaultChallanId(id);
                setIsVaultOpen(true);
              }}
              onOpenCalendar={() => setIsCalendarModalOpen(true)}
            />

            {/* Regime Battleground Card */}
            <RegimeBattleCard
              user={currentUser}
              lang={lang}
              onUpdateRegime={handleUpdateRegime}
            />

            {/* Why Autopay Works: 3 Safety Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/[0.08] space-y-2 transition-colors">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.g1Title}</h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                  {t.g1Desc}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/[0.08] space-y-2 transition-colors">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.g2Title}</h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                  {t.g2Desc}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/[0.08] space-y-2 transition-colors">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 flex items-center justify-center">
                  <Building className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.g3Title}</h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                  {t.g3Desc}
                </p>
              </div>
            </div>

            {/* Direct Sovereign Settlement & Zero Wastage Explainer Banner */}
            <div className="p-6 rounded-4xl bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-[10px] font-bold uppercase tracking-wider">
                    Zero Middleman Float
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 text-[10px] font-bold uppercase tracking-wider">
                    RBI Treasury (Article 266)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-[10px] font-bold uppercase tracking-wider">
                    Zero Tax Wastage Guard
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  How does money go directly to the Government—and not a single rupee wasted?
                </h4>
                <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  KarSetu never touches, pools, or routes your funds through private wallets. Payments clear directly to the Reserve Bank of India via TIN 2.0 & NPCI BBPS with verifiable BSR challans.
                </p>
              </div>
              <button
                onClick={() => setIsSecurityModalOpen(true)}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-slate-950 font-bold text-xs shrink-0 shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300 dark:text-emerald-600 shrink-0" />
                <span>Inspect Money Trail & Zero Wastage</span>
                <ArrowRight className="w-4 h-4 text-blue-200 dark:text-slate-500 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Advance Tax Shield */}
        {activeTab === 'advance' && (
          <AdvanceTaxView
            user={currentUser}
            installments={advanceData.installments}
            lang={lang}
            onOpenVaultWithId={(id) => {
              setSelectedVaultChallanId(id);
              setIsVaultOpen(true);
            }}
            onTriggerAutopay={(inst) => {
              handleTriggerInstallmentPayment(inst);
            }}
            onOpen26As={() => setIs26AsModalOpen(true)}
          />
        )}

        {/* Tab 3: Property Tax BBPS */}
        {activeTab === 'property' && (
          <PropertyTaxView
            user={currentUser}
            lang={lang}
            onOpenVaultWithId={(id) => {
              setSelectedVaultChallanId(id);
              setIsVaultOpen(true);
            }}
            onTriggerPropertyAutopay={(item) => triggerPreDebitForTax(item)}
          />
        )}

        {/* Tab 4: Capital Gains */}
        {activeTab === 'gains' && (
          <CapitalGainsView
            user={currentUser}
            lang={lang}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Tab 5: GST & TDS */}
        {activeTab === 'gst' && (
          <GstTdsView
            user={currentUser}
            lang={lang}
            onOpenVaultWithId={(id) => {
              setSelectedVaultChallanId(id);
              setIsVaultOpen(true);
            }}
            onTriggerGstAutopay={(item) => triggerPreDebitForTax(item)}
          />
        )}
      </main>

      {/* Floating Action Button for Quick Tax Calculator */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2.5 print:hidden">
        <button
          onClick={() => setIsPlaygroundOpen(true)}
          className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-m3-3 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          title="Open Custom Tax Calculator"
        >
          <Calculator className="w-6 h-6" />
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#040404] py-8 text-center text-xs text-slate-500 dark:text-neutral-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700 dark:text-neutral-300">
            KarSetu (करसेतु) • {t.tagline}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500">
            {t.footerText || 'Compliant with RBI E-Mandate Regulations, DPDP Act 2023, Income Tax Department TIN 2.0 & NPCI BBPS Rails.'}
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedPreDebitTax && (
        <PreDebitAlertModal
          isOpen={isPreDebitAlertOpen}
          onClose={() => {
            setIsPreDebitAlertOpen(false);
            setSelectedPreDebitTax(null);
          }}
          taxItem={selectedPreDebitTax}
          user={currentUser}
          onConfirmAutoPay={handleConfirmAutoPay}
        />
      )}

      <MandateManagerModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={currentUser}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onUpdateMandate={(mandate) => {
          setCurrentUser({ ...currentUser, mandate });
          showToast('Mandate settings successfully updated!');
        }}
      />

      <ChallanVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        challans={challans}
        activeChallanId={selectedVaultChallanId}
      />

      <SetupWizardModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onCompleteSetup={(newProfile) => {
          setCurrentUser({
            ...currentUser,
            ...newProfile,
            name: 'Rahul Sharma (You)',
          });
          showToast('🎉 Tax Autopilot configured and activated!');
        }}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        lang={lang}
      />

      <TaxPlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
        currentUser={currentUser}
        onApplyCustomTax={(updatedProfile) => {
          setCurrentUser({
            ...currentUser,
            ...updatedProfile,
          });
          showToast('Updated active profile with your custom income numbers!');
        }}
      />

      <ActivityLogDrawer
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        logs={activityLogs}
        onAddLog={(newLog) => setActivityLogs((prev) => [newLog, ...prev])}
      />

      {/* Pan-Indian Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLang={lang}
        onSelectLang={(selectedLang) => {
          setLang(selectedLang);
          showToast(`Switched language to ${translations[selectedLang]?.tagline.slice(0, 24)}...`);
        }}
      />

      {/* UPI Accounts & Live Stats Manager Modal */}
      <UpiManagerModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        accounts={upiAccounts}
        onAddAccount={handleAddUpiAccount}
        onSetPrimary={handleSetPrimaryUpi}
        onUpdateAccount={handleUpdateUpiAccount}
        onDeleteAccount={handleDeleteUpiAccount}
      />

      {/* Trust, Security & Fraud Defense Shield Modal */}
      <SecuritySafetyModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Form 26AS & AIS Tax Credit Reconciler Modal */}
      <Form26AsModal
        isOpen={is26AsModalOpen}
        onClose={() => setIs26AsModalOpen(false)}
        user={currentUser}
        lang={lang}
      />

      {/* Statutory Tax Deadlines Calendar & .ics Export Modal */}
      <CalendarExportModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}

export default App;
