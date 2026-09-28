export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  bonus: number;
  preprodAddress: string;
}

export const INITIAL_PREPROD_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Sarah Jenkins',
    role: 'Lead Cryptographer',
    department: 'Engineering',
    salary: 8500,
    bonus: 500,
    preprodAddress: 'mn_addr_preprod14g0smfdj6hjjkcd5hjh43xkra9q78zgfluqh7zzz6gy42y24f3jsc8chvm',
  },
  {
    id: 'emp-2',
    name: 'David Kim',
    role: 'ZK Circuit Architect',
    department: 'Research',
    salary: 7400,
    bonus: 400,
    preprodAddress: 'mn_addr_preprod17t55208u3rlzyw5u0l6g07v6lm5r8r9kyehrj4n7828zlxfcy0gqzs8fan',
  },
  {
    id: 'emp-3',
    name: 'Elena Rostova',
    role: 'UI/UX Systems Engineer',
    department: 'Product',
    salary: 6200,
    bonus: 300,
    preprodAddress: 'mn_addr_preprod18hjmk46qx4un7fv44sxcqf8py3ksvmnr3pq2zfdp4zll5mjsqcws7lf5ae',
  },
  {
    id: 'emp-4',
    name: 'Marcus Vance',
    role: 'Smart Contract Auditor',
    department: 'Security',
    salary: 5800,
    bonus: 200,
    preprodAddress: 'mn_addr_preprod1pkrvzy4x26u2pqgej6cdt4m2ymdvt0m3kesf3afn82wfgmtp94lsqjv2jq',
  },
  {
    id: 'emp-5',
    name: 'Chloe Dupont',
    role: 'Regulatory Compliance Officer',
    department: 'Legal',
    salary: 5100,
    bonus: 100,
    preprodAddress: 'mn_addr_preprod12q4hfav42k9ma4kyjcsyacj4un3kmcxe6pa9dd6590nuy8emvwus9vmjwk',
  },
];

const STORAGE_KEY = 'vansidian_team_roster_v2';

export function loadTeamRoster(): Employee[] {
  if (typeof window === 'undefined') return INITIAL_PREPROD_EMPLOYEES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load team roster from storage:', e);
  }
  return INITIAL_PREPROD_EMPLOYEES;
}

export function saveTeamRoster(employees: Employee[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch (e) {
    console.error('Failed to save team roster:', e);
  }
}

export function resetTeamRoster(): Employee[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INITIAL_PREPROD_EMPLOYEES;
}

export function isValidPreprodAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  return (
    trimmed.startsWith('mn_addr_preprod1') ||
    trimmed.startsWith('mn_preprod') ||
    trimmed.startsWith('0x') ||
    trimmed.length >= 40
  );
}

export function formatAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 22) return address;
  return `${address.slice(0, 16)}...${address.slice(-8)}`;
}

export const FAUCET_URL = 'https://midnight-tmnight-preprod.nethermind.dev';
