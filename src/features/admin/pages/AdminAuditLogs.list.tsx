import { AuditLog } from '@/core/interfaces/audit';
import {
  getActionIcon,
  getActionTheme,
  formatLocalizedDate,
  safePrettyJSON,
} from './AdminAuditLogs.helpers';
import { ChevronDownIcon } from './AdminAuditLogs.icons';

type Props = {
  logs: AuditLog[];
  expandedIds: Set<number | string>;
  toggleExpand: (id: string | string) => void;
  translate: (k: string, f: string) => string;
  currentLang: string;
};

export default function LogList({
  logs,
  expandedIds,
  toggleExpand,
  translate,
  currentLang,
}: Props) {
  return (
    <div className="space-y-4">
      {logs.map((log, idx) => {
        const logId: number | string = (log.id ?? log.ID ?? idx) as number | string;
        const expanded = expandedIds.has(logId);
        const theme = getActionTheme(log.action || '');
        return (
          <div key={String(logId)} className={`rounded-lg border ${theme.border} ${theme.bg} p-4`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`${theme.iconBg} rounded-md p-2`}>
                  {getActionIcon(log.action || '')}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {log.action}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatLocalizedDate(log.created_at || '', currentLang)}
                  </div>
                </div>
              </div>
              <button onClick={() => toggleExpand(String(logId))} className="p-1">
                <ChevronDownIcon
                  className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {expanded && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <strong>{translate('log.user', 'User')}:</strong> {log.user_id}
                </div>
                <div>
                  <strong>{translate('log.resource', 'Resource')}:</strong> {log.resource_type}
                </div>
                <div className="mt-2">
                  <pre className="whitespace-pre-wrap rounded bg-gray-100 p-2 text-xs">
                    {safePrettyJSON(log.new_data ?? log.old_data) ??
                      translate('log.noData', 'No data')}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
