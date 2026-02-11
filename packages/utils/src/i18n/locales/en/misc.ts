/**
 * Miscellaneous translations (Language, Notifications, Table, Button)
 */
export const misc = {
  language: {
    aria: 'Language selector',
    switchToEn: 'Switch to English',
    switchToZh: 'Switch to Chinese',
    short: 'EN',
    switchLabel: 'Toggle language',
  },
  notification: {
    title: 'Notifications',
    requestChange: 'Request Change',
    project: 'Project',
    viewAll: 'View All',
    time: {
      '5min': '5 minutes ago',
      '8min': '8 minutes ago',
      '15min': '15 minutes ago',
      '1hour': '1 hour ago',
    },
  },
  table: {
    id: 'ID',
    user: 'User',
    project: 'Project',
    titleDesc: 'Title / Description',
    status: 'Status',
    actions: 'Actions',
    role: 'Role',
  },
  button: {
    newGroup: 'New Group',
    newProject: 'New Project',
  },
  terminal: {
    connecting: 'Connecting...',
    connected: 'Connected.',
    websocketError: 'Connection Error',
    disconnected: 'Session ended.',
    disconnectedError: 'Connection dropped unexpectedly.',
  },
} as const;
