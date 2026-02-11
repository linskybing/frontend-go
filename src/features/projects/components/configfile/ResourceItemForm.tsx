import { useState } from 'react';
import { TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// Ensure these paths match your project structure
import {
  ResourceItem,
  WorkloadResource,
  ServiceResource,
  ConfigMapResource,
} from '@/core/interfaces/configFile';
import { PVC } from '@/core/interfaces/pvc';

// Import Sub-components
import ConfigMapManager from './ConfigMapManager';
import WorkloadForm from './WorkloadForm';
import ServiceForm from './ServiceForm'; // Imported the dedicated ServiceForm

interface ResourceItemFormProps {
  resource: ResourceItem;
  index: number;
  groupPvcs: PVC[];
  hasUserStorage: boolean;
  onUpdate: (id: string, updated: ResourceItem) => void;
  onRemove: (id: string) => void;
}

const ResourceItemForm = ({
  resource,
  index,
  groupPvcs,
  hasUserStorage,
  onUpdate,
  onRemove,
}: ResourceItemFormProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // (Icon removed) Using index badge for compact display to avoid colored emojis.

  // Helper: Determine the color theme based on the resource kind
  const getColorClass = () => {
    switch (resource.kind) {
      case 'Pod':
        return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'Deployment':
        return 'bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400';
      case 'Service':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'ConfigMap':
        return 'bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400';
      case 'Job': // New Job Color (Orange/Amber)
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Handler for renaming the resource
  const handleNameChange = (val: string) => {
    onUpdate(resource.id, { ...resource, name: val });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all">
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200 dark:bg-gray-700/50 dark:border-gray-700">
        {/* Left Side: Icon & Name Input */}
        <div className="flex items-center gap-3">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-sm ${getColorClass()}`}
          >
            <span className="text-[10px] font-bold">{index + 1}</span>
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {resource.kind}
            </span>
            <input
              type="text"
              value={resource.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-0.5 w-full min-w-[150px] bg-transparent text-sm font-bold text-gray-900 focus:outline-none focus:text-accent-600 focus:underline p-0 border-none h-auto dark:text-white"
              placeholder="Resource Name"
            />
          </div>
        </div>

        {/* Right Side: Collapse & Delete Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onRemove(resource.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove Resource"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* --- Body Section (Content) --- */}
      {isExpanded && (
        <div className="p-4 animate-in slide-in-from-top-2 duration-200">
          {/* Workloads (Pod / Deployment) */}
          {(resource.kind === 'Pod' ||
            resource.kind === 'Deployment' ||
            resource.kind === 'Job') && (
            <WorkloadForm
              resource={resource as WorkloadResource}
              groupPvcs={groupPvcs}
              hasUserStorage={hasUserStorage}
              onChange={(updated) => onUpdate(resource.id, updated)}
            />
          )}

          {/* Service - Delegated to dedicated ServiceForm */}
          {resource.kind === 'Service' && (
            <ServiceForm
              resource={resource as ServiceResource}
              onUpdate={(updated) => onUpdate(resource.id, updated)}
            />
          )}

          {/* ConfigMap - Delegated to ConfigMapManager */}
          {resource.kind === 'ConfigMap' && (
            <ConfigMapManager
              data={(resource as ConfigMapResource).data}
              onChange={(newData) =>
                onUpdate(resource.id, { ...resource, data: newData } as ConfigMapResource)
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceItemForm;
