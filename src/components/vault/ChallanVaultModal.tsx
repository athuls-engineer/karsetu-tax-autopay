import React, { useState, useEffect } from 'react';
import { ChallanReceipt as ChallanReceiptType } from '../../types/tax';
import { ChallanReceipt } from './ChallanReceipt';
import { formatINR } from '../../services/taxCalculator';
import { X, ShieldCheck, FileText, ArrowRight, Search, Download, Sparkles } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'advance' | 'property' | 'gst'>('all');
  const [mobileTab, setMobileTab] = useState<'list' | 'receipt'>(activeChallanId ? 'receipt' : 'list');

  const handleExportCsv = () => {
    const headers = ['Receipt ID', 'Tax Type', 'Major Head', 'Minor Head', 'PAN / GSTIN', 'Amount (INR)', 'Paid On', 'CIN', 'BSR Code', 'Bank Ref'];
    const rows = challans.map((c) => [
      c.id,
      `"${c.taxType}"`,
      `"${c.majorHead}"`,
      `"${c.minorHead}"`,
      c.panMasked,
      c.amount,
      `"${c.paidOn}"`,
      c.cin,
      c.bsrCode || '',
      c.bankRef,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KarSetu_Tax_Challans_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (activeChallanId) {
      setSelectedChallanId(activeChallanId);
      setMobileTab('receipt');
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

  const filteredChallans = challans.filter((c) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'advance'
        ? c.minorHead.includes('ADVANCE') || c.id.includes('CH-280')
        : selectedCategory === 'property'
        ? !!c.bbpsRef || c.majorHead.includes('MUNICIPAL')
        : c.majorHead.includes('GST');
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesQuery =
      c.taxType.toLowerCase().includes(q) ||
      c.cin.toLowerCase().includes(q) ||
      c.crn.toLowerCase().includes(q) ||
      (c.bsrCode && c.bsrCode.toLowerCase().includes(q)) ||
      c.amount.toString().includes(q);
    return matchesCategory && matchesQuery;
  });

  const currentChallan =
    filteredChallans.find((c) => c.id === selectedChallanId) ||
    challans.find((c) => c.id === selectedChallanId) ||
    filteredChallans[0] ||
    challans[0];

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
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Government Challan & Receipt Vault</h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  CIN & BSR Verified
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-neutral-400">
                100% Tax Department & BBPS verified receipts stored with permanent BSR verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
              title="Download CSV statement of all paid tax challans"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#141414] rounded-full transition-colors cursor-pointer"
              aria-label="Close vault"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#070707] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            {[
              { id: 'all', label: `All (${challans.length})` },
              { id: 'advance', label: 'Advance Tax' },
              { id: 'property', label: 'Property Tax' },
              { id: 'gst', label: 'GST PMT-06' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#141414] text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-[#202020] border border-slate-200/80 dark:border-white/[0.06]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CIN, BSR, or tax..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#0E0E0E] text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Mobile View Toggle (Challan List vs View Receipt) */}
        <div className="lg:hidden px-5 pt-3 shrink-0">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#141414] rounded-2xl border border-slate-200/80 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => setMobileTab('list')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mobileTab === 'list'
                  ? 'bg-white dark:bg-[#202020] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-neutral-400'
              }`}
            >
              Challan List ({filteredChallans.length})
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('receipt')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mobileTab === 'receipt'
                  ? 'bg-white dark:bg-[#202020] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-neutral-400'
              }`}
            >
              View Receipt
            </button>
          </div>
        </div>

        {/* Content Layout: Left Selector, Right Viewer */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of Receipts (4 cols on lg) */}
          <div className={`lg:col-span-4 space-y-3 ${mobileTab === 'receipt' ? 'hidden lg:block' : 'block'}`}>
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Filtered Receipts ({filteredChallans.length})
              </span>
              <button
                type="button"
                onClick={handleExportCsv}
                className="sm:hidden text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> Export CSV
              </button>
            </div>

            {filteredChallans.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                No receipts match your search or filter.
              </div>
            ) : (
              filteredChallans.map((challan) => {
                const isSelected = challan.id === currentChallan?.id;
                return (
                  <button
                    key={challan.id}
                    onClick={() => {
                      setSelectedChallanId(challan.id);
                      setMobileTab('receipt');
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-sm flex flex-col gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
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
              })
            )}

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
          <div className={`lg:col-span-8 ${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}>
            <button
              type="button"
              onClick={() => setMobileTab('list')}
              className="lg:hidden mb-3 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 cursor-pointer py-1"
            >
              ← Back to all challans
            </button>
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
