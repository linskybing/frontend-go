import { useState } from 'react';
import { Button } from '@nthucscc/ui';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface GroupStorageFormProps {
  groups: any[];
  loading: boolean;
  onSubmit: (data: {
    groupId: string;
    name: string;
    capacity: string;
  }) => void;
  onCancel: () => void;
}

export default function GroupStorageForm({
  groups,
  loading,
  onSubmit,
  onCancel,
}: GroupStorageFormProps) {
  const [formData, setFormData] = useState({
    groupId: '',
    name: '',
    capacity: '10Gi',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groupId || !formData.name || !formData.capacity) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create Group Storage
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Group Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Group
          </label>
          <select
            value={formData.groupId}
            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          >
            <option value="">Select a group...</option>
            {groups.map((group) => (
              <option key={group.GID} value={group.GID}>
                {group.GroupName}
              </option>
            ))}
          </select>
          {groups.length === 0 && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              No groups available for selection.
            </p>
          )}
        </div>

        {/* Storage Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Storage Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Shared Data Volume"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Capacity
          </label>
          <input
            type="text"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="e.g., 10Gi, 100Gi, 1Ti"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent-600 hover:bg-accent-700 text-white"
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
