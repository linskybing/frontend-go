import { useEffect, useMemo } from 'react';
import { sanitizeK8sName } from '@nthucscc/utils';
import { useGlobalWebSocket } from './useGlobalWebSocket';
import type { ResourceMessage } from '../ws-types';

export const useNamespaceMessages = (rawNamespace?: string) => {
  const { getNamespaceMessages, subscribeToNamespaces } = useGlobalWebSocket();

  const namespace = useMemo(() => sanitizeK8sName(rawNamespace || ''), [rawNamespace]);

  useEffect(() => {
    if (!namespace) return;
    return subscribeToNamespaces([namespace]);
  }, [namespace, subscribeToNamespaces]);

  const messages = useMemo<ResourceMessage[]>(
    () => (namespace ? getNamespaceMessages(namespace) : []),
    [namespace, getNamespaceMessages],
  );

  return { namespace, messages };
};

export default useNamespaceMessages;
