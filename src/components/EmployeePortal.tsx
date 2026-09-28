import React, { useState, useEffect } from 'react';
import { PaystubData } from './PaystubModal';
import { PREPROD_CONTRACT_ADDRESS } from '../hooks/useMidnight';
import { 
  Employee, 
  loadTeamRoster, 
  formatAddress 
} from '../utils/teamRoster';
import { 
  User, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Calendar, 
  Lock, 
  Check, 
  Search,
  Copy,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface EmployeePortalProps {
  onOpenPaystub: (data: PaystubData) => void;
  isConnected: boolean;
  connectedAddress?: string | null;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  onOpenPaystub,
  isConnected,
  connectedAddress,
}) => {
  const [employees, setEmployees] = useState<Employee[]>(() => loadTeamRoster());
  const [selectedId, setSelectedId] = useState<string>('emp-1');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [matchedEmployee, setMatchedEmployee] = useState<Employee | null>(null);

  // Re-load team roster when component mounts
  useEffect(() => {
    setEmployees(loadTeamRoster());
  }, []);

  // Match connected wallet address to team roster
  useEffect(() => {
    if (connectedAddress && employees.length > 0) {
      const cleanConnected = connectedAddress.trim().toLowerCase();
      const match = employees.find(
        (e) => e.preprodAddress.toLowerCase() === cleanConnected
      );
      if (match) {
        setMatchedEmployee(match);
        setSelectedId(match.id);
      } else {
        setMatchedEmployee(null);
      }
    } else {
      setMatchedEmployee(null);
    }
  }, [connectedAddress, employees]);

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.role.toLowerCase().includes(query.toLowerCase()) ||
      e.preprodAddress.toLowerCase().includes(query.toLowerCase())
  );

  const selected = employees.find((e) => e.id === selectedId) || employees[0];
  const totalPay = selected ? selected.salary + selected.bonus : 0;
  const sampleBatchRoot = '0x8849b2c01948ef11029487c889a24410f92e4a1b0c3d5e8f';
  const sampleTxHash = PREPROD_CONTRACT_ADDRESS;

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewPaystub = () => {
    if (!selected) return;
    onOpenPaystub({
      certificateId: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      txHash: sampleTxHash,
      blockTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      employeeName: selected.name,
      employeeRole: selected.role,
      disclosedAmount: totalPay,
      batchRootHash: sampleBatchRoot,
      employeeCount: employees.length,
      circuitName: 'processPayrollBatch (Compact v0.31.1 ZK-SNARK)',
    });
  };

  if (!selected) {
    return <div className="p-6 text-center text-sm text-[var(--text-muted)]">No employee records found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="app-card border-l-4 border-l-[#a995ff] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[var(--brand-soft)] text-[#a995ff]">
              <User className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-semibold text-white">Employee Self-Service Portal</h2>
            <span className="status-success text-xs px-2.5 py-0.5 rounded-full font-mono">
              Confidential Recipient
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Inspect your private earnings, verify cryptographic inclusion in the batch settlement, and download verified income statements.
          </p>
        </div>

        <button
          onClick={handleViewPaystub}
          className="app-button-primary flex items-center gap-2 px-4 py-2.5 text-xs font-semibold shrink-0 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Official Paystub</span>
        </button>
      </div>

      {/* Connected Wallet Identity Verification Status */}
      {isConnected && connectedAddress && (
        <div className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          matchedEmployee 
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
            : 'bg-purple-950/20 border-purple-500/30 text-purple-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {matchedEmployee ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#a995ff] shrink-0" />
            )}
            <div>
              <p className="font-semibold text-white">
                {matchedEmployee
                  ? `Identity Verified: Logged in as ${matchedEmployee.name} (${matchedEmployee.role})`
                  : 'Connected Lace Wallet Detected'}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5 break-all">
                {connectedAddress}
              </p>
            </div>
          </div>

          {matchedEmployee ? (
            <span className="shrink-0 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg font-mono text-[11px] font-semibold border border-emerald-500/40">
              Active Payee
            </span>
          ) : (
            <span className="shrink-0 text-[11px] text-[var(--text-muted)]">
              (Viewing demo profiles or switch wallet)
            </span>
          )}
        </div>
      )}

      {/* Recipient Selector Pill Strip */}
      <div className="app-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Select Employee Profile / Recipient View
          </p>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-subtle)]" />
            <input
              type="text"
              placeholder="Search team member or Preprod address…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[var(--surface-1)] border border-[var(--border)] rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-[var(--text-subtle)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filteredEmployees.map((emp) => {
            const isSelf = connectedAddress && emp.preprodAddress.toLowerCase() === connectedAddress.toLowerCase();
            return (
              <button
                key={emp.id}
                onClick={() => setSelectedId(emp.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  selectedId === emp.id
                    ? 'bg-[var(--brand-soft)] border border-[#a995ff]/50 text-white'
                    : 'bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${selectedId === emp.id ? 'bg-[#a995ff]' : 'bg-slate-600'}`}></span>
                <span>{emp.name}</span>
                {isSelf && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                    You
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Recipient Details & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Card */}
        <div className="lg:col-span-2 app-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-5 border-b border-[var(--border)] gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {selected.name}
                {connectedAddress && selected.preprodAddress.toLowerCase() === connectedAddress.toLowerCase() && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
                    Verified Wallet
                  </span>
                )}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {selected.role} • {selected.department}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-[var(--text-muted)] block">Disbursement Preprod Address</span>
              <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                <code className="text-xs text-purple-300 font-mono" title={selected.preprodAddress}>
                  {formatAddress(selected.preprodAddress)}
                </code>
                <button
                  onClick={() => handleCopyAddress(selected.preprodAddress)}
                  className="text-[var(--text-muted)] hover:text-white p-1 rounded transition-colors cursor-pointer"
                  title="Copy full Preprod address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--surface-1)] rounded-xl border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] block">Base Salary</span>
              <p className="mt-1 text-xl font-bold font-mono text-white">${selected.salary.toLocaleString()}</p>
              <span className="text-[11px] text-[var(--text-muted)]">Monthly Gross</span>
            </div>

            <div className="p-4 bg-[var(--surface-1)] rounded-xl border border-[var(--border)]">
              <span className="text-xs text-[var(--text-muted)] block">Performance Incentive</span>
              <p className="mt-1 text-xl font-bold font-mono text-[#73d7aa]">+${selected.bonus.toLocaleString()}</p>
              <span className="text-[11px] text-[var(--text-muted)]">Verified Merit Bonus</span>
            </div>

            <div className="p-4 bg-[var(--surface-1)] rounded-xl border border-[#a995ff]/30 bg-purple-950/20">
              <span className="text-xs text-[#a995ff] block font-semibold">Net Payout Amount</span>
              <p className="mt-1 text-xl font-bold font-mono text-white">${totalPay.toLocaleString()}</p>
              <span className="text-[11px] text-[#73d7aa] flex items-center gap-1">
                <Check className="w-3 h-3" /> Fully Funded
              </span>
            </div>
          </div>

          {/* Statement Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">
              Need proof of income for banking, housing, or compliance?
            </p>
            <button
              onClick={handleViewPaystub}
              className="app-button-secondary w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#a995ff]" />
              <span>Print / Download PDF Paystub</span>
            </button>
          </div>
        </div>

        {/* Cryptographic Inclusion & Privacy Guarantee */}
        <div className="app-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm">Merkle Inclusion Proof</h4>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Your compensation was processed in a batch transaction using Midnight's Compact ZK circuit.
          </p>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-[var(--surface-1)] rounded-lg border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] block font-sans">Batch Settlement Root</span>
              <code className="text-[#b7a8ff] text-[11px] break-all">{sampleBatchRoot}</code>
            </div>

            <div className="p-3 bg-[var(--surface-1)] rounded-lg border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] block font-sans">Cryptographic Invariant</span>
              <span className="text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Leaf Included in Merkle Tree
              </span>
            </div>

            <div className="p-3 bg-[var(--surface-1)] rounded-lg border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] block font-sans">Privacy Status</span>
              <span className="text-purple-300 flex items-center gap-1 mt-0.5 font-sans">
                <Lock className="w-3.5 h-3.5" /> Co-worker compensation shielded
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Statements History */}
      <section className="app-card overflow-hidden">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Disbursement Statements & History</h3>
            <p className="text-xs text-[var(--text-muted)]">Archived pay periods for {selected.name}</p>
          </div>
          <span className="text-xs text-[var(--text-muted)]">3 Verified Statements</span>
        </div>

        <div className="divide-y divide-[var(--border)] text-xs">
          {[
            { period: 'September 2026', amount: totalPay, status: 'Settled', date: 'Sep 30, 2026' },
            { period: 'August 2026', amount: totalPay, status: 'Settled', date: 'Aug 31, 2026' },
            { period: 'July 2026', amount: selected.salary, status: 'Settled', date: 'Jul 31, 2026' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-[var(--surface-3)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--surface-1)] rounded-lg text-[#a995ff]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-white">{item.period}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{item.date} • {item.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-semibold text-white">${item.amount.toLocaleString()}</span>
                <button
                  onClick={handleViewPaystub}
                  className="app-button-secondary px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#a995ff]" />
                  <span>Statement</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
