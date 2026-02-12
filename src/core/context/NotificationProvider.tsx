import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NotificationContext } from './notification-context';
import { Notification } from '@/core/interfaces/notification';
import * as notificationService from '@/core/services/notificationService'; // New import
// Import the API_BASE_URL if it's needed for WebSocket connection
// import { API_BASE_URL } from '../config/url';

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NOTIFICATION_WS_URL = `/api/notifications/ws`; // Placeholder WebSocket URL

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    notificationService
      .markNotificationAsRead(id)
      .catch((error) => console.error('Failed to mark notification as read on backend:', error));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    notificationService
      .markAllNotificationsAsRead()
      .catch((error) =>
        console.error('Failed to mark all notifications as read on backend:', error),
      );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    notificationService
      .clearAllNotifications()
      .catch((error) => console.error('Failed to clear all notifications on backend:', error));
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(NOTIFICATION_WS_URL);

    ws.current.onopen = () => {
      console.log('Notification WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const newNotification: Notification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    ws.current.onclose = () => {
      console.log('Notification WebSocket disconnected');
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (ws.current?.readyState === WebSocket.CLOSED) {
          // Only try to reconnect if it was intentionally closed
          // or if the component is still mounted.
          // A more robust reconnect logic would be needed in a production app.
          ws.current = null; // Clear reference to allow new connection
          // For simplicity, we just log here. Reconnection would be more complex.
          console.log('Attempting to reconnect Notification WebSocket...');
          // For a full implementation, you'd re-run the useEffect or call a reconnect function.
        }
      }, 3000); // Reconnect after 3 seconds
    };

    ws.current.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
      ws.current?.close();
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications],
  );

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};
