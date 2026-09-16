import React, { useState, useRef, useEffect } from 'react';
import { LanguageMode, UserProfile } from '../../types/tax';
import { mockUsers } from '../../data/mockData';
import { supportedLanguages, translations } from '../../data/translations';
import {
  Globe2,
  CreditCard,
  SlidersHorizontal,
  FileCheck2,
  ChevronDown,
  PlusCircle,
  HelpCircle,
  Sun,
  Moon,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  lang: LanguageMode;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenLanguageSelector: () => void;
  onOpenUpiManager: () => void;
  onOpenSettings: () => void;
  onOpenVault: () => void;
  onOpenSetup: () => void;
  onOpenGlossary: () => void;
  onOpenSecurity?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onSelectUser,
  lang,
  theme,
  onToggleTheme,
  onOpenLanguageSelector,
  onOpenUpiManager,
  onOpenSettings,
  onOpenVault,
  onOpenSetup,
  onOpenGlossary,
  onOpenSecurity,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = translations[lang] || translations.en;
  const currentLangMeta = supportedLanguages.find((l) => l.code === lang) || supportedLanguages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#000000]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Slogan */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-m3-2 relative overflow-hidden shrink-0">
            <span className="font-extrabold text-lg sm:text-xl tracking-tighter">KS</span>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-black" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  KarSetu
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-neutral-500">
                  (करसेतु)
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-[#04160A] text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse shrink-0" />
                <span>Autopilot Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium hidden lg:block whitespace-nowrap truncate max-w-xs xl:max-w-md">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Pan-Indian Language Selector Button */}
          <button
            onClick={onOpenLanguageSelector}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#0A0A0A] hover:bg-slate-200 dark:hover:bg-[#141414] text-xs font-bold text-slate-800 dark:text-neutral-200 transition-colors border border-slate-200/70 dark:border-white/[0.08]"
            title="Choose Language (10 Indian Languages)"
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="hidden sm:inline">{currentLangMeta.nativeName}</span>
            <span className="sm:hidden uppercase text-[11px]">{lang}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-[#0A0A0A] hover:bg-slate-200 dark:hover:bg-[#141414] text-slate-700 dark:text-amber-300 border border-slate-200/70 dark:border-white/[0.08] transition-colors flex items-center justify-center text-xs font-bold"
            title={`Switch to ${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* UPI Accounts Hub Button */}
          <button
            onClick={onOpenUpiManager}
            className="flex items-center gap-1.5 p-2 xl:px-3 xl:py-1.5 rounded-2xl bg-blue-50/80 dark:bg-[#071328] hover:bg-blue-100 dark:hover:bg-[#0D1E3D] text-xs font-bold text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-500/25 transition-colors"
            title="Manage UPI AutoPay Accounts & Live Stats"
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
            <span className="hidden xl:inline">{t.upiAccountsBtn}</span>
          </button>

          {/* Zero-Jargon Glossary Button */}
          <button
            onClick={onOpenGlossary}
            className="hidden sm:flex items-center gap-1.5 p-2 xl:px-3 xl:py-1.5 rounded-full bg-amber-50 dark:bg-[#171004] hover:bg-amber-100 dark:hover:bg-[#261A07] text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/25 transition-colors"
            title="Tax Glossary"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="hidden xl:inline">{t.glossaryBtn}</span>
          </button>

          {/* Trust, Security & Safety Shield */}
          <button
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 p-2 xl:px-3 xl:py-1.5 rounded-full bg-emerald-50 dark:bg-[#07190F] hover:bg-emerald-100 dark:hover:bg-[#0E2818] text-xs font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/25 transition-colors"
            title="KarSetu Trust, Security & Fraud Defense Shield"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden xl:inline">Safety Shield</span>
          </button>

          {/* Challan Receipts Vault Button */}
          <button
            onClick={onOpenVault}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-2xl bg-m3-surface-container dark:bg-[#0A0A0A] hover:bg-m3-surface-container-high dark:hover:bg-[#141414] text-xs font-bold text-slate-800 dark:text-neutral-200 border border-transparent dark:border-white/[0.08] transition-colors"
            title="Official Challan Vault"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="hidden md:inline">{t.challanVaultBtn}</span>
          </button>

          {/* Autopilot Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:px-2.5 sm:py-2 rounded-2xl bg-m3-surface-container dark:bg-[#0A0A0A] hover:bg-m3-surface-container-high dark:hover:bg-[#141414] text-xs font-bold text-slate-800 dark:text-neutral-200 border border-transparent dark:border-white/[0.08] flex items-center justify-center transition-colors"
            title="Autopilot Mandate Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          </button>

          {/* Profile Switcher */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-full bg-slate-100 dark:bg-[#0A0A0A] hover:bg-slate-200 dark:hover:bg-[#141414] cursor-pointer transition-colors border border-slate-200/70 dark:border-white/[0.08]"
              title="Click to switch taxpayer persona or setup new profile"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-white dark:border-black shrink-0"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-neutral-200 hidden md:inline">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown to switch persona */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-m3-3 border border-slate-200 dark:border-white/[0.08] z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                  {t.switchPersonaLabel || 'Switch Test Persona:'}
                </div>
                {mockUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      u.id === user.id
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-[#141414] text-slate-700 dark:text-neutral-300'
                    }`}
                  >
                    <img src={u.avatar} className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-semibold">{u.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{u.profileType}</p>
                    </div>
                  </button>
                ))}

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/[0.08]">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenSetup();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{t.setupNewBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
