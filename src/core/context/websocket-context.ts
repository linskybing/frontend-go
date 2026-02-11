import { createContext } from 'react';
import type { ResourceMessage } from './ws-types';

export interface WebSocketContextType {
  messages: ResourceMessage[];
  connectToNamespace: (namespace: string) => void;
  getNamespaceMessages: (namespace: string) => ResourceMessage[];
  clearMessages: () => void;
  registerLogWindow: (key: string, win: Window | null) => void;
  unregisterLogWindow: (key: string) => void;
  subscribeToPodLogs: (
    namespace: string,
    pod: string,
    container: string,
    cb: (line: string) => void,
  ) => () => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);
