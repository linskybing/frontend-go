// src/components/groups/LoadingState.tsx

const LoadingState = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {/* Display 3 pulsing placeholder cards */}
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="animate-pulse flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
export default LoadingState;
