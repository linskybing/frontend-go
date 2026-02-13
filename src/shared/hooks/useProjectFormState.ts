import { useState, ChangeEvent } from 'react';
import type { ScheduleWindow } from '@/core/interfaces/project';

export interface ProjectFormState {
  projectName: string;
  description: string;
  gpuQuota: number;
  gpuAccess: string[];
  mpsMemory: number;
  maxConcurrentJobsPerUser: number;
  maxQueuedJobsPerUser: number;
  maxJobRuntimeSeconds: number;
  maxProjectUsers: number;
  scheduleWindows: ScheduleWindow[];
  groupId: string;
  selectedGroupName: string;
}

export interface ProjectFormHandlers {
  onProjectNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onGpuQuotaChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGpuAccessChange: (access: string) => void;
  onMpsMemoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxConcurrentJobsPerUserChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxQueuedJobsPerUserChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxJobRuntimeSecondsChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxProjectUsersChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onScheduleWindowChange: (index: number, field: keyof ScheduleWindow, value: string | number) => void;
  addScheduleWindow: () => void;
  removeScheduleWindow: (index: number) => void;
  onSelectedGroupChange: (groupId: string, groupName: string) => void;
  resetForm: () => void;
  loadProjectData: (data: Partial<ProjectFormState>) => void;
}

/**
 * Custom hook for managing project form state.
 * Consolidates all form-related state and handlers into one reusable hook.
 */
export const useProjectFormState = (): [ProjectFormState, ProjectFormHandlers] => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [gpuQuota, setGpuQuota] = useState<number>(0);
  const [gpuAccess, setGpuAccess] = useState<string[]>(['shared']);
  const [mpsMemory, setMpsMemory] = useState<number>(0);
  const [maxConcurrentJobsPerUser, setMaxConcurrentJobsPerUser] = useState<number>(0);
  const [maxQueuedJobsPerUser, setMaxQueuedJobsPerUser] = useState<number>(0);
  const [maxJobRuntimeSeconds, setMaxJobRuntimeSeconds] = useState<number>(0);
  const [maxProjectUsers, setMaxProjectUsers] = useState<number>(0);
  const [scheduleWindows, setScheduleWindows] = useState<ScheduleWindow[]>([]);
  const [groupId, setGroupId] = useState<string>('');
  const [selectedGroupName, setSelectedGroupName] = useState('');

  const state: ProjectFormState = {
    projectName,
    description,
    gpuQuota,
    gpuAccess,
    mpsMemory,
    maxConcurrentJobsPerUser,
    maxQueuedJobsPerUser,
    maxJobRuntimeSeconds,
    maxProjectUsers,
    scheduleWindows,
    groupId,
    selectedGroupName,
  };

  const handlers: ProjectFormHandlers = {
    onProjectNameChange: (e: ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value),
    onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
    onGpuQuotaChange: (e: ChangeEvent<HTMLInputElement>) => setGpuQuota(Number(e.target.value)),
    onGpuAccessChange: (access: string) => {
      setGpuAccess((prev) => {
        if (prev.includes(access)) {
          return prev.filter((a) => a !== access);
        }
        return [...prev, access];
      });
    },
    onMpsMemoryChange: (e: ChangeEvent<HTMLInputElement>) => setMpsMemory(Number(e.target.value)),
    onMaxConcurrentJobsPerUserChange: (e: ChangeEvent<HTMLInputElement>) =>
      setMaxConcurrentJobsPerUser(Number(e.target.value)),
    onMaxQueuedJobsPerUserChange: (e: ChangeEvent<HTMLInputElement>) =>
      setMaxQueuedJobsPerUser(Number(e.target.value)),
    onMaxJobRuntimeSecondsChange: (e: ChangeEvent<HTMLInputElement>) =>
      setMaxJobRuntimeSeconds(Number(e.target.value)),
    onMaxProjectUsersChange: (e: ChangeEvent<HTMLInputElement>) =>
      setMaxProjectUsers(Number(e.target.value)),
    onScheduleWindowChange: (index, field, value) => {
      setScheduleWindows((prev) =>
        prev.map((window, i) => (i === index ? { ...window, [field]: value } : window)),
      );
    },
    addScheduleWindow: () => {
      setScheduleWindows((prev) => [...prev, { weekday: 1, start: '09:00', end: '18:00' }]);
    },
    removeScheduleWindow: (index: number) => {
      setScheduleWindows((prev) => prev.filter((_, i) => i !== index));
    },
    onSelectedGroupChange: (id: string, name: string) => {
      setGroupId(id);
      setSelectedGroupName(name);
    },
    resetForm: () => {
      setProjectName('');
      setDescription('');
      setGpuQuota(0);
      setGpuAccess(['shared']);
      setMpsMemory(0);
      setMaxConcurrentJobsPerUser(0);
      setMaxQueuedJobsPerUser(0);
      setMaxJobRuntimeSeconds(0);
      setMaxProjectUsers(0);
      setScheduleWindows([]);
      setGroupId('');
      setSelectedGroupName('');
    },
    loadProjectData: (data: Partial<ProjectFormState>) => {
      if (data.projectName !== undefined) setProjectName(data.projectName);
      if (data.description !== undefined) setDescription(data.description);
      if (data.gpuQuota !== undefined) setGpuQuota(data.gpuQuota);
      if (data.gpuAccess !== undefined) setGpuAccess(data.gpuAccess);
      if (data.mpsMemory !== undefined) setMpsMemory(data.mpsMemory);
      if (data.maxConcurrentJobsPerUser !== undefined)
        setMaxConcurrentJobsPerUser(data.maxConcurrentJobsPerUser);
      if (data.maxQueuedJobsPerUser !== undefined) setMaxQueuedJobsPerUser(data.maxQueuedJobsPerUser);
      if (data.maxJobRuntimeSeconds !== undefined) setMaxJobRuntimeSeconds(data.maxJobRuntimeSeconds);
      if (data.maxProjectUsers !== undefined) setMaxProjectUsers(data.maxProjectUsers);
      if (data.scheduleWindows !== undefined) setScheduleWindows(data.scheduleWindows);
      if (data.groupId !== undefined) setGroupId(data.groupId);
      if (data.selectedGroupName !== undefined) setSelectedGroupName(data.selectedGroupName);
    },
  };

  return [state, handlers];
};
