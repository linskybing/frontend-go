/**
 * Checks if the user is authenticated.
 * Returns true if user data or username exists in local storage.
 */
export function isAuthenticated() {
  const username = localStorage.getItem('username');
  const userData = localStorage.getItem('userData');
  return !!username || !!userData;
}
