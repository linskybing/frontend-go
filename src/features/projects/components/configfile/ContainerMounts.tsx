import type { MountConfig } from '@/core/interfaces/configFile';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

type Props = {
  mounts: MountConfig[];
  onChange: (next: MountConfig[]) => void;
};

export default function ContainerMounts({ mounts, onChange }: Props) {
  const addMount = () => {
    const newMount: MountConfig = {
      id: Date.now().toString(),
      type: 'emptyDir',
      subPaths: [{ id: Date.now().toString() + '-s', subPath: '', mountPath: '/' }],
    };
    onChange([...mounts, newMount]);
  };

  const removeMount = (id: string) => onChange(mounts.filter((m) => m.id !== id));

  const updateMount = (id: string, field: keyof MountConfig, value: any) => {
    onChange(mounts.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
          Container Mounts
        </label>
        <button
          type="button"
          onClick={addMount}
          className="text-xs font-bold text-accent-600 hover:text-accent-700 flex items-center gap-1"
        >
          <PlusIcon className="h-3 w-3" /> Add
        </button>
      </div>

      {mounts.length === 0 ? (
        <div className="text-xs text-gray-500">No mounts configured for this container.</div>
      ) : (
        <div className="space-y-2">
          {mounts.map((m) => (
            <div key={m.id} className="rounded-md border p-2 bg-white dark:bg-gray-700">
              <div className="flex items-center gap-2">
                <select
                  value={m.type}
                  onChange={(e) => updateMount(m.id, 'type', e.target.value as any)}
                  className="rounded-md border-gray-300 bg-white py-1 px-2 text-sm"
                >
                  <option value="emptyDir">emptyDir</option>
                  <option value="user-storage">Personal Storage</option>
                  <option value="group-pvc">Group PVC</option>
                  <option value="configMap">ConfigMap</option>
                </select>
                <button
                  onClick={() => removeMount(m.id)}
                  className="ml-auto text-gray-400 hover:text-red-600"
                  title="Remove mount"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Subpaths</label>
                  <div className="space-y-1 mt-1">
                    {(m.subPaths || []).map((sp) => (
                      <div key={sp.id} className="flex gap-2">
                        <input
                          type="text"
                          value={sp.subPath}
                          onChange={(e) => {
                            const next = (m.subPaths || []).map((s) =>
                              s.id === sp.id ? { ...s, subPath: e.target.value } : s,
                            );
                            updateMount(m.id, 'subPaths', next);
                          }}
                          placeholder="source subPath"
                          className="flex-1 rounded-md border-gray-300 py-1 px-2 text-sm"
                        />
                        <input
                          type="text"
                          value={sp.mountPath}
                          onChange={(e) => {
                            const next = (m.subPaths || []).map((s) =>
                              s.id === sp.id ? { ...s, mountPath: e.target.value } : s,
                            );
                            updateMount(m.id, 'subPaths', next);
                          }}
                          placeholder="/container/path"
                          className="flex-1 rounded-md border-gray-300 py-1 px-2 text-sm font-mono"
                        />
                      </div>
                    ))}
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          updateMount(m.id, 'subPaths', [
                            ...(m.subPaths || []),
                            { id: Date.now().toString() + '-s', subPath: '', mountPath: '/' },
                          ])
                        }
                        className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
                      >
                        <PlusIcon className="h-4 w-4" /> Add Subpath
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
