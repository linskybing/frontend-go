import { useContext } from 'react';
import { WebSocketContext } from '../WebSocketContext';

export const useGlobalWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useGlobalWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default useGlobalWebSocket;
