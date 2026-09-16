import React, { useState, useEffect } from 'react';
import { ChallanReceipt as ChallanReceiptType } from '../../types/tax';
import { ChallanReceipt } from './ChallanReceipt';
import { formatINR } from '../../services/taxCalculator';
import { X, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface ChallanVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  challans: ChallanReceiptType[];
  activeChallanId?: string;
}

export const ChallanVaultModal: React.FC<ChallanVaultModalProps> = ({
  isOpen,
  onClose,
  challans,
  activeChallanId,
}) => {
  const [selectedChallanId, setSelectedChallanId] = useState<string>(
    activeChallanId || (challans[0]?.id ?? '')
  );

  useEffect(() => {
    if (activeChallanId) {
      setSelectedChallanId(activeChallanId);
    } else if (challans.length > 0 && !challans.some((c) => c.id === selectedChallanId)) {
      setSelectedChallanId(challans[0].id);
    }
  }, [activeChallanId, isOpen, challans]);

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

  const currentChallan = challans.find((c) => c.id === selectedChallanId) || challans[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-m3-4 border border-slate-100 dark:border-white/[0.08] overflow-hidden transition-colors my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-m3-surface-container-low dark:bg-[#040404] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-m3-primary-container dark:bg-emerald-950 text-m3-on-primary-container dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-m3-primary dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Government Challan & Receipt Vault</h2>
              <p className="text-xs text-slate-600 dark:text-neutral-400">
                100% Tax Department & BBPS verified receipts stored with permanent BSR verification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#141414] rounded-full transition-colors cursor-pointer"
            aria-label="Close vault"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Left Selector, Right Viewer */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of Receipts (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 block px-1">
              Your Tax Payments ({challans.length})
            </span>

            {challans.map((challan) => {
              const isSelected = challan.id === currentChallan?.id;
              return (
                <button
                  key={challan.id}
                  onClick={() => setSelectedChallanId(challan.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm'
                      : 'bg-white dark:bg-[#0E0E0E] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-neutral-400">
                      {challan.bsrCode ? `BSR: ${challan.bsrCode}` : 'BBPS'}
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{formatINR(challan.amount)}</span>
                  </div>

                  <p className="font-semibold text-slate-900 dark:text-slate-200 text-xs line-clamp-1">{challan.taxType}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400 pt-1 border-t border-slate-100 dark:border-white/[0.08]">
                    <span>{challan.paidOn.split(',')[0]}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      Verified <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold mb-1">
                <FileText className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>ITR Filing Ready</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                All Challan Reference Numbers (CRN) are automatically pre-populated into your annual ITR form.
              </p>
            </div>
          </div>

          {/* Detailed Receipt View (8 cols on lg) */}
          <div className="lg:col-span-8">
            {currentChallan ? (
              <ChallanReceipt challan={currentChallan} />
            ) : (
              <div className="p-8 text-center text-slate-400">No receipt selected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
