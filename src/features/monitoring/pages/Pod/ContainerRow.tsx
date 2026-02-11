// ContainerRow.tsx
import React from 'react';
import { LuTerminal, LuFileText, LuBox } from 'react-icons/lu';
import { ActionButton } from './ActionButton';
import { TranslateFn } from './types';

interface ContainerRowProps {
  containerName: string;
  podName: string;
  namespace: string;
  onConnect: () => void;
  onLogs: () => void;
  t: TranslateFn;
}

export const ContainerRow: React.FC<ContainerRowProps> = ({
  containerName,
  onConnect,
  onLogs,
  t,
}) => (
  <tr className="bg-gray-50/80 dark:bg-gray-800/50">
    <td className="pl-12 pr-6 py-3 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
      <LuBox className="w-4 h-4 text-gray-400" />
      <span className="font-mono text-xs">{containerName}</span>
    </td>
    <td className="px-6 py-3 text-xs text-gray-500">-</td>
    <td className="px-6 py-3 text-xs text-gray-500">-</td>
    <td className="px-6 py-3 text-right">
      <div className="flex items-center justify-end gap-2">
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onConnect();
          }}
          icon={<LuTerminal className="w-3.5 h-3.5" />}
          label={t('monitor.button.connect')}
        />
        <ActionButton
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            onLogs();
          }}
          icon={<LuFileText className="w-3.5 h-3.5" />}
          label="Logs"
        />
      </div>
    </td>
  </tr>
);
