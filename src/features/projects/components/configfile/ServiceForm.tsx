import { PlusIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ServiceResource, ServiceProtocol, KeyValuePair } from '@/core/interfaces/configFile';

interface ServiceFormProps {
  resource: ServiceResource;
  onUpdate: (updated: ServiceResource) => void;
}

const ServiceForm = ({ resource, onUpdate }: ServiceFormProps) => {
  const handleChange = (
    field: keyof ServiceResource,
    value: ServiceResource[keyof ServiceResource],
  ) => {
    onUpdate({ ...resource, [field]: value });
  };

  // --- Selector Logic ---
  const addSelector = () => {
    const newSelector: KeyValuePair = {
      id: Date.now().toString(),
      key: 'app', // Default key
      value: '',
    };
    onUpdate({ ...resource, selectors: [...resource.selectors, newSelector] });
  };

  const removeSelector = (id: string) => {
    onUpdate({ ...resource, selectors: resource.selectors.filter((s) => s.id !== id) });
  };

  const updateSelector = (id: string, field: keyof KeyValuePair, value: string) => {
    onUpdate({
      ...resource,
      selectors: resource.selectors.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  };

  // --- Port Logic ---
  const addPort = () => {
    const newPort = {
      id: Date.now().toString(),
      name: 'http',
      port: 80,
      targetPort: 80,
      protocol: 'TCP' as ServiceProtocol,
    };
    onUpdate({ ...resource, ports: [...resource.ports, newPort] });
  };

  const removePort = (id: string) => {
    onUpdate({ ...resource, ports: resource.ports.filter((p) => p.id !== id) });
  };

  const updatePort = (
    id: string,
    field: keyof ServiceResource['ports'][number],
    value: string | number | ServiceProtocol | undefined,
  ) => {
    onUpdate({
      ...resource,
      ports: resource.ports.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Basic Settings */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Service Type</label>
          <select
            value={resource.serviceType}
            onChange={(e) => handleChange('serviceType', e.target.value)}
            disabled={resource.headless}
            className="block w-full rounded-md border-gray-300 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
          >
            <option value="ClusterIP">ClusterIP</option>
            <option value="NodePort">NodePort</option>
          </select>
        </div>

        <div className="flex items-center pt-5">
          <input
            id={`headless-${resource.id}`}
            type="checkbox"
            checked={resource.headless}
            onChange={(e) => {
              const isHeadless = e.target.checked;
              onUpdate({
                ...resource,
                headless: isHeadless,
                serviceType: isHeadless ? 'ClusterIP' : resource.serviceType,
              });
            }}
            className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
          />
          <label
            htmlFor={`headless-${resource.id}`}
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Enable Headless Mode (ClusterIP: None)
          </label>
        </div>
      </div>

      {/* 2. Selectors (Target Pods) */}
      <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1">
            <FunnelIcon className="h-3.5 w-3.5" /> Selectors (Match Pod Labels)
          </h5>
          <button
            type="button"
            onClick={addSelector}
            className="text-xs text-accent-600 font-bold flex items-center gap-1 hover:text-accent-500"
          >
            <PlusIcon className="h-3 w-3" /> Add Selector
          </button>
        </div>

        {resource.selectors.length === 0 ? (
          <div className="text-center py-2">
            <p className="text-xs text-red-400">
              Warning: No selector defined. Service will not route traffic to any Pod.
            </p>
          </div>
        ) : (
          resource.selectors.map((s) => (
            <div key={s.id} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Key (e.g. app)"
                value={s.key}
                onChange={(e) => updateSelector(s.id, 'key', e.target.value)}
                className="flex-1 rounded-md border-gray-300 py-1 text-xs font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <span className="text-gray-400">:</span>
              <input
                type="text"
                placeholder="Value (e.g. my-pod)"
                value={s.value}
                onChange={(e) => updateSelector(s.id, 'value', e.target.value)}
                className="flex-1 rounded-md border-gray-300 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={() => removeSelector(s.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 3. Ports Manager */}
      <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-bold uppercase text-gray-500">Service Ports</h5>
          <button
            type="button"
            onClick={addPort}
            className="text-xs text-accent-600 font-bold flex items-center gap-1 hover:text-accent-500"
          >
            <PlusIcon className="h-3 w-3" /> Add Port
          </button>
        </div>

        {resource.ports.map((p) => (
          <div key={p.id} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Name"
              value={p.name}
              onChange={(e) => updatePort(p.id, 'name', e.target.value)}
              className="w-20 rounded-md border-gray-300 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="number"
              placeholder="Port"
              value={p.port}
              onChange={(e) => updatePort(p.id, 'port', parseInt(e.target.value) || 0)}
              className="w-16 rounded-md border-gray-300 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="number"
              placeholder="Target"
              value={p.targetPort}
              onChange={(e) => updatePort(p.id, 'targetPort', parseInt(e.target.value) || 0)}
              className="w-16 rounded-md border-gray-300 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select
              value={p.protocol}
              onChange={(e) => updatePort(p.id, 'protocol', e.target.value)}
              className="w-20 rounded-md border-gray-300 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
            </select>
            <button onClick={() => removePort(p.id)} className="text-gray-400 hover:text-red-500">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceForm;
