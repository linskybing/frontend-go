import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useGroupPermissions } from '@/shared/hooks/useGroupPermissions';
import { toast, Toaster } from 'react-hot-toast';

// Services
import {
  getConfigFilesByProjectId,
  createConfigFile,
  updateConfigFile,
  deleteConfigFile,
  createInstance,
  deleteInstance,
} from '@/core/services/configFileService';

// Interfaces
import { Project } from '@/core/interfaces/project';
import { ConfigFile } from '@/core/interfaces/configFile';

// Components
import { Button } from '@nthucscc/ui';
import ConfigFileList from '../ConfigFileList';
import AddConfigModal from '../AddConfigModal';
import EditConfigModal from '../EditConfigModal';

interface ConfigFilesTabProps {
  project: Project;
}

const ConfigFilesTab: React.FC<ConfigFilesTabProps> = ({ project }) => {
  const { t } = useTranslation();
  const projectId = project.PID;

  // Check permissions for the project's group
  const { canManage } = useGroupPermissions(project.GID);

  // --- State ---
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfigFile | null>(null);

  // --- Helper: Error Extractor ---
  const getErrorMessage = (err: any) => {
    return err?.response?.data?.message || err?.message || 'An unexpected error occurred';
  };

  // --- Data Fetching ---
  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConfigFilesByProjectId(projectId);
      setConfigFiles(data);
    } catch (err) {
      console.error('Failed to load configs', err);
      toast.error(t('project.detail.fetchError') || 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  }, [projectId, t]);

  // Initial Load
  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  // --- Handlers ---

  const handleCreate = async (data: { filename: string; raw_yaml: string }) => {
    setActionLoading(true);
    try {
      await createConfigFile({ ...data, project_id: projectId });
      toast.success(t('common.createSuccess') || 'Configuration created successfully');
      setIsCreateModalOpen(false);
      await fetchConfigs();
    } catch (err) {
      console.error('Error creating config file:', err);
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: { filename: string; raw_yaml: string }) => {
    if (!selectedConfig) return;
    setActionLoading(true);
    try {
      await updateConfigFile(selectedConfig.CFID, {
        filename: data.filename || selectedConfig.Filename,
        raw_yaml: data.raw_yaml || selectedConfig.Content,
      });
      toast.success(t('common.updateSuccess') || 'Configuration updated successfully');
      setIsEditModalOpen(false);
      await fetchConfigs();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (configid: string) => {
    if (!window.confirm(t('common.confirmDelete'))) return;

    setActionLoading(true);
    const deletePromise = deleteConfigFile(configId);

    try {
      await toast.promise(deletePromise, {
        loading: 'Deleting...',
        success: 'Configuration deleted',
        error: (err) => getErrorMessage(err),
      });
      await fetchConfigs();
    } catch (_error: unknown) {
      // error handled by toast.promise
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateInstance = async (id: string) => {
    setActionLoading(true);
    try {
      await createInstance(id);
      toast.success(t('project.detail.instanceCreateSent'));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInstance = async (id: string) => {
    if (!window.confirm(t('project.detail.confirmDeleteInstance'))) return;

    setActionLoading(true);
    try {
      await deleteInstance(id);
      toast.success(t('project.detail.instanceDeleteSent'));
      await fetchConfigs();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (config: ConfigFile) => {
    setSelectedConfig(config);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{
          zIndex: 99999,
        }}
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-600">
          <div>
            <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
              {t('project.detail.configTitle')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {t('project.detail.configDesc')}
            </p>
          </div>
          {canManage && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={actionLoading}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-150 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <PlusIcon className="h-5 w-5" />
              {actionLoading ? t('common.loading') : t('project.detail.addConfig')}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent mb-2"></div>
              <p>{t('common.loading')} Configurations...</p>
            </div>
          ) : (
            <ConfigFileList
              projectId={projectId}
              configFiles={configFiles}
              onDelete={handleDelete}
              onEdit={openEditModal}
              onCreateInstance={handleCreateInstance}
              onDeleteInstance={handleDeleteInstance}
              actionLoading={actionLoading}
              canManage={canManage}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddConfigModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        actionLoading={actionLoading}
        project={project}
      />
      <EditConfigModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
        selectedConfig={selectedConfig}
        actionLoading={actionLoading}
      />
    </>
  );
};

export default ConfigFilesTab;
