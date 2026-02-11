export type { ErrorResponse, MessageResponse } from '@/core/interfaces/error';

export interface LoginResponse {
  user_id: string;
  username: string;
  is_super_admin: boolean;
}
