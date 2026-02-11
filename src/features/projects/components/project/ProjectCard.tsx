import React from 'react';
import { Project } from '@/core/interfaces/project';
import { useTranslation } from '@nthucscc/utils';
import { FolderIcon } from '@nthucscc/ui';

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onClick(project.PID)}
      className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-accent-500"
    >
      <FolderIcon className="mb-4 h-10 w-10 text-accent-500 transition-colors group-hover:text-accent-600" />

      <h4 className="mb-2 text-lg font-bold text-gray-900 line-clamp-1 dark:text-white group-hover:text-accent-600">
        {project.ProjectName || t('project.untitled')}
      </h4>

      <p className="mb-4 h-12 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {project.Description || t('project.noDescription')}
      </p>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
        <span className="text-xs font-mono text-gray-400">ID: {project.PID}</span>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          GID: {project.GID}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
