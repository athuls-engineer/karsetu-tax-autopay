import React, { useEffect } from 'react';
import { LanguageMode } from '../../types/tax';
import {
  X,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  Bell,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CalendarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: LanguageMode;
}

export const CalendarExportModal: React.FC<CalendarExportModalProps> = ({
  isOpen,
  onClose,
  lang = 'en',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const taxMilestones = [
    {
      date: '15 June 2026',
      title: 'Q1 Advance Tax Installment (15% Threshold)',
      section: 'Sec 208 / 211',
      desc: 'Pay at least 15% of estimated total annual tax to prevent Sec 234C 1% interest penalty.',
      category: 'advance_tax',
      icsDateStart: '20260615T090000Z',
      icsDateEnd: '20260615T180000Z',
    },
    {
      date: '15 September 2026',
      title: 'Q2 Advance Tax Installment (45% Cumulative)',
      section: 'Sec 208 / 211',
      desc: 'Cumulative 45% target. Factoring capital gains from April to August.',
      category: 'advance_tax',
      icsDateStart: '20260915T090000Z',
      icsDateEnd: '20260915T180000Z',
    },
    {
      date: '30 September 2026',
      title: 'Municipal Property Tax Early-Bird Cutoff',
      section: 'BBPS Municipal',
      desc: 'Last day to capture up to 5% early payment rebate on urban property tax demand.',
      category: 'property_tax',
      icsDateStart: '20260930T090000Z',
      icsDateEnd: '20260930T180000Z',
    },
    {
      date: '15 December 2026',
      title: 'Q3 Advance Tax Installment (75% Cumulative)',
      section: 'Sec 208 / 211',
      desc: 'Cumulative 75% target. KarSetu runs automated 72-hour pre-debit WhatsApp notice.',
      category: 'advance_tax',
      icsDateStart: '20261215T090000Z',
      icsDateEnd: '20261215T180000Z',
    },
    {
      date: '15 March 2027',
      title: 'Q4 Final Advance Tax Milestone (100% Target)',
      section: 'Sec 208 / 211',
      desc: 'Final 100% advance tax clearance. Prevents Section 234B & 234C interest penalties.',
      category: 'advance_tax',
      icsDateStart: '20270315T090000Z',
      icsDateEnd: '20270315T180000Z',
    },
    {
      date: '31 July 2027',
      title: 'Annual Income Tax Return (ITR-1 / ITR-2 / ITR-4)',
      section: 'Section 139(1)',
      desc: 'Statutory ITR filing deadline for individuals, salaried professionals, and non-audit taxpayers.',
      category: 'itr',
      icsDateStart: '20270731T090000Z',
      icsDateEnd: '20270731T180000Z',
    },
  ];

  const handleDownloadIcs = () => {
    let icsString = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KarSetu Tax Autopilot//India Statutory Tax Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:India Tax Compliance Deadlines FY 2026-27
`;

    taxMilestones.forEach((m) => {
      icsString += `BEGIN:VEVENT
UID:karsetu-${m.icsDateStart}@karsetu.gov.in
DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}Z
DTSTART:${m.icsDateStart}
DTEND:${m.icsDateEnd}
SUMMARY:${m.title}
DESCRIPTION:${m.desc} (Statutory Head: ${m.section}) - Managed with KarSetu Tax Autopilot.
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P3D
ACTION:DISPLAY
DESCRIPTION:Reminder: 72 hours until ${m.title}
END:VALARM
END:VEVENT
`;
    });

    icsString += 'END:VCALENDAR';

    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'KarSetu_Tax_Deadlines_2026_27.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#0B57D0', '#146C2E'],
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-4xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-m3-4 border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-m3-surface-container-low dark:bg-[#0B1325] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Statutory Tax Deadlines (FY 2026-27 / AY 2027-28)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official calendar for CBDT Advance Tax, BBPS Municipal Rebate, and ITR
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close calendar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Callout */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-[#0C1E3D] dark:to-[#0F2347] border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-0.5">
            <span className="font-bold text-xs text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Never Miss an Installment or 5% Municipal Rebate
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Import all 6 official government compliance milestones directly into your phone or PC calendar with 72h alarms.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .ICS Calendar</span>
          </button>
        </div>

        {/* Milestones List */}
        <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
          {taxMilestones.map((m) => (
            <div
              key={m.date}
              className="p-4 rounded-3xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 flex items-start gap-3.5 text-xs hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                  {m.date.split(' ')[1].slice(0, 3)}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white leading-none mt-0.5">
                  {m.date.split(' ')[0]}
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{m.title}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-mono text-[10px] font-bold shrink-0">
                    {m.section}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {m.desc}
                </p>

                <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                    <Bell className="w-3 h-3" /> Auto-Alert: 72h Prior
                  </span>
                  <span>•</span>
                  <span>Standard Statutory Window</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0B1325] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Compatible with Google Calendar, Apple Calendar, and Outlook</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-[#1E293B] text-white dark:text-slate-100 font-bold hover:bg-slate-800 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 transition-colors cursor-pointer"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
