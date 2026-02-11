import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Job } from '@/core/services/jobService';

interface JobLogModalProps {
  job: Job | null;
  log: string;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
  // pods associated with this job (from global messages)
  pods?: { namespace: string; name: string; containers: string[] }[];
  onViewPodLog?: (namespace: string, pod: string, container: string) => void;
}

const JobLogModal: React.FC<JobLogModalProps> = ({
  job,
  log,
  loading,
  open,
  onClose,
  onRefresh,
  pods,
  onViewPodLog,
}) => {
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const logRef = useRef<HTMLPreElement>(null);

  const lines = useMemo(() => log.split('\n'), [log]);
  const filtered = useMemo(
    () => lines.filter((line) => line.toLowerCase().includes(search.toLowerCase())),
    [lines, search],
  );

  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [filtered, autoScroll]);

  if (!open || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-2">Job Log: {job.Name}</h2>
        <div className="flex items-center gap-2 mb-3 text-sm">
          <input
            className="flex-1 rounded border px-2 py-1 bg-gray-50 dark:bg-gray-800"
            placeholder="Search in logs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            Auto-scroll
          </label>
          {onRefresh && (
            <button
              className="px-2 py-1 rounded bg-accent-600 text-white text-xs hover:bg-violet-700"
              onClick={onRefresh}
            >
              Refresh
            </button>
          )}
        </div>
        <pre
          ref={logRef}
          className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-xs overflow-auto max-h-96 whitespace-pre"
        >
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-500">No log available.</div>
          ) : (
            filtered.map((line, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-gray-400 select-none w-12 text-right">{idx + 1}</span>
                <span className="whitespace-pre-wrap break-words">{line}</span>
              </div>
            ))
          )}
        </pre>
        {pods && pods.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Pods for this Job</h3>
            <div className="space-y-2 max-h-40 overflow-auto">
              {pods.map((p) => (
                <div
                  key={`${p.namespace}-${p.name}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="text-sm">
                    {p.name} <span className="text-xs text-gray-500">({p.namespace})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.containers.map((c) => (
                      <button
                        key={c}
                        className="px-2 py-1 text-xs rounded bg-accent-600 text-white hover:bg-accent-700"
                        onClick={() => onViewPodLog && onViewPodLog(p.namespace, p.name, c)}
                      >
                        Logs: {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobLogModal;
