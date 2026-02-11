/**
 * Monitor and Terminal translations
 */
export const monitor = {
  monitor: {
    title: '即時監控',
    panel: {
      title: '即時監控',
      subtitle: '即時日誌與狀態更新。',
    },
    table: {
      podName: 'Pod 名稱',
      namespace: '命名空間',
      status: '狀態',
      actions: '動作',
      kind: '類型',
      name: '名稱',
      details: '詳細資訊',
      age: '存活時間',
      images: '映像檔',
      restarts: '重啟次數',
      labels: '標籤',
    },
    col: {
      kind: '類型',
      name: '名稱',
      status: '狀態',
      age: '存活時間',
      details: '詳細資訊',
      images: '映像檔',
      restarts: '重啟次數',
      labels: '標籤',
    },
    empty: {
      noPods: '找不到 Pod。',
      waitingForData: '等待叢集資料串流...',
      waitingTitle: '等待資料串流',
    },
    button: {
      connect: '連線',
    },
    agePrefix: '存在時間',
    waiting: '等待叢集資料串流...',
    podMonitoring: {
      title: 'Pod Monitoring',
      description: '應用程式 workloads 的即時檢視。',
    },
    websocketError: 'WebSocket 錯誤',
    connected: '已連線',
    disconnected: '已斷線',
  },
  terminal: {
    connected: '已連線',
    websocketError: 'WebSocket 錯誤',
    disconnected: '已斷線',
  },
} as const;
