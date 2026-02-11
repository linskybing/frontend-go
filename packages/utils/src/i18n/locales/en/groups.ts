/**
 * Group-related translations
 */
export const groups = {
  groups: {
    title: 'Groups',
    myGroups: 'My Groups',
    subtitle: 'Manage and join groups.',
    createNew: 'Create New Group',
    searchPlaceholder: 'Search groups...',
    name: 'Group Name',
    nameLabel: 'Group Name',
    description: 'Description',
    descriptionLabel: 'Description',
    namePlaceholder: 'Enter group name...',
    descriptionPlaceholder: 'Enter description...',
    noDescription: 'No description',
    creating: 'Creating group...',
    createButton: 'Create Group',
    error: {
      userNotLogged: 'User not logged in',
      userIdMissing: 'User ID is missing',
      unknown: 'Unknown error',
      loadFailed: 'Failed to load groups',
    },
    noMatch: 'No groups match "{term}".',
    page: {
      title: 'Groups',
      description: 'Manage your groups here.',
    },
    infoTitle: 'Group Information',
    inviteUser: 'Invite User',
    manageMembers: 'Manage',
    membersList: 'Group Members',
    memberCount: '{count} members in this group.',
    noMembers: 'No members invited yet.',
    notFound: 'Group not found.',
    tab: {
      overview: 'Overview',
      members: 'Members',
      storage: 'Storage',
      info: 'Info',
    },
    form: {
      title: 'Create Group',
      nameRequired: 'Group name is required',
      createFailed: 'Failed to create group',
      creating: 'Creating...',
      cancel: 'Cancel',
    },
    list: {
      title: 'Groups',
      description: 'Browse and manage groups.',
      searchPlaceholder: 'Search groups...',
      loading: 'Loading groups...',
      deleteGroupAria: 'Delete group',
      empty: {
        filter: 'No groups match your filter.',
        noGroups: 'No groups available.',
        filterTip: 'Try adjusting your filter criteria.',
        noGroupsTip: 'Create a new group to get started.',
      },
    },
    empty: {
      title: 'No Groups',
      description: 'You are not a member of any groups yet.',
    },
  },
} as const;
