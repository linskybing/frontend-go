import { PlusIcon, TrashIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { KeyValuePair } from '@/core/interfaces/configFile';

interface ConfigMapManagerProps {
  data: KeyValuePair[];
  onChange: (newData: KeyValuePair[]) => void;
}

const ConfigMapManager = ({ data, onChange }: ConfigMapManagerProps) => {
  const addPair = () => {
    const newPair: KeyValuePair = {
      id: Date.now().toString(),
      key: '',
      value: '',
    };
    onChange([...data, newPair]);
  };

  const removePair = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const updatePair = (id: string, field: keyof KeyValuePair, value: string) => {
    onChange(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TableCellsIcon className="h-5 w-5 text-purple-500" />
          Config Data (Key-Value)
        </h4>
        <button
          type="button"
          onClick={addPair}
          className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all active:scale-95"
        >
          <PlusIcon className="h-4 w-4" />
          Add Data
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-6 text-center dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">No configuration data.</p>
          <p className="text-xs text-gray-400">Add environment variables or config files here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Key Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Key (e.g., DB_HOST)"
                  value={item.key}
                  onChange={(e) => updatePair(item.id, 'key', e.target.value)}
                  className="block w-full rounded-md border-gray-300 py-1.5 text-xs font-mono focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <span className="text-gray-400 font-bold">:</span>

              {/* Value Input */}
              <div className="flex-[1.5]">
                <input
                  type="text"
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) => updatePair(item.id, 'value', e.target.value)}
                  className="block w-full rounded-md border-gray-300 py-1.5 text-xs focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removePair(item.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfigMapManager;
