import React from 'react';
import { Check, CircleDashed, Rocket } from 'lucide-react';

const columns = [
  { icon: Check, label: 'Built', color: '#36ddc7', items: ['Midnight Preprod contract', 'Lace wallet connection', 'Local private witnesses', 'Batch-proof execution', 'Employer, auditor and employee views'] },
  { icon: CircleDashed, label: 'Scope today', color: '#9c87ff', items: ['Preprod network environment', 'Demonstration payroll roster', 'Current Compact batch bounds', 'Lace and test-token requirements', 'Illustrative marketing preview data'] },
  { icon: Rocket, label: 'Roadmap', color: '#84a8ff', items: ['Production-network preparation', 'Payroll-system integrations', 'Expanded selective disclosure', 'Organization administration', 'Exportable audit packages'] },
];

export const ProductScope: React.FC = () => <section className="py-20" aria-labelledby="scope-title">
  <div className="max-w-3xl"><p className="text-[10px] font-semibold uppercase tracking-[.3em] text-[#a899ff]">Honest scope</p><h2 id="scope-title" className="mt-3 text-3xl font-bold tracking-[-.04em] text-white sm:text-4xl">What works now, and what comes next.</h2><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">A clear boundary between the working Preprod system, its present constraints, and the direction of the product.</p></div>
  <div className="mt-9 grid gap-4 lg:grid-cols-3">{columns.map(({ icon: Icon, label, color, items }) => <article key={label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-6"><div className="flex items-center gap-3"><Icon className="h-5 w-5" style={{ color }} /><h3 className="text-lg font-semibold">{label}</h3></div><ul className="mt-6 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm text-[var(--text-muted)]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />{item}</li>)}</ul></article>)}</div>
</section>;
