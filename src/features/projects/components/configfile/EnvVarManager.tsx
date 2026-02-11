import { PlusIcon, TrashIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { EnvVar } from '@/core/interfaces/configFile';

interface EnvVarManagerProps {
  envVars: EnvVar[];
  onChange: (newEnv: EnvVar[]) => void;
}

const EnvVarManager = ({ envVars, onChange }: EnvVarManagerProps) => {
  const addEnv = () => {
    const newEnv: EnvVar = {
      id: Date.now().toString(),
      name: '',
      value: '',
    };
    onChange([...envVars, newEnv]);
  };

  const removeEnv = (id: string) => {
    onChange(envVars.filter((e) => e.id !== id));
  };

  const updateEnv = (id: string, field: keyof EnvVar, value: string) => {
    onChange(envVars.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <CommandLineIcon className="h-3.5 w-3.5" /> Environment Variables
        </label>
        <button
          type="button"
          onClick={addEnv}
          className="text-xs font-bold text-accent-600 hover:text-accent-700 flex items-center gap-1 dark:text-accent-400"
        >
          <PlusIcon className="h-3 w-3" /> Add
        </button>
      </div>

      {envVars.length > 0 && (
        <div className="space-y-2">
          {envVars.map((env) => (
            <div key={env.id} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="NAME"
                value={env.name}
                onChange={(e) => updateEnv(env.id, 'name', e.target.value)}
                className="flex-1 rounded-md border-gray-300 py-1 text-xs font-mono dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <span className="text-gray-400">=</span>
              <input
                type="text"
                placeholder="VALUE"
                value={env.value}
                onChange={(e) => updateEnv(env.id, 'value', e.target.value)}
                className="flex-1 rounded-md border-gray-300 py-1 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => removeEnv(env.id)}
                className="text-gray-400 hover:text-red-500"
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

export default EnvVarManager;
