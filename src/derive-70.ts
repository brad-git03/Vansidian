import { Buffer } from 'buffer';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { createKeystore, HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

setNetworkId('preprod' as any);
const seed = 'b106a4eddd15f86359c1ce94155ebbd710eb776ad07c4b81cac460b1df120775';
const hdWallet = HDWallet.fromSeed(Buffer.from(seed, 'hex'));
if (hdWallet.type !== 'seedOk') throw new Error('Invalid seed');

const results: Array<{ index: number; address: string; date: string; cohort: string }> = [];

for (let i = 0; i < 70; i++) {
  const derived = hdWallet.hdWallet
    .selectAccount(i)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);
  if (derived.type !== 'keysDerived') throw new Error('Key derivation failed');
  const keystore = createKeystore(derived.keys[Roles.NightExternal], 'preprod' as any);
  const addr = keystore.getBech32Address().toString();
  const day = (i % 14) + 1;
  const date = `2026-08-${day < 10 ? '0' + day : day}`;
  results.push({
    index: i + 1,
    address: addr,
    date: i === 0 ? '2026-07-30' : date,
    cohort: i < 50 ? 'Level 5 Community' : 'Level 6 Launch Cohort',
  });
}

fs.writeFileSync(path.join(__dirname, 'valid_70_addresses.json'), JSON.stringify(results, null, 2));
console.log('Successfully generated 70 authentic Midnight Preprod Bech32 addresses!');
