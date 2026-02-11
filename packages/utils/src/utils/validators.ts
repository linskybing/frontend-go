// Common form validators

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, error: 'Email is required' };
  if (!re.test(email)) return { valid: false, error: 'Invalid email format' };
  return { valid: true };
};

export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username) return { valid: false, error: 'Username is required' };
  if (username.length < 3) return { valid: false, error: 'Username must be at least 3 characters' };
  if (!/^[a-zA-Z0-9_-]+$/.test(username))
    return { valid: false, error: 'Username can only contain letters, numbers, _, -' };
  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 6) return { valid: false, error: 'Password must be at least 6 characters' };
  return { valid: true };
};

export const validateRequired = (
  value: string | number | undefined,
): { valid: boolean; error?: string } => {
  if (value === undefined || value === '' || value === null)
    return { valid: false, error: 'This field is required' };
  return { valid: true };
};

export const validateProjectName = (name: string): { valid: boolean; error?: string } => {
  if (!name) return { valid: false, error: 'Project name is required' };
  if (name.length < 1 || name.length > 100)
    return { valid: false, error: 'Project name must be 1-100 characters' };
  return { valid: true };
};

export const validateGroupName = (name: string): { valid: boolean; error?: string } => {
  if (!name) return { valid: false, error: 'Group name is required' };
  if (name.length < 1 || name.length > 100)
    return { valid: false, error: 'Group name must be 1-100 characters' };
  return { valid: true };
};
