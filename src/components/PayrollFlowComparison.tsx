import React from 'react';
import { Building2, Check, Database, FileSpreadsheet, Fingerprint, LockKeyhole, Network, ShieldCheck, TriangleAlert, Users } from 'lucide-react';

type Tone = 'risk' | 'safe';
type Step = { icon: React.ElementType; title: string; detail: string; signal: string };

const palettes = {
  risk: {
    border: 'border-[#5a2c43]', panel: 'from-[#1d1220] via-[#131426] to-[#0e1728]', label: 'text-[#ff829e]', icon: 'border-[#78344c] bg-[#3a1725] text-[#ff7898]', node: 'border-[#40283d] bg-[#171321]/90', line: 'bg-[#6b344c]', dot: 'bg-[#ff7898]', chip: 'border-[#693047] bg-[#361722] text-[#ff9ab0]', badge: 'border-[#7d334d] bg-[#411725] text-[#ff91aa]', result: 'border-[#5a2c43] bg-[#261520]',
  },
  safe: {
    border: 'border-[#27575b]', panel: 'from-[#0a202b] via-[#10192e] to-[#0c1830]', label: 'text-[#55dec9]', icon: 'border-[#5a4fbd] bg-[#211d57] text-[#9c87ff]', node: 'border-[#2e3e63] bg-[#101a32]/90', line: 'bg-[#5954a7]', dot: 'bg-[#45dec8]', chip: 'border-[#486b2c] bg-[#1d361d] text-[#b8ed67]', badge: 'border-[#29756b] bg-[#123e3a] text-[#56e4cf]', result: 'border-[#28675f] bg-[#11332f]',
  },
};

const Connector = ({ tone, label }: { tone: Tone; label: string }) => {
  const palette = palettes[tone];
  return <div className="relative hidden min-w-[72px] self-center lg:block" aria-hidden="true"><div className={`h-px w-full ${palette.line}`} /><span className={`flow-comparison-dot absolute left-0 top-[-3px] h-[7px] w-[7px] rounded-full shadow-[0_0_12px_currentColor] ${palette.dot}`} /><span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[.12em] text-[#7886aa]">{label}</span></div>;
};

const Flow = ({ tone, eyebrow, title, badge, steps, connectors, outcomes, result }: { tone: Tone; eyebrow: string; title: string; badge: string; steps: Step[]; connectors: string[]; outcomes: string[]; result: string }) => {
  const palette = palettes[tone];
  const safe = tone === 'safe';
  return <article className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${palette.border} ${palette.panel}`}>
    <div className={`absolute inset-x-0 top-0 h-px ${safe ? 'bg-gradient-to-r from-transparent via-[#45dec8] to-transparent' : 'bg-gradient-to-r from-transparent via-[#d64d70] to-transparent'}`} />
    <header className="flex flex-col gap-4 border-b border-white/[.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div><p className={`text-[9px] font-semibold uppercase tracking-[.24em] ${palette.label}`}>{eyebrow}</p><h3 className="mt-2 text-xl font-semibold text-white">{title}</h3></div>
      <span className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-semibold ${palette.badge}`}>{badge}</span>
    </header>

    <div className="px-5 py-6 sm:px-7 sm:py-8">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">{steps.map(({ icon: Icon, title: stepTitle, detail, signal }, index) => <React.Fragment key={stepTitle}>
        <div className={`relative flex min-h-[142px] gap-4 rounded-xl border p-4 lg:flex-col ${palette.node}`}>
          <span className="absolute right-3 top-3 font-mono text-[9px] text-[#637092]">0{index + 1}</span>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${palette.icon}`}><Icon className="h-5 w-5" /></span>
          <div><h4 className="text-sm font-semibold text-white">{stepTitle}</h4><p className="mt-1 text-[11px] leading-5 text-[#99a6c6]">{detail}</p><p className={`mt-3 text-[9px] font-semibold uppercase tracking-[.12em] ${palette.label}`}>{signal}</p></div>
        </div>
        {index < connectors.length && <Connector tone={tone} label={connectors[index]} />}
      </React.Fragment>)}</div>

      <footer className={`mt-5 flex flex-col gap-4 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${palette.result}`}>
        <div className="flex items-center gap-3">{safe ? <Check className="h-5 w-5 text-[#55e0ca]" /> : <TriangleAlert className="h-5 w-5 text-[#ff7898]" />}<div><p className="text-[9px] uppercase tracking-[.18em] text-[#8390b0]">End state</p><p className="mt-1 text-sm font-semibold text-white">{result}</p></div></div>
        <div className="flex flex-wrap gap-2">{outcomes.map((outcome) => <span key={outcome} className={`rounded-full border px-3 py-1 text-[10px] ${palette.chip}`}>{outcome}</span>)}</div>
      </footer>
    </div>
  </article>;
};

const traditional: Step[] = [
  { icon: Users, title: 'Employee records', detail: 'Names, salaries, bonuses, and payout instructions.', signal: 'Plaintext begins here' },
  { icon: Building2, title: 'Payroll processor', detail: 'A centralized provider receives the full payroll file.', signal: 'Another trust boundary' },
  { icon: Network, title: 'Individual transfers', detail: 'Every payment creates another operational record.', signal: 'Data multiplied' },
  { icon: FileSpreadsheet, title: 'Audit exports', detail: 'Finance reconstructs evidence across several systems.', signal: 'Manual verification' },
];

const privateFlow: Step[] = [
  { icon: LockKeyhole, title: 'Private roster', detail: 'Authorized payroll data stays within the local boundary.', signal: 'Private input' },
  { icon: Database, title: 'Batch commitment', detail: 'The entire payroll becomes one cryptographic root.', signal: 'One commitment' },
  { icon: Fingerprint, title: 'Zero-knowledge proof', detail: 'Compact verifies the constraints without revealing salaries.', signal: 'Proof generated' },
  { icon: ShieldCheck, title: 'Midnight settlement', detail: 'The network records a verifiable state transition.', signal: 'Auditable result' },
];

export const PayrollFlowComparison: React.FC = () => <section className="py-12 sm:py-20" aria-labelledby="flow-comparison-title">
  <div className="mx-auto mb-10 max-w-4xl text-center"><p className="text-[10px] font-semibold uppercase tracking-[.3em] text-[#a899ff]">Side by side</p><h2 id="flow-comparison-title" className="mt-3 text-3xl font-bold tracking-[-.04em] text-white sm:text-5xl">Same payroll. A fundamentally different data trail.</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">See where sensitive information spreads in a traditional workflow—and where Vansidian replaces it with commitments and proofs.</p></div>
  <div className="space-y-5">
    <Flow tone="risk" eyebrow="01 · Exposed workflow" title="Traditional payroll replicates sensitive data" badge="Sensitive data copied at every stage" steps={traditional} connectors={['Upload', 'Disburse', 'Export']} outcomes={['Multiple custodians', 'Repeated plaintext', 'Manual audit']} result="More copies, more exposure, more reconciliation" />
    <Flow tone="safe" eyebrow="02 · Protected workflow" title="Vansidian proves the payroll without publishing it" badge="Commitments, not compensation" steps={privateFlow} connectors={['Commit', 'Prove', 'Verify']} outcomes={['No salaries on-chain', 'One batch proof', 'Selective disclosure']} result="One verifiable record without the payroll details" />
  </div>
</section>;
