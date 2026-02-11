// PodLogsModal.tsx
import React, { useEffect, useRef } from 'react';
import { LuFileText } from 'react-icons/lu';

interface PodLogsModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  loading: boolean;
  target?: { pod: string; container: string } | null;
}

export const PodLogsModal: React.FC<PodLogsModalProps> = ({
  open,
  onClose,
  content,
  loading,
  target,
}) => {
  // Optional: Auto-scroll to bottom when content updates
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-100 text-accent-600 rounded-lg dark:bg-accent-900/50 dark:text-accent-400">
              <LuFileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Log Viewer</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {target ? `${target.pod} / ${target.container}` : 'Selecting...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          >
            Esc to Close
          </button>
        </div>

        {/* Content - Scroll logic moved here */}
        <div className="flex-1 overflow-y-auto bg-[#1e1e1e] relative scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {loading && (
            <div className="sticky top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-10 min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          <pre className="min-h-full w-full p-4 font-mono text-xs leading-relaxed text-gray-300 whitespace-pre-wrap">
            {content || (
              <span className="text-gray-600 italic">No logs available or connecting...</span>
            )}
            {/* Invisible element to help auto-scroll to bottom */}
            <div ref={logsEndRef} />
          </pre>
        </div>
      </div>
    </div>
  );
};
