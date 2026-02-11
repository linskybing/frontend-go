/**
 * Error messages
 */
export const errors = {
  error: {
    fetch: '無法擷取資料',
    fetchGroups: '讀取群組失敗',
    fetchData: '讀取資料失敗',
    createGroup: '建立群組失敗',
    deleteGroup: '刪除群組失敗',
    deleteFailed: '刪除失敗',
    initData: '資料初始化失敗',
    selectGroup: '請選擇群組',
    invalidProjectData: '無效的專案資料',
    createProject: '建立專案失敗',
    deleteProject: '刪除專案失敗',
    userNotLogged: '使用者未登入',
    application_error: '應用程式錯誤',
    application_error_description: '發生了問題。我們為此不便向您致歉。',
    component_stack: '組件堆棧',
    try_again: '重試',
    go_home: '返回首頁',
  },
} as const;
