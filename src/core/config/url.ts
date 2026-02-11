import { API_BASE_URL, BASE_URL, WS_PROTOCOL, WS_HOST } from './config';
export { API_BASE_URL, BASE_URL, WS_PROTOCOL, WS_HOST };

export const GET_NS_MONITORING_URL = (ns: string) =>
  `${WS_PROTOCOL}//${WS_HOST}/ws/monitoring/${ns}`;
// auth
export const LOGIN_URL = `${API_BASE_URL}/login`;
export const REGISTER_URL = `${API_BASE_URL}/register`;
export const LOGOUT_URL = `${API_BASE_URL}/logout`;
export const FORGOT_PASSWORD_URL = `${API_BASE_URL}/forgot-password`;
//groups
export const GROUPS_URL = `${API_BASE_URL}/groups`;
export const GROUP_BY_ID_URL = (id: string) => `${API_BASE_URL}/groups/${id}`;
// user groups
export const USER_GROUP_URL = `${API_BASE_URL}/user-groups`;
export const USER_GROUP_BY_GROUP_URL = `${API_BASE_URL}/user-groups/by-group`;
export const USER_GROUP_BY_USER_URL = `${API_BASE_URL}/user-groups/by-user`;
// config files
export const CONFIG_FILES_URL = `${API_BASE_URL}/configfiles`;
export const CONFIG_FILE_BY_ID_URL = (id: string) => `${API_BASE_URL}/configfiles/${id}`;
export const CONFIG_FILE_RESOURCES_URL = (id: string) =>
  `${API_BASE_URL}/configfiles/${id}/resources`;
export const CONFIG_FILES_BY_PROJECT_URL = (id: string) =>
  `${API_BASE_URL}/configfiles/project/${id}`;
//resources
export const RESOURCES_URL = `${API_BASE_URL}/resources`;
export const RESOURCE_BY_ID_URL = (id: string) => `${API_BASE_URL}/resources/${id}`;
// audit
export const AUDIT_LOGS_URL = `${API_BASE_URL}/audit/logs`;
// projects
export const PROJECTS_URL = `${API_BASE_URL}/projects`;
export const PROJECT_BY_ID_URL = (id: string) => `${API_BASE_URL}/projects/${id}`;
export const PROJECT_CONFIG_FILES_URL = (id: string) => `${API_BASE_URL}/configfiles/project/${id}`;
export const PROJECT_RESOURCES_URL = (id: string) => `${API_BASE_URL}/projects/${id}/resources`;
// pvc
export const PVC_CREATE_URL = `${API_BASE_URL}/k8s/pvc`;
export const PVC_EXPAND_URL = `${API_BASE_URL}/k8s/pvc/expand`;
export const PVC_LIST_URL = (namespace: string) => `${API_BASE_URL}/k8s/pvc/list/${namespace}`;
// Deprecated: per-project PVC listing removed; use group storage endpoints (via service helpers).
// Keep a deprecated alias for compatibility with older frontend modules that still import it.
export const PVC_LIST_BY_PROJECT_URL = (pid: string) => `${API_BASE_URL}/k8s/pvc/by-project/${pid}`;
export const PVC_GET_URL = (namespace: string, name: string) =>
  `${API_BASE_URL}/k8s/pvc/${namespace}/${name}`;
export const PVC_DELETE_URL = (namespace: string, name: string) =>
  `${API_BASE_URL}/k8s/pvc/${namespace}/${name}`;
export const PVC_FILEBROWSER_START_URL = `${API_BASE_URL}/k8s/filebrowser/start`;
export const PVC_FILEBROWSER_STOP_URL = `${API_BASE_URL}/k8s/filebrowser/stop`;
export const PROJECTS_BY_USER_URL = () => `${API_BASE_URL}/projects/by-user`;
// jobs
export const JOBS_URL = `${API_BASE_URL}/jobs`;
export const JOB_BY_ID_URL = (id: string) => `${JOBS_URL}/${id}`;
export const JOB_LOGS_URL = (id: string) => `${JOBS_URL}/${id}/logs`;
export const JOBS_WS_URL = () => `${WS_PROTOCOL}//${WS_HOST}/ws/jobs`;
export const JOB_LOGS_WS_URL = (id: string) => `${WS_PROTOCOL}//${WS_HOST}/ws/jobs/${id}/logs`;
// Pod logs websocket URL (query params: namespace, pod, container)
export const POD_LOGS_WS_URL = (namespace: string, pod: string, container: string) =>
  `${WS_PROTOCOL}//${WS_HOST}/ws/logs?namespace=${encodeURIComponent(namespace)}&pod=${encodeURIComponent(
    pod,
  )}&container=${encodeURIComponent(container)}`;
// users
export const USERS_URL = `${API_BASE_URL}/users`;
export const USER_BY_ID_URL = (id: string) => `${API_BASE_URL}/users/${id}`;
// instance
export const INSTANCE_BY_ID_URL = (id: string) => `${API_BASE_URL}/configfiles/${id}/instance`;
// websocket
export const WEBSOCKET_MONITORING_URL = (namespace: string) =>
  `${WS_PROTOCOL}//${WS_HOST}/ws/monitoring/${namespace}`;
export const WEBSOCKET_USER_MONITORING_URL = () => `${WS_PROTOCOL}//${WS_HOST}/ws/monitoring`;

// storage
export const USER_DRIVE_URL = `${API_BASE_URL}/k8s/users/browse`;
// Renamed: project drive list -> group drive list (use group storage service)
export const GROUP_DRIVE_LIST = `${API_BASE_URL}/groups/my-storages`;
