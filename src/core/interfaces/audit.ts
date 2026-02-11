export interface AuditLog {
  ID?: number;
  id?: number;
  user_id: number;
  action: string;
  resource_type: string;
  resource_id: string;
  old_data?: unknown;
  new_data?: unknown;
  ip_address?: string;
  user_agent?: string;
  description?: string;
  created_at: string;
}

export interface AuditLogQuery {
  user_id?: number;
  resource_type?: string;
  action?: string;
  start_time?: string;
  end_time?: string;
  limit?: number;
  offset?: number;
}
