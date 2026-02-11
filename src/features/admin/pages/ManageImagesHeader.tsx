import { PageMeta } from '@nthucscc/components-shared';
import { PageBreadcrumb } from '@nthucscc/ui';

interface PullJobStatus {
  job_id: string;
  image: string;
  status: 'pending' | 'pulling' | 'completed' | 'failed';
  progress: number;
  message: string;
  timestamp: string;
}

interface FailedPullJob {
  job_id: string;
  image_name: string;
  image_tag: string;
  message: string;
  updated_at: string;
}

interface Props {
  successMessage: string;
  pullJobStatuses: Map<string, PullJobStatus>;
  failedJobs: FailedPullJob[];
}

export default function ManageImagesHeader({ successMessage, pullJobStatuses, failedJobs }: Props) {
  return (
    <>
      <PageMeta title="Manage Images" description="Manage Docker images in the system" />
      <PageBreadcrumb pageTitle="Manage Docker Images" />

      {successMessage && (
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Active Pull Jobs */}
      {pullJobStatuses.size > 0 && (
        <div className="mb-6 rounded-xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-900/30 dark:bg-accent-900/20">
          <h3 className="mb-3 font-semibold text-accent-900 dark:text-accent-300">
            Active Pull Jobs ({pullJobStatuses.size})
          </h3>
          <div className="space-y-2">
            {Array.from(pullJobStatuses.values()).map((job) => (
              <div
                key={job.job_id}
                className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-800"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.image}
                    </span>
                    <span
                      className={`text-xs font-semibold ${job.status === 'completed' ? 'text-green-600 dark:text-green-400' : job.status === 'failed' ? 'text-red-600 dark:text-red-400' : 'text-accent-600 dark:text-accent-400'}`}
                    >
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{job.message}</p>
                  {job.status === 'pulling' && (
                    <div className="mt-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-1.5 bg-accent-600 transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failed Pull Jobs History */}
      {failedJobs.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/20">
          <h3 className="mb-3 font-semibold text-red-900 dark:text-red-300">
            Failed Pull Jobs ({failedJobs.length})
          </h3>
          <div className="space-y-2">
            {failedJobs.map((job) => (
              <div
                key={job.job_id}
                className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-800"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.image_name}:{job.image_tag}
                    </span>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {job.job_id}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-red-700 dark:text-red-300">{job.message}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(job.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
