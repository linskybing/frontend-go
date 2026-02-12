/**
 * Group Storage Interfaces
 *
 * Defines types for group-level storage with permission-based access control
 * Based on platform-go's group storage system
 */

// Permission levels for group storage
export type StoragePermission = 'none' | 'read' | 'write';

// Group PVC information
export interface GroupPVC {
  id: string; // Format: group-{gid}-{uuid}
  name: string;
  groupId: string;
  namespace: string;
  pvcName: string;
  size: string; // e.g., "100Gi"
  capacity: number; // Numeric capacity in Gi
  storageClass: string;
  accessMode: string; // e.g., "ReadWriteMany"
  status: 'Pending' | 'Bound' | 'Lost' | 'Terminating';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// User's permission for a specific group PVC
export interface GroupStoragePermission {
  id: string;
  groupId: string;
  pvcId: string;
  pvcName: string;
  userId: string;
  permission: StoragePermission;
  grantedBy: string;
  grantedAt: string;
  updatedAt: string;
  revokedAt?: string;
}

// Access policy for a group PVC
export interface GroupStorageAccessPolicy {
  id: string;
  groupId: string;
  pvcId: string;
  defaultPermission: StoragePermission;
  adminOnly: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Group PVC with user's permission information
export interface GroupPVCWithPermissions extends GroupPVC {
  userPermission: StoragePermission;
  canAccess: boolean;
  canModify: boolean;
}

// Request/Response DTOs

export interface SetStoragePermissionRequest {
  groupId: string;
  pvcId: string;
  userId: string;
  permission: StoragePermission;
}

export interface UserPermission {
  userId: string;
  permission: StoragePermission;
}

export interface BatchSetPermissionsRequest {
  groupId: string;
  pvcId: string;
  permissions: UserPermission[];
}

export interface SetStorageAccessPolicyRequest {
  groupId: string;
  pvcId: string;
  defaultPermission: StoragePermission;
  adminOnly?: boolean;
}

export interface StoragePermissionInfo {
  userId: string;
  username: string;
  permission: StoragePermission;
  canRead: boolean;
  canWrite: boolean;
  grantedBy: string;
  grantedAt: string;
}

// FileBrowser access request/response
export interface FileBrowserAccessRequest {
  groupId: string;
  pvcId: string;
  userId: string;
}

export interface FileBrowserAccessResponse {
  allowed: boolean;
  url?: string;
  port?: string;
  podName?: string;
  readOnly: boolean;
  message?: string;
}

// PVC Binding (mount group storage in project namespace)
export interface CreateProjectPVCBindingRequest {
  projectId: string;
  groupPvcId: string;
  pvcName: string;
  readOnly?: boolean;
}

export interface ProjectPVCBindingInfo {
  id: string;
  projectId: string;
  projectName: string;
  groupPvcId: string;
  projectPvcName: string;
  projectNamespace: string;
  accessMode: string;
  status: string;
  createdAt: string;
}

// Create group storage request
export interface CreateGroupStorageRequest {
  groupId: string;
  groupName: string;
  name: string;
  capacity: number; // in Gi
  storageClass?: string;
}

export interface CreateGroupStorageResponse {
  id: string;
  pvcName: string;
  namespace: string;
  message: string;
}
