import { PlusIcon } from '@heroicons/react/24/outline';
import { WorkloadResource, ContainerConfig, JobResource } from '@/core/interfaces/configFile';
import ConfigMapManager from './ConfigMapManager';
import { PVC } from '@/core/interfaces/pvc';
import ContainerForm from './ContainerForm';

interface WorkloadFormProps {
  resource: WorkloadResource | JobResource;
  groupPvcs: PVC[];
  hasUserStorage: boolean;
  onChange: (updated: WorkloadResource | JobResource) => void;
}

const WorkloadForm = ({ resource, onChange }: WorkloadFormProps) => {
  const updateField = (
    field: keyof WorkloadResource | keyof JobResource,
    value: WorkloadResource[keyof WorkloadResource],
  ) => {
    onChange({ ...resource, [field]: value } as WorkloadResource | JobResource);
  };

  const addContainer = () => {
    const newContainer: ContainerConfig = {
      id: Date.now().toString(),
      name: `container-${resource.containers.length + 1}`,
      image: '',
      imagePullPolicy: 'IfNotPresent',
      command: '',
      args: '',
      ports: [],
      env: [],
      envFrom: [],
      mounts: [],
    };
    updateField('containers', [...resource.containers, newContainer]);
  };

  const updateContainer = (id: string, updated: ContainerConfig) => {
    updateField(
      'containers',
      resource.containers.map((c) => (c.id === id ? updated : c)),
    );
  };

  const removeContainer = (id: string) => {
    updateField(
      'containers',
      resource.containers.filter((c) => c.id !== id),
    );
  };

  const duplicateContainer = (container: ContainerConfig) => {
    const cloned = { ...container, id: Date.now().toString(), name: `${container.name}-copy` };
    updateField('containers', [...resource.containers, cloned]);
  };

  return (
    <div className="space-y-6">
      {/* Resource Specific Settings Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Deployment Specific: Replicas */}
        {resource.kind === 'Deployment' && (
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Replicas</label>
            <input
              type="number"
              min="1"
              value={resource.replicas}
              onChange={(e) => updateField('replicas', parseInt(e.target.value) || 1)}
              className="block w-full rounded-md border-gray-300 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}

        {/* 2. Job Specific Settings */}
        {resource.kind === 'Job' && (
          <>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Completions</label>
              <input
                type="number"
                min="1"
                value={(resource as JobResource).completions ?? 1}
                onChange={(e) => updateField('completions', parseInt(e.target.value) || 1)}
                className="block w-full rounded-md border-gray-300 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Parallelism</label>
              <input
                type="number"
                min="1"
                value={(resource as JobResource).parallelism ?? 1}
                onChange={(e) => updateField('parallelism', parseInt(e.target.value) || 1)}
                className="block w-full rounded-md border-gray-300 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Backoff Limit (Retries)
              </label>
              <input
                type="number"
                min="0"
                value={(resource as JobResource).backoffLimit ?? 4}
                onChange={(e) => updateField('backoffLimit', parseInt(e.target.value) || 0)}
                className="block w-full rounded-md border-gray-300 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Restart Policy</label>
              <select
                value={(resource as JobResource).restartPolicy || 'OnFailure'}
                onChange={(e) => updateField('restartPolicy', e.target.value)}
                className="block w-full rounded-md border-gray-300 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="OnFailure">OnFailure</option>
                <option value="Never">Never</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Selectors (labels) */}
      <div>
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
          Selectors / Labels
        </label>
        <p className="text-xs text-gray-400">Key-value pairs used as labels</p>
        <div className="mt-2">
          <ConfigMapManager
            data={resource.selectors || []}
            onChange={(s) => updateField('selectors', s)}
          />
        </div>
      </div>

      {/* Containers List (Shared by Pod, Deployment, Job) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Containers</label>
          <button
            onClick={addContainer}
            className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-500"
          >
            <PlusIcon className="h-4 w-4" /> Add Container
          </button>
        </div>

        {resource.containers.map((container, idx) => (
          <ContainerForm
            key={container.id}
            index={idx}
            container={container}
            onUpdate={(updated) => updateContainer(container.id, updated)}
            onRemove={() => removeContainer(container.id)}
            onDuplicate={() => duplicateContainer(container)}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkloadForm;
