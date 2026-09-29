import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const questions = [
  ['What payroll information is kept private?', 'Employee identities, individual compensation, bonuses, recipient information, and private witness material remain within authorized processing boundaries.'],
  ['What is recorded on Midnight?', 'The contract records the required public state, proof commitment, transaction confirmation, and counters—not the individual salary records used as private witnesses.'],
  ['Can validators see individual salaries?', 'No. Validators verify that the zero-knowledge proof satisfies the contract constraints without receiving the underlying compensation values.'],
  ['Does Vansidian store private payroll data?', 'The current demonstration processes private witness inputs locally for proof generation. A production deployment would still require an explicit data-retention and operational-security review.'],
  ['Why use one batch proof?', 'A batch commitment lets the system verify an entire payroll run as one state transition instead of publishing an individual record for every employee.'],
  ['Which wallet and network are supported?', 'The current implementation connects through Lace Wallet and targets Midnight Preprod.'],
  ['Is Vansidian production-ready?', 'The application is a working Preprod implementation and demonstration environment. It should not be interpreted as a completed production deployment or audit certification.'],
  ['How can an auditor verify a payroll run?', 'The auditor view combines the transaction record, batch commitment, selectively disclosed evidence, and verification references without revealing every private payroll input.'],
];

export const FAQSection: React.FC = () => {
  const [open, setOpen] = useState(0);
  return <section className="py-16 sm:py-24" aria-labelledby="faq-title"><div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-[10px] font-semibold uppercase tracking-[.3em] text-[#a899ff]">Frequently asked questions</p><h2 id="faq-title" className="mt-3 text-3xl font-bold tracking-[-.04em] text-white sm:text-4xl">Clear answers about private payroll.</h2><p className="mt-4 max-w-md text-sm leading-6 text-[var(--text-muted)]">What the current Preprod system protects, verifies, and exposes.</p></div><div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]">{questions.map(([question, answer], index) => { const expanded = open === index; return <article key={question} className="border-b border-[var(--border)] last:border-0"><h3><button onClick={() => setOpen(expanded ? -1 : index)} className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left text-sm font-semibold text-white sm:px-6" aria-expanded={expanded} aria-controls={`faq-answer-${index}`}>{question}<span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${expanded ? 'border-[#6c5ac4] bg-[#292055] text-[#ac9aff]' : 'border-[var(--border)] text-[var(--text-muted)]'}`}>{expanded ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}</span></button></h3>{expanded && <div id={`faq-answer-${index}`} className="px-5 pb-5 pr-16 text-sm leading-6 text-[var(--text-muted)] sm:px-6 sm:pb-6 sm:pr-20">{answer}</div>}</article>; })}</div></div></section>;
};
