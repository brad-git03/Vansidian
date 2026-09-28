import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import path from 'node:path';

export default defineConfig({
  plugins: [wasm(), react()],
  resolve: {
    dedupe: [
      '@midnight-ntwrk/onchain-runtime-v3',
      '@midnight-ntwrk/ledger-v8',
      '@midnight-ntwrk/compact-runtime',
      '@midnight-ntwrk/midnight-js-protocol',
    ],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@midnight-ntwrk/onchain-runtime-v3': path.resolve(__dirname, 'node_modules/@midnight-ntwrk/onchain-runtime-v3'),
    },
  },
  define: {
    'process.env': {},
  },
  build: {
    target: 'esnext',
  },
});
