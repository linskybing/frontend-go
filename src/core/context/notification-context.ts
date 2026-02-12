import React from 'react';
import { Notification } from '@/core/interfaces/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(
  undefined,
);
