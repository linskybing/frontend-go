import React from 'react';
import { Project } from '@/core/interfaces/project';
import { useTranslation } from '@nthucscc/utils';
import { FolderIcon, PencilIcon, TrashIcon } from '@nthucscc/ui';

interface ProjectListTableProps {
  projects: Project[];
  onClick?: (id: string) => void;
  // legacy / alternate prop name
  onProjectClick?: (id: string) => void;
  // Optional compatibility props used by pages that wrap this table
  error?: string | null;
  onDeleteProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  searchTerm?: string;
  isActionLoading?: boolean;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProjectListTable: React.FC<ProjectListTableProps> = ({
  projects,
  onClick,
  onProjectClick,
  onDeleteProject,
  onEditProject,
}) => {
  const { t } = useTranslation();

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <FolderIcon size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('project.empty')}</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('project.list.empty.noProjects')}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {t('project.name')}
            </th>
            <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 md:table-cell dark:text-gray-300">
              {t('project.description')}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {t('project.group')}
            </th>
            <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:table-cell dark:text-gray-300">
              {t('common.createdAt')}
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {t('common.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {projects.map((project) => (
            <tr
              key={project.PID}
              className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="mr-4 flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                      <FolderIcon size={24} />
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => (onClick ?? onProjectClick)?.(project.PID)}
                      className="cursor-pointer text-sm font-semibold text-gray-900 hover:text-accent-600 dark:text-white dark:hover:text-accent-400"
                    >
                      {project.ProjectName}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      ID: {project.PID}
                    </div>
                  </div>
                </div>
              </td>
              <td className="hidden px-6 py-4 md:table-cell">
                <div className="max-w-xs text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.Description || (
                    <span className="italic text-gray-400 dark:text-gray-500">
                      {t('project.noDescription')}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-800 dark:bg-accent-900/30 dark:text-accent-400">
                  GID: {project.GID}
                </span>
              </td>
              <td className="hidden px-6 py-4 whitespace-nowrap text-left text-sm text-gray-600 sm:table-cell dark:text-gray-400">
                {new Date(project.CreatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {onEditProject && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProject(project);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent-50 px-3 py-2 text-accent-700 transition-colors hover:bg-accent-100 dark:bg-accent-900/30 dark:text-accent-400 dark:hover:bg-accent-900/50"
                      title={t('common.edit')}
                    >
                      <PencilIcon size={16} />
                      <span className="hidden sm:inline">{t('common.edit')}</span>
                    </button>
                  )}
                  {onDeleteProject && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-red-700 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      title={t('common.delete')}
                    >
                      <TrashIcon size={16} />
                      <span className="hidden sm:inline">{t('common.delete')}</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectListTable;
