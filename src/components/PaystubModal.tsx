import React, { useState } from 'react';
import { Logo } from './Logo';
import { PREPROD_CONTRACT_ADDRESS } from '../hooks/useMidnight';
import { X, Printer, Copy, Check, ShieldCheck, QrCode, Lock, CheckCircle2, Calendar, FileText, Hash, ExternalLink } from 'lucide-react';

export interface PaystubData {
  certificateId: string;
  txHash: string;
  explorerUrl?: string;
  blockTimestamp: string;
  employeeName?: string;
  employeeRole?: string;
  disclosedAmount: number;
  batchRootHash?: string;
  employeeCount?: number;
  circuitName: string;
}

interface PaystubModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaystubData | null;
}

export const PaystubModal: React.FC<PaystubModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(data.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-slate-950 rounded-2xl border border-purple-500/40 shadow-2xl shadow-purple-600/20 overflow-hidden relative">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>CONFIDENTIAL AUDIT CERTIFICATE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Printable Area */}
        <div id="printable-certificate" className="p-6 sm:p-8 space-y-6 text-left bg-gradient-to-b from-slate-950 to-slate-900/90 relative">
          {/* Watermark Seal */}
          <div className="absolute right-8 top-16 opacity-5 pointer-events-none">
            <ShieldCheck className="w-80 h-80 text-white" />
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <Logo size={42} showText={true} />
            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                ● Midnight Preprod Verified
              </span>
              <p className="text-xs text-slate-400 font-mono">
                Cert ID: <span className="text-slate-200">{data.certificateId}</span>
              </p>
              <p className="text-xs text-slate-400 font-mono flex items-center sm:justify-end gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{data.blockTimestamp}</span>
              </p>
            </div>
          </div>

          {/* Title Badge */}
          <div className="text-center py-2 space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide uppercase">
              Zero-Knowledge Paystub & Solvency Certificate
            </h2>
            <p className="text-xs text-slate-400">
              Formally verified state commitment executed via Midnight Compact Smart Contract
            </p>
          </div>

          {/* Core Certificate Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box 1: Payout Subject */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Recipient / Allocation
              </span>
              <p className="text-sm font-bold text-white">
                {data.employeeName || 'Enterprise Treasury Batch'}
              </p>
              <p className="text-xs text-purple-300 font-medium">
                {data.employeeRole || (data.employeeCount ? `${data.employeeCount} Batched Team Members` : 'Authorized Disbursal')}
              </p>
            </div>

            {/* Box 2: Certified Amount */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-emerald-500/30 space-y-1.5 text-left">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Disclosed Audit Value
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-emerald-400">
                  ${data.disclosedAmount.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-300/80 font-mono uppercase font-bold">
                  USD Equivalent
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" />
                <span>ZK-Proof of Solvency Passed</span>
              </p>
            </div>
          </div>

          {/* Cryptographic Proof Details */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-purple-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                <span>Cryptographic Proof Hashes</span>
              </span>
              <span className="text-[10px] text-emerald-400">Circuit: {data.circuitName}</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Verified Transaction Hash:</span>
                <div className="flex items-center justify-between text-purple-200 mt-0.5">
                  <span className="truncate pr-2">{data.txHash}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {data.explorerUrl && (
                      <a
                        href={data.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-400 hover:text-white underline cursor-pointer flex items-center gap-1 text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Explorer</span>
                      </a>
                    )}
                    <button
                      onClick={handleCopyHash}
                      className="text-purple-400 hover:text-purple-300 shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {data.batchRootHash && (
                <div>
                  <span className="text-slate-500 block">Merkle Batch Root Hash:</span>
                  <span className="text-indigo-300 truncate block mt-0.5">{data.batchRootHash}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block">Target Preprod Smart Contract:</span>
                <span className="text-slate-300 truncate block mt-0.5">{PREPROD_CONTRACT_ADDRESS}</span>
              </div>
            </div>
          </div>

          {/* Privacy Guarantee Clause */}
          <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-start gap-3 text-xs text-slate-300">
            <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-slate-400">
              <strong className="text-purple-300">Privacy Guarantee:</strong> Individual bonus structures, employee tax allocations, and internal compensation splits remain 100% confidential in client memory. This certificate proves cryptographic legitimacy without data leakage.
            </p>
          </div>

          {/* Verification Badge & QR Footprint */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white font-mono">CRYPTOGRAPHIC SEAL</p>
                <p className="text-[10px] text-slate-400 font-mono">SNARK Verifier: Compact v0.31.1</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-purple-300" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
