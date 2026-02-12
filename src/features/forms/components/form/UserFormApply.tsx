import React, { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Project } from '@/core/interfaces/project';

interface UserFormApplyProps {
  projects: Project[];
  selectedProject: string | undefined;
  setSelectedProject: (id: string | undefined) => void;
  title: string;
  setTitle: (t: string) => void;
  description: string;
  setDescription: (d: string) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
  handleSubmit: (e: FormEvent) => void;
}

const UserFormApply: React.FC<UserFormApplyProps> = ({
  projects,
  selectedProject,
  setSelectedProject,
  title,
  setTitle,
  description,
  setDescription,
  loading,
  error,
  success,
  handleSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6 mb-8">
      <h3 className="mb-4 text-xl font-semibold">{t('form.apply.title') || 'Apply'}</h3>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('form.label.project')}</label>
          <select
            value={selectedProject ?? ''}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSelectedProject(e.target.value || undefined)
            }
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
          >
            <option value="">{t('form.select.none')}</option>
            {projects.map((p) => (
              <option key={p.PID} value={p.PID}>
                {p.ProjectName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('form.label.title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
            placeholder={t('form.placeholder.title')}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('form.label.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
            placeholder={t('form.placeholder.description.long')}
          />
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-accent-600 text-white rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? t('form.submitting') : t('form.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFormApply;
