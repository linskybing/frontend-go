/**
 * Group-related translations
 */
export const groups = {
  groups: {
    title: '群組',
    myGroups: '我的群組',
    subtitle: '管理並加入群組。',
    createNew: '建立新群組',
    searchPlaceholder: '搜尋群組...',
    name: '群組名稱',
    nameLabel: '群組名稱',
    description: '描述',
    descriptionLabel: '描述',
    namePlaceholder: '輸入群組名稱...',
    descriptionPlaceholder: '輸入描述...',
    noDescription: '無描述',
    creating: '正在建立群組...',
    createButton: '建立群組',
    error: {
      userNotLogged: '使用者未登入',
      userIdMissing: '缺少使用者 ID',
      unknown: '未知錯誤',
      loadFailed: '無法載入群組',
    },
    noMatch: '找不到符合 "{term}" 的群組。',
    page: {
      title: '群組',
      description: '在此管理您的群組。',
    },
    infoTitle: '群組資訊',
    inviteUser: '邀請使用者',
    manageMembers: '管理',
    membersList: '群組成員',
    memberCount: '此群組中有 {count} 個成員。',
    noMembers: '尚未邀請任何成員。',
    notFound: '找不到群組。',
    tab: {
      overview: '概覽',
      members: '成員',
      storage: '儲存空間',
      info: '資訊',
    },
    form: {
      title: '建立群組',
      nameRequired: '群組名稱為必填',
      createFailed: '建立群組失敗',
      creating: '建立中...',
      cancel: '取消',
    },
    list: {
      title: '群組',
      description: '瀏覽並管理群組。',
      searchPlaceholder: '搜尋群組...',
      loading: '載入群組中...',
      deleteGroupAria: '刪除群組',
      empty: {
        filter: '沒有符合 "{term}" 的群組。',
        noGroups: '找不到群組。',
        filterTip: '請嘗試不同的搜尋詞。',
        noGroupsTip: '建立一個新群組以開始使用。',
      },
    },
    empty: {
      title: '沒有群組',
      description: '您尚未加入任何群組。',
    },
  },
} as const;
