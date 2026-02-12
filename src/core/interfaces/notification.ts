export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string; // Optional link for the notification
}
