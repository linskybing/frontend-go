import { useCallback, useEffect, useRef, useState } from 'react';

interface PollingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useWorkflowPolling = <T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  intervalMs = 5000,
): PollingState<T> & { refresh: () => Promise<void> } => {
  const [state, setState] = useState<PollingState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const timer = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load workflows.',
      });
    }
  }, [fetcher]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      await refresh();
    };

    run();

    timer.current = window.setInterval(() => {
      if (!cancelled) {
        refresh();
      }
    }, intervalMs);

    return () => {
      cancelled = true;
      if (timer.current) {
        window.clearInterval(timer.current);
      }
    };
  }, [refresh, intervalMs, ...deps]);

  return { ...state, refresh };
};
