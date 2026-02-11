import React, { ChangeEvent } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { InputField } from '@/features/forms/components/form';

interface MPSSettingsProps {
  mpsLimit: number;
  mpsMemory: number;
  onMpsLimitChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMpsMemoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const MPSSettings: React.FC<MPSSettingsProps> = ({
  mpsLimit,
  mpsMemory,
  onMpsLimitChange,
  onMpsMemoryChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="font-semibold text-gray-900 dark:text-white">{t('project.mpsSettings')}</h4>

      <InputField
        label={t('project.create.mpsThreadLimit')}
        type="number"
        value={mpsLimit}
        onChange={onMpsLimitChange}
        placeholder="100"
      />

      <InputField
        label={t('project.create.mpsMemoryLimit')}
        type="number"
        value={mpsMemory}
        onChange={onMpsMemoryChange}
        placeholder="1024"
      />
    </div>
  );
};

export default MPSSettings;
