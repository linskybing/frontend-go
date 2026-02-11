import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GET_NS_MONITORING_URL, JOBS_WS_URL, POD_LOGS_WS_URL } from '../config/url';
import type { ResourceMessage } from './ws-types';
import { WebSocketContext } from './websocket-context';
import { sanitizeK8sName } from '@nthucscc/utils';
import { isDeletionEvent } from './websocketUtils';

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ResourceMessage[]>([]);

  const sockets = useRef<Record<string, WebSocket>>({});
  const logWindows = useRef<Record<string, Window | null>>({});
  const podLogSockets = useRef<Record<string, WebSocket | undefined>>({});
  const podLogSubscribers = useRef<Record<string, Array<(line: string) => void>>>({});

  const connectToNamespace = useCallback((rawNs: string) => {
    const ns = sanitizeK8sName(rawNs);
    if (!ns) throw new Error('[WS Pool] Attempted to connect to invalid or empty namespace');

    if (
      sockets.current[ns] &&
      (sockets.current[ns].readyState === WebSocket.OPEN ||
        sockets.current[ns].readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const url = GET_NS_MONITORING_URL(ns);
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        const batchUpdates: ResourceMessage[] = Array.isArray(rawData) ? rawData : [rawData];
        if (batchUpdates.length === 0) return;

        if (import.meta.env.DEV) {
          console.log('[WS Pool] Received batch update:', rawData);
        }

        setMessages((prev) => {
          const nextMessages = [...prev];
          batchUpdates.forEach((msg) => {
            if (!msg.kind || !msg.name) return;
            const key = `${msg.kind}-${msg.name}-${msg.ns}`;
            const existingIndex = nextMessages.findIndex(
              (m) => `${m.kind}-${m.name}-${m.ns}` === key,
            );

            if (isDeletionEvent(msg)) {
              if (existingIndex >= 0) nextMessages.splice(existingIndex, 1);
              return;
            }

            if (existingIndex >= 0)
              nextMessages[existingIndex] = { ...nextMessages[existingIndex], ...msg };
            else nextMessages.push(msg);
          });
          return nextMessages.slice(-1000);
        });
      } catch (e) {
        if (import.meta.env.DEV) console.error('[WS Pool] Parse error for', e);
      }
    };

    ws.onclose = () => delete sockets.current[ns];
    ws.onerror = () => {
      try {
        ws.close();
      } catch (_e) {
        /* ignore close errors */
      }
      delete sockets.current[ns];
    };

    sockets.current[ns] = ws;

    const jobsKey = '__jobs__';
    if (!sockets.current[jobsKey]) {
      try {
        const jobsWs = new WebSocket(JOBS_WS_URL());
        jobsWs.onmessage = (event) => {
          try {
            const raw = JSON.parse(event.data);
            const batch: ResourceMessage[] = Array.isArray(raw) ? raw : [raw];
            if (batch.length === 0) return;

            setMessages((prev) => {
              const next = [...prev];
              batch.forEach((msg) => {
                if (!msg.kind || msg.kind.toLowerCase() !== 'job') return;
                const key = `${msg.kind}-${msg.name}-${msg.ns}`;
                const idx = next.findIndex((m) => `${m.kind}-${m.name}-${m.ns}` === key);

                if (isDeletionEvent(msg)) {
                  if (idx >= 0) next.splice(idx, 1);
                  return;
                }
                if (idx >= 0) next[idx] = { ...next[idx], ...msg };
                else next.push(msg);
              });
              return next.slice(-1000);
            });
          } catch (e) {
            if (import.meta.env.DEV) console.error('[WS Pool] Parse error on jobs feed:', e);
          }
        };

        jobsWs.onclose = () => delete sockets.current[jobsKey];
        jobsWs.onerror = () => {
          try {
            jobsWs.close();
          } catch (_e) {
            /* ignore close errors */
          }
          delete sockets.current[jobsKey];
        };

        sockets.current[jobsKey] = jobsWs;
      } catch (e) {
        if (import.meta.env.DEV) console.error('[WS Pool] Failed to open jobs websocket', e);
      }
    }
  }, []);

  const getNamespaceMessages = useCallback(
    (rawNs: string) => {
      const ns = sanitizeK8sName(rawNs);
      return messages.filter((m) => m.ns === ns);
    },
    [messages],
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  useEffect(() => {
    const currentSockets = sockets.current;
    const currentLogWindows = logWindows.current;
    return () => {
      if (import.meta.env.DEV) console.log('[WS Pool] Cleaning up all sockets...');
      Object.values(currentSockets).forEach((s) => s.close());
      Object.values(currentLogWindows).forEach((w) => {
        try {
          w?.close();
        } catch (err) {
          if (import.meta.env.DEV) console.debug('failed closing log window', err);
        }
      });
    };
  }, []);

  const registerLogWindow = useCallback((key: string, win: Window | null) => {
    logWindows.current[key] = win;
    const interval = setInterval(() => {
      const w = logWindows.current[key];
      if (!w || w.closed) {
        delete logWindows.current[key];
        clearInterval(interval);
      }
    }, 1000);
  }, []);

  const unregisterLogWindow = useCallback((key: string) => {
    const w = logWindows.current[key];
    if (w && !w.closed) {
      try {
        w.close();
      } catch (_e) {
        if (import.meta.env.DEV) console.debug('error closing log window');
      }
    }
    delete logWindows.current[key];
  }, []);

  const subscribeToPodLogs = useCallback(
    (rawNamespace: string, pod: string, container: string, cb: (line: string) => void) => {
      const namespace = sanitizeK8sName(rawNamespace);
      const key = `podlogs-${namespace}-${pod}-${container}`;

      if (!podLogSubscribers.current[key]) podLogSubscribers.current[key] = [];
      podLogSubscribers.current[key].push(cb);

      if (!podLogSockets.current[key]) {
        try {
          const wsUrl = POD_LOGS_WS_URL(namespace, pod, container);
          const ws = new WebSocket(wsUrl);

          ws.onmessage = (ev) => {
            const data = ev.data;
            const isLikelyJson =
              typeof data === 'string' && (data.startsWith('{') || data.startsWith('['));
            if (!isLikelyJson) {
              (podLogSubscribers.current[key] || []).forEach((s) => s(String(data)));
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (Array.isArray(parsed))
                parsed.forEach((p) => {
                  const line = typeof p === 'string' ? p : JSON.stringify(p);
                  (podLogSubscribers.current[key] || []).forEach((s) => s(line));
                });
              else if (typeof parsed === 'object') {
                const line = JSON.stringify(parsed);
                (podLogSubscribers.current[key] || []).forEach((s) => s(line));
              } else (podLogSubscribers.current[key] || []).forEach((s) => s(String(parsed)));
            } catch (err) {
              if (import.meta.env.DEV) console.log('[WS Pool] pod log parse error', err);
              (podLogSubscribers.current[key] || []).forEach((s) => s(String(data)));
            }
          };

          ws.onclose = () => {
            delete podLogSockets.current[key];
            delete podLogSubscribers.current[key];
          };
          ws.onerror = (err) => {
            if (import.meta.env.DEV) console.debug('[WS Pool] pod log socket error', err);
            try {
              ws.close();
            } catch (_e) {
              if (import.meta.env.DEV)
                console.debug('error closing ws', _e); /* ignore close errors */
            }
            delete podLogSockets.current[key];
          };

          podLogSockets.current[key] = ws;
        } catch (err) {
          if (import.meta.env.DEV) console.debug('[WS Pool] failed to open pod logs ws', err);
        }
      }

      return () => {
        const list = podLogSubscribers.current[key] || [];
        podLogSubscribers.current[key] = list.filter((f) => f !== cb);
        if ((podLogSubscribers.current[key] || []).length === 0) {
          const ws = podLogSockets.current[key];
          if (ws) {
            try {
              ws.close();
            } catch (_e) {
              if (import.meta.env.DEV) console.debug('error closing pod log ws', _e);
            }
          }
          delete podLogSockets.current[key];
          delete podLogSubscribers.current[key];
        }
      };
    },
    [],
  );

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        connectToNamespace,
        getNamespaceMessages,
        clearMessages,
        registerLogWindow,
        unregisterLogWindow,
        subscribeToPodLogs,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
