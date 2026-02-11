import { useTranslation } from '@nthucscc/utils';
import { Resource } from '@/core/interfaces/resource';
import { ResourceBadge } from './ResourceBadge';
import { CubeIcon, NetworkIcon, StatusOnlineIcon, StatusOfflineIcon } from '../common/Icons';

interface ResourceListProps {
  resources: Resource[];
  isLoading: boolean;
}

const ResourceDetails = ({ resource }: { resource: Resource }) => {
  const resAny = resource as any;
  const isWorkload = ['Deployment', 'Pod', 'Job'].includes(resource.Type);
  const isService = resource.Type === 'Service';

  if (isWorkload && resAny.Containers && Array.isArray(resAny.Containers)) {
    return (
      <div className="mt-2 flex flex-col gap-1.5 pl-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Containers
        </span>
        <div className="flex flex-wrap gap-2">
          {resAny.Containers.map((c: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <CubeIcon className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-medium">{c.Name || c.image || 'container'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isService && resAny.Ports && Array.isArray(resAny.Ports)) {
    return (
      <div className="mt-2 flex flex-col gap-1.5 pl-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Ports
        </span>
        <div className="flex flex-wrap gap-2">
          {resAny.Ports.map((p: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <NetworkIcon className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-mono">
                {p.port}/{p.protocol}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export const ResourceList = ({ resources, isLoading }: ResourceListProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex animate-pulse items-center justify-between">
            <div className="h-4 w-2/5 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-5 w-1/5 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">{t('configFile.noRelatedResources')}</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/30 sm:px-6">
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {t('configFile.relatedResources')}
      </h4>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => {
          const status = (r as any).Status;
          const isRunning = status === 'Running' || status === 'Active';

          return (
            <li
              key={r.RID}
              className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-accent-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-accent-700"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {r.Name}
                    </span>
                    {/* Status Indicator */}
                    {status && (
                      <div className="flex items-center" title={`Status: ${status}`}>
                        {isRunning ? <StatusOnlineIcon /> : <StatusOfflineIcon />}
                      </div>
                    )}
                  </div>
                  <ResourceBadge type={r.Type} />
                </div>
                {/* Details Section (Containers / Ports) */}
                <ResourceDetails resource={r} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
