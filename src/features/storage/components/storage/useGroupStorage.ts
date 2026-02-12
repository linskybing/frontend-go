import { useState, useEffect } from 'react';
import { sanitizeK8sName, useTranslation } from '@nthucscc/utils';
import { toast } from 'react-hot-toast';
import { GroupPVCWithPermissions } from '@/core/interfaces/groupStorage';
import { useGlobalWebSocket } from '@/core/context/hooks/useGlobalWebSocket';
import type { ResourceMessage } from '@/core/context/ws-types';
import {
  getMyGroupStorages,
  startGroupFileBrowser,
  stopGroupFileBrowser,
  getGroupStorageProxyUrl,
} from '@/core/services/resource/groupStorageService';

/**
 * useGroupStorage - Hook to manage group storage data and actions
 */
export const useGroupStorage = () => {
  const { t } = useTranslation();
  const { messages, subscribeToNamespaces } = useGlobalWebSocket();
  const [storages, setStorages] = useState<GroupPVCWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<Record<string, boolean>>({});

  // Fetch storages
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const init = async () => {
      try {
        const data = await getMyGroupStorages();
        if (cancelled) return;
        setStorages(data || []);
        cleanup = subscribeToNamespaces(data.map((s) => s.namespace || ''));
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        toast.error(msg || t('storage.errLoadList'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [subscribeToNamespaces, t]);

  // Handle actions
  const handleAction = async (storage: GroupPVCWithPermissions, action: 'start' | 'stop') => {
    if (isActionLoading[storage.id] || !storage.canAccess) return;

    setIsActionLoading((prev) => ({ ...prev, [storage.id]: true }));
    try {
      if (action === 'start') {
        await startGroupFileBrowser(storage.groupId, storage.id);
        toast.success(t('storage.starting'));
      } else {
        await stopGroupFileBrowser(storage.groupId, storage.id);
        toast.success(t('storage.stopping'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || t('storage.actionFailed'));
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [storage.id]: false }));
    }
  };

  const handleOpen = async (storage: GroupPVCWithPermissions) => {
    if (!storage.canAccess) {
      toast.error(t('storage.noPermission'));
      return;
    }
    try {
      const url = await getGroupStorageProxyUrl(storage.groupId, storage.id);
      if (!url) {
        toast.error(t('storage.actionFailed'));
        return;
      }
      window.open(url, '_blank');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || t('storage.actionFailed'));
    }
  };

  const getFileBrowserStatus = (namespace: string): 'online' | 'offline' => {
    const safeNamespace = sanitizeK8sName(namespace || '');
    const nsMessages: ResourceMessage[] = (messages as any)[safeNamespace] || [];
    const hasBrowser = nsMessages.some((m) => m.kind === 'Pod' && m.name?.includes('filebrowser'));
    return hasBrowser ? 'online' : 'offline';
  };

  return {
    storages,
    loading,
    isActionLoading,
    handleAction,
    handleOpen,
    getFileBrowserStatus,
  };
};
