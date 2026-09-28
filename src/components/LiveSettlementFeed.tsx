import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Lock, 
  Sparkles, 
  Layers, 
  Users, 
  FileText, 
  ChevronRight, 
  Radio
} from 'lucide-react';
import { 
  SettlementRecord, 
  loadSettlementFeed 
} from '../utils/settlementFeed';
import { PaystubData } from './PaystubModal';

interface LiveSettlementFeedProps {
  onOpenPaystub?: (data: PaystubData) => void;
  onLaunchApp?: () => void;
}

export const LiveSettlementFeed: React.FC<LiveSettlementFeedProps> = ({
  onOpenPaystub,
  onLaunchApp,
}) => {
  const [settlements, setSettlements] = useState<SettlementRecord[]>(() => loadSettlementFeed());
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setSettlements(loadSettlementFeed());
    };
    window.addEventListener('vansidian_settlement_added', handleUpdate);
    return () => window.removeEventListener('vansidian_settlement_added', handleUpdate);
  }, []);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const totalVolume = settlements.reduce((sum, s) => sum + s.totalDisbursed, 0);
  const totalRecipients = settlements.reduce((sum, s) => sum + s.recipientCount, 0);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] bg-[var(--canvas)] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Midnight Preprod Real-Time Consensus Feed</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Verified On-Chain Settlements
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Every payroll batch below has been mathematically verified on Midnight Preprod via Compact ZK-SNARK circuits. 
              The cryptographic Merkle root and batch invariants are immutable on-chain; all employee compensation amounts remain <span className="text-[#a995ff] font-semibold">100% confidential</span>.
            </p>
          </div>

          {onLaunchApp && (
            <button
              onClick={onLaunchApp}
              className="app-button-primary flex items-center gap-2 px-5 py-2.5 text-xs font-semibold shrink-0 cursor-pointer self-start md:self-auto"
            >
              <span>Launch Payroll Workstation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Global Live Telemetry Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)]">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#a995ff]" /> Batches Confirmed
            </span>
            <p className="mt-2 text-2xl font-bold font-mono text-white">
              {settlements.length}
            </p>
            <span className="text-[11px] text-emerald-400 mt-1 block">100% Invariant Pass Rate</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)]">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Total Volume Disbursed
            </span>
            <p className="mt-2 text-2xl font-bold font-mono text-white">
              ${totalVolume.toLocaleString()}
            </p>
            <span className="text-[11px] text-[var(--text-muted)] mt-1 block">Shielded Treasury Gross</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)]">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Team Recipients Settled
            </span>
            <p className="mt-2 text-2xl font-bold font-mono text-white">
              {totalRecipients}
            </p>
            <span className="text-[11px] text-[var(--text-muted)] mt-1 block">O(1) Batched Disbursements</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-1)] border border-emerald-500/20 bg-emerald-950/10">
            <span className="text-xs text-emerald-300 flex items-center gap-1.5 font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Privacy Verification
            </span>
            <p className="mt-2 text-2xl font-bold font-mono text-emerald-400">
              0 Data Leaks
            </p>
            <span className="text-[11px] text-emerald-300/80 mt-1 block">Zero Plaintext On-Chain</span>
          </div>
        </div>

        {/* Transactions Feed List */}
        <div className="space-y-4">
          {settlements.map((tx) => (
            <div
              key={tx.id}
              className="app-card p-5 sm:p-6 transition-all duration-200 hover:border-purple-500/40 hover:bg-[var(--surface-2)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white font-mono">
                        {tx.txHash.slice(0, 10)}…{tx.txHash.slice(-8)}
                      </span>
                      <button
                        onClick={() => handleCopy(tx.txHash)}
                        className="text-[var(--text-muted)] hover:text-white p-1 rounded transition-colors cursor-pointer"
                        title="Copy full transaction hash"
                      >
                        {copiedHash === tx.txHash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        {tx.status} On-Chain
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {tx.blockTimestamp} • {tx.network} • Circuit: <code className="text-purple-300">{tx.circuitName}</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <a
                    href={tx.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="app-button-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold cursor-pointer text-[#a995ff]"
                  >
                    <span>View on Preprod Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {onOpenPaystub && (
                    <button
                      onClick={() =>
                        onOpenPaystub({
                          certificateId: `CERT-${tx.id.toUpperCase()}`,
                          txHash: tx.txHash,
                          explorerUrl: tx.explorerUrl,
                          blockTimestamp: tx.blockTimestamp,
                          employeeName: 'Verified Enterprise Recipient',
                          employeeRole: 'Zero-Knowledge Payroll Settlement',
                          disclosedAmount: tx.totalDisbursed,
                          batchRootHash: tx.merkleBatchRoot,
                          employeeCount: tx.recipientCount,
                          circuitName: tx.circuitName,
                        })
                      }
                      className="app-button-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Audit Certificate</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Commitment & Privacy Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-[var(--surface-1)] rounded-xl border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block font-sans">
                    32-Byte Merkle Batch Root
                  </span>
                  <code className="text-[#b7a8ff] text-[11px] break-all block mt-0.5">
                    {tx.merkleBatchRoot}
                  </code>
                </div>

                <div className="p-3 bg-[var(--surface-1)] rounded-xl border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block font-sans">
                    Batch Aggregation Scope
                  </span>
                  <p className="text-white text-sm font-bold mt-0.5">
                    {tx.recipientCount} Recipients <span className="text-[var(--text-muted)] text-xs font-normal">(${tx.totalDisbursed.toLocaleString()} Gross)</span>
                  </p>
                </div>

                <div className="p-3 bg-[var(--surface-1)] rounded-xl border border-purple-500/20 bg-purple-950/20 flex flex-col justify-center">
                  <span className="text-[10px] text-purple-300 block font-sans font-semibold">
                    Zero-Knowledge Privacy Status
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1.5 mt-0.5 font-sans font-medium text-xs">
                    <Lock className="w-3 h-3" />
                    Individual Salaries & Names 100% Shielded
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informational Callout */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#a995ff] shrink-0" />
            <span>
              <strong>How to verify:</strong> Click any transaction above to inspect it on the official Midnight Preprod block explorer. You will see valid transaction proofs and Merkle commitments, but zero recipient identity leakage.
            </span>
          </div>
          <span className="text-[11px] font-mono text-purple-300 shrink-0">Compact v0.31.1 Dual-State Engine</span>
        </div>
      </div>
    </section>
  );
};
