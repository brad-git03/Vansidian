import React, { useState } from 'react';
import { Logo } from './Logo';
import { DualStateDashboard } from './DualStateDashboard';
import { PayrollRoster } from './PayrollRoster';
import { PaystubData } from './PaystubModal';
import { WalletConnect } from './WalletConnect';
import { AuditorView } from './AuditorView';
import { EmployeePortal } from './EmployeePortal';
import { ZKPipeline } from './ZKPipeline';
import { 
  WalletState, 
  CircuitCallState, 
  PREPROD_CONTRACT_ADDRESS, 
  PREPROD_CONTRACT_HEX_ID 
} from '../hooks/useMidnight';
import { 
  ArrowLeft, 
  BookOpen, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  Copy, 
  FileText, 
  History, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  ShieldCheck, 
  Users, 
  Wallet, 
  X,
  Briefcase,
  Search,
  UserCheck
} from 'lucide-react';

interface Props {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  isWalletInstalled: boolean;
  privateWitnessValue: number;
  onWitnessChange: (v: number) => void;
  publicCounterState: number;
  circuitState: CircuitCallState;
  onExecute: () => void;
  onOpenPaystub: (d: PaystubData) => void;
  onBackToWebsite: () => void;
}

export type UserRole = 'employer' | 'auditor' | 'employee';
type EmployerView = 'overview' | 'payroll' | 'transactions' | 'proof' | 'developer';

export const AppDashboard: React.FC<Props> = ({
  wallet,
  onConnect,
  onDisconnect,
  isWalletInstalled,
  privateWitnessValue,
  onWitnessChange,
  publicCounterState,
  circuitState,
  onExecute,
  onOpenPaystub,
  onBackToWebsite,
}) => {
  const [role, setRole] = useState<UserRole>('employer');
  const [view, setView] = useState<EmployerView>('payroll');
  const [mobile, setMobile] = useState(false);
  const [technical, setTechnical] = useState(false);
  const [copied, setCopied] = useState(false);

  const employerNav: [EmployerView, string, React.ElementType][] = [
    ['overview', 'Overview', LayoutDashboard],
    ['payroll', 'Payroll runs', Users],
    ['transactions', 'Transactions', History],
    ['proof', 'Proof console', ShieldCheck],
    ['developer', 'Developer settings', Code2],
  ];

  const chooseView = (v: EmployerView) => {
    setView(v);
    setMobile(false);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setMobile(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(PREPROD_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const Sidebar = () => (
    <>
      <div className="flex h-16 items-center border-b border-[var(--border)] px-5">
        <Logo size={30} showText />
      </div>

      {/* Role Selector in Sidebar */}
      <div className="p-3 border-b border-[var(--border)] bg-[var(--surface-1)]">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-2 px-1">
          Active Workspace Role
        </label>
        <div className="grid grid-cols-1 gap-1">
          <button
            onClick={() => handleRoleChange('employer')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              role === 'employer'
                ? 'bg-[var(--brand-soft)] text-white border border-[#a995ff]/40 shadow-sm'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#a995ff]" />
            <div className="leading-tight">
              <p className="font-semibold">Employer / CFO</p>
              <p className="text-[10px] text-[var(--text-subtle)]">Disburse & manage</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleChange('auditor')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              role === 'auditor'
                ? 'bg-emerald-500/20 text-white border border-emerald-500/40 shadow-sm'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <div className="leading-tight">
              <p className="font-semibold">Auditor / Verifier</p>
              <p className="text-[10px] text-[var(--text-subtle)]">ZK proof inspection</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleChange('employee')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              role === 'employee'
                ? 'bg-indigo-500/20 text-white border border-indigo-500/40 shadow-sm'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <div className="leading-tight">
              <p className="font-semibold">Employee / Payee</p>
              <p className="text-[10px] text-[var(--text-subtle)]">Confidential paystub</p>
            </div>
          </button>
        </div>
      </div>

      {/* Role Navigation Items */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Workspace navigation">
        {role === 'employer' && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 pt-1 pb-2">
              Treasury Navigation
            </p>
            {employerNav.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => chooseView(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                  view === id
                    ? 'bg-[var(--brand-soft)] text-white font-medium'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-white'
                }`}
                aria-current={view === id ? 'page' : undefined}
              >
                <Icon className={`h-4 w-4 ${view === id ? 'text-[#a995ff]' : ''}`} />
                {label}
              </button>
            ))}
          </>
        )}

        {role === 'auditor' && (
          <div className="px-3 py-2 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Auditor Capabilities
            </p>
            <div className="p-3 bg-[var(--surface-2)] rounded-lg text-xs space-y-2 text-[var(--text-muted)]">
              <p className="text-white font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Selective Disclosure
              </p>
              <p className="text-[11px] leading-relaxed">
                Verifies Compact ZK-SNARK rules without revealing confidential compensation.
              </p>
            </div>
          </div>
        )}

        {role === 'employee' && (
          <div className="px-3 py-2 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Recipient Privacy
            </p>
            <div className="p-3 bg-[var(--surface-2)] rounded-lg text-xs space-y-2 text-[var(--text-muted)]">
              <p className="text-white font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Merkle Inclusion
              </p>
              <p className="text-[11px] leading-relaxed">
                Proves your salary leaf is included on Midnight Preprod without leaking coworker rates.
              </p>
            </div>
          </div>
        )}
      </nav>

      <button
        onClick={onBackToWebsite}
        className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] hover:text-white cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to website
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-white lg:grid lg:grid-cols-[240px_1fr]">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-[var(--border)] bg-[var(--surface-1)] lg:flex lg:flex-col">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      {mobile && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setMobile(false)}>
          <aside
            className="flex h-full w-72 flex-col bg-[var(--surface-1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute left-[232px] top-3">
              <button
                onClick={() => setMobile(false)}
                className="p-2 text-white"
                aria-label="Close navigation"
              >
                <X />
              </button>
            </div>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="min-w-0 flex flex-col">
        {/* Workspace Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[color:var(--canvas)]/95 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobile(true)}
              className="app-button-secondary p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-medium">Vansidian workspace</p>
              <p className="hidden text-xs text-[var(--text-muted)] sm:block">Midnight Preprod</p>
            </div>
          </div>

          {/* Role Switching Quick Tabs in Top Header (visible on tablets & up) */}
          <div className="hidden md:flex items-center bg-[var(--surface-1)] border border-[var(--border)] rounded-xl p-1 gap-1">
            <button
              onClick={() => handleRoleChange('employer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                role === 'employer'
                  ? 'bg-[var(--brand-soft)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#a995ff]" />
              <span>Employer / Admin</span>
            </button>

            <button
              onClick={() => handleRoleChange('auditor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                role === 'auditor'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auditor / Verifier</span>
            </button>

            <button
              onClick={() => handleRoleChange('employee')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                role === 'employee'
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/30'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Employee Portal</span>
            </button>
          </div>

          {/* Wallet Status Area */}
          <div className="flex items-center gap-2">
            {wallet.isConnected ? (
              <>
                <span className="hidden font-mono text-xs text-[var(--text-muted)] sm:block">
                  {wallet.address?.slice(0, 9)}…
                </span>
                <button
                  onClick={onDisconnect}
                  className="app-button-secondary p-2 cursor-pointer"
                  aria-label="Disconnect wallet"
                  title="Disconnect wallet"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onConnect}
                className="app-button-primary flex items-center gap-2 px-3.5 py-2 text-sm cursor-pointer"
              >
                <Wallet className="h-4 w-4" />
                {wallet.isConnecting ? 'Connecting…' : 'Connect wallet'}
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8 flex-1">
          {/* Subheader / Role Context Banner */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#a995ff]">
                {role === 'employer' && 'Finance Operations & Treasury Engine'}
                {role === 'auditor' && 'Compliance & Zero-Knowledge Verification'}
                {role === 'employee' && 'Employee Self-Service & Private Records'}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                {role === 'employer' && (employerNav.find((n) => n[0] === view)?.[1] || 'Payroll')}
                {role === 'auditor' && 'Auditor & Compliance Suite'}
                {role === 'employee' && 'Personal Paystub & Income Statement'}
              </h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {role === 'employer' &&
                  (view === 'payroll'
                    ? 'Review compensation and submit a private, verifiable payroll run via Compact circuit.'
                    : 'Confidential treasury state management with on-chain consensus verifiability.')}
                {role === 'auditor' &&
                  'Mathematically verify state bounds, Compact ZK-SNARK proofs, and compliance records.'}
                {role === 'employee' &&
                  'Inspect your confidential compensation and verify cryptographic Merkle inclusion.'}
              </p>
            </div>

            {/* Role indicator pill */}
            <div className="shrink-0">
              {role === 'employer' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                  Local RAM Witness Active
                </span>
              )}
              {role === 'auditor' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  ZK Verification Mode
                </span>
              )}
              {role === 'employee' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Shielded Recipient View
                </span>
              )}
            </div>
          </div>

          {/* Connection prompt if disconnected */}
          {!wallet.isConnected && (
            <div className="mb-6">
              <WalletConnect
                wallet={wallet}
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                isWalletInstalled={isWalletInstalled}
              />
            </div>
          )}

          {/* Active ZK Proof & Lace Signing Pipeline */}
          {(circuitState.isCalling || circuitState.stage !== 'idle') && (
            <div className="mb-6">
              <ZKPipeline
                stage={circuitState.stage}
                isCalling={circuitState.isCalling}
                txHash={circuitState.txHash}
                signature={circuitState.signature}
              />
            </div>
          )}

          {/* ROLE 1: EMPLOYER / CFO WORKSTATION */}
          {role === 'employer' && (
            <>
              {(view === 'overview' || view === 'payroll') && (
                <PayrollRoster
                  isConnected={wallet.isConnected}
                  onDisburseBatch={async () => onExecute()}
                  isProcessing={circuitState.isCalling}
                  onOpenPaystub={onOpenPaystub}
                />
              )}

              {view === 'proof' && (
                <DualStateDashboard
                  privateWitnessValue={privateWitnessValue}
                  onWitnessChange={onWitnessChange}
                  publicCounterState={publicCounterState}
                  circuitState={circuitState}
                  onExecute={onExecute}
                  isConnected={wallet.isConnected}
                  onOpenPaystub={onOpenPaystub}
                />
              )}

              {view === 'transactions' && (
                <section className="app-card overflow-hidden">
                  <div className="border-b border-[var(--border)] p-6">
                    <h2 className="text-lg font-semibold">Transaction history</h2>
                    <p className="text-sm text-[var(--text-muted)]">Verified payroll state transitions on Midnight Preprod.</p>
                  </div>
                  <div>
                    {circuitState.history.map((tx, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-3 border-b border-[var(--border)] px-6 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex gap-3">
                          <ShieldCheck className="mt-0.5 h-4 w-4 text-[var(--success)]" />
                          <div>
                            <code className="text-sm">{tx.txHash}</code>
                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                              {tx.timestamp} · Verified proof · +{tx.addedValue} State Delta
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            onOpenPaystub({
                              certificateId: `CERT-${i + 10482}`,
                              txHash: tx.txHash,
                              blockTimestamp: tx.timestamp,
                              employeeName: 'Verified recipient',
                              disclosedAmount: tx.addedValue * 100,
                              circuitName: 'processPayrollBatch (Compact v0.31.1)',
                            })
                          }
                          className="app-button-secondary flex items-center justify-center gap-2 px-3 py-2 text-xs cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View statement
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {view === 'developer' && (
                <section className="app-card overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold">Developer settings</h2>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Network and contract configuration for this workspace.
                    </p>
                  </div>
                  <button
                    onClick={() => setTechnical(!technical)}
                    className="flex w-full items-center justify-between border-t border-[var(--border)] px-6 py-4 text-sm cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Contract details
                    </span>
                    {technical ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {technical && (
                    <div className="space-y-4 border-t border-[var(--border)] bg-[var(--surface-1)] p-6">
                      <div>
                        <p className="mb-1 text-xs text-[var(--text-muted)]">Contract ID</p>
                        <code className="break-all text-xs">{PREPROD_CONTRACT_HEX_ID}</code>
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between">
                          <p className="text-xs text-[var(--text-muted)]">Contract address</p>
                          <button
                            onClick={copy}
                            className="flex items-center gap-1 text-xs text-[#a995ff] cursor-pointer"
                          >
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <code className="break-all text-xs">{PREPROD_CONTRACT_ADDRESS}</code>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Public ledger counter</p>
                        <p className="mt-1 text-xl font-semibold">{publicCounterState}</p>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          {/* ROLE 2: AUDITOR / VERIFIER WORKSTATION */}
          {role === 'auditor' && (
            <AuditorView
              circuitState={circuitState}
              publicCounterState={publicCounterState}
              onOpenPaystub={onOpenPaystub}
            />
          )}

          {/* ROLE 3: EMPLOYEE / RECIPIENT WORKSTATION */}
          {role === 'employee' && (
            <EmployeePortal
              onOpenPaystub={onOpenPaystub}
              isConnected={wallet.isConnected}
            />
          )}
        </main>
      </div>
    </div>
  );
};
