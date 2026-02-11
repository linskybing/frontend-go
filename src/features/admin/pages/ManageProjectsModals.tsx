import type { FormEvent } from 'react';
import { Project } from '@/core/interfaces/project';
import CreateProjectForm from '@/features/projects/components/CreateProjectForm';
import EditProjectForm from '@/features/projects/components/EditProjectForm';
import { DeleteConfirmationModal } from '@nthucscc/ui';

type Props = {
  // Creation
  formState: any;
  formHandlers: any;
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleCreateProject: (e: FormEvent) => Promise<void> | void;
  availableGroups: any[];
  // Edit
  isEditModalOpen: boolean;
  handleCloseEditModal: () => void;
  handleUpdateProject: (e: FormEvent) => Promise<void> | void;
  // Delete
  isDeleteModalOpen: boolean;
  projectToDelete: Project | null;
  handleCloseDeleteModal: () => void;
  handleConfirmDelete: () => Promise<void> | void;
  // Common
  actionLoading: boolean;
  error: string | null;
};

export default function ManageProjectsModals({
  formState,
  formHandlers,
  isModalOpen,
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
  actionLoading,
  error,
}: Props) {
  const CreateModal = () => (
    <CreateProjectForm
      projectName={formState.projectName}
      description={formState.description}
      groupId={formState.groupId}
      gpuQuota={formState.gpuQuota}
      mpsMemory={formState.mpsMemory}
      loading={actionLoading}
      error={error}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      onProjectNameChange={formHandlers.onProjectNameChange}
      onDescriptionChange={formHandlers.onDescriptionChange}
      onGpuQuotaChange={formHandlers.onGpuQuotaChange}
      onMpsMemoryChange={formHandlers.onMpsMemoryChange}
      onGroupIdChange={formHandlers.onGroupIdChange}
      onSubmit={handleCreateProject}
      availableGroups={availableGroups}
      selectedGroupName={formState.selectedGroupName}
      onSelectedGroupChange={formHandlers.onSelectedGroupChange}
    />
  );

  const EditModal = () => (
    <EditProjectForm
      projectName={formState.projectName}
      description={formState.description}
      gpuQuota={formState.gpuQuota}
      gpuAccess={formState.gpuAccess}
      mpsMemory={formState.mpsMemory}
      loading={actionLoading}
      error={error}
      isOpen={isEditModalOpen}
      onClose={handleCloseEditModal}
      onProjectNameChange={formHandlers.onProjectNameChange}
      onDescriptionChange={formHandlers.onDescriptionChange}
      onGpuQuotaChange={formHandlers.onGpuQuotaChange}
      onGpuAccessChange={formHandlers.onGpuAccessChange}
      onMpsMemoryChange={formHandlers.onMpsMemoryChange}
      onSubmit={handleUpdateProject}
    />
  );

  const DeleteModal = () => (
    <DeleteConfirmationModal
      isOpen={isDeleteModalOpen}
      onClose={handleCloseDeleteModal}
      onConfirm={handleConfirmDelete}
      item={projectToDelete}
      itemType="Project"
      loading={actionLoading}
    />
  );

  return (
    <>
      <CreateModal />
      <EditModal />
      <DeleteModal />
    </>
  );
}
