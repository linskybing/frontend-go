import React, { ChangeEvent } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { InputField } from '@/features/forms/components/form';

interface GPUSettingsProps {
  gpuQuota: number;
  gpuAccess: string[];
  onGpuQuotaChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGpuAccessChange: (access: string) => void;
}

export const GPUSettings: React.FC<GPUSettingsProps> = ({
  gpuQuota,
  gpuAccess,
  onGpuQuotaChange,
  onGpuAccessChange,
}) => {
  const { t } = useTranslation();

  const gpuAccessOptions = ['shared'];

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="font-semibold text-gray-900 dark:text-white">{t('project.gpuResources')}</h4>

      <InputField
        label={t('project.create.gpuQuota')}
        type="number"
        value={gpuQuota}
        onChange={onGpuQuotaChange}
        placeholder="0"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('project.create.gpuAccessMode')}
        </label>
        <div className="flex gap-4">
          {gpuAccessOptions.map((mode) => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={gpuAccess.includes(mode)}
                onChange={() => onGpuAccessChange(mode)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{mode}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GPUSettings;
