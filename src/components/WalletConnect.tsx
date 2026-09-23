import React, { useState } from 'react';
import { WalletState } from '../hooks/useMidnight';
import { Wallet, LogOut, ShieldCheck, AlertTriangle, ExternalLink, Copy, Check, Sparkles, Lock } from 'lucide-react';

interface WalletConnectProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  isWalletInstalled: boolean;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  onConnect,
  onDisconnect,
  isWalletInstalled,
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!wallet.address) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {wallet.walletName || 'Lace'} Wallet Connector
            </h2>
            <p className="text-xs text-slate-400">Midnight Network DApp Connector API v4</p>
          </div>
        </div>

        {/* Status Badge */}
        {wallet.isConnected ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Connected ({wallet.network || 'preprod'})
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-full text-xs font-medium text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            {isWalletInstalled ? 'Extension Ready' : 'Disconnected'}
          </div>
        )}
      </div>

      {/* Error Alert Box */}
      {wallet.error && (
        <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-rose-200">Connection Issue</p>
            <p className="text-xs text-rose-300/80 mt-1">{wallet.error}</p>
            {!isWalletInstalled && (
              <a
                href="https://www.lace.io/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-2 font-medium underline"
              >
                Install Lace Wallet Extension <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Wallet Details or Connect Actions */}
      {wallet.isConnected ? (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-400 font-medium">Connected Unshielded Address</p>
                <button
                  onClick={copyAddress}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs sm:text-sm text-indigo-300 truncate selection:bg-indigo-500/30">
                  {wallet.address}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>

            {wallet.shieldedAddress && (
              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-400" /> Shielded Key / Address
                </p>
                <p className="font-mono text-xs text-purple-300 truncate">
                  {wallet.shieldedAddress}
                </p>
              </div>
            )}

            {wallet.dustBalance && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> DUST Balance
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold">
                  {wallet.dustBalance} DUST
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onDisconnect}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-medium text-sm transition-all duration-200 hover:border-slate-600 active:scale-[0.99] cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={onConnect}
            disabled={wallet.isConnecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all duration-200 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            {wallet.isConnecting ? 'Connecting to Lace...' : 'Connect Lace Wallet'}
          </button>
        </div>
      )}
    </div>
  );
};
