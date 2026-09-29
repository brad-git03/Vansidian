import React, { useState } from 'react';
import { Check, Fingerprint, KeyRound, Radio, Wallet } from 'lucide-react';

interface Props { isConnected: boolean; hasWitnessValue: boolean; isConfirmed: boolean; }

export const WorkflowBar: React.FC<Props> = ({ isConnected, hasWitnessValue, isConfirmed }) => {
  const [selected, setSelected] = useState(0);
  const steps = [
    { title: 'Connect', copy: 'Authorize your Lace wallet on Midnight Preprod.', location: 'Wallet boundary', icon: Wallet, done: isConnected },
    { title: 'Prepare', copy: 'Review the private roster and create the payroll commitment locally.', location: 'Private · local', icon: KeyRound, done: isConnected && hasWitnessValue },
    { title: 'Prove', copy: 'Generate a zero-knowledge proof that the batch satisfies the contract constraints.', location: 'Private · local', icon: Fingerprint, done: isConfirmed },
    { title: 'Settle', copy: 'Submit the proof and retain a verifiable Midnight transaction record.', location: 'Public · on-chain', icon: Radio, done: isConfirmed },
  ];

  return <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]">
    <div className="border-b border-[var(--border)] px-6 py-7 sm:px-8"><p className="text-[10px] uppercase tracking-[.3em] text-[#a995ff]">How it works</p><h2 className="mt-3 text-3xl font-bold tracking-[-.04em]">One clear path from payroll to proof.</h2></div>
    <div className="grid lg:grid-cols-[1fr_320px]">
      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4">
        <div className="pointer-events-none absolute left-[12%] right-[12%] top-[48px] hidden border-t border-dashed border-[#475378] lg:block" />
        {steps.map(({ title, icon: Icon, done, location }, index) => <button key={title} onClick={() => setSelected(index)} className={`relative border-b border-r border-[var(--border)] p-6 text-left transition-colors lg:border-b-0 ${selected === index ? 'bg-[#151c39]' : 'hover:bg-white/[.02]'}`} aria-pressed={selected === index}>
          <div className="relative z-10 flex items-center justify-between"><span className={`grid h-11 w-11 place-items-center rounded-xl border ${done ? 'border-[#29766d] bg-[#153b39] text-[#43dfc9]' : selected === index ? 'border-[#6556b4] bg-[#262054] text-[#a995ff]' : 'border-[var(--border)] bg-[#111a30] text-[var(--text-muted)]'}`}>{done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}</span><span className="font-mono text-[10px] text-[var(--text-subtle)]">0{index + 1}</span></div>
          <h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#8897bd]">{location}</p>
        </button>)}
      </div>
      <aside className="border-t border-[var(--border)] bg-[#091329] p-7 lg:border-l lg:border-t-0" aria-live="polite"><p className="text-[10px] uppercase tracking-[.2em] text-[#8d7af1]">Stage 0{selected + 1}</p><h3 className="mt-3 text-xl font-semibold">{steps[selected].title}</h3><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{steps[selected].copy}</p><div className="mt-6 rounded-lg border border-[#2c3a5b] bg-[#111b34] px-4 py-3 text-xs text-[#aeb9da]">Data boundary: <span className="text-white">{steps[selected].location}</span></div></aside>
    </div>
  </div>;
};
