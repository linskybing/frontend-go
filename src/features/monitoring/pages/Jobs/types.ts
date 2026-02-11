// src/pages/Jobs/types.ts

export interface InferredJob {
  name: string;
  namespace: string;
  status: string;
  image: string;
  createdAt?: string;
  podCount: number;
}

export interface JobPod {
  name: string;
  namespace: string;
  containers: string[];
  status: string;
  startTime?: string;
  image?: string;
}

export interface JobPodMap {
  [jobName: string]: JobPod[];
}
