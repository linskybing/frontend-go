import { useState, useEffect, useCallback } from 'react';
import { BaseModal } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
import { Form, FormMessage } from '@/core/interfaces/form';
import { getFormMessages, createFormMessage } from '@/core/services/formService';
import {
  ChatBubbleBottomCenterTextIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface FormDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: Form | null;
  currentUserid: string;
}

export default function FormDetailModal({
  isOpen,
  onClose,
  form,
  currentUserId,
}: FormDetailModalProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<FormMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const loadMessages = useCallback(async () => {
    if (!form) return;
    setLoadingMessages(true);
    try {
      const msgs = await getFormMessages(form.ID);
      setMessages(msgs);
    } catch (error: unknown) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, [form]);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen, loadMessages]);

  const handleSendMessage = async () => {
    if (!form || !newMessage.trim()) return;
    setLoading(true);
    try {
      const msg = await createFormMessage(form.ID, { content: newMessage.trim() });
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch (error: unknown) {
      alert('Failed to send message: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!form) return null;

  const isCompleted = form.status === 'Completed';

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="" maxWidth="max-w-3xl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-accent-600 dark:text-accent-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{form.title}</h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>ID: {form.ID}</span>
            <span>•</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                form.status === 'Completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : form.status === 'Rejected'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    : form.status === 'Processing'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
              }`}
            >
              {form.status}
            </span>
            {form.tag && (
              <>
                <span>•</span>
                <span className="px-2 py-1 rounded bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300 text-xs">
                  {form.tag}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('form.field.description')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{form.description}</p>
        </div>

        {/* Messages Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
            {t('form.messages.title')} ({messages.length})
          </h3>

          {/* Messages List */}
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {loadingMessages ? (
              <div className="text-center py-8 text-gray-500">{t('form.messages.loading')}</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">{t('form.messages.empty')}</div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = msg.user_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className="flex-shrink-0">
                      <UserCircleIcon
                        className={`h-8 w-8 ${isMyMessage ? 'text-accent-600 dark:text-accent-400' : 'text-gray-500 dark:text-gray-400'}`}
                      />
                    </div>
                    <div className={`flex-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block px-4 py-2 rounded-lg max-w-md ${
                          isMyMessage
                            ? 'bg-accent-600 text-white'
                            : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(msg.CreatedAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* New Message Input */}
          {!isCompleted ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                placeholder={t('form.messages.placeholder')}
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent-500 focus:border-transparent text-gray-900 dark:text-white"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !newMessage.trim()}
                className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                {loading ? t('form.messages.sending') : t('form.messages.send')}
              </button>
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              {t('form.messages.completed')}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
