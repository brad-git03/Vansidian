import React, { useState } from 'react';
import { Menu, Wallet, X } from 'lucide-react';
import { WalletState } from '../hooks/useMidnight';
import { Logo } from './Logo';

interface NavbarProps { wallet: WalletState; onConnect: () => void; onDisconnect: () => void; onLaunchApp: () => void; }

const links = [['Product', '#about'], ['How it works', '#how-it-works'], ['Settlements', '#settlements'], ['Security', '#security']];

export const Navbar: React.FC<NavbarProps> = ({ wallet, onConnect, onDisconnect, onLaunchApp }) => {
  const [open, setOpen] = useState(false);
  const walletLabel = wallet.isConnecting ? 'Connecting…' : wallet.isConnected ? `${wallet.address?.slice(0, 7)}…` : 'Connect wallet';

  return <header className="sticky top-0 z-50 border-b border-[#243150] bg-[#081126]/95 backdrop-blur-xl">
    <div className="mx-auto flex h-[72px] max-w-[1324px] items-center justify-between px-5 sm:px-7">
      <a href="#hero" aria-label="Vansidian home"><Logo size={35} showText showTagline={false} /></a>
      <nav className="hidden items-center gap-11 lg:flex" aria-label="Primary navigation">{links.map(([label, href]) => <a key={href} href={href} className="text-sm font-medium text-[#e9ecf8] transition-colors hover:text-[#8f79ff]">{label}</a>)}</nav>
      <div className="hidden items-center gap-4 sm:flex">
        <button onClick={wallet.isConnected ? onDisconnect : onConnect} disabled={wallet.isConnecting} className="flex h-10 items-center gap-2 rounded-md border border-[#394a72] px-4 text-xs font-medium text-[#eef0fa] transition-colors hover:border-[#6d65bc] hover:bg-white/[.03] disabled:opacity-50"><Wallet className="h-4 w-4 text-[#b4b9ff]" />{walletLabel}</button>
        <button onClick={onLaunchApp} className="h-10 rounded-md bg-gradient-to-r from-[#6048ee] to-[#765cff] px-6 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(96,72,238,.25)] transition hover:brightness-110">Launch app</button>
      </div>
      <button onClick={() => setOpen((value) => !value)} className="rounded-md border border-[#394a72] p-2 text-white sm:hidden" aria-expanded={open} aria-label="Toggle navigation">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
    </div>
    {open && <div className="border-t border-[#243150] bg-[#0a142b] px-5 py-4 sm:hidden"><nav className="mx-auto grid max-w-[1324px] gap-1">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm hover:bg-white/5">{label}</a>)}<button onClick={wallet.isConnected ? onDisconnect : onConnect} className="mt-2 rounded-md border border-[#394a72] px-4 py-3 text-sm">{walletLabel}</button><button onClick={onLaunchApp} className="mt-1 rounded-md bg-[#6048ee] px-4 py-3 text-sm font-semibold">Launch app</button></nav></div>}
  </header>;
};
