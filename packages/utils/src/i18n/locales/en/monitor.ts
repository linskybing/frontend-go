/**
 * Monitor and Terminal translations
 */
export const monitor = {
  monitor: {
    title: 'Real-time Monitoring',
    panel: {
      title: 'Real-time Monitoring',
      subtitle: 'Real-time logs and status updates.',
    },
    table: {
      podName: 'Pod Name',
      namespace: 'Namespace',
      status: 'Status',
      actions: 'Actions',
      kind: 'Kind',
      name: 'Name',
      details: 'Details',
      age: 'Age',
      images: 'Images',
      restarts: 'Restarts',
      labels: 'Labels',
    },
    col: {
      kind: 'Kind',
      name: 'Name',
      status: 'Status',
      age: 'Age',
      details: 'Details',
      images: 'Images',
      restarts: 'Restarts',
      labels: 'Labels',
    },
    empty: {
      noPods: 'No pods found.',
      waitingForData: 'Waiting for cluster data stream...',
      waitingTitle: 'Waiting for data stream',
    },
    button: {
      connect: 'Connect',
    },
    agePrefix: 'Age',
    waiting: 'Waiting for cluster data stream...',
    podMonitoring: {
      title: 'Pod Monitoring',
      description: 'Real-time view of your application workloads.',
    },
    websocketError: 'WebSocket Error',
    connected: 'Connected',
    disconnected: 'Disconnected',
  },
  terminal: {
    connected: 'Connected',
    websocketError: 'WebSocket Error',
    disconnected: 'Disconnected',
  },
} as const;
