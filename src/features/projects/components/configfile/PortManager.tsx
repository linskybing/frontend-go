import { PlusIcon, TrashIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { ContainerPort } from '@/core/interfaces/configFile';

interface PortManagerProps {
  ports: ContainerPort[];
  onChange: (newPorts: ContainerPort[]) => void;
}

const PortManager = ({ ports, onChange }: PortManagerProps) => {
  const addPort = () => {
    const newPort: ContainerPort = { id: Date.now().toString(), port: 8080, protocol: 'TCP' };
    onChange([...ports, newPort]);
  };

  const removePort = (id: string) => {
    onChange(ports.filter((p) => p.id !== id));
  };

  const updatePort = (
    id: string,
    field: keyof ContainerPort,
    value: ContainerPort[keyof ContainerPort],
  ) => {
    onChange(ports.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <ArrowsRightLeftIcon className="h-3.5 w-3.5" /> Container Ports
        </label>
        <button
          type="button"
          onClick={addPort}
          className="text-xs font-bold text-accent-600 flex items-center gap-1 hover:text-accent-500"
        >
          <PlusIcon className="h-3 w-3" /> Add
        </button>
      </div>

      {ports.length > 0 && (
        <div className="flex flex-col gap-2">
          {ports.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 rounded-md bg-white border border-gray-300 px-2 py-1 shadow-sm dark:bg-gray-700 dark:border-gray-600"
            >
              <input
                type="number"
                value={p.port}
                onChange={(e) => updatePort(p.id, 'port', parseInt(e.target.value) || 0)}
                className="w-16 border-none bg-transparent p-0 text-xs font-bold focus:ring-0 dark:text-white"
                placeholder="Port"
              />
              <select
                value={p.protocol}
                onChange={(e) => updatePort(p.id, 'protocol', e.target.value)}
                className="border-none bg-transparent p-0 text-xs text-gray-500 focus:ring-0 dark:text-gray-300"
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
              </select>
              <button
                onClick={() => removePort(p.id)}
                className="text-gray-400 hover:text-red-500 ml-auto"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortManager;
