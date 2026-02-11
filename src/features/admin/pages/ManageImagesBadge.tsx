interface Props {
  isGlobal: boolean;
  projectId?: number;
}

export default function ManageImagesBadge({ isGlobal, projectId }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
        isGlobal
          ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-300'
          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
      }`}
    >
      {isGlobal ? 'Global' : `Project ${projectId ?? '—'}`}
    </span>
  );
}
