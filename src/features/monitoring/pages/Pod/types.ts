// types.ts
export interface PodEvent {
  type?: string;
  reason?: string;
  message?: string;
  count?: number;
  firstTimestamp?: string;
  lastTimestamp?: string;
  source?: string;
}

export interface Pod {
  name: string;
  containers: string[];
  status: string;
  events?: PodEvent[];
}

export interface NamespacePods {
  [namespace: string]: Pod[];
}

// Helper type to fix the "key" strict typing issue in sub-components
export type TranslateFn = (key: any) => string;
