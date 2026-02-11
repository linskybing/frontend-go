interface ResourceBadgeProps {
  type: string;
}

const TYPE_COLORS: Record<string, string> = {
  Deployment: 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
  Pod: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  Service: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  ConfigMap: 'bg-accent-50 text-purple-800 dark:bg-accent-900/30 dark:text-purple-300',
  Ingress: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  PVC: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

export const ResourceBadge = ({ type }: ResourceBadgeProps) => {
  const colorClass =
    TYPE_COLORS[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-black/5 dark:ring-white/10 ${colorClass}`}
    >
      {type}
    </span>
  );
};
