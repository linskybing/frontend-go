import { Link } from 'react-router-dom';
import { useTranslation } from '@nthucscc/utils';
import { FolderIcon } from '@heroicons/react/24/outline';
import { Project } from '@/core/interfaces/project';

interface RecentActivityProps {
  projects: Project[];
}

export default function RecentActivity({ projects }: RecentActivityProps) {
  const { t } = useTranslation();
  const recent = projects.slice(0, 5);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        {t('page.dashboard.recentProjects')}
      </h3>
      {recent.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">{t('page.dashboard.noProjects')}</p>
      ) : (
        <div className="space-y-1">
          {recent.map((project) => (
            <Link
              key={project.PID}
              to={`/projects/${project.PID}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50"
            >
              <FolderIcon className="h-5 w-5 text-accent-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 dark:text-white">
                  {project.ProjectName}
                </p>
                {project.Description && (
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {project.Description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
