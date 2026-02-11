/**
 * Member, Role, and Invite translations
 */
export const members = {
  members: {
    noneFound: '找不到成員。',
    noMatch: '沒有符合搜尋條件的成員。',
  },
  role: {
    admin: {
      name: '管理員',
      desc: '對所有資源和設定擁有完整存取權限。',
    },
    manager: {
      name: '經理',
      desc: '可以管理專案、群組和成員。',
    },
    user: {
      name: '使用者',
      desc: '可以存取和使用指派的專案。',
    },
    label: '角色: {role}',
  },
  invite: {
    selectUserError: '請選擇要邀請的使用者',
    unknownError: '邀請使用者時發生未知錯誤',
    title: '邀請使用者',
    description: '邀請使用者加入專案或群組',
    userLabel: '使用者',
    userSearchPlaceholder: '搜尋使用者...',
    noResults: '找不到使用者',
  },
} as const;
