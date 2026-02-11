export interface PVC {
  name: string;
  namespace: string;
  size: string;
  status: string;
  isGlobal?: boolean;
}

export interface PVCRequest {
  name: string;
  namespace: string;
  size: string;
  storageClassName: string;
}
