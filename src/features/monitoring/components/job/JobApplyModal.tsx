import React, { useState, FormEvent, useEffect } from 'react';
import { getProjectListByUser, getProjects } from '@/core/services/projectService';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { getConfigFilesByProjectId } from '@/core/services/resource/configFileService';
import type { Project } from '@/core/interfaces/project';
import type { ConfigFile } from '@/core/interfaces/configFile';
import { SubmitJobRequest } from '@/core/services/jobSubmitService';
import JobApplyHeader from './JobApplyHeader';
import JobApplyForm from './JobApplyForm';

interface JobApplyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitJobRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const JobApplyModal: React.FC<JobApplyModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  success,
}) => {
  const [projectId, setProjectId] = useState('');
  const [configFileId, setConfigFileId] = useState('');
  const [submitType, setSubmitType] = useState<'job' | 'workflow'>('job');
  const [queueName, setQueueName] = useState('');
  const [priority, setPriority] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [configFilesLoading, setConfigFilesLoading] = useState(false);
  const [configFilesError, setConfigFilesError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const loadProjects = async () => {
      setProjectsLoading(true);
      try {
        const userDataStr = localStorage.getItem('userData');
        let nextProjects: Project[] = [];
        if (userDataStr) {
          const { user_id: userId } = JSON.parse(userDataStr);
          const [allProjects, userGroups] = await Promise.all([
            getProjects(),
            getGroupsByUser(userId),
          ]);
          const userGroupIds = userGroups.map((g: { GID: string }) => g.GID);
          nextProjects = (allProjects || []).filter((p) => userGroupIds.includes(p.GID));
        } else {
          nextProjects = await getProjectListByUser();
        }
        if (cancelled) return;
        setProjects(nextProjects);
        if (!projectId && nextProjects.length > 0) {
          setProjectId(nextProjects[0].PID);
        }
      } catch (err) {
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    };
    loadProjects();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!projectId) {
      setConfigFiles([]);
      setConfigFileId('');
      return;
    }
    let cancelled = false;
    setConfigFilesLoading(true);
    setConfigFilesError(null);
    getConfigFilesByProjectId(projectId)
      .then((files) => {
        if (cancelled) return;
        setConfigFiles(files);
        if (!configFileId && files.length > 0) {
          setConfigFileId(String(files[0].CFID));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setConfigFilesError(err instanceof Error ? err.message : 'Failed to load templates.');
      })
      .finally(() => {
        if (!cancelled) setConfigFilesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, projectId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: SubmitJobRequest = {
      project_id: projectId,
      config_file_id: configFileId,
      submit_type: submitType,
      queue_name: queueName || undefined,
      priority: priority || undefined,
    };
    await onSubmit(payload);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl p-6 relative flex flex-col max-h-[90vh]">
        <JobApplyHeader onClose={onClose} />
        <JobApplyForm
          projectId={projectId}
          setProjectId={setProjectId}
          configFileId={configFileId}
          setConfigFileId={setConfigFileId}
          submitType={submitType}
          setSubmitType={setSubmitType}
          queueName={queueName}
          setQueueName={setQueueName}
          priority={priority}
          setPriority={setPriority}
          projects={projects}
          projectsLoading={projectsLoading}
          configFiles={configFiles}
          configFilesLoading={configFilesLoading}
          configFilesError={configFilesError}
          loading={loading}
          error={error}
          success={success}
          onClose={onClose}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default JobApplyModal;
