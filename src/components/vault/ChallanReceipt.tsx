import React, { useState } from 'react';
import { ChallanReceipt as ChallanReceiptType } from '../../types/tax';
import { formatINR } from '../../services/taxCalculator';
import { CheckCircle2, Download, Printer, ShieldCheck, QrCode, ExternalLink } from 'lucide-react';
import { ChallanVerifyModal } from './ChallanVerifyModal';

interface ChallanReceiptProps {
  challan: ChallanReceiptType;
  onClose?: () => void;
}

export const ChallanReceipt: React.FC<ChallanReceiptProps> = ({ challan }) => {
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const handlePrint = () => {
    window.print();
  };

  const isBBPS = !!challan.bbpsRef;
  const isGST = challan.majorHead.includes('GST');

  return (
    <div className="print-receipt-surface bg-white dark:bg-[#0A0A0A] rounded-3xl border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-m3-3 print:shadow-none print:border-none transition-colors">
      {/* Top Banner */}
      <div
        className={`text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isBBPS
            ? 'bg-gradient-to-r from-amber-700 to-orange-800 dark:from-amber-900 dark:to-orange-950'
            : isGST
            ? 'bg-gradient-to-r from-purple-800 to-indigo-900 dark:from-purple-950 dark:to-indigo-950'
            : 'bg-gradient-to-r from-emerald-800 to-teal-900 dark:from-emerald-950 dark:to-teal-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Official Govt Receipt
              </span>
              <span className="text-xs text-emerald-100">
                {isBBPS ? 'BBPS Verified' : isGST ? 'GSTN Verified' : 'BSR Code 0210045'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
              {isBBPS
                ? 'BBPS Municipal Property Tax Receipt'
                : isGST
                ? 'Form GST PMT-06 (Electronic Cash Ledger)'
                : 'TIN 2.0 ITNS 280 Tax Challan'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Slip
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Save PDF
          </button>
        </div>
      </div>

      {/* Official Details Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Payment Successfully Deposited to Government
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Autopaid via {challan.paymentMode}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium block">Total Paid</span>
            <span className="text-xl font-extrabold text-emerald-950 dark:text-emerald-100">
              {formatINR(challan.amount)}
            </span>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">Taxpayer Name:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{challan.taxpayerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">PAN / GSTIN:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{challan.panMasked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">Assessment Year:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{challan.assessmentYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">Financial Year:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{challan.financialYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">Major Head:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{challan.majorHead}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E0E0E] border border-slate-200 dark:border-white/[0.08] space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">Challan Ref No (CRN):</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">{challan.crn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">BSR Code / Authority:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{challan.bsrCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">Challan Sequence No:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{challan.challanNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">Tender Date & Time:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{challan.paidOn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-neutral-400">Bank Ref / UTR:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{challan.bankRef}</span>
            </div>
          </div>
        </div>

        {/* Challan Identification Number (CIN) Bar */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase font-bold text-blue-800 dark:text-blue-300 tracking-wider block">
              Official Challan Identification Number (CIN / BBPS UMN)
            </span>
            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tracking-wider">
              {challan.cin}
            </span>
            <p className="text-[11px] text-slate-600 dark:text-neutral-400 mt-0.5">
              Verified with NSDL / Protean & Income Tax Portal e-Filing 2.0 / NPCI
            </p>
          </div>

          <button
            onClick={() => setIsVerifyModalOpen(true)}
            className="flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white dark:bg-[#121212] hover:bg-blue-50 dark:hover:bg-[#1C1C1C] border border-blue-200 dark:border-blue-500/30 shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0 cursor-pointer group text-left"
            title="Click to view camera-scannable QR code & verify on Government Portal"
          >
            <div className="relative">
              <QrCode className="w-8 h-8 text-blue-900 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-[10px] text-slate-600 dark:text-neutral-400 leading-tight">
              <p className="font-bold text-blue-950 dark:text-blue-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 flex items-center gap-1">
                <span>Scan to Verify</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">Click to Open Portal</p>
            </div>
          </button>
        </div>
      </div>

      {/* Official Government Verification Modal */}
      <ChallanVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        challan={challan}
      />
    </div>
  );
};
