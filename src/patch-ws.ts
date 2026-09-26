// Patch for Node 24 undici WebSocket incompatibility with Substrate nodes
import { WebSocket as WsWebSocket } from 'ws';

Object.defineProperty(globalThis, 'WebSocket', {
  value: WsWebSocket,
  writable: true,
  configurable: true,
});
