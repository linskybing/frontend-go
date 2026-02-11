type Props = {
  loading?: boolean;
  onClose: () => void;
};

export default function JobApplyFooter({ loading = false, onClose }: Props) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <button
        type="button"
        className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-sm"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-indigo-600 text-white text-sm disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
