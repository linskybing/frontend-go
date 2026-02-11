import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { ConfigFile } from '@/core/interfaces/configFile';
import { ConfigFileItem } from './configfile/ConfigFileItem';

// Icons
import { Squares2X2Icon, BriefcaseIcon } from './common/Icons';

interface ConfigFileListProps {
  configFiles: ConfigFile[];
  onDelete: (id: string) => void;
  onEdit: (config: ConfigFile) => void;
  onCreateInstance: (id: string) => void;
  onDeleteInstance: (id: string) => void;
  actionLoading: boolean;
  canManage?: boolean;
  projectId?: number;
}

type TabType = 'general' | 'job';

export default function ConfigFileList({
  configFiles,
  onDelete,
  onEdit,
  onCreateInstance,
  onDeleteInstance,
  actionLoading,
  canManage = true,
  projectId,
}: ConfigFileListProps) {
  const { t } = useTranslation();

  // Persist active tab per-project so re-renders (loading states) keep selection
  const storageKey = `configfiles_tab_${projectId ?? 'global'}`;
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved === 'job' ? 'job' : 'general';
    } catch (_error: unknown) {
      return 'general';
    }
  });

  // keep storage in sync
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, activeTab);
    } catch (_error: unknown) {
      // ignore storage errors
    }
  }, [storageKey, activeTab]);

  const { generalFiles, jobFiles } = useMemo(() => {
    const general: ConfigFile[] = [];
    const jobs: ConfigFile[] = [];

    configFiles.forEach((file) => {
      const isJob = /kind:\s*Job/i.test(file.Content || '');

      if (isJob) {
        jobs.push(file);
      } else {
        general.push(file);
      }
    });

    return { generalFiles: general, jobFiles: jobs };
  }, [configFiles]);

  const displayFiles = activeTab === 'general' ? generalFiles : jobFiles;

  // --- Helper: Empty State Component ---
  const EmptyState = ({ type }: { type: TabType }) => (
    <div className="flex flex-col items-center justify-center rounded-b-xl border border-t-0 border-dashed border-gray-300 bg-gray-50/50 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        {type === 'general' ? (
          <Squares2X2Icon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        ) : (
          <BriefcaseIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
        {type === 'general'
          ? t('configFile.noGeneralConfigs') || 'No general workloads found'
          : t('configFile.noJobConfigs') || 'No job configurations found'}
      </h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-sm">
        {type === 'general'
          ? 'Config files for Deployments, Pods, and Services will appear here.'
          : 'Config files for Batch Jobs will appear here.'}
      </p>
    </div>
  );

  return (
    <div className="space-y-0">
      {/* --- Tabs Header --- */}
      <div className="flex items-center gap-1 rounded-t-xl border border-b-0 border-gray-200 bg-gray-50/50 p-1.5 dark:border-gray-700 dark:bg-gray-800/50">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-white text-accent-600 shadow-sm ring-1 ring-black/5 dark:bg-gray-700 dark:text-accent-400 dark:ring-white/5'
              : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-300'
          }`}
        >
          <Squares2X2Icon className="h-4 w-4" />
          <span>General</span>
          <span
            className={`ml-1.5 rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === 'general'
                ? 'bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
            }`}
          >
            {generalFiles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('job')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
            activeTab === 'job'
              ? 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5 dark:bg-gray-700 dark:text-amber-400 dark:ring-white/5'
              : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-300'
          }`}
        >
          <BriefcaseIcon className="h-4 w-4" />
          <span>Jobs</span>
          <span
            className={`ml-1.5 rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === 'job'
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
            }`}
          >
            {jobFiles.length}
          </span>
        </button>
      </div>

      {/* --- List Content --- */}
      <div className="overflow-visible rounded-b-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {displayFiles.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayFiles.map((cf) => (
              <ConfigFileItem
                key={cf.CFID}
                configFile={cf}
                onDelete={onDelete}
                onEdit={onEdit}
                onCreateInstance={onCreateInstance}
                onDeleteInstance={onDeleteInstance}
                actionLoading={actionLoading}
                canManage={!!canManage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
