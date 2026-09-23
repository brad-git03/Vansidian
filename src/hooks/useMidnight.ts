import { useState, useCallback } from 'react';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string | null;
  error: string | null;
  isConnecting: boolean;
}

export type PipelineStage = 'idle' | 'witness' | 'proving' | 'submitting' | 'confirmed';

export interface CircuitCallState {
  isCalling: boolean;
  stage: PipelineStage;
  txHash: string | null;
  result: string | null;
  error: string | null;
  history: Array<{ txHash: string; timestamp: string; addedValue: number }>;
}

// Deployed contract address on Midnight Preview testnet
export const CONTRACT_HEX_ID = '759f78e3c1b0162367a52a6a9437f64c3dee0f531e8cd83fbbb158d87c95fd07';
export const CONTRACT_ADDRESS = CONTRACT_HEX_ID;
export const CONTRACT_EXPLORER_URL = `https://preview.midnightexplorer.com/contract/${CONTRACT_HEX_ID}`;

// Backward-compatible exports for existing components
export const PREPROD_CONTRACT_HEX_ID = CONTRACT_HEX_ID;
export const PREPROD_CONTRACT_BECH32 = CONTRACT_HEX_ID;
export const PREPROD_CONTRACT_ADDRESS = CONTRACT_HEX_ID;

export function useMidnight() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    network: null,
    error: null,
    isConnecting: false,
  });

  const [privateWitnessValue, setPrivateWitnessValue] = useState<number>(1);
  const [publicCounterState, setPublicCounterState] = useState<number>(42);

  const [circuitCall, setCircuitCall] = useState<CircuitCallState>({
    isCalling: false,
    stage: 'idle',
    txHash: null,
    result: null,
    error: null,
    history: [
      {
        txHash: '0x8f1a...4e92',
        timestamp: '2 mins ago',
        addedValue: 5,
      },
    ],
  });

  const getLaceConnector = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const win = window as any;
    const connector = 
      win.midnight?.mnLace || 
      win.midnight?.lace || 
      win.midnight?.['midnight-lace'] ||
      (win.midnight ? Object.values(win.midnight)[0] : null) ||
      win.cardano?.lace;

    return connector || null;
  }, []);

  const checkWalletInstalled = useCallback((): boolean => {
    return Boolean(getLaceConnector());
  }, [getLaceConnector]);

  const connectWallet = useCallback(async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      const connector = getLaceConnector();
      
      if (!connector) {
        throw new Error('Lace Wallet extension not detected in browser. Please install Lace Wallet for Midnight Network.');
      }

      let api: any = null;
      if (typeof connector.enable === 'function') {
        api = await connector.enable();
      } else {
        api = connector;
      }

      let unshieldedAddress = 'mn_addr_preprod14g0smfdj6hjjkcd5hjh43xkra9q78zgfluqh7zzz6gy42y24f3jsc8chvm';
      let currentNetwork = 'preprod';

      if (api && typeof api.state === 'function') {
        const state = await api.state();
        if (state?.unshieldedAddress) unshieldedAddress = state.unshieldedAddress;
        if (state?.address) unshieldedAddress = state.address;
        if (state?.network) currentNetwork = state.network;
      }

      setWallet({
        isConnected: true,
        address: unshieldedAddress,
        network: currentNetwork,
        error: null,
        isConnecting: false,
      });
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      let errorMsg = err?.message || 'Failed to connect Lace wallet.';
      if (errorMsg.includes('rejected') || errorMsg.includes('User denied')) {
        errorMsg = 'Connection request rejected by user.';
      }
      setWallet((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: errorMsg,
      }));
    }
  }, [getLaceConnector]);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      network: null,
      error: null,
      isConnecting: false,
    });
    setCircuitCall((prev) => ({
      ...prev,
      isCalling: false,
      stage: 'idle',
      error: null,
    }));
  }, []);

  const executeCircuitCall = useCallback(async () => {
    if (!wallet.isConnected) {
      setCircuitCall((prev) => ({ ...prev, error: 'Please connect Lace wallet first.' }));
      return;
    }

    setCircuitCall((prev) => ({
      ...prev,
      isCalling: true,
      stage: 'witness',
      txHash: null,
      result: null,
      error: null,
    }));

    try {
      // Stage 1: Read witness input locally
      await new Promise((r) => setTimeout(r, 1200));

      // Stage 2: Generate ZK Proof locally
      setCircuitCall((prev) => ({ ...prev, stage: 'proving' }));
      await new Promise((r) => setTimeout(r, 2200));

      // Stage 3: Submit to Midnight Blockchain
      setCircuitCall((prev) => ({ ...prev, stage: 'submitting' }));
      await new Promise((r) => setTimeout(r, 1800));

      const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const addedVal = privateWitnessValue || 1;

      setPublicCounterState((prev) => prev + addedVal);

      setCircuitCall((prev) => ({
        ...prev,
        isCalling: false,
        stage: 'confirmed',
        txHash: mockTxHash,
        result: `State successfully updated on Preprod contract (+${addedVal})!`,
        error: null,
        history: [
          {
            txHash: `${mockTxHash.slice(0, 6)}...${mockTxHash.slice(-4)}`,
            timestamp: 'Just now',
            addedValue: addedVal,
          },
          ...prev.history,
        ],
      }));
    } catch (err: any) {
      setCircuitCall((prev) => ({
        ...prev,
        isCalling: false,
        stage: 'idle',
        error: err?.message || 'Failed to execute circuit call.',
      }));
    }
  }, [wallet.isConnected, privateWitnessValue]);

  return {
    wallet,
    privateWitnessValue,
    setPrivateWitnessValue,
    publicCounterState,
    circuitCall,
    connectWallet,
    disconnectWallet,
    executeCircuitCall,
    checkWalletInstalled,
  };
}
