import yaml from 'js-yaml';
import { createDefaultResource } from '@/features/projects/utils/resourceFactories'; // Assume existing
import {
  ResourceItem,
  ResourceKind,
  ConfigMapResource,
  ServiceResource,
  WorkloadResource,
} from '@/core/interfaces/configFile';

// Parse a single YAML Doc into ResourceItem
const parseResourceDoc = (docObj: any, idx: number): ResourceItem => {
  const kind: ResourceKind = (docObj.kind as ResourceKind) || 'ConfigMap';
  const id = `parsed-${idx}-${Date.now()}`;
  const baseName = docObj.metadata?.name || `${kind.toLowerCase()}-${idx + 1}`;

  const res: ResourceItem = createDefaultResource(kind, id, baseName);
  if (docObj.metadata?.name) res.name = docObj.metadata.name;

  // Generic: capture metadata.annotations if present on any resource
  (res as any).annotations = [];
  if (docObj.metadata?.annotations) {
    Object.entries(docObj.metadata.annotations).forEach(([k, v], i) =>
      (res as any).annotations.push({ id: `${id}-a-${i}`, key: String(k), value: String(v) }),
    );
  }

  if (kind === 'ConfigMap') {
    const cm = res as ConfigMapResource;
    cm.data = [];
    if (docObj.data) {
      Object.entries(docObj.data).forEach(([k, v]) =>
        cm.data.push({ id: `${id}-d-${k}`, key: k, value: String(v) }),
      );
    }
    return cm;
  }

  if (kind === 'Service') {
    const svc = res as ServiceResource;

    // Parse service type and headless mode
    svc.serviceType = (docObj.spec?.type as 'ClusterIP' | 'NodePort') || 'ClusterIP';
    svc.headless = docObj.spec?.clusterIP === 'None';

    svc.selectors = [];
    if (docObj.spec?.selector) {
      Object.entries(docObj.spec.selector).forEach(([k, v], i) =>
        svc.selectors.push({ id: `${id}-s-${i}`, key: k, value: String(v) }),
      );
    }
    svc.ports = (docObj.spec?.ports || []).map((p: any, i: number) => ({
      id: `${id}-p-${i}`,
      name: p.name || `p${i + 1}`,
      port: p.port || 0,
      targetPort: p.targetPort || p.port || 0,
      protocol: p.protocol || 'TCP',
    }));
    return svc;
  }

  if (kind === 'Pod' || kind === 'Deployment' || kind === 'Job' || kind === 'CronJob') {
    const workload = res as WorkloadResource;
    const spec = docObj.spec || {};
    // Many controllers place the PodSpec under different keys:
    // - Pod: spec
    // - Deployment: spec.template.spec
    // - Job: spec.template.spec
    // - CronJob: spec.jobTemplate.spec.template.spec
    let templateSpec: any = spec.template?.spec || spec;
    if (!templateSpec?.containers) {
      templateSpec = spec.jobTemplate?.spec?.template?.spec || templateSpec;
    }
    const containers = templateSpec.containers || [];

    workload.containers = containers.map((c: any, ci: number) => ({
      id: `${id}-c-${ci}`,
      name: c.name || `container-${ci + 1}`,
      image: c.image || '',
      imagePullPolicy: c.imagePullPolicy || 'IfNotPresent',
      command: c.command
        ? typeof c.command === 'string'
          ? c.command
          : JSON.stringify(c.command)
        : '',
      args: (() => {
        if (!c.args) return '';
        if (Array.isArray(c.args)) {
          // If it's a single-item array and that item is a multiline string,
          // keep the raw multiline string so the generator can split into list entries.
          if (c.args.length === 1 && typeof c.args[0] === 'string') {
            return String(c.args[0]);
          }
          // Otherwise preserve as a JSON array string
          return JSON.stringify(c.args);
        }
        return String(c.args);
      })(),
      ports: (c.ports || []).map((p: any, pi: number) => ({
        id: `${id}-c-${ci}-p-${pi}`,
        port: p.containerPort || p.port || 0,
        protocol: p.protocol || 'TCP',
      })),
      env: (c.env || []).map((e: any, ei: number) => ({
        id: `${id}-c-${ci}-e-${ei}`,
        name: e.name,
        value: String(e.value),
      })),
      envFrom: (c.envFrom || []).map((ef: any) => ef.configMapRef?.name || ''),
      mounts: (() => {
        const volumes = templateSpec.volumes || [];
        const vm = c.volumeMounts || [];
        const grouped: Record<string, any> = {};
        vm.forEach((m: any, mi: number) => {
          const volumeDef = volumes.find((v: any) => v.name === m.name);

          let mountType: 'group-pvc' | 'user-storage' | 'emptyDir' | 'configMap' = 'group-pvc';
          let pvcName = m.name || '';
          let configMapName: string | undefined = undefined;
          let medium: string | undefined = undefined;
          let sizeLimit: string | undefined = undefined;

          if (volumeDef?.persistentVolumeClaim) {
            // Prefer PVC claimName placeholders to indicate user/project volumes
            const claimName = String(volumeDef.persistentVolumeClaim.claimName || '');
            if (claimName === '{{userVolume}}') {
              mountType = 'user-storage';
              pvcName = '';
            } else if (claimName === '{{groupVolume}}') {
              mountType = 'group-pvc';
              pvcName = m.name || '';
            } else {
              // General PVC reference: treat as project PVC by default
              mountType = 'group-pvc';
              pvcName = claimName || m.name || '';
            }
          } else if (volumeDef?.nfs) {
            // Legacy fallback: if someone still emits NFS, map to PVC semantics conservatively
            const rawPath = String(volumeDef.nfs.path || '');
            const cleanedPath = rawPath.replace(/\/+$/, '');
            const serverHint = String(volumeDef.nfs.server || '');

            if (serverHint === '{{userVolume}}' && (cleanedPath === '' || cleanedPath === '/')) {
              mountType = 'user-storage';
              pvcName = '';
            } else if (serverHint === '{{groupNfsServer}}') {
              mountType = 'group-pvc';
              pvcName = m.name || '';
            } else {
              const projectMatch = cleanedPath.match(/^\/?(?:exports|srv)\/(.+)$/);
              if (projectMatch) {
                mountType = 'group-pvc';
                pvcName = projectMatch[1];
              } else {
                mountType = 'group-pvc';
                pvcName = m.name || cleanedPath;
              }
            }
          } else if (volumeDef?.emptyDir) {
            mountType = 'emptyDir';
            medium = volumeDef.emptyDir.medium || undefined;
            sizeLimit = volumeDef.emptyDir.sizeLimit || undefined;
          } else if (volumeDef?.configMap) {
            mountType = 'configMap';
            configMapName = volumeDef.configMap.name || m.name || undefined;
          }

          if (!grouped[m.name]) {
            grouped[m.name] = {
              id: `${id}-c-${ci}-m-${mi}`,
              pvcName,
              type: mountType,
              configMapName,
              medium,
              sizeLimit,
              subPaths: [],
            };
          }

          grouped[m.name].subPaths.push({
            id: `${id}-c-${ci}-m-${mi}-${grouped[m.name].subPaths.length}`,
            subPath: m.subPath || '',
            mountPath: m.mountPath,
          });
        });

        return Object.keys(grouped).map((k) => ({ ...grouped[k] }));
      })(),
      resources: c.resources
        ? {
            requests: c.resources.requests
              ? {
                  cpu: c.resources.requests.cpu || undefined,
                  memory: c.resources.requests.memory || undefined,
                  gpu: c.resources.requests['nvidia.com/gpu'] || undefined,
                }
              : undefined,
            limits: c.resources.limits
              ? {
                  cpu: c.resources.limits.cpu || undefined,
                  memory: c.resources.limits.memory || undefined,
                  gpu: c.resources.limits['nvidia.com/gpu'] || undefined,
                }
              : undefined,
          }
        : undefined,
    }));

    workload.replicas = spec.replicas || workload.replicas;

    // Job specific fields
    if (kind === 'Job') {
      (workload as any).completions = spec.completions ?? (workload as any).completions;
      (workload as any).parallelism = spec.parallelism ?? (workload as any).parallelism;
      (workload as any).backoffLimit = spec.backoffLimit ?? (workload as any).backoffLimit;
      (workload as any).activeDeadlineSeconds =
        spec.activeDeadlineSeconds ?? (workload as any).activeDeadlineSeconds;
      (workload as any).restartPolicy =
        templateSpec.restartPolicy || (workload as any).restartPolicy;
    }

    // Parse Labels/Selectors
    workload.selectors = [];
    const labels = spec.selector?.matchLabels || docObj.metadata?.labels || spec.selector || {};
    Object.entries(labels).forEach(([k, v], i) => {
      workload.selectors.push({ id: `${id}-s-${i}`, key: String(k), value: String(v) });
    });

    return workload;
  }

  return res;
};

export const parseK8sYaml = (yamlContent: string): ResourceItem[] => {
  try {
    const docs = yaml.loadAll(yamlContent) as unknown[];
    return docs
      .filter((d): d is Record<string, unknown> => Boolean(d && typeof d === 'object'))
      .map((doc, i) => parseResourceDoc(doc, i));
  } catch (e) {
    console.error('YAML Parse Error:', e);
    return [];
  }
};
