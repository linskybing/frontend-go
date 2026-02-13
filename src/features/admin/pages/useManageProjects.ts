import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Project } from '@/core/interfaces/project';
import {
  fetchProjects,
  fetchGroups,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from './manageProjectsApi';
import type { CreateProjectDTO, UpdateProjectInput } from '@/core/services/projectService';
import { useTranslation } from '@nthucscc/utils';
import { useProjectFormState } from '@/shared/hooks/useProjectFormState';

interface GroupOption {
  GID: string;
  GroupName: string;
}

export function useManageProjects() {
  const { t } = useTranslation();

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const [formState, formHandlers] = useProjectFormState();

  const [availableGroups, setAvailableGroups] = useState<GroupOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const openCreateModal = () => setIsModalOpen(true);

  const handleProjectClick = (projectId: string) => {
    const project = allProjects.find((p) => p.PID === projectId);
    if (project) {
      setProjectToEdit(project);
      formHandlers.loadProjectData({
        projectName: project.ProjectName,
        description: project.Description || '',
        gpuQuota: project.GPUQuota || 0,
        gpuAccess: project.GPUAccess ? project.GPUAccess.split(',') : ['shared'],
        mpsMemory: project.MPSMemory || 0,
        maxConcurrentJobsPerUser: project.MaxConcurrentJobsPerUser || 0,
        maxQueuedJobsPerUser: project.MaxQueuedJobsPerUser || 0,
        maxJobRuntimeSeconds: project.MaxJobRuntimeSeconds || 0,
        maxProjectUsers: project.MaxProjectUsers || 0,
        scheduleWindows: project.ScheduleWindows || [],
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    formHandlers.loadProjectData({
      projectName: project.ProjectName,
      description: project.Description || '',
      gpuQuota: project.GPUQuota || 0,
      gpuAccess: project.GPUAccess ? project.GPUAccess.split(',') : ['shared'],
      mpsMemory: project.MPSMemory || 0,
      maxConcurrentJobsPerUser: project.MaxConcurrentJobsPerUser || 0,
      maxQueuedJobsPerUser: project.MaxQueuedJobsPerUser || 0,
      maxJobRuntimeSeconds: project.MaxJobRuntimeSeconds || 0,
      maxProjectUsers: project.MaxProjectUsers || 0,
      scheduleWindows: project.ScheduleWindows || [],
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setProjectToEdit(null);
    formHandlers.resetForm();
    setError(null);
  };

  const handleUpdateProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectToEdit) return;

    const input: UpdateProjectInput = {
      project_name: formState.projectName,
      description: formState.description,
      gpu_quota: formState.gpuQuota,
      gpu_access: formState.gpuAccess.join(','),
      mps_memory: formState.mpsMemory,
      max_concurrent_jobs_per_user: formState.maxConcurrentJobsPerUser,
      max_queued_jobs_per_user: formState.maxQueuedJobsPerUser,
      max_job_runtime_seconds: formState.maxJobRuntimeSeconds,
      max_project_users: formState.maxProjectUsers,
      schedule_windows: formState.scheduleWindows,
    };

    try {
      setActionLoading(true);
      setError(null);
      const updatedProject = await updateProjectApi(projectToEdit.PID, input);
      setAllProjects((prev) =>
        prev.map((p) => (p.PID === updatedProject.PID ? updatedProject : p)),
      );
      handleCloseEditModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    formHandlers.resetForm();
    setError(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
    setError(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedProjects = await fetchProjects();
        setAllProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);

        const groups = await fetchGroups();
        setAvailableGroups(groups);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.initData'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      setFilteredProjects(allProjects);
      return;
    }

    const results = allProjects.filter((project) => {
      const nameMatch = project.ProjectName?.toLowerCase().includes(term);
      const descMatch = project.Description?.toLowerCase().includes(term);
      const idMatch = project.PID ? String(project.PID).includes(term) : false;
      return nameMatch || descMatch || idMatch;
    });

    setFilteredProjects(results);
  }, [searchTerm, allProjects]);

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();

    if (formState.groupId === '') {
      setError(t('error.selectGroup'));
      return;
    }
    const input: CreateProjectDTO = {
      project_name: formState.projectName,
      description: formState.description,
      g_id: formState.groupId,
      gpu_quota: formState.gpuQuota,
      gpu_access: formState.gpuAccess.join(','),
      mps_memory: formState.mpsMemory,
      max_concurrent_jobs_per_user: formState.maxConcurrentJobsPerUser,
      max_queued_jobs_per_user: formState.maxQueuedJobsPerUser,
      max_job_runtime_seconds: formState.maxJobRuntimeSeconds,
      max_project_users: formState.maxProjectUsers,
      schedule_windows: formState.scheduleWindows,
    };

    try {
      setActionLoading(true);
      setError(null);

      const newProject = await createProjectApi(input);

      if (newProject && newProject.PID) {
        setAllProjects((prev) => [...prev, newProject]);
        handleCloseModal();
      } else {
        setError(t('error.invalidProjectData'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.createProject'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (project: Project) => {
    if (actionLoading || loading) return;
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    const projectId = projectToDelete.PID;

    setActionLoading(true);
    handleCloseDeleteModal();

    try {
      const res = await deleteProjectApi(projectId);
      if (res.message === 'project deleted') {
        setAllProjects((prev) => prev.filter((p) => p.PID !== projectId));
      } else {
        setError(res.message || t('error.deleteProject'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.deleteFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  return {
    t,
    filteredProjects,
    error,
    handleProjectClick,
    handleEditProject,
    handleDeleteClick,
    searchTerm,
    handleSearchChange,
    loading,
    actionLoading,
    formState,
    formHandlers,
    isModalOpen,
    openCreateModal,
    handleCloseModal,
    handleCreateProject,
    availableGroups,
    isEditModalOpen,
    handleCloseEditModal,
    handleUpdateProject,
    isDeleteModalOpen,
    projectToDelete,
    handleCloseDeleteModal,
    handleConfirmDelete,
  };
}

export default useManageProjects;
