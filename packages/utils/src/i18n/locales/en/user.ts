export const user = {
  editProfile: 'Edit Profile',
  support: 'Support',
  switchUser: 'Switch User',
  settings: {
    title: 'User Settings',
    theme: {
      title: 'Theme',
      light: 'Light',
      dark: 'Dark',
    },
    notifications: {
      title: 'Notifications',
      receive: 'Receive Notifications',
    },
  },
  admin: {
    viewingAs: 'Viewing as {username}',
    revertToAdmin: 'Revert to Admin',
    searchUser: 'Search User',
    searchUserPlaceholder: 'Search users by username or email',
    noUsersFound: 'No users found',
    switchToUser: 'Switch to {username}',
  },
} as const;
