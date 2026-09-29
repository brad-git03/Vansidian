import React from 'react';
import { FileText, Layers3, LockKeyhole } from 'lucide-react';

const items = [
  { icon: LockKeyhole, title: 'Confidential by design', copy: 'Employee compensation is encrypted end-to-end. Only authorized parties can view sensitive data.' },
  { icon: Layers3, title: 'Verifiable on chain', copy: 'Every payroll run is proven on Midnight Network with a single zero-knowledge proof.' },
  { icon: FileText, title: 'Ready for audits', copy: 'Provide cryptographic evidence of payroll execution without exposing individual salaries.' },
];

export const AboutSection: React.FC = () => <section id="about" className="scroll-mt-24 py-12 sm:py-14">
  <div className="text-center">
    <p className="text-[10px] font-semibold uppercase tracking-[.3em] text-[#a8b3dc]">Built for modern payroll</p>
    <h2 className="mt-3 text-3xl font-bold tracking-[-.035em] text-white sm:text-[40px]">Privacy without losing accountability</h2>
    <p className="mx-auto mt-3 max-w-[840px] text-sm text-[#a6b2d4] sm:text-base">Vansidian combines confidential payroll with transparent, verifiable settlements on Midnight Network.</p>
  </div>
  <div className="mt-7 grid gap-4 md:grid-cols-3">{items.map(({ icon: Icon, title, copy }) => <article key={title} className="flex min-h-[150px] gap-5 rounded-lg border border-[#2a3959] bg-[#0b152a]/70 p-5 sm:p-6">
    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#2c2e6b] bg-[#191b50] text-[#866dff]"><Icon className="h-7 w-7" /></span>
    <div><h3 className="mt-1 text-base font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-[1.55] text-[#a4b0d2]">{copy}</p></div>
  </article>)}</div>
</section>;
