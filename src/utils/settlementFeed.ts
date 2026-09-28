export interface SettlementRecord {
  id: string;
  txHash: string;
  blockTimestamp: string;
  circuitName: string;
  recipientCount: number;
  totalDisbursed: number;
  merkleBatchRoot: string;
  status: 'Confirmed' | 'Processing';
  explorerUrl: string;
  network: string;
  organizationId: string;
}

export const INITIAL_SETTLEMENTS: SettlementRecord[] = [
  {
    id: 'set-1',
    txHash: '0x638bc0a26f67691cf961bd99d84c384fbc2859bada9268ee4ccb55a10876ac0d',
    blockTimestamp: 'Block #2,725,434',
    circuitName: 'processPayrollBatch (Compact v0.31.1)',
    recipientCount: 5,
    totalDisbursed: 34500,
    merkleBatchRoot: '0x8849b2c01948ef11029487c889a24410f92e4a1b0c3d5e8f',
    status: 'Confirmed',
    explorerUrl: 'https://preprod.midnightexplorer.com/tx/638bc0a26f67691cf961bd99d84c384fbc2859bada9268ee4ccb55a10876ac0d',
    network: 'Midnight Preprod',
    organizationId: 'ORG-VANSIDIAN-01',
  },
  {
    id: 'set-2',
    txHash: '0x008bf891f27a818f1c899185722add5a8ee2f9969c1f2efbf93e02b5d204fb3591',
    blockTimestamp: 'Block #2,725,420',
    circuitName: 'processPayrollBatch (Compact v0.31.1)',
    recipientCount: 12,
    totalDisbursed: 78200,
    merkleBatchRoot: '0x3f9e4a1b0c3d5e8f8849b2c01948ef11029487c889a24410',
    status: 'Confirmed',
    explorerUrl: 'https://preprod.midnightexplorer.com/tx/008bf891f27a818f1c899185722add5a8ee2f9969c1f2efbf93e02b5d204fb3591',
    network: 'Midnight Preprod',
    organizationId: 'ORG-OBSIDIAN-GLOBAL',
  },
  {
    id: 'set-3',
    txHash: '0xcbd7c6032150647b244c3e8a2483ed22fadaaf72e9c2d98a0af30a543f01b1c2',
    blockTimestamp: 'Block #2,725,389',
    circuitName: 'processPayrollBatch (Compact v0.31.1)',
    recipientCount: 8,
    totalDisbursed: 51000,
    merkleBatchRoot: '0xa1b0c3d5e8f8849b2c01948ef11029487c889a24410f92e4',
    status: 'Confirmed',
    explorerUrl: 'https://preprod.midnightexplorer.com/contracts/0xcbd7c6032150647b244c3e8a2483ed22fadaaf72e9c2d98a0af30a543f01b1c2',
    network: 'Midnight Preprod',
    organizationId: 'ORG-RISEIN-RESEARCH',
  },
];

const STORAGE_KEY = 'vansidian_settlements_v1';

export function loadSettlementFeed(): SettlementRecord[] {
  if (typeof window === 'undefined') return INITIAL_SETTLEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load settlement feed from storage:', e);
  }
  return INITIAL_SETTLEMENTS;
}

export function saveSettlementRecord(record: SettlementRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadSettlementFeed();
    const updated = [record, ...current.filter((item) => item.txHash !== record.txHash)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 20)));
    // Trigger custom event for reactive UI updates
    window.dispatchEvent(new Event('vansidian_settlement_added'));
  } catch (e) {
    console.error('Failed to save settlement record:', e);
  }
}
