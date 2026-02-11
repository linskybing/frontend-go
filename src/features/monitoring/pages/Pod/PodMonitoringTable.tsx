// PodMonitoringTable.tsx
import { useEffect, useState, useCallback } from 'react';
import { useGlobalWebSocket } from '@/core/context/hooks/useGlobalWebSocket';
import { getUsername } from '@/core/services/authService';
import { getProjectListByUser, getProjects } from '@/core/services/projectService';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { Project } from '@/core/interfaces/project';
import { useTranslation } from '@nthucscc/utils';
import { LuActivity, LuServer } from 'react-icons/lu';

// Imports from local split files
import { NamespacePods } from './types';
import { PodList } from './PodList';
import { PodLogsModal } from './PodLogsModal';

export default function PodTables() {
  const { messages, connectToNamespace, subscribeToPodLogs } = useGlobalWebSocket();
  const [podsData, setPodsData] = useState<NamespacePods>({});
  const { t } = useTranslation();

  // Logs State
  const [logsState, setLogsState] = useState({
    open: false,
    content: '',
    loading: false,
    target: null as { namespace: string; pod: string; container: string } | null,
  });

  const handleFetchLogs = useCallback((namespace: string, podName: string, container: string) => {
    setLogsState({
      open: true,
      content: '',
      loading: true,
      target: { namespace, pod: podName, container },
    });
  }, []);

  const closeLogs = useCallback(() => {
    setLogsState((prev) => ({ ...prev, open: false }));
  }, []);

  // Subscribe to logs when modal opens
  const { open, target } = logsState;

  useEffect(() => {
    if (!open || !target) return;

    let unsub: (() => void) | null = null;

    try {
      unsub = subscribeToPodLogs(target.namespace, target.pod, target.container, (line: string) => {
        setLogsState((prev) => ({
          ...prev,
          loading: false,
          content: prev.content ? prev.content + '\n' + line : line,
        }));
      });
    } catch (e) {
      setLogsState((prev) => ({
        ...prev,
        loading: false,
        content: `Connection Error: ${String(e)}`,
      }));
    }

    return () => {
      if (unsub) unsub();
    };
  }, [open, target, subscribeToPodLogs]);

  // Namespace Connection Logic
  useEffect(() => {
    const connectUserNamespaces = async () => {
      const username = getUsername();
      if (!username || username === 'null') return;

      const userDataStr = localStorage.getItem('userData');
      let projects: Project[] = [];

      try {
        if (userDataStr) {
          const { user_id: userId } = JSON.parse(userDataStr);
          const [allProjects, userGroups] = await Promise.all([
            getProjects(),
            getGroupsByUser(userId),
          ]);
          const userGroupIds = userGroups.map((g: { GID: any }) => g.GID);
          projects = (allProjects || []).filter((p: Project) => userGroupIds.includes(p.GID));
        } else {
          projects = await getProjectListByUser();
        }

        projects.forEach((p) => {
          connectToNamespace(`proj-${p.PID}-${username}`);
        });

        // Ensure discovered namespaces are also connected
        Object.keys(podsData).forEach((ns) => connectToNamespace(ns));
      } catch (err) {
        console.error('Namespace connection failed:', err);
      }
    };

    connectUserNamespaces();
  }, [connectToNamespace, podsData]);

  // Process WebSocket Messages
  // Rebuild state from messages (Source of Truth) to correctly handle additions, updates, and deletions
  useEffect(() => {
    const isJobPod = (msg: any) => {
      const labels = msg?.metadata?.labels;
      if (labels && (labels['job-name'] || labels['job'])) return true;
      const ownerRefs = msg?.metadata?.ownerReferences;
      return (
        Array.isArray(ownerRefs) && ownerRefs.some((o) => (o.kind || '').toLowerCase() === 'job')
      );
    };

    // Create a fresh map based on current messages
    const nextPodsData: NamespacePods = {};

    messages.forEach((msg: any) => {
      // Filter out non-Pods or Job-related Pods
      if (msg.kind !== 'Pod' || isJobPod(msg)) return;

      const ns = msg.ns;
      if (!nextPodsData[ns]) {
        nextPodsData[ns] = [];
      }

      // Map raw message to UI data structure
      nextPodsData[ns].push({
        name: msg.name,
        containers: msg.containers || [],
        status: msg.status || 'Unknown',
      });
    });

    // Update state with minimal re-renders
    setPodsData((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(nextPodsData)) {
        return prev;
      }
      return nextPodsData;
    });
  }, [messages]);

  const hasPods = Object.keys(podsData).length > 0;

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <LuActivity className="text-accent-600" />
          {t('monitor.podMonitoring.title')}
        </h1>
        <p className="text-sm text-gray-500">{t('monitor.podMonitoring.description')}</p>
      </div>

      {hasPods ? (
        Object.keys(podsData)
          .sort()
          .map((ns) => (
            <div
              key={ns}
              className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 overflow-hidden"
            >
              <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
                <LuServer className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('monitor.table.namespace')}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-white border border-gray-200 text-sm font-mono text-gray-800 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                  {ns}
                </span>
              </div>

              {/* Use new PodList component */}
              <PodList
                namespace={ns}
                pods={podsData[ns]}
                fetchPodLogs={(pod, container) => handleFetchLogs(ns, pod, container)}
              />
            </div>
          ))
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-accent-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white dark:bg-gray-800 p-4 rounded-full border border-accent-100 shadow-sm">
              <LuActivity className="w-8 h-8 text-accent-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {t('monitor.empty.waitingTitle')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm text-center">
            {t('monitor.empty.waitingForData')}
          </p>
        </div>
      )}

      <PodLogsModal
        open={logsState.open}
        onClose={closeLogs}
        content={logsState.content}
        loading={logsState.loading}
        target={logsState.target}
      />
    </div>
  );
}
