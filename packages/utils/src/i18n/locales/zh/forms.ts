/**
 * Form and Audit log translations
 */
export const forms = {
  // Top-level keys for backward compatibility
  form_status_pending: '待審核',
  form_status_approved: '已核准',
  form_status_rejected: '已駁回',
  form_status_processing: '處理中',
  form_status_completed: '已完成',
  form: {
    title: '提交表單',
    subtitle: '建立新的表單請求或報告',
    type: {
      general: '一般',
      bug: '錯誤回報',
      feature: '功能需求',
    },
    status: {
      pending: '待審核',
      approved: '已核准',
      rejected: '已駁回',
      processing: '處理中',
      completed: '已完成',
    },
    action: {
      process: '處理',
      reject: '駁回',
      complete: '完成',
    },
    label: {
      title: '標題',
      description: '描述',
      project: '專案',
    },
    select: {
      none: '無',
    },
    error: {
      titleRequired: '標題為必填項',
      submitFailed: '提交失敗',
    },
    success: {
      submitted: '提交成功，管理員將儘快審核。',
    },
    createFailed: '建立表單失敗',
    created: '表單建立成功！',
    field: {
      title: '標題',
      description: '描述',
      tag: '自訂標籤（選填）',
    },
    exampleTitle: '範例標題',
    placeholder: {
      title: '輸入標題...',
      description: {
        base: '輸入描述...',
        long: '輸入詳細描述...',
      },
      tag: '例如：緊急、前端等',
    },
    projectId: '專案 ID: {id}',
    cancel: '取消',
    submitting: '提交中...',
    submit: '送出',
    viewDetails: '查看詳情與留言',
    viewMessages: '留言',
    messages: {
      title: '留言',
      empty: '尚無留言。開始對話吧！',
      loading: '載入留言中...',
      placeholder: '輸入您的留言...',
      send: '送出',
      sending: '送出中...',
      completed: '此表單已完成，無法再新增留言。',
    },
    history: {
      title: '歷史紀錄',
      empty: '無歷史紀錄。',
      loading: '載入歷史紀錄中...',
    },
    apply: {
      title: '申請',
    },
    page: {
      title: '表單頁面',
      description: '提交並管理您的表單。',
    },
  },
  filter: {
    title: '篩選條件',
    userId: '用戶 ID',
    resource: '資源類型',
    action: '動作',
    limit: '顯示筆數',
    dateRange: '時間範圍',
    placeholder: {
      userId: '搜尋 ID...',
      resource: '例如：project, user',
      action: '例如：create, update',
    },
  },
  log: {
    noDescription: '未記錄描述',
    view: '查看變更',
    hide: '隱藏詳情',
    before: '變更前',
    after: '變更後',
  },
} as const;
