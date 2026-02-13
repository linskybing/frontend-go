import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGlobalWebSocket } from '@/core/context/hooks/useGlobalWebSocket';
import { useNamespaceSubscriptions } from '@/core/context/hooks/useNamespaceSubscriptions';
import { PageLayout } from '@nthucscc/ui';
import { SearchInput } from '@nthucscc/components-shared';
import { LuActivity } from 'react-icons/lu';
import { useTranslation } from '@nthucscc/utils';

// Auth and project services
import { getUsername } from '@/core/services/authService';
import { getProjectListByUser, getProjects } from '@/core/services/projectService';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { Project } from '@/core/interfaces/project';
import { ConfigFile } from '@/core/interfaces/configFile';
import { getConfigFilesByProjectId } from '@/core/services/resource/configFileService';
import { submitJob } from '@/core/services/jobService';

// Local imports
import { InferredJob, JobPodMap, JobPod } from './types';
import { JobTable } from './JobTable';
import { PodLogsModal } from '../Pod/PodLogsModal';

const JobsLivePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState('');
  const [configFilesLoading, setConfigFilesLoading] = useState(false);
  const [configFilesError, setConfigFilesError] = useState<string | null>(null);
  const [submitType, setSubmitType] = useState<'job' | 'workflow'>('job');
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: null as string | null,
    success: null as string | null,
  });

  // Pod Log Modal State
  const [podLogsState, setPodLogsState] = useState({
    open: false,
    content: '',
    loading: false,
    target: null as { namespace: string; pod: string; container: string } | null,
  });

  // Global WebSocket Context
  const { messages, subscribeToPodLogs } = useGlobalWebSocket();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { t } = useTranslation();
  const username = useMemo(() => getUsername() || '', []);

  // Namespace connection logic
  useEffect(() => {
    let cancelled = false;

    const loadUserProjects = async () => {
      if (!username || username === 'null') return;

      const userDataStr = localStorage.getItem('userData');
      let nextProjects: Project[] = [];

      try {
        if (userDataStr) {
          const { user_id: userId } = JSON.parse(userDataStr);
          const [allProjects, userGroups] = await Promise.all([
            getProjects(),
            getGroupsByUser(userId),
          ]);
          const userGroupIds = userGroups.map((g: { GID: any }) => g.GID);
          nextProjects = (allProjects || []).filter((p: Project) => userGroupIds.includes(p.GID));
        } else {
          nextProjects = await getProjectListByUser();
        }

        if (cancelled) return;
        setProjects(nextProjects);
        if (!selectedProjectId && nextProjects.length > 0) {
          setSelectedProjectId(nextProjects[0].PID);
        }
      } catch (err) {
        console.error('Job namespace connection failed:', err);
      }
    };

    loadUserProjects();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const subscribedNamespaces = useMemo(
    () => projects.map((p) => `proj-${p.PID}-${username}`),
    [projects, username],
  );

  useNamespaceSubscriptions(subscribedNamespaces);

  useEffect(() => {
    if (!selectedProjectId) {
      setConfigFiles([]);
      setSelectedConfigId('');
      return;
    }

    let isMounted = true;
    setConfigFilesLoading(true);
    setConfigFilesError(null);

    getConfigFilesByProjectId(selectedProjectId)
      .then((files) => {
        if (!isMounted) return;
        setConfigFiles(files);
        if (files.length > 0) {
          setSelectedConfigId(String(files[0].CFID));
        } else {
          setSelectedConfigId('');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setConfigFilesError(err instanceof Error ? err.message : 'Failed to load templates.');
      })
      .finally(() => {
        if (!isMounted) return;
        setConfigFilesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

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

  const selectedProject = useMemo(
    () => projects.find((p) => p.PID === selectedProjectId) || null,
    [projects, selectedProjectId],
  );

  const namespacePreview = useMemo(() => {
    if (!selectedProject || !username) return '';
    return `proj-${selectedProject.PID}-${username}`;
  }, [selectedProject, username]);

  const selectedConfig = useMemo(
    () => configFiles.find((cf) => String(cf.CFID) === selectedConfigId) || null,
    [configFiles, selectedConfigId],
  );

  const handleSubmitTemplate = useCallback(async () => {
    if (!selectedConfigId) {
      setSubmitState({ loading: false, error: 'Select a template first.', success: null });
      return;
    }

    setSubmitState({ loading: true, error: null, success: null });
    try {
      await submitJob({
        project_id: selectedProjectId,
        config_file_id: selectedConfigId,
        submit_type: submitType,
      });
      setSubmitState({
        loading: false,
        error: null,
        success: 'Submission queued. Track progress in the live job stream.',
      });
    } catch (err) {
      setSubmitState({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to submit template.',
        success: null,
      });
    }
  }, [selectedConfigId]);

  return (
    <PageLayout title={t('page.jobs.title')} breadcrumb={t('page.jobs.title')}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          <section className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gradient-to-br from-amber-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-900/20 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Submit</p>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Launch a job or workflow
                </h2>
              </div>
              <div className="flex rounded-full bg-white/80 dark:bg-gray-900/70 p-1 shadow-inner">
                {(['job', 'workflow'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSubmitType(type)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                      submitType === type
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    {type === 'job' ? 'Job' : 'Workflow'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Project
                </label>
                <div className="mt-1">
                  <select
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    {projects.length === 0 && <option value="">No projects</option>}
                    {projects.map((p) => (
                      <option key={p.PID} value={p.PID}>
                        {p.ProjectName}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Namespace: <span className="font-mono">{namespacePreview || 'N/A'}</span>
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Template
                </label>
                <div className="mt-1">
                  <select
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    value={selectedConfigId}
                    onChange={(e) => setSelectedConfigId(e.target.value)}
                    disabled={configFilesLoading || configFiles.length === 0}
                  >
                    {configFilesLoading && <option value="">Loading templates...</option>}
                    {!configFilesLoading && configFiles.length === 0 && (
                      <option value="">No templates available</option>
                    )}
                    {configFiles.map((cf) => (
                      <option key={cf.CFID} value={String(cf.CFID)}>
                        {cf.Filename}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Use config files that include {submitType === 'job' ? 'Job' : 'Workflow'}
                  resources.
                </p>
              </div>

              {configFilesError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                  {configFilesError}
                </div>
              )}

              {selectedConfig && (
                <div className="rounded-xl border border-gray-200/80 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 p-3">
                  <p className="text-xs text-gray-500">Selected template</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {selectedConfig.Filename}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(selectedConfig.CreatedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {submitState.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                  {submitState.error}
                </div>
              )}

              {submitState.success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                  {submitState.success}
                </div>
              )}

              <button
                type="button"
                className="w-full rounded-lg bg-gray-900 text-white py-2 text-sm font-semibold shadow hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmitTemplate}
                disabled={submitState.loading || !selectedConfigId}
              >
                {submitState.loading ? 'Submitting...' : 'Submit template'}
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

              <div className="w-full sm:w-64">
                <SearchInput
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                  }}
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
          </section>
        </div>

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
