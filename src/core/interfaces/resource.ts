export interface Resource {
  RID: string;
  CFID: string;
  Name: string;
  Type: string;
  Description?: string;
  ParsedYAML: object;
  CreatedAt: string;
}

export interface ResourceMessage {
  type: string;
  name: string;
  ns: string;
  status?: string;
  kind?: string;
  age?: string;

  // Network related
  clusterIP?: string;
  externalIP?: string;
  externalIPs?: string[];
  nodePorts?: number[];
  ports?: string[];
  serviceType?: string;

  // Pod related
  containers?: string[];
  images?: string[];
  restartCount?: number;

  // Metadata
  metadata?: {
    deletionTimestamp?: string | null;
    creationTimestamp?: string;
    labels?: Record<string, string>;
    ownerReferences?: Array<{ kind: string; name: string }>;
  };
}
