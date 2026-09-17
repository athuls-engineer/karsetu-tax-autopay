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
  Calendar,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  Server,
} from 'lucide-react';
import { KarSetuLogo } from '../common/KarSetuLogo';

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
  challansCount?: number;
  onOpenCalendar?: () => void;
  onOpen26As?: () => void;
  onOpenSandboxInfo?: () => void;
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
  challansCount = 5,
  onOpenCalendar,
  onOpen26As,
  onOpenSandboxInfo,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(target)) {
        setIsToolsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsToolsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const t = translations[lang] || translations.en;
  const currentLangMeta = supportedLanguages.find((l) => l.code === lang) || supportedLanguages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/90 transition-colors duration-300 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Brand Logo & Status Pill */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <KarSetuLogo className="w-9 h-9 sm:w-10 sm:h-10" />

          <div className="flex items-center gap-2">
            <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
              KarSetu
            </span>
            <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-400">
              (करसेतु)
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse shrink-0" />
              <span>Autopilot Active</span>
            </span>
            {onOpenSandboxInfo && (
              <button
                type="button"
                onClick={onOpenSandboxInfo}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
                title="CBDT TIN 2.0 & RBI Sandbox Simulation Info"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>CBDT Sandbox</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean, Cohesive Navigation Controls (Zero Clutter) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* 1. Official Challan Vault Button */}
          <button
            type="button"
            onClick={onOpenVault}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-slate-800 transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Official Challan Vault"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Challans</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black leading-none">
              {challansCount}
            </span>
          </button>

          {/* 2. Unified Tools & Utilities Dropdown */}
          <div className="relative" ref={toolsMenuRef}>
            <button
              type="button"
              onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold border transition-all active:scale-95 cursor-pointer shadow-2xs ${
                isToolsMenuOpen
                  ? 'bg-blue-50 text-blue-900 border-blue-300 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-600/70'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-800'
              }`}
              title="Tools & Utilities"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="hidden sm:inline">Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isToolsMenuOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                }`}
              />
            </button>

            {/* Tools Dropdown Menu */}
            {isToolsMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-2.5 bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Compliance & Sync</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold">CBDT TIN 2.0</span>
                </div>

                <div className="space-y-1">
                  {onOpenCalendar && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        onOpenCalendar();
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 cursor-pointer transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">Tax Deadlines (.ICS)</span>
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[9px] font-black">
                            iCal
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Advance tax dates & 72h calendar reminders
                        </p>
                      </div>
                    </button>
                  )}

                  {onOpen26As && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        onOpen26As();
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 cursor-pointer transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">Form 26AS & AIS Sync</span>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[9px] font-black">
                            TRACES
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Reconcile salary & bank TDS tax credits
                        </p>
                      </div>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      onOpenSecurity?.();
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">Safety & Money Trail</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-black">
                          Art 266
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Direct RBI Treasury flow & zero float audit
                      </p>
                    </div>
                  </button>

                  {onOpenSandboxInfo && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        onOpenSandboxInfo();
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 cursor-pointer transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Server className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">CBDT Sandbox Testnet</span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[9px] font-black">
                            SIMULATED
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Production specs vs regulatory sandbox details
                        </p>
                      </div>
                    </button>
                  )}
                </div>

                <div className="my-2 border-t border-slate-100 dark:border-white/[0.08]" />

                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  Platform Utilities
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      onOpenUpiManager();
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 dark:text-white block">UPI AutoPay Mandates</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Linked bank accounts & debit caps
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      onOpenGlossary();
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 dark:text-white block">Tax Jargon-Buster</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Plain-language explanations of Indian tax laws
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      onOpenLanguageSelector();
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">Language / भाषा</span>
                        <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[9px] font-black">
                          {currentLangMeta.nativeName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Available in 9 Indian languages
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 dark:text-white block">Autopilot Settings</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        WhatsApp alert threshold & sweep mode
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Language Selector (Visible on sm+ screens) */}
          <button
            type="button"
            onClick={onOpenLanguageSelector}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-slate-800 transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Choose Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="hidden md:inline">{currentLangMeta.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden md:inline" />
          </button>

          {/* 4. Theme Toggle (Sun / Moon) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-700 dark:text-amber-300 border border-slate-200/80 dark:border-slate-800 transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs"
            title={`Switch to ${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* 5. User Profile Switcher */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/90 dark:hover:bg-slate-800 cursor-pointer transition-all active:scale-95 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
              title="Click to switch taxpayer persona or setup new profile"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-white dark:border-slate-700 shrink-0"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Persona Switcher Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  {t.switchPersonaLabel || 'Switch Taxpayer Persona:'}
                </div>
                {mockUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      onSelectUser(u);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      u.id === user.id
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <img src={u.avatar} className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-semibold">{u.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{u.profileType}</p>
                    </div>
                    {u.id === user.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </button>
                ))}

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/[0.08]">
                  <button
                    type="button"
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
