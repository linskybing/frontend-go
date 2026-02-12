export const user = {
  editProfile: '編輯個人資料',
  support: '支援',
  switchUser: '切換用戶',
  settings: {
    title: '用戶設定',
    theme: {
      title: '主題',
      light: '淺色',
      dark: '深色',
    },
    notifications: {
      title: '通知',
      receive: '接收通知',
    },
  },
  admin: {
    viewingAs: '以 {username} 身份查看',
    revertToAdmin: '還原為管理員',
    searchUser: '搜尋用戶',
    searchUserPlaceholder: '按用戶名或電子郵件搜尋用戶',
    noUsersFound: '沒有找到用戶',
    switchToUser: '切換至 {username}',
  },
} as const;
