/**
 * Pages translations (Home, Admin, Projects, Groups, etc.)
 */
export const pages = {
  page: {
    home: {
      title: '儀表板',
      description: '歡迎來到您的儀表板',
      welcome: '歡迎使用 AI 平台',
      subtitle: '在此管理您的專案、群組與 Pods。',
    },
    dashboard: {
      welcomeBack: '歡迎回來，{name}',
      overview: '總覽',
      projects: '專案',
      groups: '群組',
      activeJobs: '活動 Jobs',
      forms: '表單',
      recentProjects: '最近的專案',
      quickActions: '快速操作',
      submitJob: '提交 Job',
      browseFiles: '瀏覽檔案',
      viewPods: '查看 Pods',
      myForms: '我的表單',
      noProjects: '尚無專案',
    },
    admin: {
      dashboard: {
        totalProjects: '專案總數',
        totalGroups: '群組總數',
        pendingForms: '待審核表單',
        totalImages: '映像檔總數',
        recentAuditLogs: '最近審計日誌',
        quickNavigation: '快速導航',
        pendingImageRequests: '待審核映像檔申請',
      },
      title: '管理儀表板',
      description: '管理中心',
      manageProjects: '專案管理',
      manageGroups: '群組管理',
      forms: '表單管理',
      auditLogs: {
        title: '審計日誌',
        subtitle: '系統安全與變更追蹤',
        description: '系統安全與變更追蹤',
        breadcrumb: '審計日誌',
        heading: '系統軌跡',
        subHeading: '監控並分析管理操作與資源變更。',
        count: '顯示最近 {{count}} 筆記錄',
        emptyTitle: '未找到日誌',
        emptyDesc: '請調整篩選條件以查看更多結果。',
      },
    },
    projects: {
      title: '專案列表',
      description: '查看可存取的專案。',
      jobs: {
        activeJobsTitle: 'Active Jobs',
        liveViewFromNamespace: '來自命名空間：{namespace}',
        forceRerender: '強制重新渲染',
      },
    },
    jobs: {
      title: 'Jobs 監控',
      description: '基於專案 Job Pods 的即時檢視。',
      activeJobsTitle: '活動 Jobs',
      searchPlaceholder: '搜尋 Jobs...',
      breadcrumb: 'Jobs 監控',
    },
    manageGroups: {
      title: '群組管理',
      description: '管理您的組織群組。',
    },
    adminForm: {
      title: '表單儀表板',
      description: '管理使用者提交的表單。',
    },
    notFound: {
      title: '找不到頁面',
      description: '這是 AI 平台的 404 頁面。',
      message: '我們找不到您要瀏覽的頁面！',
      back: '返回首頁',
    },
  },
} as const;
