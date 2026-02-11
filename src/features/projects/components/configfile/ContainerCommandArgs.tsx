import type { ContainerConfig } from '@/core/interfaces/configFile';

type Props = {
  command?: ContainerConfig['command'];
  args?: ContainerConfig['args'];
  onChange: (next: { command?: string; args?: string }) => void;
};

export default function ContainerCommandArgs({ command = '', args = '', onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Command</label>
        <input
          type="text"
          value={command}
          onChange={(e) => onChange({ command: e.target.value, args })}
          placeholder="Command to run (e.g., /bin/bash)"
          className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Args</label>
        <input
          type="text"
          value={args}
          onChange={(e) => onChange({ command, args: e.target.value })}
          placeholder="Arguments (space-separated)"
          className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
}
