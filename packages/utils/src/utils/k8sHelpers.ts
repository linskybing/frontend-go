// Utility function to calculate age from timestamp
export const calculateAge = (creationTimestamp?: string): string => {
  if (!creationTimestamp) return '-';
  const diff = Date.now() - new Date(creationTimestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

export const sanitizeK8sName = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '');
};
// Format bytes to human-readable size
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Parse Kubernetes resource names safely
export const parseResourceName = (fullName: string): { namespace: string; name: string } => {
  const parts = fullName.split('/');
  return {
    namespace: parts.length > 1 ? parts[0] : 'default',
    name: parts.length > 1 ? parts[1] : fullName,
  };
};

// Check if a pod/resource is in system namespace
export const isSystemResource = (name: string, prefixes: string[] = []): boolean => {
  const systemPrefixes = ['kube-', 'coredns', 'etcd', 'calico', 'ingress', ...prefixes];
  return systemPrefixes.some((prefix) => name.startsWith(prefix));
};
