import React from 'react';
import { ArrowUpRight, Check, EyeOff, FileCheck, Layers } from 'lucide-react';
const items=[
 {icon:EyeOff,n:'01',title:'Compensation stays private',copy:'Salary, bonus, and recipient data are evaluated locally. No raw payroll values reach RPC nodes or block explorers.'},
 {icon:Layers,n:'02',title:'One proof scales with the team',copy:'Aggregate an entire payroll run into one commitment instead of exposing or settling every employee record separately.'},
 {icon:FileCheck,n:'03',title:'Auditors get verified facts',copy:'Disclose only the state transitions and compliance evidence required—never the underlying compensation data.'},
];
export const AboutSection:React.FC=()=> <section id="about" className="scroll-mt-24 py-24 sm:py-32">
 <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]"><div><p className="text-xs font-medium uppercase tracking-[.18em] text-[#a995ff]">Built for private finance</p><h2 className="mt-4 text-3xl font-medium tracking-[-.035em] sm:text-5xl">Privacy without losing accountability.</h2><p className="mt-5 max-w-md leading-7 text-[var(--text-muted)]">Vansidian separates sensitive payroll inputs from the public proof used to verify them.</p><a href="#documentation" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white">Explore the architecture <ArrowUpRight className="h-4 w-4"/></a></div>
 <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">{items.map(({icon:Icon,n,title,copy})=><article key={n} className="bg-[var(--surface-1)] p-6 sm:p-7"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-soft)]"><Icon className="h-5 w-5 text-[#a995ff]"/></span><span className="font-mono text-xs text-[var(--text-subtle)]">{n}</span></div><h3 className="mt-8 text-lg font-medium">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{copy}</p><div className="mt-6 flex items-center gap-2 text-xs text-[#73d7aa]"><Check className="h-3.5 w-3.5"/>Verified by design</div></article>)}</div></div>
</section>;
