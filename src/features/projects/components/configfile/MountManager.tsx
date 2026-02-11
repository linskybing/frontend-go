// src/components/add-config/MountManager.tsx
import { PlusIcon, CubeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { MountConfig, MountType, WizardData } from '@/core/interfaces/configFile';
import { PVC } from '@/core/interfaces/pvc';
import MountRow from './MountRow';

interface MountManagerProps {
  mounts: MountConfig[];
  groupPvcs: PVC[];
  hasUserStorage: boolean; // NEW
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
}

const MountManager = ({ mounts, groupPvcs, hasUserStorage, setWizardData }: MountManagerProps) => {
  const hasGroupStorage = groupPvcs.length > 0;
  const isAnyStorageAvailable = hasUserStorage || hasGroupStorage;

  const addMount = () => {
    // Determine a valid default type
    let defaultType: MountType = 'user-storage';

    if (hasUserStorage) {
      defaultType = 'user-storage';
    } else if (hasGroupStorage) {
      defaultType = 'group-pvc';
    } else {
      // fallback to emptyDir when no persistent storage exists
      defaultType = 'emptyDir';
    }

    const defaultPVC =
      defaultType === 'group-pvc' && groupPvcs.length > 0 ? groupPvcs[0].name : undefined;

    const newMount: MountConfig = {
      id: Date.now().toString(),
      type: defaultType,
      pvcName: defaultPVC,
      subPaths: [{ id: Date.now().toString() + '-s', subPath: '', mountPath: '/' }],
    };

    setWizardData((prev) => ({ ...prev, mounts: [...prev.mounts, newMount] }));
  };

  const removeMount = (id: string) => {
    setWizardData((prev) => ({
      ...prev,
      mounts: prev.mounts.filter((m) => m.id !== id),
    }));
  };

  const updateMount = (id: string, field: keyof MountConfig, value: unknown) => {
    setWizardData((prev) => ({
      ...prev,
      mounts: prev.mounts.map((m) => {
        if (m.id !== id) return m;
        // Reset pvcName if switching to user-storage
        if (field === 'type' && value === 'user-storage') {
          return {
            ...m,
            type: value as MountType,
            pvcName: undefined,
            subPaths: [{ id: Date.now().toString() + '-s', subPath: '', mountPath: '/' }],
          };
        }
        // Handle switching to emptyDir
        if (field === 'type' && value === 'emptyDir') {
          return {
            ...m,
            type: value as MountType,
            pvcName: undefined,
            configMapName: undefined,
            medium: undefined,
            sizeLimit: undefined,
            subPaths: [{ id: Date.now().toString() + '-s', subPath: '', mountPath: '/' }],
          };
        }
        // Handle switching to configMap
        if (field === 'type' && value === 'configMap') {
          return {
            ...m,
            type: value as MountType,
            pvcName: undefined,
            configMapName: m.configMapName || '',
            subPaths: [{ id: Date.now().toString() + '-s', subPath: '', mountPath: '/' }],
          };
        }
        // Auto-select first PVC if switching to group-pvc
        if (field === 'type' && value === 'group-pvc' && !m.pvcName && groupPvcs.length > 0) {
          const first = groupPvcs[0].name;
          return {
            ...m,
            type: value as MountType,
            pvcName: first,
            subPaths: [{ id: Date.now().toString() + '-s', subPath: '', mountPath: '/' }],
          };
        }
        // When pvc changes, keep subPath empty (root directory)
        if (field === 'pvcName') {
          return {
            ...m,
            pvcName: value as string,
            subPaths: [{ id: Date.now().toString() + '-s', subPath: '', mountPath: '/' }],
          };
        }
        if (field === 'configMapName') {
          return {
            ...m,
            configMapName: value as string,
            subPaths: [{ id: Date.now().toString() + '-s', subPath: '', mountPath: '/' }],
          };
        }
        if (field === 'subPaths') {
          return { ...m, subPaths: value as MountConfig['subPaths'] };
        }
        return m;
      }),
    }));
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CubeIcon className="h-5 w-5 text-accent-500" />
          Volume Mounts
        </h4>

        {isAnyStorageAvailable ? (
          <button
            type="button"
            onClick={addMount}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-accent-700 transition-all active:scale-95"
          >
            <PlusIcon className="h-4 w-4" />
            Add Volume
          </button>
        ) : (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <ExclamationTriangleIcon className="h-4 w-4" />
            No storage available
          </span>
        )}
      </div>

      {mounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-8 text-center dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">No volumes configured.</p>
          <p className="text-xs text-gray-400">
            {isAnyStorageAvailable
              ? 'Click "Add Volume" to mount storage to your Pod.'
              : 'Initialize Personal Storage or create Group Storage to enable mounts.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mounts.map((mount) => (
            <MountRow
              key={mount.id}
              mount={mount}
              groupPvcs={groupPvcs}
              hasUserStorage={hasUserStorage}
              hasGroupStorage={hasGroupStorage}
              onChange={updateMount}
              onRemove={removeMount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MountManager;
