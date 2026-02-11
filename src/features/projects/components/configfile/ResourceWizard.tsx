import { ResourceItem, ResourceKind } from '@/core/interfaces/configFile';
import ResourceItemForm from './ResourceItemForm';
import { createDefaultResource } from '@/features/projects/utils/resourceFactories';
import { PVC } from '@/core/interfaces/pvc';

interface ResourceWizardProps {
  resources: ResourceItem[];
  setResources: (res: ResourceItem[]) => void;
  groupPvcs: PVC[];
  hasUserStorage: boolean;
}

export default function ResourceWizard({
  resources,
  setResources,
  groupPvcs,
  hasUserStorage,
}: ResourceWizardProps) {
  const addResource = (kind: ResourceKind) => {
    const id = Date.now().toString();
    const count = resources.filter((r) => r.kind === kind).length + 1;
    const baseName = `${kind.toLowerCase()}-${count}`;
    const newResource = createDefaultResource(kind, id, baseName);
    setResources([...resources, newResource]);
  };

  const removeResource = (id: string) => setResources(resources.filter((r) => r.id !== id));

  const updateResource = (id: string, updated: ResourceItem) => {
    setResources(resources.map((r) => (r.id === id ? updated : r)));
  };

  return (
    <div className="space-y-6">
      {/* Toolbar - Restore original style
        (Different colored buttons, dashed border, centered)
      */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-dashed border-gray-300 bg-white/50 dark:border-gray-600 dark:bg-gray-800/50 justify-center">
        <button
          onClick={() => addResource('Pod')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 transition-all font-medium text-sm"
        >
          + Pod
        </button>
        <button
          onClick={() => addResource('Deployment')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-50 text-accent-700 hover:bg-accent-100 dark:bg-accent-900/30 dark:text-accent-300 transition-all font-medium text-sm"
        >
          + Deployment
        </button>
        <button
          onClick={() => addResource('Job')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 transition-all font-medium text-sm"
        >
          + Job
        </button>
        <button
          onClick={() => addResource('Service')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 transition-all font-medium text-sm"
        >
          + Service
        </button>
        <button
          onClick={() => addResource('ConfigMap')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-accent-50 dark:bg-accent-900/30 dark:text-purple-300 transition-all font-medium text-sm"
        >
          + ConfigMap
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {resources.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No resources added.</div>
        ) : (
          resources.map((res, idx) => (
            <ResourceItemForm
              key={res.id}
              index={idx}
              resource={res}
              groupPvcs={groupPvcs}
              hasUserStorage={hasUserStorage}
              onUpdate={updateResource}
              onRemove={removeResource}
            />
          ))
        )}
      </div>
    </div>
  );
}
