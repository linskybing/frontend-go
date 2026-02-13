import type { FormEvent } from 'react';
import JobApplyFooter from './JobApplyFooter';
import type { Project } from '@/core/interfaces/project';
import type { ConfigFile } from '@/core/interfaces/configFile';

type Props = {
  projectId: string;
  setProjectId: (v: string) => void;
  configFileId: string;
  setConfigFileId: (v: string) => void;
  submitType: 'job' | 'workflow';
  setSubmitType: (v: 'job' | 'workflow') => void;
  queueName: string;
  setQueueName: (v: string) => void;
  priority: number;
  setPriority: (v: number) => void;
  projects: Project[];
  projectsLoading: boolean;
  configFiles: ConfigFile[];
  configFilesLoading: boolean;
  configFilesError: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  onClose: () => void;
  handleSubmit: (e: FormEvent) => Promise<void> | void;
};

export default function JobApplyForm({
  projectId,
  setProjectId,
  configFileId,
  setConfigFileId,
  submitType,
  setSubmitType,
  queueName,
  setQueueName,
  priority,
  setPriority,
  projects,
  projectsLoading,
  configFiles,
  configFilesLoading,
  configFilesError,
  loading,
  error,
  success,
  onClose,
  handleSubmit,
}: Props) {
  return (
    <div className="overflow-y-auto flex-1 pr-2">
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded bg-green-50 text-green-600 text-sm border border-green-100 flex items-start gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
            Basic Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full md:col-span-1">
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow sm:text-sm"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                disabled={projectsLoading || projects.length === 0}
                required
              >
                {projectsLoading && <option value="">Loading projects...</option>}
                {!projectsLoading && projects.length === 0 && <option value="">No projects</option>}
                {projects.map((project) => (
                  <option key={project.PID} value={project.PID}>
                    {project.ProjectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-full md:col-span-1">
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Config File <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow sm:text-sm"
                value={configFileId}
                onChange={(e) => setConfigFileId(e.target.value)}
                disabled={configFilesLoading || configFiles.length === 0}
                required
              >
                {configFilesLoading && <option value="">Loading templates...</option>}
                {!configFilesLoading && configFiles.length === 0 && (
                  <option value="">No templates available</option>
                )}
                {configFiles.map((cf) => (
                  <option key={cf.CFID} value={cf.CFID}>
                    {cf.Filename}
                  </option>
                ))}
              </select>
            </div>

            {configFilesError && (
              <div className="col-span-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {configFilesError}
              </div>
            )}

            <div className="col-span-full">
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Submit Type
              </label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow sm:text-sm"
                value={submitType}
                onChange={(e) => setSubmitType(e.target.value as 'job' | 'workflow')}
              >
                <option value="job">Job</option>
                <option value="workflow">Workflow</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-500"></span>
            Scheduling
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Queue Name
              </label>
              <input
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm"
                value={queueName}
                onChange={(e) => setQueueName(e.target.value)}
                placeholder="default-batch"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <input
                type="number"
                min="0"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <JobApplyFooter loading={loading} onClose={onClose} />
      </form>
    </div>
  );
}
      </form>
    </div>
  );
}
