import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@nthucscc/utils';
import { Pagination, SearchInput } from '@nthucscc/components-shared';

import { PageLayout } from '@nthucscc/ui';
import { getProjects } from '@/core/services/projectService';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { Project } from '@/core/interfaces/project';

// Components
import ProjectCard from '../components/project/ProjectCard';
import ProjectListTable from '../components/project/ProjectListTable';
import { GridIcon, ListIcon } from '@nthucscc/ui';

// Loading Skeleton
const SkeletonLoader = ({ viewMode }: { viewMode: 'grid' | 'list' }) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-48 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
        />
      ))}
    </div>
  );
};

export default function Projects() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI States (Default List View)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = viewMode === 'list' ? 10 : 8;

  // Fetch Data
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = localStorage.getItem('userData');
        if (!userData) throw new Error(t('error.userNotLogged'));

        const { user_id: userId } = JSON.parse(userData);
        const [allProjects, userGroups] = await Promise.all([
          getProjects(),
          getGroupsByUser(userId),
        ]);

        if (controller.signal.aborted) return;

        // console.log('All projects:', allProjects);
        // console.log('User groups:', userGroups);

        const userGroupIds = new Set(userGroups.map((ug) => ug.GID));
        // console.log('User group IDs:', userGroupIds);

        const filtered = allProjects.filter((p) => {
          // console.log(`Checking project ${p.ProjectName} with GID:`, p.GID);
          return userGroupIds.has(p.GID);
        });

        // console.log('Filtered projects:', filtered);
        setProjects(filtered);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load projects');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [t]);

  // Filtering & Pagination
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    const lower = searchTerm.toLowerCase();
    return projects.filter(
      (p) =>
        p.ProjectName.toLowerCase().includes(lower) || p.Description?.toLowerCase().includes(lower),
    );
  }, [projects, searchTerm]);

  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  // Handlers
  const handleProjectClick = useCallback((id: string) => navigate(`/projects/${id}`), [navigate]);

  return (
    <PageLayout
      title={t('page.projects.title')}
      description={t('page.projects.description')}
      breadcrumb={t('breadcrumb.projects')}
    >
      <div className="p-4 md:p-6">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('project.list.title')}
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-64">
              <SearchInput
                value={searchTerm}
                onChange={(val) => {
                  setSearchTerm(val);
                  setCurrentPage(1);
                }}
                placeholder={t('search.projectsPlaceholder')}
              />
            </div>

            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => setViewMode('list')}
                className={`rounded p-1.5 transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ListIcon size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <GridIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonLoader viewMode={viewMode} />
        ) : error ? (
          <div className="py-20 text-center text-red-500">{error}</div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-gray-500">{t('project.empty')}</div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentProjects.map((p) => (
                  <ProjectCard key={p.PID} project={p} onClick={handleProjectClick} />
                ))}
              </div>
            ) : (
              <ProjectListTable projects={currentProjects} onClick={handleProjectClick} />
            )}

            {filteredProjects.length > itemsPerPage && (
              <div className="mt-6">
                <Pagination
                  current={currentPage}
                  total={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
