type Props = {
  title?: string;
  onClose: () => void;
};

export default function JobApplyHeader({ title = 'Submit New Job', onClose }: Props) {
  return (
    <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
        {title}
      </h2>
      <button
        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
