import React from 'react';
import { PipelineStage } from '../hooks/useMidnight';
import { Cpu, Loader2, CheckCircle2, ShieldCheck, Lock, UploadCloud, KeyRound } from 'lucide-react';

interface ZKPipelineProps {
  stage: PipelineStage;
  isCalling: boolean;
  txHash: string | null;
  signature?: string | null;
}

export const ZKPipeline: React.FC<ZKPipelineProps> = ({ stage, isCalling, txHash, signature }) => {
  if (!isCalling && stage === 'idle' && !txHash) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-indigo-500/40 my-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-indigo-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Real-Time Zero-Knowledge Execution Pipeline</h4>
            <p className="text-xs text-slate-400">Client Witness ➔ ZK Prover ➔ Lace Signing ➔ Midnight Blockchain</p>
          </div>
        </div>

        {stage === 'confirmed' ? (
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Execution Confirmed
          </span>
        ) : (
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            Processing Stage
          </span>
        )}
      </div>

      {/* 4-Stage Progress Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Stage 1 */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            stage === 'witness'
              ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
              : stage === 'proving' || stage === 'signing' || stage === 'submitting' || stage === 'confirmed'
              ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
              : 'bg-slate-900/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-purple-300">
              <Lock className="w-3.5 h-3.5" />
              1. Local Witness
            </span>
            {stage === 'witness' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
            ) : stage !== 'idle' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : null}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Reading private parameter in local browser memory.
          </p>
        </div>

        {/* Stage 2 */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            stage === 'proving'
              ? 'bg-indigo-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
              : stage === 'signing' || stage === 'submitting' || stage === 'confirmed'
              ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
              : 'bg-slate-900/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-indigo-300">
              <Cpu className="w-3.5 h-3.5" />
              2. ZK Prover
            </span>
            {stage === 'proving' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : stage === 'signing' || stage === 'submitting' || stage === 'confirmed' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : null}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Calculating cryptographic ZK proof via Compact assets.
          </p>
        </div>

        {/* Stage 3 */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            stage === 'signing'
              ? 'bg-amber-500/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : stage === 'submitting' || stage === 'confirmed'
              ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
              : 'bg-slate-900/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-amber-300">
              <KeyRound className="w-3.5 h-3.5" />
              3. Lace Sign
            </span>
            {stage === 'signing' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : stage === 'submitting' || stage === 'confirmed' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : null}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Authorizing transaction commitment with Lace wallet.
          </p>
        </div>

        {/* Stage 4 */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            stage === 'submitting'
              ? 'bg-emerald-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : stage === 'confirmed'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
              : 'bg-slate-900/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-emerald-300">
              <UploadCloud className="w-3.5 h-3.5" />
              4. Verification
            </span>
            {stage === 'submitting' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : stage === 'confirmed' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : null}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Broadcasting ZK proof & signature to Preprod node.
          </p>
        </div>
      </div>

      {/* Confirmation Box */}
      {stage === 'confirmed' && txHash && (
        <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              On-Chain Transaction Confirmed: <span className="font-mono text-emerald-300 select-all">{txHash}</span>
            </span>
          </div>
          {signature && (
            <span className="text-[11px] text-slate-400 font-mono">
              Signed: <span className="text-amber-300">{signature.slice(0, 10)}...{signature.slice(-6)}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
