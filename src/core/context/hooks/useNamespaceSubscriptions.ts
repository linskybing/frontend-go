import { useEffect, useMemo, useRef } from 'react';
import { sanitizeK8sName } from '@nthucscc/utils';
import { useGlobalWebSocket } from './useGlobalWebSocket';

export const useNamespaceSubscriptions = (rawNamespaces: string[]) => {
  const { subscribeToNamespaces } = useGlobalWebSocket();
  const unsubscribeByNamespace = useRef<Map<string, () => void>>(new Map());

  const namespaces = useMemo(
    () =>
      Array.from(
        new Set(
          rawNamespaces.map((ns) => sanitizeK8sName(ns)).filter((ns): ns is string => Boolean(ns)),
        ),
      ),
    [rawNamespaces],
  );

  useEffect(() => {
    const next = new Set(namespaces);
    const current = new Set(unsubscribeByNamespace.current.keys());

    next.forEach((ns) => {
      if (current.has(ns)) return;
      const unsubscribe = subscribeToNamespaces([ns]);
      unsubscribeByNamespace.current.set(ns, unsubscribe);
    });

    current.forEach((ns) => {
      if (next.has(ns)) return;
      const unsubscribe = unsubscribeByNamespace.current.get(ns);
      if (unsubscribe) unsubscribe();
      unsubscribeByNamespace.current.delete(ns);
    });
  }, [namespaces, subscribeToNamespaces]);

  useEffect(() => {
    return () => {
      unsubscribeByNamespace.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeByNamespace.current.clear();
    };
  }, []);
};

export default useNamespaceSubscriptions;
