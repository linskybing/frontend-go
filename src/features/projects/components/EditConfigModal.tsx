import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useTranslation } from '@nthucscc/utils';
import { ConfigFile } from '@/core/interfaces/configFile';
import { PVC } from '@/core/interfaces/pvc';
import { checkMyUserStorageStatus } from '@/core/services/resource/storage';
import { getMyGroupStorages } from '@/core/services/resource/groupStorageService';
import { getUsername } from '@/core/services/authService';
import { generateMultiDocYAML } from '@/features/projects/utils/k8sYamlGenerator';
import { getProjectById } from '@/core/services/projectService';

// Refactored Imports
import { BaseModal } from '@nthucscc/ui';
import ResourceWizard from './configfile/ResourceWizard';
import { useConfigForm } from '@/shared/hooks/useConfigForm';

interface EditConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { filename: string; raw_yaml: string }) => void;
  selectedConfig: ConfigFile | null;
  actionLoading?: boolean;
}

export default function EditConfigModal({
  isOpen,
  onClose,
  onSave,
  selectedConfig,
  actionLoading = false,
}: EditConfigModalProps) {
  const { t } = useTranslation();

  const {
    filename,
    setFilename,
    rawYaml,
    updateRawYaml,
    resources,
    setResources,
    activeTab,
    switchTab,
    error,
    setError,
  } = useConfigForm(selectedConfig, isOpen);

  // External Data State
  const [groupPvcs, setGroupPvcs] = useState<PVC[]>([]);
  const [hasUserStorage, setHasUserStorage] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-light');

  // Load external data
  useEffect(() => {
    if (isOpen && selectedConfig) {
      const projectPromise = getProjectById(selectedConfig.ProjectID).catch(() => null);

      Promise.all([
        projectPromise,
        getMyGroupStorages().catch(() => []),
        getUsername() ? checkMyUserStorageStatus() : Promise.resolve(false),
      ]).then(([projInfo, allMyPvcs, storage]) => {
        const groupId = projInfo?.GID;
        const pvcsArray = Array.isArray(allMyPvcs) ? allMyPvcs : [];

        const filtered = groupId
          ? pvcsArray.filter((p: any) => String(p.groupId ?? p.group_id) === String(groupId))
          : pvcsArray;

        const converted = filtered
          .map((p: any) => ({
            name: p.pvcName || p.name || '',
            namespace: p.namespace || '',
            size: String(p.capacity ?? p.size ?? ''),
            status: p.status || '',
          }))
          .filter((p) => p.name);

        setGroupPvcs(converted);
        setHasUserStorage(!!storage);
      });
    }
  }, [isOpen, selectedConfig]);

  // Theme observer
  useEffect(() => {
    const updateTheme = () =>
      setEditorTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light');
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSave = () => {
    if (!filename.trim())
      return setError(t('config.error.filenameRequired') || 'Filename is required.');
    const finalYaml = activeTab === 'wizard' ? generateMultiDocYAML(resources) : rawYaml;
    if (!finalYaml.trim())
      return setError(t('config.error.yamlEmpty') || 'YAML content cannot be empty.');
    onSave({ filename, raw_yaml: finalYaml });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('config.editTitle') || 'Edit Configuration'}
      subtitle={t('config.editSubtitle') || 'Modify configuration using wizard or YAML editor.'}
      maxWidth="max-w-7xl"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('config.filename.label')}
        </label>
        <input
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => switchTab('wizard')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'wizard'
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Resource Wizard
          </button>
          <button
            onClick={() => switchTab('yaml')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'yaml'
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            YAML Preview
          </button>
        </nav>
      </div>

      <div className="h-[60vh] overflow-y-auto mb-6">
        {activeTab === 'wizard' ? (
          <ResourceWizard
            resources={resources}
            setResources={setResources}
            groupPvcs={groupPvcs}
            hasUserStorage={hasUserStorage}
          />
        ) : (
          <div className="h-full border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
            <MonacoEditor
              width="100%"
              height="100%"
              language="yaml"
              theme={editorTheme}
              value={rawYaml}
              onChange={updateRawYaml}
              options={{ minimap: { enabled: true }, scrollBeyondLastLine: false, fontSize: 14 }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-red-600 dark:text-red-400">{error && `Error: ${error}`}</span>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={actionLoading}
            className="w-full sm:w-auto px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-500 disabled:opacity-50"
          >
            {actionLoading ? t('config.saving') : t('config.saveButton')}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
