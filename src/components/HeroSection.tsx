import React from 'react';
import { ArrowRight, CalendarDays, Check, FileText, Layers3, LockKeyhole, ShieldCheck, Users } from 'lucide-react';

interface HeroSectionProps { onConnectClick: () => void; isConnected: boolean; isConnecting?: boolean; onLaunchApp: () => void; }

const recipients = ['emp_7a3f...9c2d', 'emp_9b1e...4f77', 'emp_c4d2...8a1e', 'emp_6e90...3b5c', 'emp_f2a7...1d9b'];

const SummaryCard = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) => <div className="flex min-w-0 items-center gap-3 rounded-md border border-[#273657] bg-[#111c36] px-3 py-3">
  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#172447] text-[#aeb8ff]"><Icon className="h-5 w-5" /></span>
  <div className="min-w-0"><p className="text-lg font-semibold leading-none text-white">{value}</p><p className="mt-1 truncate text-xs text-[#a5b2d7]">{label}</p></div>
</div>;

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchApp }) => <section id="hero" className="w-full border-b border-[#243150] bg-[#081126]">
  <div className="relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_54%_38%,rgba(67,75,188,.2),transparent_36%),radial-gradient(circle_at_22%_55%,rgba(58,48,148,.13),transparent_34%)]" />
    <div className="pointer-events-none absolute left-[42%] top-0 h-full w-[28%] skew-x-[-23deg] bg-gradient-to-br from-[#17265a]/50 to-transparent" />
    <div className="relative mx-auto grid max-w-[1324px] items-center gap-14 px-5 py-10 sm:px-7 lg:min-h-[520px] lg:grid-cols-[1fr_1.12fr] lg:py-7">
      <div className="max-w-[620px]">
        <p className="text-[11px] font-semibold uppercase tracking-[.31em] text-[#9b87ff]">Private payroll&nbsp;&nbsp;•&nbsp;&nbsp;public proof</p>
        <h1 className="mt-5 text-[52px] font-bold leading-[.98] tracking-[-.055em] text-white sm:text-[68px] lg:text-[76px]">Payroll privacy,<br/><span className="bg-gradient-to-b from-[#8b72ff] to-[#5e43ec] bg-clip-text text-transparent">proven.</span></h1>
        <p className="mt-7 max-w-[570px] text-lg leading-[1.55] text-[#aeb9dc] sm:text-xl">Run confidential payroll and verify every disbursement<br className="hidden xl:block" /> without exposing employee compensation.</p>
        <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-9">
          <button onClick={onLaunchApp} className="flex h-14 items-center justify-center gap-3 rounded-md bg-gradient-to-r from-[#5a3ff0] to-[#765cff] px-8 text-base font-semibold text-white shadow-[0_12px_34px_rgba(83,57,236,.28)] transition hover:brightness-110">Start a payroll run <ArrowRight className="h-4 w-4" /></button>
          <a href="#settlements" className="flex items-center gap-3 text-base font-medium text-[#9d88ff] hover:text-[#b5a7ff]">View live settlements <ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>

      <div className="rounded-xl border border-[#263557] bg-[#0b162d]/85 p-3 shadow-[0_28px_90px_rgba(0,0,0,.24)]" aria-label="September payroll preview">
        <div className="rounded-lg border border-[#263657] bg-[#0b152b] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5"><h2 className="text-xl font-semibold">September payroll</h2><span className="flex items-center gap-2 text-xs text-[#2ee3cc]"><span className="h-3 w-3 rounded-full bg-[#25ddc6] shadow-[0_0_12px_rgba(37,221,198,.5)]" />Ready to prove</span></div>
            <div className="sm:text-right"><p className="text-[11px] text-[#9ba8cc]">Total disbursement</p><p className="text-xl font-semibold leading-tight">$34,500.00</p></div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3"><SummaryCard icon={Users} value="5" label="employees" /><SummaryCard icon={FileText} value="0" label="exceptions" /><SummaryCard icon={CalendarDays} value="Sep 30" label="pay date" /></div>
          <div className="mt-3 overflow-x-auto rounded-md border border-[#243350]">
            <div className="min-w-[500px]"><div className="grid grid-cols-[34px_1fr_120px_88px] bg-[#17213a] px-2 py-2 text-[10px] text-[#9facce]"><span>#</span><span>Recipient (anonymized)</span><span>Status</span><span className="text-right">Network fee</span></div>
            {recipients.map((recipient, index) => <div key={recipient} className="grid grid-cols-[34px_1fr_120px_88px] items-center border-t border-[#202e4a] px-2 py-[7px] text-[11px] text-[#c3cbed]"><span>{index + 1}</span><span className="truncate">{recipient}</span><span className="flex items-center gap-2"><Check className="h-4 w-4 rounded-full bg-[#2ce0c7] p-[2px] text-[#08201f]" />Scheduled</span><span className="text-right">0.12 NIGHT</span></div>)}</div>
          </div>
          <div className="mt-3 flex items-center gap-4 rounded-md border border-[#17676f] bg-gradient-to-r from-[#0d3744]/80 to-[#101b33] px-4 py-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[35%] bg-[#28e2cc] text-[#062d31]"><ShieldCheck className="h-6 w-6" /></span>
            <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-white">Batch commitment verified</p><p className="mt-1 text-[10px] text-[#a9b7db]">A zero-knowledge proof confirms all disbursements without revealing amounts.</p></div>
            <a href="#settlements" className="hidden items-center gap-2 text-[10px] text-[#b9c4ee] sm:flex">View proof <ArrowRight className="h-3 w-3" /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="border-t border-[#243150]"><div className="mx-auto grid max-w-[1160px] divide-y divide-[#2a3856] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-7">
    {[[LockKeyhole, 'Private by default', 'Compensation stays confidential\non and off chain.'], [Layers3, 'One batch proof', 'Verify an entire payroll run\nwith a single proof.'], [ShieldCheck, 'Auditor-ready evidence', 'Cryptographic records for compliance\nand reporting.']].map(([Icon, title, copy]) => <div key={String(title)} className="flex items-center gap-5 px-5 py-5 first:pl-0 last:pr-0 sm:justify-center"><Icon className="h-9 w-9 shrink-0 text-[#8068ff]" /><div><h3 className="text-sm font-semibold">{String(title)}</h3><p className="mt-1 whitespace-pre-line text-xs leading-[1.45] text-[#9fadd2]">{String(copy)}</p></div></div>)}
  </div></div>
</section>;
