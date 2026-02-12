import React, { useState, useCallback } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { User } from '@/core/interfaces/user';
import { searchUsers } from '@/core/services/userService'; // Import searchUsers
import useSearch from '@/shared/hooks/useSearch'; // Import useSearch
import SearchBar from '@/features/forms/components/form/SearchBar'; // Import SearchBar
import { Button } from '@nthucscc/ui'; // Assuming a Button component from UI library
import { useAuth } from '@/core/context/useAuth'; // New import

const UserSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { switchViewMode, isAdmin, viewMode } = useAuth(); // Consume from AuthContext
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // When in admin mode viewing as another user, currentAdminView would be the user being viewed.
  // For now, we will use viewMode from AuthContext to determine if we are in admin view or not.
  // This component will primarily facilitate the *switching* action.

  const handleSearch = useCallback(async (searchTerm: string): Promise<User[]> => {
    if (!searchTerm.trim()) {
      return [];
    }
    try {
      const users = await searchUsers(searchTerm);
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    results: searchResults,
    loading,
    error,
  } = useSearch(handleSearch, { debounceTime: 300 });

  function handleSwitchUser() {
    if (selectedUser) {
      console.log(`Admin switching to user: ${selectedUser.Username}`);
      // Simulate backend user switch and update local storage with switched user's data
      localStorage.setItem('userData', JSON.stringify({ ...selectedUser, role: 'user' }));
      localStorage.setItem('viewMode', 'user'); // Explicitly set viewMode to user
      switchViewMode('user', true); // Update context and persist
      setSelectedUser(null); // Clear selected user after switching
      // You might also want to refresh the page or navigate to '/' to fully reflect the change
    }
  }

  function handleRevertToAdmin() {
    console.log('Admin reverting to own view');
    // Simulate reverting to admin's original data
    // This would ideally involve fetching the actual admin user data from backend
    // For now, we'll just clear the switched user data and reset viewMode to admin.
    localStorage.removeItem('userData'); // Remove switched user data
    localStorage.setItem('viewMode', 'admin'); // Explicitly set viewMode to admin
    switchViewMode('admin', true); // Update context and persist
    // You might also want to refresh the page or navigate to '/admin'
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('user.switchUser')}</h2>

      {viewMode === 'user' && isAdmin && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg flex items-center justify-between">
          <span>User view: {localStorage.getItem('username') || 'User'}</span>
          <Button onClick={handleRevertToAdmin}>Revert to admin</Button>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search user
        </label>
        <SearchBar
          initialSearchTerm={searchTerm}
          onDebouncedChange={setSearchTerm}
          placeholder="Search by username"
          className="w-full"
        />
      </div>

      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && searchResults.length > 0 && (
        <ul className="border border-gray-200 dark:border-gray-700 rounded-md max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <li
              key={user.UID}
              className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedUser?.UID === user.UID ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <p className="font-medium text-gray-900 dark:text-white">{user.Username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.Email}</p>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && searchTerm.trim() !== '' && searchResults.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No users found</p>
      )}

      <Button
        onClick={handleSwitchUser}
        disabled={!selectedUser}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        Switch to {selectedUser?.Username || 'user'}
      </Button>
    </div>
  );
};

export default UserSwitcher;
