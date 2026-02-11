export const connectWebSocket = (url: string, onMessage: (data: unknown) => void) => {
  const ws = new WebSocket(url);

  // ws.onopen = () => console.log('connected');
  ws.onmessage = (event: MessageEvent) => {
    try {
      const parsed = JSON.parse(event.data);
      onMessage(parsed as unknown);
    } catch (err) {
      console.error('Failed to parse websocket message', err);
    }
  };
  ws.onerror = (err) => console.error('error', err);
  // ws.onclose = () => console.log('closed');

  return ws;
};
