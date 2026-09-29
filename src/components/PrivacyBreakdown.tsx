import React from 'react';
import { Circle, Diamond } from 'lucide-react';

const rows = [
  ['Employee identity', 'Shared across administrators', 'Authorized parties only'],
  ['Individual compensation', 'Stored in operational systems', 'Private witness data'],
  ['Payroll total', 'Replicated across reports', 'Selectively disclosed'],
  ['Recipient information', 'Visible to payment providers', 'Committed; not published as payroll data'],
  ['Proof of execution', 'Bank files and reconciliations', 'One verified batch commitment'],
  ['Audit evidence', 'Manual document collection', 'Cryptographically verifiable record'],
];

export const PrivacyBreakdown: React.FC = () => <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]">
  <div className="border-b border-[var(--border)] p-6 sm:p-8"><p className="text-[10px] uppercase tracking-[.3em] text-[#a995ff]">Who sees what</p><h2 className="mt-3 text-3xl font-bold tracking-[-.04em]">Private where it matters. Public where it counts.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">Vansidian replaces repeated plaintext records with private witnesses, commitments, and explicit disclosure boundaries.</p></div>
  <div className="hidden md:block"><table className="w-full text-left"><thead><tr className="bg-[#111a30] text-[10px] uppercase tracking-[.16em] text-[#8f9bbd]"><th className="px-7 py-4 font-medium">Information</th><th className="px-7 py-4 font-medium">Traditional workflow</th><th className="px-7 py-4 font-medium">Vansidian</th></tr></thead><tbody>{rows.map(([data, traditional, vansidian]) => <tr key={data} className="border-t border-[var(--border)]"><th className="px-7 py-4 text-sm font-medium text-white">{data}</th><td className="px-7 py-4 text-sm text-[var(--text-muted)]"><span className="flex items-center gap-3"><Circle className="h-2.5 w-2.5 fill-[#e56b87] text-[#e56b87]" />{traditional}</span></td><td className="px-7 py-4 text-sm text-[#c8d1ed]"><span className="flex items-center gap-3"><Diamond className="h-3 w-3 fill-[#7c65f6] text-[#7c65f6]" />{vansidian}</span></td></tr>)}</tbody></table></div>
  <div className="divide-y divide-[var(--border)] md:hidden">{rows.map(([data, traditional, vansidian]) => <article key={data} className="p-5"><h3 className="font-semibold">{data}</h3><p className="mt-3 flex gap-2 text-sm text-[var(--text-muted)]"><Circle className="mt-1 h-2.5 w-2.5 shrink-0 fill-[#e56b87] text-[#e56b87]" />{traditional}</p><p className="mt-2 flex gap-2 text-sm text-[#c8d1ed]"><Diamond className="mt-1 h-3 w-3 shrink-0 fill-[#7c65f6] text-[#7c65f6]" />{vansidian}</p></article>)}</div>
</div>;
