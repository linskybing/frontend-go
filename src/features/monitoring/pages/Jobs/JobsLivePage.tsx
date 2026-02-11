import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGlobalWebSocket } from '@/core/context/hooks/useGlobalWebSocket';
import { PageLayout } from '@nthucscc/ui';
import { SearchInput } from '@nthucscc/components-shared';
import { LuActivity } from 'react-icons/lu';
import { useTranslation } from '@nthucscc/utils';

// Auth and project services
import { getUsername } from '@/core/services/authService';
import { getProjectListByUser, getProjects } from '@/core/services/projectService';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { Project } from '@/core/interfaces/project';

// Local imports
import { InferredJob, JobPodMap, JobPod } from './types';
import { JobTable } from './JobTable';
import { PodLogsModal } from '../Pod/PodLogsModal';

const JobsLivePage: React.FC = () => {
  const [search, setSearch] = useState('');

  // Pod Log Modal State
  const [podLogsState, setPodLogsState] = useState({
    open: false,
    content: '',
    loading: false,
    target: null as { namespace: string; pod: string; container: string } | null,
  });

  // Global WebSocket Context
  const { messages, connectToNamespace, subscribeToPodLogs } = useGlobalWebSocket();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { t } = useTranslation();

  // Namespace connection logic
  useEffect(() => {
    const connectUserNamespaces = async () => {
      const username = getUsername();
      if (!username || username === 'null') return;

      const userDataStr = localStorage.getItem('userData');
      let projects: Project[] = [];

      try {
        if (userDataStr) {
          // Use cached user data and groups
          const { user_id: userId } = JSON.parse(userDataStr);
          const [allProjects, userGroups] = await Promise.all([
            getProjects(),
            getGroupsByUser(userId),
          ]);
          const userGroupIds = userGroups.map((g: { GID: any }) => g.GID);
          projects = (allProjects || []).filter((p: Project) => userGroupIds.includes(p.GID));
        } else {
          // Fallback to API
          projects = await getProjectListByUser();
        }

        // Connect to project namespaces
        projects.forEach((p) => {
          // Namespace format must match backend
          const ns = `proj-${p.PID}-${username}`;
          connectToNamespace(ns);
        });
      } catch (err) {
        console.error('Job Namespace connection failed:', err);
      }
    };

    connectUserNamespaces();
  }, [connectToNamespace]);

  // Infer jobs from pod messages
  const { jobPodMap, inferredJobs } = useMemo(() => {
    const map: JobPodMap = {};
    const jobs: InferredJob[] = [];

    messages.forEach((m: any) => {
      // Only process pods
      if (m.kind !== 'Pod') return;

      const labels = m?.metadata?.labels || {};
      const ownerRefs = m?.metadata?.ownerReferences || [];

      // Resolve job name from labels or owner references
      let jobName = labels['job-name'] || labels['job'];

      if (!jobName && Array.isArray(ownerRefs)) {
        const jobOwner = ownerRefs.find(
          (o: any) => o.name && (o.kind || '').toLowerCase() === 'job',
        );
        if (jobOwner) jobName = jobOwner.name;
      }

      // Add pod to job mapping
      if (jobName) {
        if (!map[jobName]) map[jobName] = [];

        // Map pod info
        const podInfo: JobPod = {
          name: m.name,
          namespace: m.ns,
          containers: m.containers || [],
          status: m.status || 'Unknown',
          startTime: m.metadata?.creationTimestamp,
          image: m.containers && m.containers.length > 0 ? 'container-image' : '',
        };

        // Avoid duplicates
        if (!map[jobName].find((p) => p.name === m.name)) {
          map[jobName].push(podInfo);
        }
      }
    });

    // Convert map to list
    Object.keys(map).forEach((jobName) => {
      const pods = map[jobName];
      if (pods.length === 0) return;

      const firstPod = pods[0];

      // Derive job status
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

    // Sort newest first
    jobs.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return { jobPodMap: map, inferredJobs: jobs };
  }, [messages]);

  // Log subscription
  const handleViewPodLog = useCallback((namespace: string, pod: string, container: string) => {
    setPodLogsState({
      open: true,
      content: '',
      loading: true,
      target: { namespace, pod, container },
    });
  }, []);

  const { open: podOpen, target: podTarget } = podLogsState;

  useEffect(() => {
    if (!podOpen || !podTarget) return;
    let unsub: (() => void) | null = null;
    try {
      unsub = subscribeToPodLogs(
        podTarget.namespace,
        podTarget.pod,
        podTarget.container,
        (line: string) => {
          setPodLogsState((prev) => ({
            ...prev,
            loading: false,
            content: prev.content ? prev.content + '\n' + line : line,
          }));
        },
      );
    } catch (e) {
      setPodLogsState((prev) => ({ ...prev, loading: false, content: `Error: ${String(e)}` }));
    }
    return () => {
      if (unsub) unsub();
    };
  }, [podOpen, podTarget, subscribeToPodLogs]);

  // Search and pagination
  const filteredJobs = useMemo(
    () =>
      inferredJobs.filter(
        (j) =>
          j.name.toLowerCase().includes(search.toLowerCase()) ||
          j.namespace.toLowerCase().includes(search.toLowerCase()),
      ),
    [inferredJobs, search],
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const pagedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <PageLayout title={t('page.jobs.title')} breadcrumb={t('page.jobs.title')}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent-100 text-accent-600 rounded-lg dark:bg-accent-900/30 dark:text-accent-400">
              <LuActivity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('page.jobs.activeJobsTitle')}
              </h2>
              <p className="text-xs text-gray-500">{t('page.jobs.description')}</p>
            </div>
          </div>

          <div className="w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t('page.jobs.searchPlaceholder')}
            />
          </div>
        </div>

        <JobTable
          jobs={pagedJobs}
          jobPodMap={jobPodMap}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewPodLog={handleViewPodLog}
        />

        <PodLogsModal
          open={podLogsState.open}
          onClose={() => setPodLogsState((prev) => ({ ...prev, open: false }))}
          content={podLogsState.content}
          loading={podLogsState.loading}
          target={podLogsState.target}
        />
      </div>
    </PageLayout>
  );
};

export default JobsLivePage;
