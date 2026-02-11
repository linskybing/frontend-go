interface Props {
  total: number;
  pulledCount: number;
  unPulledCount: number;
  selectedCount: number;
  onPullSelected: () => Promise<void> | void;
  processing: boolean;
}

export default function ManageImagesActionBar({
  total,
  pulledCount,
  unPulledCount,
  selectedCount,
  onPullSelected,
  processing,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Docker Images</h2>
          <p className="mt-1 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Total: {total}</span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              Pulled: {pulledCount}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400"></span>
              Pulling:
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-gray-400"></span>
              Not Pulled: {unPulledCount}
            </span>
          </p>
        </div>
        {selectedCount > 0 && (
          <button
            onClick={onPullSelected}
            disabled={processing}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-6 py-3 font-medium text-white transition-colors hover:bg-accent-700 disabled:opacity-50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Pull {selectedCount} Image{selectedCount > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  );
}
