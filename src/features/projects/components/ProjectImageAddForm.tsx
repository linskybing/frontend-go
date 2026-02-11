import React from 'react';
import type { AddProjectImageInput } from '@/core/services/imageService';
import { useTranslation } from '@nthucscc/utils';

type Props = {
  formData: AddProjectImageInput & { createAsGlobal?: boolean };
  setFormData: (next: AddProjectImageInput & { createAsGlobal?: boolean }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  adding: boolean;
  isSuperAdminFlag: boolean;
};

export default function ProjectImageAddForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  adding,
  isSuperAdminFlag,
}: Props) {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg border border-accent-200 dark:border-accent-800"
    >
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {t('project.images.addNew')}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('project.images.name')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('project.images.namePlaceholder')}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('project.images.tag')}
          </label>
          <input
            type="text"
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            placeholder={t('project.images.tagPlaceholder')}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>
      </div>
      {isSuperAdminFlag && (
        <div className="mt-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.createAsGlobal === true}
              onChange={(e) =>
                setFormData({ ...(formData || {}), createAsGlobal: e.target.checked })
              }
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('project.images.createAsGlobal')}
            </span>
          </label>
        </div>
      )}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={adding}
          className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 text-sm"
        >
          {adding ? t('project.images.adding') : t('project.images.add')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-sm"
        >
          {t('project.images.cancel')}
        </button>
      </div>
    </form>
  );
}
