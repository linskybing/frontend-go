import {
  ResourceItem,
  WorkloadResource,
  ServiceResource,
  ConfigMapResource,
  JobResource,
  ContainerConfig,
  KeyValuePair,
  MountConfig,
} from '@/core/interfaces/configFile';

const INDENT = '  ';

const generateKeyValueBlock = (
  items: KeyValuePair[] | undefined,
  prefix: string,
  headerKey: string,
): string => {
  if (!items || items.length === 0) return '';
  let yaml = `${prefix}${headerKey}:\n`;
  items.forEach((item) => {
    if (item.key) {
      const val = String(item.value).replace(/"/g, '\\"');
      yaml += `${prefix}${INDENT}${item.key}: "${val}"\n`;
    }
  });
  return yaml;
};

const generateMetadata = (res: ResourceItem, indent: string = ''): string => {
  let yaml = `${indent}metadata:\n${indent}${INDENT}name: ${res.name}\n`;
  if (res.annotations && res.annotations.length > 0) {
    yaml += generateKeyValueBlock(res.annotations, `${indent}${INDENT}`, 'annotations');
  }
  return yaml;
};

const generateLabels = (
  selectors: KeyValuePair[] | undefined,
  prefix: string,
  defaultName: string,
): string => {
  if (!selectors || selectors.length === 0) {
    return `${prefix}labels:\n${prefix}${INDENT}app: ${defaultName}\n`;
  }
  return generateKeyValueBlock(selectors, prefix, 'labels');
};

const generateSingleContainer = (
  c: ContainerConfig,
  indent: string,
  collectedMounts: Array<MountConfig & { volName: string }>,
): string => {
  let yaml = `${indent}- name: ${c.name}\n`;
  yaml += `${indent}${INDENT}image: "${c.image || 'ubuntu:latest'}"\n`;
  yaml += `${indent}${INDENT}imagePullPolicy: ${c.imagePullPolicy}\n`;

  // Command
  if (c.command) {
    const cmdStr = c.command.trim().startsWith('[') ? c.command : `["${c.command}"]`;
    yaml += `${indent}${INDENT}command: ${cmdStr}\n`;
  }

  // Args
  if (c.args) {
    if (c.args.includes('\n')) {
      yaml += `${indent}${INDENT}args:\n${indent}${INDENT}${INDENT}- |\n`;
      c.args.split('\n').forEach((ln) => {
        yaml += `${indent}${INDENT}${INDENT}${INDENT}${ln}\n`;
      });
    } else if (c.args.trim().startsWith('[')) {
      yaml += `${indent}${INDENT}args: ${c.args}\n`;
    } else {
      yaml += `${indent}${INDENT}args: ["${c.args.replace(/"/g, '\\"')}"]\n`;
    }
  }

  // Ports
  if (c.ports.length > 0) {
    yaml += `${indent}${INDENT}ports:\n`;
    c.ports.forEach((p) => {
      yaml += `${indent}${INDENT}${INDENT}- containerPort: ${p.port}\n`;
      if (p.protocol !== 'TCP') {
        yaml += `${indent}${INDENT}${INDENT}${INDENT}protocol: ${p.protocol}\n`;
      }
    });
  }

  // Resources
  if (c.resources) {
    const { requests, limits } = c.resources;
    const hasReq = requests?.cpu || requests?.memory || requests?.gpu;
    const hasLim = limits?.cpu || limits?.memory || limits?.gpu;

    if (hasReq || hasLim) {
      yaml += `${indent}${INDENT}resources:\n`;
      if (hasReq) {
        yaml += `${indent}${INDENT}${INDENT}requests:\n`;
        if (requests.cpu) yaml += `${indent}${INDENT}${INDENT}${INDENT}cpu: "${requests.cpu}"\n`;
        if (requests.memory)
          yaml += `${indent}${INDENT}${INDENT}${INDENT}memory: "${requests.memory}"\n`;
        if (requests.gpu)
          yaml += `${indent}${INDENT}${INDENT}${INDENT}nvidia.com/gpu: "${requests.gpu}"\n`;
      }
      if (hasLim) {
        yaml += `${indent}${INDENT}${INDENT}limits:\n`;
        if (limits.cpu) yaml += `${indent}${INDENT}${INDENT}${INDENT}cpu: "${limits.cpu}"\n`;
        if (limits.memory)
          yaml += `${indent}${INDENT}${INDENT}${INDENT}memory: "${limits.memory}"\n`;
        if (limits.gpu)
          yaml += `${indent}${INDENT}${INDENT}${INDENT}nvidia.com/gpu: "${limits.gpu}"\n`;
      }
    }
  }

  // Env & EnvFrom
  if (c.env.length > 0) {
    yaml += `${indent}${INDENT}env:\n`;
    c.env.forEach((e) => {
      yaml += `${indent}${INDENT}${INDENT}- name: ${e.name}\n${indent}${INDENT}${INDENT}${INDENT}value: "${e.value}"\n`;
    });
  }
  if (c.envFrom.length > 0) {
    yaml += `${indent}${INDENT}envFrom:\n`;
    c.envFrom.forEach((cm) => {
      yaml += `${indent}${INDENT}${INDENT}- configMapRef:\n${indent}${INDENT}${INDENT}${INDENT}${INDENT}name: ${cm}\n`;
    });
  }

  // Volume Mounts
  if (c.mounts.length > 0) {
    yaml += `${indent}${INDENT}volumeMounts:\n`;
    c.mounts.forEach((m) => {
      const rawPvc = m.pvcName || 'vol';
      let volName = rawPvc.replace(/[^a-z0-9-]/g, '-').toLowerCase();

      // Normalize Volume Name
      if (m.type === 'user-storage') volName = 'user-home';
      else if (rawPvc.includes('{{') && rawPvc.includes('}}')) {
        if (rawPvc.includes('userVolume')) volName = 'user-home';
        else if (rawPvc.includes('groupVolume')) volName = 'group-volume';
        else volName = 'vol';
      }

      (m.subPaths || []).forEach((sp) => {
        collectedMounts.push({ ...m, volName }); // Push for global volumes definition
        yaml += `${indent}${INDENT}${INDENT}- name: ${volName}\n`;
        yaml += `${indent}${INDENT}${INDENT}${INDENT}mountPath: ${sp.mountPath}\n`;
        if (sp.subPath) yaml += `${indent}${INDENT}${INDENT}${INDENT}subPath: ${sp.subPath}\n`;
      });
    });
  }

  return yaml;
};

const generateVolumesBlock = (
  mounts: Array<MountConfig & { volName: string }>,
  indent: string,
): string => {
  if (mounts.length === 0) return '';

  let yaml = `${indent}volumes:\n`;

  // Collect first-seen volume descriptor per volName
  const seen = new Map<string, any>();
  mounts.forEach((m) => {
    if (!m || !m.volName) return;
    if (!seen.has(m.volName)) seen.set(m.volName, m);
  });

  seen.forEach((m) => {
    yaml += `${indent}${INDENT}- name: ${m.volName}\n`;

    // User storage -> PVC with template variable
    if (m.type === 'user-storage') {
      yaml += `${indent}${INDENT}${INDENT}persistentVolumeClaim:\n`;
      yaml += `${indent}${INDENT}${INDENT}${INDENT}claimName: "{{userVolume}}"\n`;

      // emptyDir volume
    } else if (m.type === 'emptyDir') {
      yaml += `${indent}${INDENT}${INDENT}emptyDir:\n`;
      if (m.medium) yaml += `${indent}${INDENT}${INDENT}${INDENT}medium: ${m.medium}\n`;
      if (m.sizeLimit) yaml += `${indent}${INDENT}${INDENT}${INDENT}sizeLimit: ${m.sizeLimit}\n`;

      // ConfigMap-backed volume
    } else if (m.type === 'configMap') {
      const cmName = m.configMapName || m.pvcName || m.volName;
      yaml += `${indent}${INDENT}${INDENT}configMap:\n`;
      yaml += `${indent}${INDENT}${INDENT}${INDENT}name: ${cmName}\n`;

      // Default -> persistentVolumeClaim (use provided pvcName or projectVolume template)
    } else {
      const claim = m.pvcName ? m.pvcName : '"{{groupVolume}}"';
      yaml += `${indent}${INDENT}${INDENT}persistentVolumeClaim:\n`;
      yaml += `${indent}${INDENT}${INDENT}${INDENT}claimName: ${claim}\n`;
    }
  });

  return yaml;
};

const generatePodSpecContent = (containers: ContainerConfig[], indent: string): string => {
  const allMounts: Array<MountConfig & { volName: string }> = [];
  let yaml = `${indent}containers:\n`;

  containers.forEach((c) => {
    yaml += generateSingleContainer(c, indent, allMounts);
  });

  yaml += generateVolumesBlock(allMounts, indent);
  return yaml;
};

const generateServiceYAML = (res: ServiceResource): string => {
  let yaml = `apiVersion: v1\nkind: Service\n`;
  yaml += generateMetadata(res);
  yaml += `spec:\n`;
  if (res.serviceType) yaml += `  type: ${res.serviceType}\n`;
  if (res.headless) yaml += `  clusterIP: None\n`;

  // Selector
  yaml += `  selector:\n`;
  if (res.selectors?.length > 0) {
    res.selectors.forEach((s) => {
      if (s.key && s.value) yaml += `    ${s.key}: ${s.value}\n`;
    });
  } else {
    yaml += `    # No selector defined\n`;
  }

  // Ports
  yaml += `  ports:\n`;
  if (res.ports.length === 0) {
    yaml += `    # No ports defined\n`;
  } else {
    res.ports.forEach((p) => {
      yaml += `    - name: ${p.name}\n      port: ${p.port}\n      targetPort: ${p.targetPort}\n      protocol: ${p.protocol}\n`;
    });
  }
  return yaml;
};

const generateConfigMapYAML = (res: ConfigMapResource): string => {
  let yaml = `apiVersion: v1\nkind: ConfigMap\n`;
  yaml += generateMetadata(res);
  yaml += `data:\n`;
  if (res.data.length === 0) {
    yaml += `  # No data added\n`;
  } else {
    res.data.forEach((d) => {
      if (!d.key) return;
      const val = d.value ?? '';

      // If the value contains newlines, use a block scalar to preserve formatting (e.g. XML)
      if (typeof val === 'string' && val.includes('\n')) {
        yaml += `  ${d.key}: |\n`;
        val.split('\n').forEach((ln) => {
          yaml += `${INDENT}${INDENT}${ln}\n`;
        });
      } else {
        const safe = String(val).replace(/"/g, '\\"');
        yaml += `  ${d.key}: "${safe}"\n`;
      }
    });
  }
  return yaml;
};

const generatePodYAML = (res: WorkloadResource): string => {
  let yaml = `apiVersion: v1\nkind: Pod\n`;
  yaml += generateMetadata(res);
  yaml += generateLabels(res.selectors, '  ', res.name);
  yaml += `spec:\n`;
  yaml += generatePodSpecContent(res.containers, '  ');
  return yaml;
};

const generateDeploymentYAML = (res: WorkloadResource): string => {
  let yaml = `apiVersion: apps/v1\nkind: Deployment\n`;
  yaml += generateMetadata(res);
  yaml += generateLabels(res.selectors, '  ', res.name); // Metadata Labels

  yaml += `spec:\n`;
  yaml += `  replicas: ${res.replicas || 1}\n`;

  // Selector MatchLabels
  yaml += `  selector:\n    matchLabels:\n`;
  if (res.selectors?.length > 0) {
    res.selectors.forEach((s) => (yaml += `      ${s.key}: ${s.value}\n`));
  } else {
    yaml += `      app: ${res.name}\n`;
  }

  // Template
  yaml += `  template:\n`;
  yaml += `    metadata:\n`;
  // Pod Template Annotations (Optional: can replicate deployment annotations here if needed)
  if (res.annotations && res.annotations.length > 0) {
    yaml += generateKeyValueBlock(res.annotations, '      ', 'annotations');
  }
  yaml += generateLabels(res.selectors, '      ', res.name); // Template Labels

  yaml += `    spec:\n`;
  yaml += generatePodSpecContent(res.containers, '      '); // Deep indentation
  return yaml;
};

const generateJobYAML = (res: JobResource): string => {
  let yaml = `apiVersion: batch/v1\nkind: Job\n`;
  yaml += generateMetadata(res);

  yaml += `spec:\n`;
  yaml += `  completions: ${res.completions || 1}\n`;
  yaml += `  parallelism: ${res.parallelism || 1}\n`;
  yaml += `  backoffLimit: ${res.backoffLimit ?? 4}\n`;

  yaml += `  template:\n`;
  yaml += `    metadata:\n`;
  yaml += generateLabels(res.selectors, '      ', res.name);

  yaml += `    spec:\n`;
  yaml += `      restartPolicy: ${res.restartPolicy || 'OnFailure'}\n`;
  yaml += generatePodSpecContent(res.containers, '      ');
  return yaml;
};

export const generateMultiDocYAML = (resources: ResourceItem[]): string => {
  if (resources.length === 0) return '';

  const docs = resources.map((res) => {
    switch (res.kind) {
      case 'Service':
        return generateServiceYAML(res as ServiceResource);
      case 'ConfigMap':
        return generateConfigMapYAML(res as ConfigMapResource);
      case 'Pod':
        return generatePodYAML(res as WorkloadResource);
      case 'Deployment':
        return generateDeploymentYAML(res as WorkloadResource);
      case 'Job':
        return generateJobYAML(res as JobResource);
      default:
        console.warn(`Unknown resource kind: ${(res as any).kind}`);
        return '';
    }
  });

  return docs.filter((d) => d).join('\n---\n\n');
};
