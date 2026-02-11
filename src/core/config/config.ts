const getHostname = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return 'localhost';
};

const HOSTNAME = getHostname();

// Base API URL (can be overridden at build time via VITE_API_BASE_URL)
const metaEnv =
  typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {};
const useK8sSvc = metaEnv.VITE_USE_K8S_SVC === 'true';
export const API_BASE_URL =
  metaEnv.VITE_API_BASE_URL || (useK8sSvc ? 'http://backend:30080' : `http://${HOSTNAME}:30080`);
export const BASE_URL = metaEnv.VITE_BASE_URL || `${HOSTNAME}:30080`;

export const WS_PROTOCOL =
  typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
export const WS_HOST = BASE_URL;

// API key support: prefer build-time VITE_API_KEY, fallback to runtime localStorage('apiKey')
export const API_KEY = metaEnv.VITE_API_KEY || '';

export default {
  API_BASE_URL,
  BASE_URL,
  WS_PROTOCOL,
  WS_HOST,
  API_KEY,
};
