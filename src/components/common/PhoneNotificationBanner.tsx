import React, { useEffect, useState } from 'react';
import { MessageSquare, X, CheckCircle2, Shield, Bell } from 'lucide-react';
import { formatDisplayPhone } from '../../services/notificationService';

export interface PhoneAlertNotification {
  id: string;
  channel: 'whatsapp' | 'sms';
  recipientPhone: string;
  taxTitle: string;
  amountFormatted: string;
  dueDate: string;
  taxpayerName: string;
}

interface PhoneNotificationBannerProps {
  notification: PhoneAlertNotification | null;
  onDismiss: () => void;
  onOpenPreDebit?: () => void;
}

export const PhoneNotificationBanner: React.FC<PhoneNotificationBannerProps> = ({
  notification,
  onDismiss,
  onOpenPreDebit,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      // Optional subtle synthesized audio ping
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch {
        // AudioContext not allowed before user gesture, ignore safely
      }

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 7500);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification, onDismiss]);

  if (!notification) return null;

  const isWhatsApp = notification.channel === 'whatsapp';

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-6 opacity-0 scale-95'
      }`}
      role="alert"
    >
      <div className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl rounded-3xl p-3.5 sm:p-4 text-slate-900 dark:text-white ring-1 ring-black/5 dark:ring-white/10">
        {/* Banner Header: App Tag + Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                isWhatsApp ? 'bg-[#25D366] text-white' : 'bg-blue-600 text-white'
              }`}
            >
              {isWhatsApp ? (
                <span className="font-bold text-[11px] leading-none">wa</span>
              ) : (
                <MessageSquare className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white truncate">
                {isWhatsApp ? 'WhatsApp • KarSetu Bot' : 'Messages • [KARSETU]'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-slate-400 font-medium">Just now</span>
            <button
              type="button"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onDismiss, 200);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Body */}
        <div className="space-y-1 pl-8">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
            {notification.taxTitle} Scheduled (72h Notice)
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Namaste <span className="font-semibold">{notification.taxpayerName}</span>, your deposit of{' '}
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.2 rounded">
              {notification.amountFormatted}
            </span>{' '}
            is queued for <span className="font-semibold">{notification.dueDate}</span>. Zero penalty protected.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-500" />
              Direct Treasury Flow
            </span>
            <span>•</span>
            <span className="truncate">Sent to {formatDisplayPhone(notification.recipientPhone)}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                onDismiss();
                onOpenPreDebit?.();
              }, 200);
            }}
            className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Open 72h Pre-Debit View</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 200);
            }}
            className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E293B] dark:hover:bg-[#2A3A52] text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-transparent dark:border-slate-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
