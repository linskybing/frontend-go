export interface Project {
  PID: string;
  ProjectName: string;
  Description?: string;
  GID: string;
  GPUQuota: number;
  GPUAccess: string;
  MPSLimit?: number;
  MPSMemory?: number;
  MaxConcurrentJobsPerUser?: number;
  MaxQueuedJobsPerUser?: number;
  MaxJobRuntimeSeconds?: number;
  MaxProjectUsers?: number;
  ScheduleWindows?: ScheduleWindow[];
  CreatedAt: string;
  UpdatedAt: string;
  Storages?: { name: string; capacity?: string; status?: string }[];
}

export interface ScheduleWindow {
  weekday: number;
  start: string;
  end: string;
}
