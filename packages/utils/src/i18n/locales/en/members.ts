/**
 * Member, Role, and Invite translations
 */
export const members = {
  members: {
    noneFound: 'No members found.',
    noMatch: 'No members match your search.',
  },
  role: {
    admin: {
      name: 'Administrator',
      desc: 'Full access to all resources and settings.',
    },
    manager: {
      name: 'Manager',
      desc: 'Can manage projects, groups, and members.',
    },
    user: {
      name: 'User',
      desc: 'Can access and use assigned projects.',
    },
    label: 'Role: {role}',
  },
  invite: {
    selectUserError: 'Please select a user to invite',
    unknownError: 'Unknown error occurred while inviting user',
    title: 'Invite User',
    description: 'Invite a user to the project or group',
    userLabel: 'User',
    userSearchPlaceholder: 'Search users...',
    noResults: 'No users found',
  },
} as const;
