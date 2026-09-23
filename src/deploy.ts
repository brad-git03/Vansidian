import * as fs from 'node:fs';
import * as path from 'node:path';
import { resolveNetwork, getOrCreateSeed, recordDeployment } from './network.js';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet.js';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import * as Rx from 'rxjs';

import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

// @ts-expect-error WebSocket global polyfill
globalThis.WebSocket = WebSocket;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

const selectedContract = process.env.CONTRACT || 
  (process.argv.find((a) => a.startsWith('--contract='))?.split('=')[1]) ||
  'counter';

const PRIVATE_STATE_ID = `${selectedContract}PrivateState`;

const zkConfigPath = path.resolve(__dirname, '..', 'managed', selectedContract);
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

if (!fs.existsSync(contractPath)) {
  console.error(`\n❌ Contract ${selectedContract} not compiled! Run: npm run compile\n`);
  process.exit(1);
}

const TargetContract = await import(pathToFileURL(contractPath).href);

const defaultWitnesses: Record<string, any> = {
  secretIncrement: (context: any) => [context.privateState, '1'],
  secretSalaryAmount: (context: any) => [context.privateState, 1n],
  secretBatchHash: (context: any) => [context.privateState, new Uint8Array(32)],
  secretBatchTotalAmount: (context: any) => [context.privateState, 1n],
  secretEmployeeCount: (context: any) => [context.privateState, 1n],
  secretSalaryIncrement: (context: any) => [context.privateState, 1n],
};

const compiledContract = CompiledContract.make(selectedContract, TargetContract.Contract).pipe(
  CompiledContract.withWitnesses(defaultWitnesses),
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-Development-Placeholder-1';

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'counter-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log(`║  Deploy Privacy Counter to ${network}`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log('─── Wallet setup ───────────────────────────────────────────────\n');
  const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
  const address = walletCtx.unshieldedKeystore.getBech32Address();
  console.log(`  Wallet Address: ${address}\n`);

  console.log('  Syncing with network...');
  const syncStart = Date.now();
  const syncInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - syncStart) / 1000);
    process.stdout.write(`\r  ⏳ Syncing... (${elapsed}s elapsed)   `);
  }, 3000);
  const state = await walletCtx.wallet.waitForSyncedState();
  clearInterval(syncInterval);
  process.stdout.write('\r  ✓ Synced with network.                                \n\n');

  await persistWalletState(network, walletCtx);

  let balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
  console.log(`  Balance: ${balance.toLocaleString()} tNight\n`);

  if (network !== 'undeployed' && networkConfig.faucet) {
    const initialBalance = await Rx.firstValueFrom(walletCtx.wallet.state().pipe(
      Rx.filter((s) => s.isSynced),
    ));
    const initialTNight = initialBalance.unshielded.balances[unshieldedToken().raw] ?? 0n;
    if (initialTNight === 0n) {
      console.log('─── Fund Wallet ────────────────────────────────────────────────\n');
      console.log(`  Wallet address: ${address}`);
      console.log(`  Faucet:         ${networkConfig.faucet}`);
      console.log('');
      console.log('  Waiting for tNIGHT to arrive (poll every 10s)...');
      const timeoutMs = 600_000;
      const start = Date.now();
      while (true) {
        await new Promise((r) => setTimeout(r, 10_000));
        const s = await Rx.firstValueFrom(walletCtx.wallet.state().pipe(Rx.filter((x) => x.isSynced)));
        const tn = s.unshielded.balances[unshieldedToken().raw] ?? 0n;
        if (tn > 0n) {
          console.log(`\n  Funded! tNIGHT balance: ${tn.toLocaleString()}\n`);
          break;
        }
        if (Date.now() - start > timeoutMs) {
          console.log(`\n  ❌ Funding not received within ${Math.round(timeoutMs / 60_000)} min.`);
          console.log(`  Address: ${address}`);
          console.log(`  Faucet:  ${networkConfig.faucet}`);
          await walletCtx.wallet.stop();
          process.exit(1);
        }
        process.stdout.write(`\r  ...still waiting (${Math.round((Date.now() - start) / 1000)}s elapsed)`);
      }
    }
  }

  // Register NIGHT UTXOs for DUST generation
  console.log('─── DUST Token Setup ───────────────────────────────────────────\n');
  const dustState = await Rx.firstValueFrom(walletCtx.wallet.state().pipe(Rx.filter((s) => s.isSynced)));

  const unregisteredUtxos = dustState.unshielded.availableCoins.filter(
    (c: any) => !c.meta?.registeredForDustGeneration,
  );
  if (unregisteredUtxos.length > 0) {
    console.log(`  Registering ${unregisteredUtxos.length} NIGHT UTXOs for DUST generation...`);
    const recipe = await walletCtx.wallet.registerNightUtxosForDustGeneration(
      unregisteredUtxos,
      walletCtx.unshieldedKeystore.getPublicKey(),
      (payload) => walletCtx.unshieldedKeystore.signData(payload),
    );
    const finalized = await walletCtx.wallet.finalizeRecipe(recipe);
    for (let i = 1; i <= 6; i++) {
      try {
        console.log(`  Submitting DUST registration transaction (attempt ${i}/6)...`);
        await walletCtx.wallet.submitTransaction(finalized);
        console.log('  Submitted DUST registration transaction successfully.');
        break;
      } catch (err: any) {
        console.log(`  Submission attempt ${i} note: ${err?.message || err}. Retrying in 4s...`);
        await new Promise((r) => setTimeout(r, 4000));
      }
    }
  }

  if (dustState.dust.balance(new Date()) === 0n) {
    console.log('  Waiting for DUST tokens to accrue...');
    await Rx.firstValueFrom(
      walletCtx.wallet.state().pipe(
        Rx.throttleTime(5000),
        Rx.filter((s) => s.isSynced),
        Rx.filter((s) => s.dust.balance(new Date()) > 0n),
      ),
    );
  }
  console.log('  DUST tokens ready!\n');

  console.log('─── Deploy Contract ────────────────────────────────────────────\n');
  const providers = await createProviders(walletCtx);

  let deployed: any;
  for (let attempt = 1; attempt <= 15; attempt++) {
    try {
      console.log(`  Deploying contract (attempt ${attempt}/15)...`);
      deployed = await deployContract(providers, {
        compiledContract: compiledContract as any,
        args: [],
        privateStateId: PRIVATE_STATE_ID,
        initialPrivateState: {},
      });
      break;
    } catch (err: any) {
      const msg = err?.message || err?.toString() || '';
      console.log(`  Attempt ${attempt} note: ${msg}. Retrying in 6s...`);
      await new Promise((r) => setTimeout(r, 6000));
    }
  }
  if (!deployed) {
    throw new Error('Failed to deploy contract after 15 attempts');
  }

  const contractAddress = deployed.deployTxData.public.contractAddress;
  console.log(`\n  ✅ ${selectedContract.toUpperCase()} Contract deployed successfully!`);
  console.log(`  Hex Contract ID:  ${contractAddress}`);
  console.log(`  Deployer Wallet:  ${address.toString()}`);
  const explorerBase = network === 'preview' ? 'https://preview.midnightexplorer.com' : 'https://preprod.midnightexplorer.com';
  console.log(`  Midnight Explorer: ${explorerBase}/contract/${contractAddress}\n`);

  recordDeployment(network, contractAddress, address.toString());
  await persistWalletState(network, walletCtx);
  await walletCtx.wallet.stop();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
