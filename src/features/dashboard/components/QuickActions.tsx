import { Link } from 'react-router-dom';
import { useTranslation } from '@nthucscc/utils';
import {
  PlayCircleIcon,
  FolderOpenIcon,
  ServerStackIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const actions = [
  { key: 'page.dashboard.submitJob', path: '/jobs', icon: PlayCircleIcon },
  { key: 'page.dashboard.browseFiles', path: '/file-browser', icon: FolderOpenIcon },
  { key: 'page.dashboard.viewPods', path: '/pod-tables', icon: ServerStackIcon },
  { key: 'page.dashboard.myForms', path: '/my-forms', icon: DocumentTextIcon },
] as const;

export default function QuickActions() {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        {t('page.dashboard.quickActions')}
      </h3>
      <div className="space-y-2">
        {actions.map(({ key, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-accent-50 hover:text-accent-700 dark:text-gray-300 dark:hover:bg-accent-500/10 dark:hover:text-accent-400"
          >
            <Icon className="h-5 w-5 text-gray-400" />
            {t(key)}
          </Link>
        ))}
      </div>
    </div>
  );
}
