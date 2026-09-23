// Network management for Midnight network
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export type NetworkId = 'undeployed' | 'preview' | 'preprod';

export const NETWORK_IDS: readonly NetworkId[] = ['undeployed', 'preview', 'preprod'] as const;

export interface NetworkConfig {
  networkId: NetworkId;
  indexer: string;
  indexerWS: string;
  node: string;
  proofServer: string;
  faucet: string | null;
  composeServices: string[];
}

export interface DeploymentRecord {
  address: string;
  deployedAt: string;
  deployer: string;
}

export interface NetworkState {
  version: 1;
  activeNetwork: NetworkId;
  wallets: Partial<Record<NetworkId, { seed: string; createdAt: string }>>;
  deployments: Partial<Record<NetworkId, DeploymentRecord>>;
}

export const STATE_FILE_NAME = '.midnight-state.json';
export const STATE_VERSION = 1 as const;

export const NETWORK_CONFIGS: Record<NetworkId, NetworkConfig> = {
  undeployed: {
    networkId: 'undeployed',
    indexer:   'http://127.0.0.1:8088/api/v4/graphql',
    indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
    node:      'ws://127.0.0.1:9944',
    proofServer: 'http://127.0.0.1:6300',
    faucet: null,
    composeServices: ['node', 'indexer', 'proof-server'],
  },
  preview: {
    networkId: 'preview',
    indexer:   'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    node:      'https://rpc.preview.midnight.network',
    proofServer: 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preview.nethermind.dev',
    composeServices: ['proof-server'],
  },
  preprod: {
    networkId: 'preprod',
    indexer:   'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    node:      'https://rpc.preprod.midnight.network',
    proofServer: 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preprod.nethermind.dev',
    composeServices: ['proof-server'],
  },
};

export function normalizeNetworkId(v: unknown): NetworkId | null {
  if (typeof v !== 'string') return null;
  const clean = v.toLowerCase().trim();
  if (clean === 'preprod' || clean === 'prepod') return 'preprod';
  if (clean === 'preview') return 'preview';
  if (clean === 'undeployed' || clean === 'local' || clean === 'devnet') return 'undeployed';
  return null;
}

export function isNetworkId(v: unknown): v is NetworkId {
  return normalizeNetworkId(v) !== null;
}

export interface FsOptions {
  cwd?: string;
}

function statePath(opts: FsOptions = {}): string {
  return path.join(opts.cwd ?? process.cwd(), STATE_FILE_NAME);
}

export function loadState(opts: FsOptions = {}): NetworkState | null {
  const p = statePath(opts);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Failed to parse ${p}: ${(e as Error).message}.`);
  }
  return parsed as NetworkState;
}

export function saveState(state: NetworkState, opts: FsOptions = {}): void {
  const p = statePath(opts);
  const tmp = `${p}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`);
  fs.renameSync(tmp, p);
}

export function parseNetworkFlag(argv: string[]): NetworkId | null {
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--network') {
      const v = argv[i + 1];
      if (v === undefined) throw new Error('--network requires a value');
      const normalized = normalizeNetworkId(v);
      if (!normalized) {
        throw new Error(`Unknown network: ${v}. Supported: ${NETWORK_IDS.join(', ')}.`);
      }
      return normalized;
    }
    if (arg.startsWith('--network=')) {
      const v = arg.slice('--network='.length);
      const normalized = normalizeNetworkId(v);
      if (!normalized) {
        throw new Error(`Unknown network: ${v}. Supported: ${NETWORK_IDS.join(', ')}.`);
      }
      return normalized;
    }
  }
  return null;
}

export interface ResolveOptions {
  argv?: string[];
  env?: NodeJS.ProcessEnv;
  cwd?: string;
}

export type ResolveSource = 'flag' | 'state' | 'default';

export interface ResolveResult {
  network: NetworkId;
  config: NetworkConfig;
  source: ResolveSource;
}

export function resolveNetwork(opts: ResolveOptions = {}): ResolveResult {
  const argv = opts.argv ?? process.argv;
  const env = opts.env ?? process.env;
  const cwd = opts.cwd ?? process.cwd();

  const flag = parseNetworkFlag(argv);
  let network: NetworkId;
  let source: ResolveSource;

  if (flag) {
    network = flag;
    source = 'flag';
  } else {
    const state = loadState({ cwd });
    if (state) {
      network = state.activeNetwork;
      source = 'state';
    } else {
      network = 'undeployed';
      source = 'default';
    }
  }

  const config = NETWORK_CONFIGS[network];
  return { network, config, source };
}

export const GENESIS_SEED = '0000000000000000000000000000000000000000000000000000000000000001';

export function getOrCreateSeed(network: NetworkId, opts: FsOptions = {}): string {
  const cwd = opts.cwd ?? process.cwd();
  if (network === 'undeployed') return GENESIS_SEED;
  const existing = loadState({ cwd });
  const persisted = existing?.wallets?.[network]?.seed;
  if (persisted) return persisted;

  const seed = crypto.randomBytes(32).toString('hex');
  const next: NetworkState = existing ?? {
    version: STATE_VERSION,
    activeNetwork: network,
    wallets: {},
    deployments: {},
  };
  next.activeNetwork = network;
  next.wallets = {
    ...next.wallets,
    [network]: { seed, createdAt: new Date().toISOString() },
  };
  saveState(next, { cwd });
  return seed;
}

export function recordDeployment(
  network: NetworkId,
  address: string,
  deployer: string,
  opts: FsOptions = {},
): void {
  const cwd = opts.cwd ?? process.cwd();
  const existing = loadState({ cwd });
  const next: NetworkState = existing ?? {
    version: STATE_VERSION,
    activeNetwork: network,
    wallets: {},
    deployments: {},
  };
  next.deployments = {
    ...next.deployments,
    [network]: { address, deployer, deployedAt: new Date().toISOString() },
  };
  saveState(next, { cwd });
}

export function setActiveNetwork(network: NetworkId, opts: FsOptions = {}): void {
  const cwd = opts.cwd ?? process.cwd();
  const existing = loadState({ cwd });
  const next: NetworkState = existing ?? {
    version: STATE_VERSION,
    activeNetwork: network,
    wallets: {},
    deployments: {},
  };
  next.activeNetwork = network;
  saveState(next, { cwd });
}

function isMain(): boolean {
  try {
    const here = fileURLToPath(import.meta.url);
    const invoked = process.argv[1] && fs.realpathSync(process.argv[1]);
    return invoked === fs.realpathSync(here);
  } catch {
    return false;
  }
}

if (isMain()) {
  const candidate = process.argv[2];
  if (candidate && isNetworkId(candidate)) {
    setActiveNetwork(candidate);
    console.log(`Active network set to: ${candidate}`);
  } else {
    const res = resolveNetwork();
    console.log(`Active network: ${res.network}`);
  }
}
