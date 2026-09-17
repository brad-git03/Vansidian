import React, { useState } from 'react';
import { Logo } from './Logo';
import { WalletState } from '../hooks/useMidnight';
import { ArrowRight, Menu, X } from 'lucide-react';
interface NavbarProps { wallet:WalletState; onConnect:()=>void; onDisconnect:()=>void; onLaunchApp:()=>void; }
export const Navbar:React.FC<NavbarProps> = ({wallet,onConnect,onDisconnect,onLaunchApp}) => {
  const [open,setOpen]=useState(false);
  const links=[['Product','#about'],['How it works','#how-it-works'],['Security','#security'],['Docs','#documentation']];
  return <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color:var(--canvas)]/95 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <a href="#hero" aria-label="Vansidian home"><Logo size={32} showText /></a>
      <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">{links.map(([label,href])=><a key={href} href={href} className="text-sm text-[var(--text-muted)] transition-colors hover:text-white">{label}</a>)}</nav>
      <div className="hidden items-center gap-2 sm:flex">
        <button onClick={wallet.isConnected?onDisconnect:onConnect} disabled={wallet.isConnecting} className="app-button-secondary px-3.5 py-2 text-sm">{wallet.isConnecting?'Connecting…':wallet.isConnected?`${wallet.address?.slice(0,7)}…`:'Connect wallet'}</button>
        <button onClick={onLaunchApp} className="app-button-primary flex items-center gap-2 px-4 py-2 text-sm font-semibold">Open workspace <ArrowRight className="h-4 w-4" /></button>
      </div>
      <button onClick={()=>setOpen(!open)} className="app-button-secondary p-2 sm:hidden" aria-expanded={open} aria-label="Toggle navigation">{open?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button>
    </div>
    {open&&<div className="border-t border-[var(--border)] bg-[var(--surface-1)] p-4 sm:hidden"><nav className="grid gap-1" aria-label="Mobile navigation">{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)} className="rounded-lg px-3 py-3 text-sm hover:bg-[var(--surface-2)]">{label}</a>)}<button onClick={onLaunchApp} className="app-button-primary mt-2 px-4 py-3 text-sm font-semibold">Open workspace</button></nav></div>}
  </header>;
};
