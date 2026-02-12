import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useTranslation } from '@nthucscc/utils'; // Assumed path
import { Project } from '@/core/interfaces/project';
import { PVC } from '@/core/interfaces/pvc';
import { checkMyUserStorageStatus } from '@/core/services/resource/storage';
import { getMyGroupStorages } from '@/core/services/resource/groupStorageService';
import { getUsername } from '@/core/services/authService';
import { getProjectById } from '@/core/services/projectService';
import { generateMultiDocYAML } from '@/features/projects/utils/k8sYamlGenerator';

// Shared Components & Hooks
import { BaseModal } from '@nthucscc/ui';
import ResourceWizard from './configfile/ResourceWizard';
import { useConfigForm } from '@/shared/hooks/useConfigForm';

interface AddConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  // support both legacy and new prop names
  onConfirm?: (data: { filename: string; raw_yaml: string }) => void;
  onCreate?: (data: { filename: string; raw_yaml: string }) => void;
  // accept either full project or just projectId
  projectId?: string;
  project?: Project | null;
  loading?: boolean;
  actionLoading?: boolean;
}

export default function AddConfigModal({
  isOpen,
  onClose,
  onConfirm,
  onCreate,
  projectId,
  project,
  loading = false,
  actionLoading = false,
}: AddConfigModalProps) {
  const { t } = useTranslation();

  // Reuse hook, pass null to indicate no initial config
  const {
    filename,
    setFilename,
    rawYaml,
    setRawYaml,
    updateRawYaml,
    resources,
    setResources,
    activeTab,
    switchTab,
    error,
    setError,
  } = useConfigForm(null, isOpen);

  // External data state
  const [groupPvcs, setGroupPvcs] = useState<PVC[]>([]);
  const [hasUserStorage, setHasUserStorage] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-light');

  // Initialize: reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFilename('');
      setRawYaml('');
      setResources([]);
      setError(null);

      // Read external data
      const pid = project?.PID ?? projectId;
      const projectPromise = pid ? getProjectById(pid).catch(() => null) : Promise.resolve(project);

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
          .filter((pvc: PVC) => pvc.name);

        setGroupPvcs(converted);
        setHasUserStorage(!!storage);
      });
    }
  }, [isOpen, projectId, setFilename, setRawYaml, setResources, setError, project]);

  // Handle editor theme
  useEffect(() => {
    const updateTheme = () =>
      setEditorTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light');
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = () => {
    if (!filename.trim()) {
      return setError(t('config.error.filenameRequired') || 'Please enter filename');
    }

    const finalYaml = activeTab === 'wizard' ? generateMultiDocYAML(resources) : rawYaml;

    if (!finalYaml.trim()) {
      return setError(t('config.error.yamlEmpty') || 'Content cannot be empty');
    }

    const cb = onConfirm ?? onCreate;
    if (cb) cb({ filename, raw_yaml: finalYaml });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('config.createTitle') || 'Add Config File'}
      subtitle={t('config.createSubtitle') || 'Use wizard mode or write YAML directly'}
      maxWidth="max-w-7xl"
    >
      <div className="flex flex-col h-[75vh]">
        {/* Filename input area (specific to add mode) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('config.filename.label') || 'Filename'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="example-config.yaml"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4 flex-shrink-0">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => switchTab('wizard')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'wizard'
                  ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Resource Wizard
            </button>
            <button
              onClick={() => switchTab('yaml')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'yaml'
                  ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              YAML Preview
            </button>
          </nav>
        </div>

        {/* Content Area - Auto-fill remaining height */}
        <div className="flex-grow overflow-hidden relative">
          {activeTab === 'wizard' ? (
            <div className="h-full overflow-y-auto pr-2">
              <ResourceWizard
                resources={resources}
                setResources={setResources}
                groupPvcs={groupPvcs}
                hasUserStorage={hasUserStorage}
              />
            </div>
          ) : (
            <div className="h-full border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
              <MonacoEditor
                width="100%"
                height="100%"
                language="yaml"
                theme={editorTheme}
                value={rawYaml}
                onChange={updateRawYaml}
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
            {error && `Error: ${error}`}
          </span>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {t('common.cancel') || 'Cancel'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || actionLoading}
              className="w-full sm:w-auto px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading || actionLoading
                ? t('config.creating') || 'Creating...'
                : t('common.create') || 'Create'}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
