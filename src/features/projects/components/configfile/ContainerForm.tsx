import { useState } from 'react';
import type { ContainerConfig } from '@/core/interfaces/configFile';
import ContainerResources from './ContainerResources';
import ContainerHeader from './ContainerHeader';
import ContainerCommandArgs from './ContainerCommandArgs';
import ContainerEnv from './ContainerEnv';
import ContainerPorts from './ContainerPorts';
import ContainerMounts from './ContainerMounts';

// Import managers

interface ContainerFormProps {
  container: ContainerConfig;
  index: number;
  onUpdate: (updated: ContainerConfig) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

const ContainerForm = ({
  container,
  index,
  onUpdate,
  onRemove,
  onDuplicate,
}: ContainerFormProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (
    field: keyof ContainerConfig,
    value: ContainerConfig[keyof ContainerConfig],
  ) => {
    onUpdate({ ...container, [field]: value });
  };

  return (
    <div className="rounded-md border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
      {/* Container Header */}
      <ContainerHeader
        index={index}
        name={container.name}
        isExpanded={isExpanded}
        onNameChange={(n) => handleChange('name', n)}
        onDuplicate={onDuplicate}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onRemove={onRemove}
      />

      {isExpanded && (
        <div className="p-4 space-y-4">
          <ContainerResources
            resources={container.resources}
            onChange={(next) => handleChange('resources', next)}
          />
          <div className="pt-3">
            <ContainerCommandArgs
              command={container.command}
              args={container.args}
              onChange={({ command, args }) => {
                if (typeof command !== 'undefined') handleChange('command', command);
                if (typeof args !== 'undefined') handleChange('args', args);
              }}
            />
          </div>
          <div className="pt-3">
            <ContainerPorts ports={container.ports} onChange={(p) => handleChange('ports', p)} />
          </div>
          <div className="pt-3">
            <ContainerEnv env={container.env} onChange={(e) => handleChange('env', e)} />
          </div>
          <div className="pt-3">
            <ContainerMounts
              mounts={container.mounts}
              onChange={(m) => handleChange('mounts', m)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerForm;
