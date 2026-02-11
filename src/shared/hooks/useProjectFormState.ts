import { useState, ChangeEvent } from 'react';

export interface ProjectFormState {
  projectName: string;
  description: string;
  gpuQuota: number;
  gpuAccess: string[];
  mpsMemory: number;
  groupId: string;
  selectedGroupName: string;
}

export interface ProjectFormHandlers {
  onProjectNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onGpuQuotaChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGpuAccessChange: (access: string) => void;
  onMpsMemoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
  const [groupId, setGroupId] = useState<string>('');
  const [selectedGroupName, setSelectedGroupName] = useState('');

  const state: ProjectFormState = {
    projectName,
    description,
    gpuQuota,
    gpuAccess,
    mpsMemory,
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
      setGroupId('');
      setSelectedGroupName('');
    },
    loadProjectData: (data: Partial<ProjectFormState>) => {
      if (data.projectName !== undefined) setProjectName(data.projectName);
      if (data.description !== undefined) setDescription(data.description);
      if (data.gpuQuota !== undefined) setGpuQuota(data.gpuQuota);
      if (data.gpuAccess !== undefined) setGpuAccess(data.gpuAccess);
      if (data.mpsMemory !== undefined) setMpsMemory(data.mpsMemory);
      if (data.groupId !== undefined) setGroupId(data.groupId);
      if (data.selectedGroupName !== undefined) setSelectedGroupName(data.selectedGroupName);
    },
  };

  return [state, handlers];
};
