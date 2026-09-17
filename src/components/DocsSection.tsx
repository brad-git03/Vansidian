import React, { useState } from 'react';
import { BookOpen, Code2, Shield, Terminal, Copy, Check, ExternalLink } from 'lucide-react';

export const DocsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contract' | 'model' | 'quickstart'>('contract');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const compactCode = `pragma language_version >= 0.23;

import CompactStandardLibrary;

// Multi-tenant organization state commitment map
export ledger orgPayrollRoots: Map<Bytes<32>, Bytes<32>>;
export ledger totalBatchesProcessed: Counter;
export ledger counter: Counter;

// Private witness declarations (executed strictly off-chain)
witness secretBatchHash(): Bytes<32>;
witness secretBatchTotalAmount(): Uint<16>;
witness secretEmployeeCount(): Uint<16>;

// Enterprise multi-tenant batch disbursement circuit
export circuit processPayrollBatch(
    orgId: Bytes<32>,
    newBatchRoot: Bytes<32>,
    batchTotalAmount: Uint<16>,
    employeeCount: Uint<16>
): [] {
    const witnessHash = secretBatchHash();
    assert(witnessHash == newBatchRoot, "Witness mismatch");
    assert(batchTotalAmount > 0 && employeeCount <= 1000, "Invalid bounds");

    // Commit isolated multi-tenant state
    orgPayrollRoots.insert(disclose(orgId), disclose(newBatchRoot));
    totalBatchesProcessed.increment(1);
}`;

  return (
    <section id="documentation" className="w-full py-20 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/25 rounded-full text-xs font-semibold text-indigo-300">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Developer Documentation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-[-.035em]">
            Compact Smart Contract &{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              Privacy Architecture
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Explore the formal Compact smart contract circuits, privacy boundary assertions, and developer integration specs.
          </p>
        </div>

        {/* Interactive Documentation Card */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('contract')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'contract'
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>vansidian.compact</span>
              </button>
              <button
                onClick={() => setActiveTab('model')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'model'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Privacy Invariants</span>
              </button>
              <button
                onClick={() => setActiveTab('quickstart')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'quickstart'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Quickstart Guide</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/brad-git03/Midnight-RiseIn"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>GitHub Specs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Tab Content 1: Compact Contract Code */}
          {activeTab === 'contract' && (
            <div className="p-4 sm:p-6 bg-slate-950/60 font-mono text-xs text-slate-300 relative overflow-x-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-900 text-slate-500 text-[11px]">
                <span>Language: Compact v0.31.1 • Midnight Network</span>
                <button
                  onClick={() => handleCopy(compactCode)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="text-slate-300 leading-relaxed">
                <code>{compactCode}</code>
              </pre>
            </div>
          )}

          {/* Tab Content 2: Privacy Model */}
          {activeTab === 'model' && (
            <div className="p-6 space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">1. Public State</span>
                  <h4 className="text-sm font-bold text-white">What is On-Chain (Public)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cumulative metrics (<code className="text-purple-300 font-mono">totalBatchesProcessed</code>, <code className="text-purple-300 font-mono">counter</code>) and the 32-byte cryptographic Merkle Root hash per organization.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-mono">2. Private Witness</span>
                  <h4 className="text-sm font-bold text-white">What is Off-Chain (Private)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Employee salary amounts, individual payout splits, contractor rates, and private ledger witnesses execute 100% locally in browser RAM.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">3. Mathematical Proof</span>
                  <h4 className="text-sm font-bold text-white">What the User Proves</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The user proves they possess a valid private witness input matching the batch hash without ever exposing the underlying plaintext values.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Quickstart Guide */}
          {activeTab === 'quickstart' && (
            <div className="p-6 space-y-4 text-left font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="text-purple-400 font-bold"># 1. Clone & Install Dependencies</div>
                <div className="text-slate-300 pl-2">git clone https://github.com/brad-git03/Midnight-RiseIn.git && cd Midnight-RiseIn && npm install</div>
                
                <div className="text-indigo-400 font-bold pt-2"># 2. Run Formal Security & Scalability Tests</div>
                <div className="text-slate-300 pl-2">npm test</div>

                <div className="text-emerald-400 font-bold pt-2"># 3. Start Local Frontend Dev Server</div>
                <div className="text-slate-300 pl-2">npm run dev</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
