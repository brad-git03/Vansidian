import React, { useEffect, useState } from 'react';
import { Check, LockKeyhole, Radio, ShieldCheck, Wallet } from 'lucide-react';

type Mode = 'splash' | 'wallet';
interface Props { mode:Mode; onComplete?:()=>void; }

export const SystemTransition:React.FC<Props>=({mode,onComplete})=>{
  const [stage,setStage]=useState(0);
  const splash=mode==='splash';
  const labels=splash?['Secure runtime','Private proof layer','Verified state']:['Requesting permission','Checking Midnight network','Preparing private workspace'];
  useEffect(()=>{
    const a=window.setTimeout(()=>setStage(1),splash?420:650);
    const b=window.setTimeout(()=>setStage(2),splash?900:1400);
    const c=splash?window.setTimeout(()=>onComplete?.(),1650):undefined;
    return()=>{clearTimeout(a);clearTimeout(b);if(c)clearTimeout(c)};
  },[splash,onComplete]);
  return <div className={`${splash?'fixed inset-0 z-[100]':'fixed inset-0 z-[90] bg-black/65 backdrop-blur-sm'} grid place-items-center`} role={splash?'status':'dialog'} aria-live="polite" aria-label={splash?'Loading Vansidian':'Connecting wallet'}>
    <div className={`${splash?'flex h-full w-full flex-col items-center justify-center bg-[var(--canvas)]':'w-[calc(100%-2rem)] max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 shadow-[var(--shadow-overlay)]'} relative overflow-hidden`}>
      <div className="system-loader-aura absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7657f6]/15 blur-3xl"/>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="system-logo-orbit relative grid h-24 w-24 place-items-center"><div className="absolute inset-0 rounded-full border border-[#7657f6]/25"/><div className="absolute inset-2 rounded-full border border-dashed border-[#a995ff]/30"/><img src="/vansidian-logo-v2.png" alt="Vansidian" className="system-logo-pulse h-16 w-16 object-contain"/></div>
        <p className="mt-5 text-xs font-medium uppercase tracking-[.22em] text-[#a995ff]">{splash?'Vansidian':'Secure wallet link'}</p>
        <h2 className="mt-2 text-xl font-medium">{splash?'Initializing private finance':'Connect to Lace'}</h2>
        <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">{splash?'Preparing the local privacy runtime and verified state interface.':'Approve the request in Lace. Vansidian only reads the address and network required for this session.'}</p>
        <div className="mt-7 flex items-center"><Node icon={splash?LockKeyhole:Wallet} active={stage>=0} done={stage>0}/><Line active={stage>0}/><Node icon={splash?ShieldCheck:Radio} active={stage>=1} done={stage>1}/><Line active={stage>1}/><Node icon={Check} active={stage>=2} done={false}/></div>
        <p className="mt-4 h-5 text-xs text-[var(--text-muted)]">{labels[stage]}</p>
        {!splash&&<div className="mt-5 flex items-center gap-2 text-[10px] text-[var(--text-subtle)]"><LockKeyhole className="h-3 w-3"/>Private keys never leave your wallet</div>}
      </div>
    </div>
  </div>;
};

const Node=({icon:Icon,active,done}:{icon:React.ElementType;active:boolean;done:boolean})=><span className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-500 ${active?'border-[#7657f6] bg-[#7657f6]/15 text-[#c7bcff]':'border-[var(--border)] text-[var(--text-subtle)]'}`}>{done?<Check className="h-4 w-4 text-[#73d7aa]"/>:<Icon className={`h-4 w-4 ${active&&!done?'system-node-pulse':''}`}/>}</span>;
const Line=({active}:{active:boolean})=><span className="mx-2 h-px w-12 overflow-hidden bg-[var(--border)]"><span className={`block h-full bg-gradient-to-r from-[#7657f6] to-[#32b77c] transition-all duration-500 ${active?'w-full':'w-0'}`}/></span>;
