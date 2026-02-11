/**
 * Miscellaneous translations (Language, Notifications, Table, Button)
 */
export const misc = {
  language: {
    aria: '語言選擇器',
    switchToEn: '切換至英文',
    switchToZh: '切換至中文',
    short: '中',
    switchLabel: '切換語言',
  },
  notification: {
    title: '通知',
    requestChange: '請求變更',
    project: '專案',
    viewAll: '查看全部',
    time: {
      '5min': '5 分鐘前',
      '8min': '8 分鐘前',
      '15min': '15 分鐘前',
      '1hour': '1 小時前',
    },
  },
  table: {
    id: 'ID',
    user: '使用者',
    project: '專案',
    titleDesc: '標題 / 描述',
    status: '狀態',
    actions: '動作',
    role: '角色',
  },
  button: {
    newGroup: '新群組',
    newProject: '新專案',
  },
} as const;
