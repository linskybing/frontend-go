import { AUDIT_LOGS_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';
import { AuditLog, AuditLogQuery } from '@/core/interfaces/audit';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

const normalizeLog = (log: AuditLog): AuditLog => {
  const normalizedId = log.id ?? log.ID;
  return {
    ...log,
    ID: normalizedId,
    id: normalizedId,
  };
};

export const getAuditLogs = async (query: AuditLogQuery = {}): Promise<AuditLog[]> => {
  try {
    const params = new URLSearchParams();

    if (query.user_id) params.set('user_id', String(query.user_id));
    if (query.resource_type) params.set('resource_type', query.resource_type);
    if (query.action) params.set('action', query.action);
    if (query.start_time) params.set('start_time', query.start_time);
    if (query.end_time) params.set('end_time', query.end_time);
    if (query.limit) params.set('limit', String(query.limit));
    if (query.offset) params.set('offset', String(query.offset));

    const url = params.toString() ? `${AUDIT_LOGS_URL}?${params.toString()}` : AUDIT_LOGS_URL;
    const response = await fetchWithAuth(url, { method: 'GET' });

    const logs = extractData<AuditLog[]>(response);
    return Array.isArray(logs) ? logs.map(normalizeLog) : [];
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch audit logs.');
  }
};
