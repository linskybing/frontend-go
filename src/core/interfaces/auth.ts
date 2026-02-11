export interface RegisterInput {
  username: string;
  password: string;
  email?: string;
  full_name?: string;
  type?: 'origin' | 'oauth2';
  status?: 'online' | 'offline' | 'delete';
}
