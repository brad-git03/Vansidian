import React, { useState } from 'react';
import { PaystubData } from './PaystubModal';
import { 
  User, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  ExternalLink, 
  DollarSign, 
  Calendar, 
  Lock, 
  Check, 
  BadgePercent,
  Search
} from 'lucide-react';

interface EmployeeRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  bonus: number;
  walletPreview: string;
}

const EMPLOYEES: EmployeeRecord[] = [
  { id: 'emp-1', name: 'Sarah Jenkins', role: 'Lead Cryptographer', department: 'Engineering', salary: 8500, bonus: 500, walletPreview: 'mn_addr_preprod14g0...hvm' },
  { id: 'emp-2', name: 'David Kim', role: 'ZK Circuit Architect', department: 'Research', salary: 7400, bonus: 400, walletPreview: 'mn_addr_preprod17t5...fan' },
  { id: 'emp-3', name: 'Elena Rostova', role: 'UI/UX Systems Engineer', department: 'Product', salary: 6200, bonus: 300, walletPreview: 'mn_addr_preprod18hj...5ae' },
  { id: 'emp-4', name: 'Marcus Vance', role: 'Smart Contract Auditor', department: 'Security', salary: 5800, bonus: 200, walletPreview: 'mn_addr_preprod1pkr...2jq' },
  { id: 'emp-5', name: 'Chloe Dupont', role: 'Regulatory Compliance Officer', department: 'Legal', salary: 5100, bonus: 100, walletPreview: 'mn_addr_preprod12q4...jwk' },
];

interface EmployeePortalProps {
  onOpenPaystub: (data: PaystubData) => void;
  isConnected: boolean;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  onOpenPaystub,
  isConnected,
}) => {
  const [selectedId, setSelectedId] = useState<string>('emp-1');
  const [query, setQuery] = useState('');

  const filteredEmployees = EMPLOYEES.filter(
    (e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.role.toLowerCase().includes(query.toLowerCase())
  );

  const selected = EMPLOYEES.find((e) => e.id === selectedId) || EMPLOYEES[0];
  const totalPay = selected.salary + selected.bonus;
  const sampleBatchRoot = '0x8849b2c01948ef11029487c889a24410f92e4a1b0c3d5e8f';
  const sampleTxHash = '0x759f78e3c1b0162367a52a6a9437f64c3dee0f531e8cd83fbbb158d87c95fd07';

  const handleViewPaystub = () => {
    onOpenPaystub({
      certificateId: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      txHash: sampleTxHash,
      blockTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      employeeName: selected.name,
      employeeRole: selected.role,
      disclosedAmount: totalPay,
      batchRootHash: sampleBatchRoot,
      employeeCount: 5,
      circuitName: 'processPayrollBatch (Compact v0.31.1 ZK-SNARK)',
    });
  };

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

      {/* Recipient Selector Pill Strip */}
      <div className="app-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Select Employee Profile / Recipient View
          </p>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-subtle)]" />
            <input
              type="text"
              placeholder="Search team member…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[var(--surface-1)] border border-[var(--border)] rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-[var(--text-subtle)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filteredEmployees.map((emp) => (
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
            </button>
          ))}
        </div>
      </div>

      {/* Main Recipient Details & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Card */}
        <div className="lg:col-span-2 app-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[var(--border)] gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">{selected.name}</h3>
              <p className="text-xs text-[var(--text-muted)]">{selected.role} • {selected.department}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[var(--text-muted)] block">Disbursement Account</span>
              <code className="text-xs text-purple-300 font-mono">{selected.walletPreview}</code>
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
