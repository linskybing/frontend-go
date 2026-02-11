import { useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { ConfigFile } from '@/core/interfaces/configFile';
import { Resource } from '@/core/interfaces/resource';
import { getResourcesByConfigFile } from '@/core/services/resourceService';
import { ChevronIcon, RocketLaunchIcon, StopCircleIcon } from '../common/Icons';
import { MoreActionsButton } from './MoreActionsButton';
import { ResourceList } from '../resource/ResourceList';

interface ConfigFileItemProps {
  configFile: ConfigFile;
  onDelete: (id: string) => void;
  onEdit: (config: ConfigFile) => void;
  onCreateInstance: (id: string) => void;
  onDeleteInstance: (id: string) => void;
  actionLoading: boolean;
  canManage: boolean;
}

export const ConfigFileItem = ({
  configFile,
  onDelete,
  onEdit,
  onCreateInstance,
  onDeleteInstance,
  actionLoading,
  canManage,
}: ConfigFileItemProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const handleToggleExpand = async () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    if (nextState && !hasFetched) {
      setIsLoadingResources(true);
      try {
        const res = await getResourcesByConfigFile(configFile.CFID);
        setResources(res);
        setHasFetched(true);
      } catch (error: unknown) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoadingResources(false);
      }
    }
  };

  return (
    <div className="group bg-white transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      {/* 1. Header Row */}
      <div className="flex items-center gap-4 p-4">
        {/* Chevron Expand Button */}
        <button
          onClick={handleToggleExpand}
          className={`flex-shrink-0 rounded-full p-2 text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-200 ${
            isExpanded ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200' : ''
          }`}
          disabled={actionLoading}
        >
          <ChevronIcon isOpen={isExpanded} className="h-4 w-4" />
        </button>

        {/* Info Area */}
        <div className="flex-grow min-w-0 flex flex-col justify-center">
          <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
            {configFile.Filename}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">
              #{configFile.CFID}
            </span>
            <span>•</span>
            <span>{new Date(configFile.CreatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Buttons Area */}
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          {/* Action: Deploy (Visible on Desktop) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateInstance(configFile.CFID);
            }}
            disabled={actionLoading}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-700 shadow-sm transition-all hover:bg-accent-100 hover:border-accent-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 dark:border-accent-900/50 dark:bg-accent-900/20 dark:text-accent-300 dark:hover:bg-accent-900/40"
            title={t('configFile.deploy') || 'Deploy Instance'}
          >
            <RocketLaunchIcon className="h-3.5 w-3.5" />
            <span>{t('configFile.deploy') || 'Deploy'}</span>
          </button>

          {/* Action: Destroy (Visible on Desktop) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteInstance(configFile.CFID);
            }}
            disabled={actionLoading}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 shadow-sm transition-all hover:bg-red-100 hover:border-red-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
            title={t('configFile.destroy') || 'Destroy Instance'}
          >
            <StopCircleIcon className="h-3.5 w-3.5" />
            <span>{t('configFile.destroy') || 'Stop'}</span>
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

          {/* Kebab Menu (Edit/Delete) */}
          <MoreActionsButton
            onEdit={() => onEdit(configFile)}
            onDelete={() => onDelete(configFile.CFID)}
            canManage={canManage}
          />
        </div>
      </div>

      {/* 2. Expanded Content */}
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px]' : 'max-h-0'
        }`}
      >
        {/* Render Resource List when expanded */}
        <ResourceList resources={resources} isLoading={isLoadingResources} />
      </div>
    </div>
  );
};
