/**
 * Permission utility functions
 * Provides helper functions to check user permissions based on userData stored in localStorage
 */

import type { UserData } from '@/core/interfaces/user';

/**
 * Get user data from localStorage
 * @returns UserData object or null if not found
 */
export function getUserData(): UserData | null {
  try {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) return null;
    return JSON.parse(userDataString);
  } catch (error: unknown) {
    console.error('Failed to parse userData from localStorage:', error);
    return null;
  }
}

/**
 * Check if the current user is a super admin
 * @returns true if user is super admin, false otherwise
 */
export function isSuperAdmin(): boolean {
  const userData = getUserData();
  return userData?.is_super_admin === true;
}

/**
 * Check if the current user can create groups
 * Only super admins can create groups
 * @returns true if user can create groups, false otherwise
 */
export function canCreateGroup(): boolean {
  return isSuperAdmin();
}

/**
 * Check if the current user can create projects
 * Only super admins can create projects
 * @returns true if user can create projects, false otherwise
 */
export function canCreateProject(): boolean {
  return isSuperAdmin();
}

/**
 * Check if the current user has admin-like permissions
 * This includes super admins and users with admin or manager roles
 * @returns true if user has admin-like permissions, false otherwise
 */
export function isAdminLike(): boolean {
  const userData = getUserData();
  if (!userData) return false;

  // Check if super admin
  if (userData.is_super_admin === true) return true;

  // Check role
  const role = userData.role?.toLowerCase();
  return role === 'admin' || role === 'manager';
}

/**
 * Check if the current user can manage storage
 * @returns true if user can manage storage, false otherwise
 */
export function canManageStorage(): boolean {
  return isAdminLike();
}

/**
 * Get user ID from localStorage
 * @returns user ID or null if not found
 */
export function getUserId(): string | null {
  const userData = getUserData();
  return userData?.user_id ?? null;
}

/**
 * Get username from localStorage
 * @returns username or null if not found
 */
export function getUsername(): string | null {
  const userData = getUserData();
  return userData?.username ?? null;
}
