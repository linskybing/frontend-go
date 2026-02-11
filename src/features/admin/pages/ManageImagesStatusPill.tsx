interface Props {
  isPulled: boolean;
}

export default function ManageImagesStatusPill({ isPulled }: Props) {
  return isPulled ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/50 dark:text-green-300">
      <span className="inline-block h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />
      Pulled
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
      <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
      Not Pulled
    </span>
  );
}
