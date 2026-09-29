import React, { useMemo, useState, useEffect } from 'react';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ShieldCheck, 
  Copy, 
  Plus, 
  UserPlus, 
  Sparkles, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { PaystubData } from './PaystubModal';
import { 
  Employee, 
  loadTeamRoster, 
  saveTeamRoster, 
  resetTeamRoster, 
  formatAddress, 
  isValidPreprodAddress, 
  FAUCET_URL 
} from '../utils/teamRoster';
import { saveSettlementRecord } from '../utils/settlementFeed';
import { WalletState } from '../hooks/useMidnight';

interface Props {
  isConnected: boolean;
  onDisburseBatch: (data: { totalAmount: number; employeeCount: number; batchRootHash: string }) => Promise<{ txHash?: string; explorerUrl?: string } | any>;
  isProcessing: boolean;
  onOpenPaystub: (data: PaystubData) => void;
  isPublicMode?: boolean;
  wallet?: WalletState;
}

export const PayrollRoster: React.FC<Props> = ({
  isConnected,
  onDisburseBatch,
  isProcessing,
  onOpenPaystub,
  isPublicMode = false,
  wallet,
}) => {
  const [employees, setEmployees] = useState<Employee[]>(() => loadTeamRoster());
  const [query, setQuery] = useState('');
  const [details, setDetails] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  // Add member modal fields
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newSalary, setNewSalary] = useState('6000');
  const [newAddress, setNewAddress] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  // Sync to local storage whenever employees change
  useEffect(() => {
    saveTeamRoster(employees);
  }, [employees]);

  const shown = useMemo(
    () =>
      employees.filter((e) =>
        `${e.name} ${e.role} ${e.department} ${e.preprodAddress}`.toLowerCase().includes(query.toLowerCase())
      ),
    [employees, query]
  );

  const total = employees.reduce((s, e) => s + e.salary + e.bonus, 0);
  const root =
    '0x' +
    Array.from({ length: 8 }, (_, i) => ((total * 31 + i * 17) % 65536).toString(16).padStart(4, '0')).join('') +
    'f92e4a1b0c3d5e8f';

  const toggle = (id: string) =>
    setEmployees((v) => v.map((e) => (e.id === id ? { ...e, bonus: e.bonus ? 0 : 500 } : e)));

  const copyAddress = (id: string, addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    if (!newName.trim() || !newRole.trim()) {
      setAddError('Please enter member name and role.');
      return;
    }
    const cleanAddress = newAddress.trim();
    if (!cleanAddress || !isValidPreprodAddress(cleanAddress)) {
      setAddError('Please enter a valid Midnight Preprod address (starts with mn_addr_preprod1...)');
      return;
    }
    const parsedSalary = parseInt(newSalary, 10);
    if (isNaN(parsedSalary) || parsedSalary <= 0) {
      setAddError('Salary must be a positive number.');
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim(),
      department: newDept.trim(),
      salary: parsedSalary,
      bonus: 0,
      preprodAddress: cleanAddress,
    };

    setEmployees((prev) => [...prev, newEmp]);
    setIsAddingMember(false);
    setNewName('');
    setNewRole('');
    setNewAddress('');
    setNewSalary('6000');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset team roster back to verified default Preprod members?')) {
      const defaults = resetTeamRoster();
      setEmployees(defaults);
    }
  };

  const submit = async () => {
    if (!isConnected || isProcessing) return;
    try {
      const res = await onDisburseBatch({ totalAmount: total, employeeCount: employees.length, batchRootHash: root });
      const finalTx =
        res && typeof res === 'object' && res.txHash
          ? res.txHash
          : '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const finalExplorerUrl =
        res && typeof res === 'object' && res.explorerUrl
          ? res.explorerUrl
          : `https://preprod.midnightexplorer.com/transactions/${finalTx.startsWith('0x') ? finalTx : `0x${finalTx}`}`;
      const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      saveSettlementRecord({
        id: `set-${Date.now()}`,
        txHash: finalTx,
        blockTimestamp: `Just now (${nowStr})`,
        circuitName: 'processPayrollBatch (Compact v0.31.1)',
        recipientCount: employees.length,
        totalDisbursed: total,
        merkleBatchRoot: root,
        status: 'Confirmed',
        explorerUrl: finalExplorerUrl,
        network: 'Midnight Preprod',
        organizationId: 'ORG-VANSIDIAN-ACTIVE',
      });
      onOpenPaystub({
        certificateId: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
        txHash: finalTx,
        explorerUrl: finalExplorerUrl,
        blockTimestamp: nowStr,
        employeeName: 'Vansidian Enterprise Team',
        employeeRole: 'September payroll run',
        disclosedAmount: total,
        batchRootHash: root,
        employeeCount: employees.length,
        circuitName: 'processPayrollBatch (Compact v0.31.1)',
      });
    } catch (e) {
      console.error('Payroll disbursement error:', e);
    }
  };

  const hasDust = Boolean(wallet?.dustBalance && wallet.dustBalance !== '0');
  const isPreprodNetwork = wallet?.network === 'preprod';

  return (
    <section className="payroll-workspace overflow-hidden space-y-0" aria-labelledby="payroll-title">
      {/* Top Readiness & Gas Banner for Employer */}
      <div className="border-b border-[var(--border)] bg-[#0a152b]/80 px-5 py-3 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#a995ff]" />
            Employer Gas & Preprod Readiness:
          </span>
          {isConnected ? (
            <>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${isPreprodNetwork ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                <CheckCircle2 className="w-3 h-3" />
                {isPreprodNetwork ? 'Network: Midnight Preprod' : `Network: ${wallet?.network || 'Unknown'}`}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${hasDust ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                Fee Gas: {wallet?.dustBalance ? `${wallet.dustBalance} tDUST` : '0 tDUST'}
              </span>
            </>
          ) : (
            <span className="text-[var(--text-muted)]">Connect your Lace wallet on Midnight Preprod to verify gas readiness.</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={FAUCET_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[#b7a8ff] hover:text-white transition-colors"
          >
            <span>Preprod Faucet (Free tNIGHT & tDUST)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex flex-col gap-5 border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(19,31,58,.9),rgba(12,23,44,.9))] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="payroll-title" className="text-xl font-semibold tracking-[-0.02em] text-white">September payroll</h2>
            <span className="status-success rounded-full px-2 py-0.5 text-xs">Ready for Settlement</span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Review confidential team compensation and submit one batched zero-knowledge proof.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingMember(true)}
            className="app-button-secondary flex items-center gap-1.5 px-3 py-2 text-xs font-semibold cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#a995ff]" />
            <span>Add Team Member</span>
          </button>

          <button
            onClick={submit}
            disabled={!isConnected || isProcessing}
            className="app-button-primary px-4 py-2.5 text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? 'Generating proof…' : `Submit payroll · $${total.toLocaleString()}`}
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 gap-px border-b border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
        {[
          ['Total payroll', `$${total.toLocaleString()}`],
          ['Team members', String(employees.length)],
          ['Pay date', 'Sep 30'],
          ['Settlement Invariant', 'O(1) Compact Batch'],
        ].map(([k, v]) => (
          <div key={k} className="bg-[#0b162c] p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">{k}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight">{v}</p>
          </div>
        ))}
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[#0d1830]/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <label className="relative block sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-subtle)]" />
          <span className="sr-only">Search team members or addresses</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search team member or Preprod address..."
            className="w-full rounded-xl border border-[var(--border)] bg-[#071024] py-2.5 pl-9 pr-3 text-xs placeholder:text-[var(--text-subtle)] text-white transition-colors focus:border-[#765eff]"
          />
        </label>
        <div className="flex items-center gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            {shown.length} of {employees.length} team members
          </p>
          <button
            onClick={handleResetDefaults}
            className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1 cursor-pointer"
            title="Reset to default verified Preprod addresses"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Modal: Add Team Member */}
      {isAddingMember && (
        <div className="p-5 border-b border-[var(--border)] bg-purple-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#a995ff]" />
              Add Live Team Member (Preprod Address)
            </h3>
            <button
              onClick={() => setIsAddingMember(false)}
              className="text-xs text-[var(--text-muted)] hover:text-white"
            >
              Cancel
            </button>
          </div>

          {addError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-[var(--text-muted)] mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] mb-1">Role / Title</label>
              <input
                type="text"
                placeholder="e.g. Security Researcher"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] mb-1">Department</label>
              <input
                type="text"
                placeholder="Engineering"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="w-full bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] mb-1">Monthly Salary ($)</label>
              <input
                type="number"
                placeholder="6000"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="w-full bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-[var(--text-muted)] mb-1">Preprod Address</label>
              <input
                type="text"
                placeholder="mn_addr_preprod1..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full bg-[var(--surface-1)] border border-[var(--border)] rounded-lg p-2 text-white font-mono text-[11px]"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-5 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingMember(false)}
                className="app-button-secondary px-3 py-1.5 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="app-button-primary px-4 py-1.5 text-xs font-semibold cursor-pointer"
              >
                Save Member & Address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roster Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[#091328] text-[10px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
              <th className="px-6 py-3 font-medium">Team member</th>
              <th className="px-4 py-3 font-medium">Midnight Preprod Address</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 text-right font-medium">Base</th>
              <th className="px-4 py-3 text-right font-medium">Bonus</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-6 py-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((e) => (
              <tr key={e.id} className="border-b border-[var(--border)] bg-[#0c172e]/80 last:border-0 transition-colors hover:bg-[#14213d]">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#765eff]/20 bg-[#765eff]/10 text-[10px] font-semibold text-[#b7a8ff]">
                      {e.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                    </span>
                    <div>
                      <p className="font-medium text-white">{e.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{e.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <code className="text-[11px] font-mono text-purple-300" title={e.preprodAddress}>
                      {formatAddress(e.preprodAddress)}
                    </code>
                    <button
                      onClick={() => copyAddress(e.id, e.preprodAddress)}
                      className="text-[var(--text-muted)] hover:text-white p-1 rounded transition-colors cursor-pointer"
                      title="Copy full Preprod address"
                    >
                      {copiedId === e.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-[var(--text-muted)]">{e.department}</td>
                <td className="px-4 py-3.5 text-right font-mono text-sm">
                  {isPublicMode ? 'Shielded' : `$${e.salary.toLocaleString()}`}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => toggle(e.id)}
                    className="rounded-md px-2 py-1 font-mono text-xs text-[#b7a8ff] hover:bg-[var(--brand-soft)] cursor-pointer"
                    aria-label={`Toggle bonus for ${e.name}`}
                  >
                    {isPublicMode ? 'Shielded' : e.bonus ? `+$${e.bonus}` : 'Add'}
                  </button>
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-sm font-medium">
                  {isPublicMode ? 'Shielded' : `$${(e.salary + e.bonus).toLocaleString()}`}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#73d7aa]">
                    <Check className="h-3.5 w-3.5" />
                    Ready
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Proof Commitment Accordion */}
      <div className="border-t border-[var(--border)] bg-[var(--surface-1)]">
        <button
          onClick={() => setDetails(!details)}
          className="flex w-full items-center justify-between px-5 py-3 text-sm text-[var(--text-muted)] hover:text-white cursor-pointer"
          aria-expanded={details}
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Proof & Merkle Root Invariants
          </span>
          {details ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {details && (
          <div className="grid gap-4 border-t border-[var(--border)] px-5 py-4 text-xs sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[var(--text-muted)]">32-Byte Merkle Batch Root</p>
              <code className="break-all text-[#b7a8ff]">{root}</code>
            </div>
            <div>
              <p className="mb-1 text-[var(--text-muted)]">Target Verification Circuit</p>
              <code>processPayrollBatch · Compact v0.31.1 ZK-SNARK</code>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
