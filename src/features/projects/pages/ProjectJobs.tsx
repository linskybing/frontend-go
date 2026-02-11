import { useState, useMemo, useCallback, useEffect } from 'react';
import { useGlobalWebSocket } from '@/core/context/hooks/useGlobalWebSocket';
import { getUsername } from '@/core/services/authService'; // Needed to construct namespace
import { LuRefreshCw, LuActivity } from 'react-icons/lu';
import { useTranslation, sanitizeK8sName } from '@nthucscc/utils';

// Imports from your file structure
import { InferredJob, JobPodMap, JobPod } from '../../monitoring/pages/Jobs/types';
import { JobTable } from '../../monitoring/pages/Jobs/JobTable';
import { PodLogsModal } from '../../monitoring/pages/Pod/PodLogsModal';

interface ProjectJobsProps {
  projectId?: string | number;
}

export default function ProjectJobs({ projectId }: ProjectJobsProps) {
  const { t } = useTranslation();
  // UI State
  const [, setRefreshKey] = useState(0); // Used to trigger UI re-renders if needed, though WS updates automatically

  // Pod Log States (WebSocket - Live Pod Log)
  const [podLogsState, setPodLogsState] = useState({
    open: false,
    content: '',
    loading: false,
    target: null as { namespace: string; pod: string; container: string } | null,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Global WebSocket
  const { messages, subscribeToPodLogs } = useGlobalWebSocket();
  const currentUsername = getUsername();

  // 1. Determine Target Namespace
  // Ideally, this matches the logic in ProjectDetail.tsx
  const targetNamespace = useMemo(() => {
    if (!projectId || !currentUsername) return '';

    const rawName = `proj-${projectId}-${currentUsername}`;

    return sanitizeK8sName(rawName);
  }, [projectId, currentUsername]);

  // 2. Core Logic: Infer Jobs from WebSocket Pods
  // We filter the global message stream to include ONLY pods from this project's namespace
  const { jobPodMap, tableJobs } = useMemo(() => {
    const map: JobPodMap = {};
    const jobs: InferredJob[] = [];

    if (!targetNamespace) return { jobPodMap: map, tableJobs: jobs };

    messages.forEach((m: any) => {
      // STRICT FILTER: Only process pods belonging to this specific project namespace
      if (m.ns !== targetNamespace) return;
      if (m.kind !== 'Pod') return;

      const labels = m?.metadata?.labels || {};
      const ownerRefs = m?.metadata?.ownerReferences || [];

      // Determine Job Name
      let jobName = labels['job-name'] || labels['job'];

      if (!jobName && Array.isArray(ownerRefs)) {
        const jobOwner = ownerRefs.find(
          (o: any) => o.name && (o.kind || '').toLowerCase() === 'job',
        );
        if (jobOwner) jobName = jobOwner.name;
      }

      // If this pod belongs to a Job
      if (jobName) {
        if (!map[jobName]) map[jobName] = [];

        // Avoid duplicates
        if (!map[jobName].find((p) => p.name === m.name)) {
          const podInfo: JobPod = {
            name: m.name,
            namespace: m.ns,
            containers: m.containers || [],
            status: m.status || 'Unknown',
            startTime: m.metadata?.creationTimestamp,
            image: m.containers && m.containers.length > 0 ? 'container-image' : '',
          };
          map[jobName].push(podInfo);
        }
      }
    });

    // Convert grouped Map to Array for the Table
    Object.keys(map).forEach((jobName) => {
      const pods = map[jobName];
      if (pods.length === 0) return;

      const firstPod = pods[0];

      // Derive Job Status from Pods
      let derivedStatus = 'Running';
      if (pods.every((p) => p.status === 'Succeeded' || p.status === 'Completed'))
        derivedStatus = 'Completed';
      else if (pods.some((p) => p.status === 'Failed' || p.status === 'Error'))
        derivedStatus = 'Failed';
      else if (pods.some((p) => p.status === 'Running' || p.status === 'ContainerCreating'))
        derivedStatus = 'Running';
      else derivedStatus = pods[0].status;

      jobs.push({
        name: jobName,
        namespace: firstPod.namespace,
        status: derivedStatus,
        image: firstPod.image || 'Unknown',
        createdAt: firstPod.startTime,
        podCount: pods.length,
      });
    });

    // Sort by creation time (Newest first)
    jobs.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return { jobPodMap: map, tableJobs: jobs };
  }, [messages, targetNamespace]);

  // 3. Handlers
  const handleViewPodLog = useCallback((namespace: string, pod: string, container: string) => {
    setPodLogsState({
      open: true,
      content: '',
      loading: true,
      target: { namespace, pod, container },
    });
  }, []);

  // 4. WebSocket Log Subscription
  const { open, target } = podLogsState;

  useEffect(() => {
    if (!open || !target) return;
    let unsub: (() => void) | null = null;
    try {
      unsub = subscribeToPodLogs(target.namespace, target.pod, target.container, (line: string) => {
        setPodLogsState((prev) => ({
          ...prev,
          loading: false,
          content: prev.content ? prev.content + '\n' + line : line,
        }));
      });
    } catch (e) {
      setPodLogsState((prev) => ({ ...prev, loading: false, content: `Error: ${String(e)}` }));
    }
    return () => {
      if (unsub) unsub();
    };
  }, [open, target, subscribeToPodLogs]);

  // 5. Pagination Logic
  const totalPages = Math.ceil(tableJobs.length / itemsPerPage);
  const pagedJobs = tableJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent-100 text-accent-600 rounded-lg dark:bg-accent-900/30 dark:text-accent-400">
            <LuActivity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('page.projects.jobs.activeJobsTitle')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('page.projects.jobs.liveViewFromNamespace', { namespace: targetNamespace })}
            </p>
          </div>
        </div>

        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title={t('page.projects.jobs.forceRerender')}
        >
          <LuRefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Main Table Component */}
      <div className="flex-1">
        <JobTable
          jobs={pagedJobs}
          jobPodMap={jobPodMap}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewPodLog={handleViewPodLog}
        />
      </div>

      {/* Modal: Live Pod Logs (WebSocket) */}
      <PodLogsModal
        open={podLogsState.open}
        onClose={() => setPodLogsState((prev) => ({ ...prev, open: false }))}
        content={podLogsState.content}
        loading={podLogsState.loading}
        target={podLogsState.target}
      />
    </div>
  );
}
