import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '@nthucscc/utils';
import { PageMeta } from '@nthucscc/components-shared';
import { ChartBarIcon, Cog6ToothIcon, UsersIcon } from '@heroicons/react/24/outline';

// Services & Context
import { getProjectById } from '@/core/services/projectService';
import { getUsername } from '@/core/services/authService';
import { useNamespaceMessages } from '@/core/context/hooks/useNamespaceMessages';
import { Project } from '@/core/interfaces/project';

// Components
import { PageBreadcrumb } from '@nthucscc/ui';
import MonitoringPanel from '@/features/monitoring/components/MonitoringPanel';
import ConfigFilesTab from '../components/project/ConfigFilesTab';
import ProjectImageManagement from '../components/ProjectImageManagement';
import CreateFormModal from '@/features/forms/components/CreateFormModal';

export default function ProjectDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();

  // 1. WebSocket Integration
  const username = getUsername();
  const namespace = useMemo(() => `proj-${id}-${username}`, [id, username]);
  const { messages } = useNamespaceMessages(namespace);

  // 2. Project Data State
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Project...</div>;
  if (!project) return <div className="p-10 text-center">Project Not Found</div>;

  return (
    <div>
      <PageMeta title={project.ProjectName} />
      <PageBreadcrumb pageTitle={project.ProjectName} />

      {/* Tab Navigation */}
      <div className="mb-6 mt-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: t('project.detail.tab.overview'), icon: ChartBarIcon },
            {
              id: 'configurations',
              label: t('project.detail.tab.configurations'),
              icon: Cog6ToothIcon,
            },
            { id: 'images', label: 'Images', icon: ChartBarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('project.about')}
                </h3>
                {/* Removed Jobs button and Request Support link here */}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {project.Description || t('project.noDescription')}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">ID</div>
                  <div className="font-mono font-medium">{project.PID}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Group</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{project.GID}</span>
                    <Link
                      to={`/groups/${project.GID}`}
                      className="inline-flex items-center text-xs text-accent-600 hover:text-accent-500 dark:text-accent-400"
                      title={t('groups.manageMembers')}
                    >
                      <UsersIcon className="h-3 w-3 mr-1" />
                      Manage
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Created</div>
                  <div className="font-medium">
                    {new Date(project.CreatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Quota</div>
                  <div className="font-medium">
                    {project.GPUQuota} ({project.GPUAccess})
                  </div>
                </div>
              </div>
            </div>

            {/* Monitoring Panel */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('monitor.panel.title')}
                </h3>
              </div>
              <MonitoringPanel messages={messages} />
            </div>
          </div>
        )}

        {/* --- Config Tab --- */}
        {activeTab === 'configurations' && <ConfigFilesTab project={project} />}

        {/* --- Images Tab --- */}
        {activeTab === 'images' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <ProjectImageManagement projectId={project.PID} />
          </div>
        )}
      </div>

      <CreateFormModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        projectId={project.PID}
      />
    </div>
  );
}
