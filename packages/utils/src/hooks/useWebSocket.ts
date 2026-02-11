export interface ResourceMessage {
  type: string;
  name: string;
  ns: string;
  status?: string;
  kind?: string;
  age?: string;
  clusterIP?: string;
  externalIP?: string;
  externalIPs?: string[];
  nodePorts?: number[];
  ports?: string[];
  serviceType?: string;
  containers?: string[];
  images?: string[];
  restartCount?: number;
  metadata?: {
    deletionTimestamp?: string | null;
    creationTimestamp?: string;
    labels?: Record<string, string>;
    ownerReferences?: Array<{ kind: string; name: string }>;
  };
}

// Placeholder implementation: the real hook in the app provides runtime behavior.
// Keep the default export so package consumers still get a usable stub.
export default function useWebSocket(): ResourceMessage[] {
  return [];
}
