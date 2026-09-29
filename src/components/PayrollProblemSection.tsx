import React from 'react';
import { Eye, FileWarning, Network, RefreshCcw } from 'lucide-react';

const risks = [
  { icon: Eye, title: 'Compensation exposure', copy: 'Salary and bonus data is copied across processors, exports, and administrative systems.' },
  { icon: Network, title: 'Too many trust boundaries', copy: 'Every additional payroll provider and reconciliation tool expands the sensitive-data surface.' },
  { icon: FileWarning, title: 'Fragmented audit evidence', copy: 'Approvals, transfer records, and reports live in different systems with different assumptions.' },
  { icon: RefreshCcw, title: 'Manual reconciliation', copy: 'Finance teams repeatedly prove that payroll totals and individual transfers match.' },
];

export const PayrollProblemSection: React.FC = () => <section className="py-16 sm:py-24" aria-labelledby="payroll-problem-title">
  <div className="max-w-3xl">
    <p className="text-[10px] font-semibold uppercase tracking-[.3em] text-[#ef829d]">The privacy problem</p>
    <h2 id="payroll-problem-title" className="mt-4 text-3xl font-bold tracking-[-.04em] text-white sm:text-5xl">Payroll data spreads long before an audit begins.</h2>
    <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)]">Traditional workflows duplicate sensitive compensation data across operational and reporting systems. Vansidian reduces that exposure at the protocol boundary.</p>
  </div>
  <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{risks.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-xl border border-[#422d48] bg-gradient-to-b from-[#221426]/70 to-[#0b1427] p-5">
    <span className="grid h-10 w-10 place-items-center rounded-lg border border-[#6c3044] bg-[#3b1824] text-[#ff7898]"><Icon className="h-5 w-5" /></span>
    <h3 className="mt-6 text-base font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-[#aeb8d3]">{copy}</p>
  </article>)}</div>
</section>;
