import useManageProjects from './useManageProjects';
import ProjectList from '@/features/projects/components/project/ProjectListTable';
import ManageProjectsModals from './ManageProjectsModals';
import ManageProjectsHeader from './ManageProjectsHeader';
import ManageProjectsActionBar from './ManageProjectsActionBar';

export default function ManageProjects() {
  const {
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
  } = useManageProjects();

  return (
    <div className="relative">
      <div className="min-h-screen rounded-xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:p-12">
        <ManageProjectsHeader
          title={t('project.list.title')}
          description={t('project.list.description')}
        />

        <ManageProjectsActionBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onCreateClick={openCreateModal}
          loading={loading}
          actionLoading={actionLoading}
          searchPlaceholder={t('project.list.searchPlaceholder')}
        />

        <ProjectList
          projects={filteredProjects}
          error={error}
          onProjectClick={handleProjectClick}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteClick}
          searchTerm={searchTerm}
          isActionLoading={actionLoading}
          onSearchChange={handleSearchChange}
        />
      </div>

      <ManageProjectsModals
        formState={formState}
        formHandlers={formHandlers}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        handleCreateProject={handleCreateProject}
        availableGroups={availableGroups}
        isEditModalOpen={isEditModalOpen}
        handleCloseEditModal={handleCloseEditModal}
        handleUpdateProject={handleUpdateProject}
        isDeleteModalOpen={isDeleteModalOpen}
        projectToDelete={projectToDelete}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
        actionLoading={actionLoading}
        error={error}
      />
    </div>
  );
}
