export interface ConfigFile {
  CFID: number;
  Filename: string;
  Content: string;
  ProjectID: number;
  CreatedAt: string;
}

export interface FormData {
  filename: string;
  raw_yaml: string;
}

export type MountType = 'group-pvc' | 'user-storage' | 'emptyDir' | 'configMap';
export type ResourceKind = 'Pod' | 'Deployment' | 'Service' | 'ConfigMap' | 'Job';
export type ImagePullPolicy = 'Always' | 'IfNotPresent' | 'Never';
export type ServiceProtocol = 'TCP' | 'UDP'; // New

export interface MountConfig {
  id: string;
  type: MountType;
  pvcName?: string;
  // Support multiple subPath -> mountPath pairs for the same volume
  subPaths: { id: string; subPath: string; mountPath: string }[];
  // optional fields for other mount types
  configMapName?: string;
  medium?: string; // for emptyDir
  sizeLimit?: string; // for emptyDir
}

export interface EnvVar {
  id: string;
  name: string;
  value: string;
}

export interface ContainerPort {
  id: string;
  name?: string; // New: Named ports
  port: number;
  protocol: ServiceProtocol; // New
}

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface BaseResource {
  id: string;
  kind: ResourceKind;
  name: string;
  annotations?: KeyValuePair[];
}

// [New] Container Definition
export interface ContainerConfig {
  id: string;
  name: string;
  image: string;
  imagePullPolicy: ImagePullPolicy;
  command: string; // Supports multi-line
  args: string; // Supports multi-line
  ports: ContainerPort[];
  env: EnvVar[];
  envFrom: string[]; // List of ConfigMap names
  mounts: MountConfig[];
  resources?: {
    requests?: {
      cpu?: string;
      memory?: string;
      gpu?: string;
    };
    limits?: {
      cpu?: string;
      memory?: string;
      gpu?: string;
    };
  };
}

// [Updated] Workload (Supports Multiple Containers)
export interface WorkloadResource extends BaseResource {
  kind: 'Pod' | 'Deployment' | 'Job';
  replicas: number;
  containers: ContainerConfig[]; // Array of containers
  selectors: KeyValuePair[]; // New: selectors (labels) for matching and metadata
}

export interface ServiceResource extends BaseResource {
  kind: 'Service';
  serviceType: 'ClusterIP' | 'NodePort';
  headless: boolean;
  selectors: KeyValuePair[]; // Change: Supports multiple selectors (e.g. app: my-app)
  ports: {
    id: string;
    name: string;
    port: number;
    targetPort: number;
    protocol: 'TCP' | 'UDP';
  }[];
}

export interface ConfigMapResource extends BaseResource {
  kind: 'ConfigMap';
  data: KeyValuePair[];
}

export interface WizardData {
  image: string;
  gpu: number;
  mounts: MountConfig[];
  command: string;
  args: string;
}

export interface JobResource extends WorkloadResource {
  kind: 'Job';
  completions?: number;
  parallelism?: number;
  backoffLimit?: number;
  activeDeadlineSeconds?: number;
  restartPolicy: 'OnFailure' | 'Never';
}

export type ResourceItem = WorkloadResource | ServiceResource | ConfigMapResource | JobResource;
