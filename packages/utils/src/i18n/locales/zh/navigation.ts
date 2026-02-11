/**
 * Navigation-related translations
 */
export const navigation = {
  breadcrumb: {
    home: '首頁',
    projects: '專案',
    groups: '群組',
  },
  sidebar: {
    dashboard: '儀表板',
    admin: '管理',
    projects: '專案',
    groups: '群組',
    pods: 'Pods',
    fileBrowser: '雲端檔案管理員',
    forms: '我的表單',
    overview: '總覽',
    menu: '菜單',
    jobs: 'Jobs',
    ecommerce: '電子商務',
    manageImages: '管理映像檔',
    imageRequests: '映像檔申請',
  },
  view: {
    toggleToAdmin: '切換至管理員',
    toggleToUser: '切換至使用者',
    grid: '網格檢視',
    list: '列表檢視',
  },
  search: {
    projectsPlaceholder: '搜尋專案...',
    placeholder: '搜尋...',
    groupStoragePlaceholder: '搜尋群組儲存...',
  },
  pagination: {
    prev: '上一頁',
    previous: '上一頁',
    next: '下一頁',
    pageOf: '第 {current} 頁，共 {total} 頁',
    pageInfo: '第 {current} 頁，共 {total} 頁',
  },
} as const;
