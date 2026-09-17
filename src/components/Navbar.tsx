import React, { useState } from 'react';
import { Logo } from './Logo';
import { WalletState } from '../hooks/useMidnight';
import { ArrowUpRight, Menu, X } from 'lucide-react';
interface NavbarProps { wallet:WalletState; onConnect:()=>void; onDisconnect:()=>void; onLaunchApp:()=>void; }
export const Navbar:React.FC<NavbarProps>=({wallet,onConnect,onDisconnect,onLaunchApp})=>{
 const [open,setOpen]=useState(false); const links=[['Home','#hero'],['Product','#about'],['How it works','#how-it-works'],['Security','#security']];
 return <header className="sticky top-0 z-50 bg-[var(--canvas)] px-3 pt-3 sm:px-5 sm:pt-4">
  <div className="mx-auto flex h-16 max-w-[1380px] items-center justify-between rounded-t-[24px] border-x border-t border-white/[.07] bg-[var(--surface-1)] px-4 sm:px-6">
   <a href="#hero" aria-label="Vansidian home"><Logo size={34} showText/></a>
   <nav className="hidden items-center rounded-full border border-white/[.06] bg-black/20 p-1 md:flex" aria-label="Primary navigation">{links.map(([label,href],i)=><a key={href} href={href} className={`rounded-full px-5 py-2 text-xs transition-colors ${i===0?'bg-white/[.07] text-white':'text-[var(--text-muted)] hover:text-white'}`}>{label}</a>)}</nav>
   <div className="hidden items-center gap-2 sm:flex"><button onClick={wallet.isConnected?onDisconnect:onConnect} disabled={wallet.isConnecting} className="px-3 py-2 text-xs text-[var(--text-muted)] hover:text-white">{wallet.isConnecting?'Connecting…':wallet.isConnected?`${wallet.address?.slice(0,7)}…`:'Connect wallet'}</button><button onClick={onLaunchApp} className="app-button-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold">Launch app <ArrowUpRight className="h-3.5 w-3.5"/></button></div>
   <button onClick={()=>setOpen(!open)} className="app-button-secondary p-2 sm:hidden" aria-expanded={open} aria-label="Toggle navigation">{open?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button>
  </div>
  {open&&<div className="mx-auto max-w-[1380px] border-x border-t border-[var(--border)] bg-[var(--surface-1)] p-4 sm:hidden"><nav className="grid gap-1">{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)} className="rounded-lg px-3 py-3 text-sm hover:bg-white/5">{label}</a>)}<button onClick={onLaunchApp} className="app-button-primary mt-2 px-4 py-3 font-semibold">Launch app</button></nav></div>}
 </header>;
};
