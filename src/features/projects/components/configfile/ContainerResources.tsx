import { ContainerConfig } from '@/core/interfaces/configFile';

type Props = {
  resources?: ContainerConfig['resources'];
  onChange: (next: ContainerConfig['resources']) => void;
};

export default function ContainerResources({ resources, onChange }: Props) {
  const req = resources?.requests || {};
  const lim = resources?.limits || {};

  return (
    <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-800/50 border border-accent-200 dark:border-gray-600">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-accent-600 dark:text-accent-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
        <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
          Resource Limits
        </label>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">
        Define CPU, Memory, and GPU resource requirements
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-accent-300 dark:border-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <label className="text-xs font-bold uppercase text-green-700 dark:text-green-400">
              Requests (Minimum)
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              CPU
            </label>
            <input
              type="text"
              value={req.cpu || ''}
              onChange={(e) => onChange({ requests: { ...req, cpu: e.target.value }, limits: lim })}
              placeholder="e.g., 100m, 0.5, 2"
              className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              Memory
            </label>
            <input
              type="text"
              value={req.memory || ''}
              onChange={(e) =>
                onChange({ requests: { ...req, memory: e.target.value }, limits: lim })
              }
              placeholder="e.g., 128Mi, 1Gi, 2Gi"
              className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              GPU
            </label>
            <input
              type="text"
              value={req.gpu || ''}
              onChange={(e) => onChange({ requests: { ...req, gpu: e.target.value }, limits: lim })}
              placeholder="e.g., 1, 2"
              className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-accent-300 dark:border-gray-600">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <label className="text-xs font-bold uppercase text-red-700 dark:text-red-400">
              Limits (Maximum)
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              CPU
            </label>
            <input
              type="text"
              value={lim.cpu || ''}
              onChange={(e) => onChange({ requests: req, limits: { ...lim, cpu: e.target.value } })}
              placeholder="e.g., 200m, 1, 4"
              className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              Memory
            </label>
            <input
              type="text"
              value={lim.memory || ''}
              onChange={(e) =>
                onChange({ requests: req, limits: { ...lim, memory: e.target.value } })
              }
              placeholder="e.g., 256Mi, 2Gi, 4Gi"
              className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              GPU
            </label>
            <input
              type="text"
              value={lim.gpu || ''}
              onChange={(e) => onChange({ requests: req, limits: { ...lim, gpu: e.target.value } })}
              placeholder="e.g., 1, 2"
              className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 mt-3 p-3 bg-accent-100/50 dark:bg-gray-700/50 rounded-lg border border-accent-200 dark:border-gray-600">
        <svg
          className="w-4 h-4 text-accent-600 dark:text-accent-400 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>Note:</strong> Leave fields empty to skip resource limits. GPU uses{' '}
          <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">
            nvidia.com/gpu
          </code>{' '}
          resource. Limits should be greater than or equal to requests.
        </p>
      </div>
    </div>
  );
}
