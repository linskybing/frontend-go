import { useState, useEffect } from 'react';
import {
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@nthucscc/ui';
import { groupStorageService } from '@/core/services/resource/groupStorageService';
import { getGroups } from '@/core/services/groupService';
import { Group } from '@/core/interfaces/group';
import { GroupPVCWithPermissions } from '@/core/interfaces/groupStorage';
import GroupStorageForm from './GroupStorageForm';
import GroupStorageList from './GroupStorageList';

export default function GroupStorageManagement() {
  const [storages, setStorages] = useState<GroupPVCWithPermissions[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    loadStorages();
    loadGroups();
  }, []);

  const loadStorages = async () => {
    try {
      setLoading(true);
      const data = await groupStorageService.getMyGroupStorages();
      setStorages(data || []);
    } catch (err) {
      const error = err as { message?: string };
      setMessage({
        type: 'error',
        text: error.message || 'Failed to load storages',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadGroups = async () => {
    try {
      const data = await getGroups();
      setGroups(data || []);
    } catch (err) {
      const error = err as { message?: string };
      setMessage({
        type: 'error',
        text: error.message || 'Failed to load groups',
      });
    }
  };

  const parseCapacityGi = (value: string): number | null => {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d+)(gi|g)?$/i);
    if (!match) return null;
    return Number(match[1]);
  };

  const handleCreate = async (formData: {
    groupId: string;
    name: string;
    capacity: string;
  }) => {
    const capacityGi = parseCapacityGi(formData.capacity);
    if (!capacityGi) {
      setMessage({
        type: 'error',
        text: 'Capacity must be a number in Gi (e.g., 10Gi)',
      });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await groupStorageService.createGroupStorage(formData.groupId, {
        name: formData.name,
        capacity: capacityGi,
      });
      setMessage({
        type: 'success',
        text: 'Group storage created successfully',
      });
      setShowCreateForm(false);
      await loadStorages();
    } catch (err) {
      const error = err as { message?: string };
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create storage',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId: string, pvcId: string) => {
    if (
      !window.confirm('Are you sure you want to delete this storage?')
    ) {
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await groupStorageService.deleteGroupStorage(groupId, pvcId);
      setMessage({
        type: 'success',
        text: 'Storage deleted successfully',
      });
      await loadStorages();
    } catch (err) {
      const error = err as { message?: string };
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete storage',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={
              message.type === 'success'
                ? 'text-emerald-800 dark:text-emerald-200'
                : 'text-red-800 dark:text-red-200'
            }
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Create Button */}
      {!showCreateForm && (
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-accent-600 hover:bg-accent-700 text-white flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Create Group Storage
        </Button>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <GroupStorageForm
          groups={groups}
          loading={loading}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Storage List */}
      {!showCreateForm && (
        <GroupStorageList
          storages={storages}
          loading={loading}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
