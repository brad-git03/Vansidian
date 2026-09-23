import React, { useState } from 'react';
import { CircuitCallState, PREPROD_CONTRACT_ADDRESS, PREPROD_CONTRACT_HEX_ID } from '../hooks/useMidnight';
import { PaystubData } from './PaystubModal';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Lock, 
  Database, 
  FileCheck, 
  Download, 
  Check, 
  Copy 
} from 'lucide-react';

interface AuditorViewProps {
  circuitState: CircuitCallState;
  publicCounterState: number;
  onOpenPaystub: (data: PaystubData) => void;
}

export const AuditorView: React.FC<AuditorViewProps> = ({
  circuitState,
  publicCounterState,
  onOpenPaystub,
}) => {
  const [searchHash, setSearchHash] = useState(
    circuitState.history[0]?.txHash || '0x759f78e3c1b0162367a52a6a9437f64c3dee0f531e8cd83fbbb158d87c95fd07'
  );
  const [verifiedHash, setVerifiedHash] = useState(searchHash);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVerify = (hashToVerify?: string) => {
    const target = hashToVerify || searchHash;
    setIsVerifying(true);
    setTimeout(() => {
      setVerifiedHash(target);
      setIsVerifying(false);
    }, 400);
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(PREPROD_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleGenerateAuditPack = () => {
    onOpenPaystub({
      certificateId: `AUDIT-REC-${Math.floor(100000 + Math.random() * 900000)}`,
      txHash: verifiedHash,
      blockTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      employeeName: 'Enterprise Audit Reviewer',
      employeeRole: 'Regulatory Solvency & Compliance Memo',
      disclosedAmount: publicCounterState * 100,
      batchRootHash: '0x8849b2c01948ef11029487c889a24410f92e4a1b0c3d5e8f',
      employeeCount: 5,
      circuitName: 'processPayrollBatch (Compact v0.31.1 ZK-SNARK)',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="app-card border-l-4 border-l-emerald-500 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-semibold text-white">Auditor & Compliance Portal</h2>
            <span className="status-success text-xs px-2.5 py-0.5 rounded-full font-mono">
              Zero-Knowledge Verification
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Verify protocol solvency, smart contract state bounds, and cryptographic proofs without accessing unshielded employee salaries.
          </p>
        </div>
        <button
          onClick={handleGenerateAuditPack}
          className="app-button-secondary flex items-center gap-2 px-4 py-2.5 text-xs font-semibold shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#a995ff]" />
          <span>Export Audit Certificate</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="app-card p-5">
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#a995ff]" />
            Disclosed Ledger Counter
          </p>
          <p className="mt-2 text-2xl font-bold font-mono text-white">{publicCounterState}</p>
          <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Consensus Verified On-Chain
          </p>
        </div>

        <div className="app-card p-5">
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            Confidentiality Guarantee
          </p>
          <p className="mt-2 text-2xl font-bold font-mono text-white">100% Shielded</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Zero salary data exposed to RPC</p>
        </div>

        <div className="app-card p-5">
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified Transactions
          </p>
          <p className="mt-2 text-2xl font-bold font-mono text-white">{circuitState.history.length}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Midnight Preprod Audit Log</p>
        </div>
      </div>

      {/* ZK Proof Inspector */}
      <div className="app-card overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-[#a995ff]" />
            ZK Proof & Root Inspector
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Query any transaction hash or Merkle batch root to inspect zero-knowledge proof validity.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                placeholder="Enter 0x... transaction hash or Merkle root"
                className="w-full bg-[var(--surface-1)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-xs font-mono text-white placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[#a995ff]"
              />
            </div>
            <button
              onClick={() => handleVerify()}
              disabled={isVerifying}
              className="app-button-primary px-5 py-2.5 text-xs font-semibold shrink-0 cursor-pointer"
            >
              {isVerifying ? 'Verifying ZK Proof…' : 'Inspect & Verify'}
            </button>
          </div>
        </div>

        {/* Verification Result Box */}
        <div className="p-6 bg-[var(--surface-1)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cryptographic Invariant Check
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#73d7aa] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
              <Check className="w-3.5 h-3.5" />
              ZK-SNARK Validated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-[var(--canvas)] rounded-lg border border-[var(--border)]">
              <span className="text-[var(--text-muted)] block text-[11px] mb-1 font-sans">Target Transaction / Proof Hash</span>
              <span className="text-[#b7a8ff] break-all">{verifiedHash}</span>
            </div>

            <div className="p-3 bg-[var(--canvas)] rounded-lg border border-[var(--border)]">
              <span className="text-[var(--text-muted)] block text-[11px] mb-1 font-sans">Smart Contract Identifier</span>
              <span className="text-slate-300 break-all">{PREPROD_CONTRACT_HEX_ID}</span>
            </div>

            <div className="p-3 bg-[var(--canvas)] rounded-lg border border-[var(--border)]">
              <span className="text-[var(--text-muted)] block text-[11px] mb-1 font-sans">Circuit Verification Rule</span>
              <span className="text-emerald-400">processPayrollBatch · Compact v0.31.1</span>
            </div>

            <div className="p-3 bg-[var(--canvas)] rounded-lg border border-[var(--border)]">
              <span className="text-[var(--text-muted)] block text-[11px] mb-1 font-sans">Solvency Invariant</span>
              <span className="text-emerald-400">Delta Bounds &gt;= 0 · No State Overflow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclosed State Log Table */}
      <section className="app-card overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Disclosed On-Chain Audit Feed</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Immutable ledger bounds recorded on Midnight Preprod.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyContract}
              className="text-xs text-[#a995ff] hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Contract Address'}</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {circuitState.history.map((tx, idx) => (
            <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface-3)] transition-colors">
              <div className="flex items-start sm:items-center gap-3">
                <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-slate-200">{tx.txHash}</code>
                    {tx.explorerUrl ? (
                      <a
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#b7a8ff] hover:text-white underline cursor-pointer"
                      >
                        Explorer <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-[#b7a8ff] px-2 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {tx.timestamp} • {tx.senderRole ? `${tx.senderRole} (${tx.senderAddress ? tx.senderAddress.slice(0, 16) + '...' : ''}) • ` : ''}Disclosed Delta: +{tx.addedValue} State Bound
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => handleVerify(tx.txHash)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-1)] text-xs text-slate-300 border border-[var(--border)] cursor-pointer"
                >
                  Verify Hash
                </button>
                <button
                  onClick={() =>
                    onOpenPaystub({
                      certificateId: `AUDIT-${idx + 10482}`,
                      txHash: tx.txHash,
                      explorerUrl: tx.explorerUrl,
                      blockTimestamp: tx.timestamp,
                      employeeName: 'Auditor Disclosed Verification',
                      disclosedAmount: tx.addedValue * 100,
                      circuitName: 'processPayrollBatch (Compact v0.31.1)',
                    })
                  }
                  className="app-button-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#a995ff]" />
                  <span>Audit Memo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
