export interface Project {
  PID: string;
  ProjectName: string;
  Description?: string;
  GID: string;
  GPUQuota: number;
  GPUAccess: string;
  MPSLimit?: number;
  MPSMemory?: number;
  CreatedAt: string;
  UpdatedAt: string;
  Storages?: { name: string; capacity?: string; status?: string }[];
}
