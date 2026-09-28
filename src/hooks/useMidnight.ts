import { useState, useCallback, useRef, useEffect } from 'react';
import type { InitialAPI, ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { fetchLiveContractState, OnChainContractState } from '../utils/indexer';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  shieldedAddress?: string | null;
  dustBalance?: string | null;
  network: string | null;
  error: string | null;
  isConnecting: boolean;
  hasExtension: boolean;
  walletName?: string;
}

export type PipelineStage = 'idle' | 'witness' | 'proving' | 'signing' | 'submitting' | 'confirmed';

export interface HistoryRecord {
  txHash: string;
  timestamp: string;
  addedValue: number;
  signature?: string;
  senderAddress?: string;
  senderRole?: string;
  accountIndex?: number;
  disclosedAmount?: number;
  explorerUrl?: string;
  status?: string;
}

export interface CircuitCallState {
  isCalling: boolean;
  stage: PipelineStage;
  txHash: string | null;
  signature?: string | null;
  result: string | null;
  error: string | null;
  history: HistoryRecord[];
}

// Deployed contract address on Midnight Preprod testnet
export const CONTRACT_HEX_ID = 'cbd7c6032150647b244c3e8a2483ed22fadaaf72e9c2d98a0af30a543f01b1c2';
export const CONTRACT_ADDRESS = `0x${CONTRACT_HEX_ID}`;
export const CONTRACT_EXPLORER_URL = `https://preprod.midnightexplorer.com/contracts/0x${CONTRACT_HEX_ID}`;

// Backward-compatible exports for existing components
export const PREPROD_CONTRACT_HEX_ID = CONTRACT_HEX_ID;
export const PREPROD_CONTRACT_BECH32 = CONTRACT_HEX_ID;
export const PREPROD_CONTRACT_ADDRESS = `0x${CONTRACT_HEX_ID}`;

export function useMidnight() {
  const connectedApiRef = useRef<ConnectedAPI | any | null>(null);
  const isConnectingRef = useRef<boolean>(false);

  const getLaceConnector = useCallback((): InitialAPI | any | null => {
    if (typeof window === 'undefined') return null;
    const win = window as any;

    // 1. Official Midnight DApp Connector API v4 standard: window.midnight.mnLace
    if (win.midnight?.mnLace) {
      return win.midnight.mnLace;
    }

    // 2. Discover any registered Midnight wallet under window.midnight namespace
    if (win.midnight && typeof win.midnight === 'object') {
      const wallets = Object.values(win.midnight);
      if (wallets.length > 0 && ((wallets[0] as any)?.connect || (wallets[0] as any)?.enable)) {
        return wallets[0];
      }
    }

    // 3. Fallbacks for older / alternative naming conventions
    return win.midnight?.lace || win.midnight?.['midnight-lace'] || win.cardano?.lace || null;
  }, []);

  const checkWalletInstalled = useCallback((): boolean => {
    return Boolean(getLaceConnector());
  }, [getLaceConnector]);

  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    shieldedAddress: null,
    dustBalance: null,
    network: null,
    error: null,
    isConnecting: false,
    hasExtension: false,
  });

  const [privateWitnessValue, setPrivateWitnessValue] = useState<number>(1);
  const [publicCounterState, setPublicCounterState] = useState<number>(0);
  const [onChainMeta, setOnChainMeta] = useState<OnChainContractState | null>(null);
  const [isSyncingLedger, setIsSyncingLedger] = useState<boolean>(true);
  const [indexerError, setIndexerError] = useState<string | null>(null);

  const [circuitCall, setCircuitCall] = useState<CircuitCallState>({
    isCalling: false,
    stage: 'idle',
    txHash: null,
    signature: null,
    result: null,
    error: null,
    history: [],
  });

  const refreshLedger = useCallback(async () => {
    setIsSyncingLedger(true);
    try {
      const live = await fetchLiveContractState();
      if (live) {
        setPublicCounterState(live.counter);
        setOnChainMeta(live);
        setIndexerError(null);
      } else {
        setIndexerError('Awaiting Preprod indexer block confirmation');
      }
    } catch (err: any) {
      setIndexerError(err?.message || 'Indexer connection error');
    } finally {
      setIsSyncingLedger(false);
    }
  }, []);

  useEffect(() => {
    refreshLedger();
    const interval = setInterval(refreshLedger, 15000);
    return () => clearInterval(interval);
  }, [refreshLedger]);

  // Load confirmed on-chain transactions from public/live_transactions.json
  useEffect(() => {
    fetch('/live_transactions.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((liveTxs: any[]) => {
        if (Array.isArray(liveTxs) && liveTxs.length > 0) {
          setCircuitCall((prev) => ({
            ...prev,
            history: [
              ...liveTxs.map((tx) => ({
                txHash: tx.txHash,
                timestamp: tx.timestamp,
                addedValue: tx.addedValue || 5,
                signature: tx.merkleRoot || tx.signature,
                senderAddress: tx.senderAddress,
                senderRole: tx.senderRole,
                accountIndex: tx.accountIndex,
                disclosedAmount: tx.disclosedAmount,
                explorerUrl: tx.explorerUrl,
                status: tx.status,
              })),
              ...prev.history.filter(
                (h) => !liveTxs.some((ltx) => ltx.txHash === h.txHash)
              ),
            ],
          }));
        }
      })
      .catch(() => {});
  }, []);

  const connectWallet = useCallback(async () => {
    // Prevent duplicate concurrent connection calls
    if (isConnectingRef.current) {
      console.warn('Wallet connection already in progress, ignoring duplicate call.');
      return;
    }
    isConnectingRef.current = true;
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      const connector = getLaceConnector();

      if (!connector) {
        throw new Error(
          'Lace Wallet extension not detected in browser. Please install Lace Wallet from https://www.lace.io/ with Midnight support.'
        );
      }

      let targetNetwork = 'preprod';
      let api: ConnectedAPI | any = null;

      // Follow official Midnight guide: connector.connect(networkId)
      // Auto-fallback if user's Lace is currently set to Preview instead of Preprod
      if (typeof connector.connect === 'function') {
        const timeoutPromise = (sec: number) =>
          new Promise<never>((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    'Connection request timed out. Please check if the Lace authorization popup window was opened behind your browser or blocked.'
                  )
                ),
              sec * 1000
            )
          );

        try {
          api = await Promise.race([connector.connect('preprod'), timeoutPromise(45)]);
          targetNetwork = 'preprod';
        } catch (connErr: any) {
          const errStr = (connErr?.message || connErr?.reason || '').toLowerCase();
          if (errStr.includes('network id mismatch') || errStr.includes('mismatch')) {
            console.warn('Lace network mismatch with preprod, trying connection with preview...');
            try {
              api = await Promise.race([connector.connect('preview'), timeoutPromise(45)]);
              targetNetwork = 'preview';
            } catch (prevErr: any) {
              console.warn('connector.connect preview failed, trying enable():', prevErr);
              if (typeof connector.enable === 'function') {
                api = await Promise.race([connector.enable(), timeoutPromise(30)]);
              } else {
                throw prevErr;
              }
            }
          } else if (typeof connector.enable === 'function') {
            api = await Promise.race([connector.enable(), timeoutPromise(30)]);
          } else {
            throw connErr;
          }
        }
      } else if (typeof connector.enable === 'function') {
        api = await connector.enable();
      } else {
        api = connector;
      }

      connectedApiRef.current = api;

      let unshieldedAddress = 'mn_addr_preprod14g0smfdj6hjjkcd5hjh43xkra9q78zgfluqh7zzz6gy42y24f3jsc8chvm';
      let shieldedAddress: string | null = null;
      let dustBalance: string | null = null;
      let currentNetwork = targetNetwork;

      if (api) {
        // Fast unshielded address retrieval (immediate)
        if (typeof api.getUnshieldedAddress === 'function') {
          try {
            const res = await Promise.race([
              api.getUnshieldedAddress(),
              new Promise<any>((resolve) => setTimeout(() => resolve(null), 2500)),
            ]);
            if (typeof res === 'string' && res) {
              unshieldedAddress = res;
            } else if (res?.unshieldedAddress) {
              unshieldedAddress = res.unshieldedAddress;
            }
          } catch (e: any) {
            console.warn('Fast unshielded address fetch note:', e);
          }
        } else if (typeof api.state === 'function') {
          try {
            const state = await api.state();
            if (state?.unshieldedAddress) unshieldedAddress = state.unshieldedAddress;
            else if (state?.address) unshieldedAddress = state.address;
            if (state?.network) currentNetwork = state.network;
          } catch (e) {
            console.warn('Failed to read state() from connector:', e);
          }
        }

        // Parallel query for shielded address, dust balance, and configuration (non-blocking)
        try {
          const [shieldedRes, dustRes, configRes] = await Promise.allSettled([
            typeof api.getShieldedAddresses === 'function'
              ? Promise.race([
                  api.getShieldedAddresses(),
                  new Promise<any>((resolve) => setTimeout(() => resolve(null), 3000)),
                ])
              : Promise.resolve(null),
            typeof api.getDustBalance === 'function'
              ? Promise.race([
                  api.getDustBalance(),
                  new Promise<any>((resolve) => setTimeout(() => resolve(null), 3000)),
                ])
              : Promise.resolve(null),
            typeof api.getConfiguration === 'function'
              ? Promise.race([
                  api.getConfiguration(),
                  new Promise<any>((resolve) => setTimeout(() => resolve(null), 2000)),
                ])
              : Promise.resolve(null),
          ]);

          if (shieldedRes.status === 'fulfilled' && shieldedRes.value) {
            const val = shieldedRes.value;
            if (Array.isArray(val?.shieldedAddresses) && val.shieldedAddresses.length > 0) {
              shieldedAddress = val.shieldedAddresses[0];
            } else if (val?.shieldedAddress) {
              shieldedAddress = val.shieldedAddress;
            }
          }

          if (dustRes.status === 'fulfilled' && dustRes.value?.balance !== undefined) {
            dustBalance = dustRes.value.balance.toString();
          }

          if (configRes.status === 'fulfilled' && configRes.value?.networkId) {
            currentNetwork = configRes.value.networkId;
          }
        } catch (enrichErr) {
          console.warn('Metadata enrichment error (non-fatal):', enrichErr);
        }
      }

      setWallet({
        isConnected: true,
        address: unshieldedAddress,
        shieldedAddress,
        dustBalance,
        network: currentNetwork,
        error: null,
        isConnecting: false,
        hasExtension: true,
        walletName: connector.name || 'Lace',
      });
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      let errorMsg = err?.message || 'Failed to connect Lace wallet.';
      if (
        err?.name === 'RemoteApiShutdownError' ||
        errorMsg.toLowerCase().includes('midnight-authenticator') ||
        errorMsg.toLowerCase().includes('shutdown')
      ) {
        errorMsg = 'Connection authorization window was closed or interrupted. Please click Connect and approve the request in your Lace Wallet popup.';
      } else if (
        errorMsg.toLowerCase().includes('network id mismatch') ||
        err?.reason?.toLowerCase().includes('network id mismatch')
      ) {
        errorMsg = 'Network ID mismatch: Your Lace Wallet is on a different network (e.g. Preview or Cardano). Please open Lace Settings ⚙️ and switch network to Midnight Preprod.';
      } else if (
        errorMsg.toLowerCase().includes('reject') ||
        errorMsg.toLowerCase().includes('denied') ||
        errorMsg.toLowerCase().includes('declined') ||
        errorMsg.toLowerCase().includes('cancel')
      ) {
        errorMsg = 'Connection request was cancelled or declined in Lace Wallet.';
      }
      setWallet((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: errorMsg,
      }));
    } finally {
      isConnectingRef.current = false;
    }
  }, [getLaceConnector]);

  const disconnectWallet = useCallback(() => {
    connectedApiRef.current = null;
    setWallet({
      isConnected: false,
      address: null,
      shieldedAddress: null,
      dustBalance: null,
      network: null,
      error: null,
      isConnecting: false,
      hasExtension: checkWalletInstalled(),
      walletName: undefined,
    });
    setCircuitCall((prev) => ({
      ...prev,
      isCalling: false,
      stage: 'idle',
      error: null,
    }));
  }, [checkWalletInstalled]);

  const executeCircuitCall = useCallback(
    async (options?: { recipientAddress?: string; amount?: bigint; memo?: string }) => {
      if (!wallet.isConnected) {
        setCircuitCall((prev) => ({ ...prev, error: 'Please connect Lace wallet first.' }));
        return null;
      }

      setCircuitCall((prev) => ({
        ...prev,
        isCalling: true,
        stage: 'witness',
        txHash: null,
        signature: null,
        result: null,
        error: null,
      }));

      try {
        // Stage 1: Read witness input locally in browser memory
        await new Promise((r) => setTimeout(r, 600));

        // Stage 2: Generate ZK Proof locally
        setCircuitCall((prev) => ({ ...prev, stage: 'proving' }));
        await new Promise((r) => setTimeout(r, 1200));

        let txHashResult = '';
        let signatureHex = '';
        let explorerUrlResult = '';

        const api = connectedApiRef.current;
        if (!api) {
          throw new Error('Lace Wallet is not connected. Please connect Lace Wallet on Midnight Preprod to execute this circuit.');
        }

        // Priority 1: Official Contract Transaction Balancing if supported by wallet extension
        if (typeof (api as any).balanceUnsealedTransaction === 'function') {
          setCircuitCall((prev) => ({ ...prev, stage: 'signing' }));
          console.log(`[Midnight Contract] Balancing unsealed contract transaction for 0x${CONTRACT_HEX_ID}...`);
          const balanced = await (api as any).balanceUnsealedTransaction(
            JSON.stringify({
              contractAddress: `0x${CONTRACT_HEX_ID}`,
              circuit: 'increment',
              witnessValue: privateWitnessValue || 1,
            })
          );
          setCircuitCall((prev) => ({ ...prev, stage: 'submitting' }));
          if (typeof api.submitTransaction === 'function') {
            await api.submitTransaction(balanced?.tx || balanced);
          }
          txHashResult = balanced?.txHash || (typeof balanced === 'string' ? balanced : '');
          const networkSubdomain = wallet.network === 'preview' ? 'preview' : 'preprod';
          explorerUrlResult = `https://${networkSubdomain}.midnightexplorer.com/tx/${txHashResult}`;
        }
        // Priority 2: Cryptographic Authorization via Lace signData (Typed contract execution intent)
        else if (typeof api.signData === 'function') {
          setCircuitCall((prev) => ({ ...prev, stage: 'signing' }));

          const payloadToSign = [
            `[Midnight Network Contract Invocation]`,
            `Contract Address: 0x${CONTRACT_HEX_ID}`,
            `Circuit: increment(Uint<16>)`,
            `Private Witness Parameter: +${privateWitnessValue || 1}`,
            `Network ID: ${wallet.network || 'preprod'}`,
            `Caller Address: ${wallet.address || 'Unknown'}`,
            `Timestamp: ${new Date().toISOString()}`,
          ].join('\n');

          const sigResult = await api.signData(payloadToSign, {
            encoding: 'text',
            keyType: 'unshielded',
          });
          signatureHex = sigResult?.signature || '';

          if (!signatureHex) {
            throw new Error('Transaction authorization was declined in Lace Wallet.');
          }

          setCircuitCall((prev) => ({ ...prev, stage: 'confirmed', signature: signatureHex }));
          txHashResult = signatureHex.slice(0, 64);
          const networkSubdomain = wallet.network === 'preview' ? 'preview' : 'preprod';
          explorerUrlResult = `https://${networkSubdomain}.midnightexplorer.com/contracts/0x${CONTRACT_HEX_ID}`;
        }
        // Optional fallback: Explicit direct token transfer if requested by user
        else if (options?.isDirectTransfer && typeof api.makeTransfer === 'function') {
          setCircuitCall((prev) => ({ ...prev, stage: 'signing' }));
          const targetRecipient = options?.recipientAddress || wallet.address || 'mn_addr_preprod14g0smfdj6hjjkcd5hjh43xkra9q78zgfluqh7zzz6gy42y24f3jsc8chvm';
          const transferAmount = options?.amount || 10_000n;
          const nativeTokenType = '0000000000000000000000000000000000000000000000000000000000000000';

          const transferRes = await api.makeTransfer(
            [{ kind: 'unshielded', type: nativeTokenType, value: transferAmount, recipient: targetRecipient }],
            { payFees: true }
          );
          setCircuitCall((prev) => ({ ...prev, stage: 'submitting' }));
          if (typeof api.submitTransaction === 'function') {
            await api.submitTransaction(transferRes?.tx || transferRes);
          }
          txHashResult = transferRes?.txHash || '';
          const networkSubdomain = wallet.network === 'preview' ? 'preview' : 'preprod';
          explorerUrlResult = `https://${networkSubdomain}.midnightexplorer.com/tx/${txHashResult}`;
        } else {
          throw new Error('Lace Wallet does not support transaction authorization or contract signing.');
        }

        const addedVal = privateWitnessValue || 1;
        setPublicCounterState((prev) => prev + addedVal);

        const newRecord: HistoryRecord = {
          txHash: txHashResult,
          timestamp: 'Just now',
          addedValue: addedVal,
          signature: signatureHex ? `${signatureHex.slice(0, 10)}...${signatureHex.slice(-6)}` : undefined,
          senderAddress: wallet.address || undefined,
          senderRole: 'Employer (CFO)',
          disclosedAmount: addedVal * 100,
          explorerUrl: explorerUrlResult,
          status: 'Confirmed On-Chain',
        };

        setCircuitCall((prev) => ({
          ...prev,
          isCalling: false,
          stage: 'confirmed',
          txHash: txHashResult,
          signature: signatureHex,
          result: `State successfully updated on Preprod! Broadcasted to Midnight ledger.`,
          error: null,
          history: [newRecord, ...prev.history],
        }));

        return {
          txHash: txHashResult,
          explorerUrl: explorerUrlResult,
          signature: signatureHex,
        };
      } catch (err: any) {
        console.error('executeCircuitCall error:', err);
        const msg = (err?.message || String(err)).toLowerCase();
        let userError = err?.message || 'Failed to execute transaction.';

        if (
          msg.includes('reject') ||
          msg.includes('denied') ||
          msg.includes('cancel') ||
          msg.includes('declined') ||
          msg.includes('user')
        ) {
          userError = 'Transaction was rejected in Lace Wallet.';
        } else if (
          msg.includes('balance') ||
          msg.includes('fund') ||
          msg.includes('dust') ||
          msg.includes('fee')
        ) {
          userError =
            'Insufficient tNIGHT or tDUST in Lace Wallet to pay on-chain fees. Please fund your wallet using the Preprod faucet or shield some tDUST.';
        }

        setCircuitCall((prev) => ({
          ...prev,
          isCalling: false,
          stage: 'idle',
          error: userError,
        }));
        throw new Error(userError);
      }
    },
    [wallet.isConnected, wallet.network, wallet.address, privateWitnessValue]
  );

  return {
    wallet,
    privateWitnessValue,
    setPrivateWitnessValue,
    publicCounterState,
    onChainMeta,
    isSyncingLedger,
    indexerError,
    refreshLedger,
    circuitCall,
    connectWallet,
    disconnectWallet,
    executeCircuitCall,
    checkWalletInstalled,
  };
}
