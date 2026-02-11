import React from 'react';
import { GroupPVCWithPermissions } from '@/core/interfaces/groupStorage';
import { PermissionBadge } from './PermissionBadge';
import { StatusBadge } from './StorageComponents';

interface StorageCardProps {
  storage: GroupPVCWithPermissions;
  isOnline: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
  onOpen: () => void;
}

/**
 * StorageCard - Individual storage item display
 * Shows storage info, permissions, and action buttons
 */
export const StorageCard: React.FC<StorageCardProps> = ({
  storage,
  isOnline,
  isLoading,
  onStart,
  onStop,
  onOpen,
}) => {
  const ActionButton: React.FC<{
    onClick: () => void;
    disabled: boolean;
    loading?: boolean;
    className: string;
    children: React.ReactNode;
  }> = ({ onClick, disabled, className, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {storage.name}
            </h3>
            <StatusBadge isOnline={isOnline} />
            <PermissionBadge permission={storage.userPermission} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
            <InfoItem label="PVC Name" value={storage.pvcName} />
            <InfoItem label="Capacity" value={`${storage.capacity}Gi`} />
            <InfoItem label="Namespace" value={storage.namespace} mono />
            <InfoItem label="Status" value={storage.status} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {!isOnline ? (
            <ActionButton
              onClick={onStart}
              disabled={isLoading || !storage.canModify}
              className={
                storage.canModify
                  ? 'bg-accent-600 hover:bg-accent-700 text-white'
                  : 'bg-gray-200 text-gray-400'
              }
            >
              Start
            </ActionButton>
          ) : (
            <ActionButton
              onClick={onStop}
              disabled={isLoading || !storage.canModify}
              className={
                storage.canModify
                  ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                  : 'bg-gray-200 text-gray-400'
              }
            >
              Stop
            </ActionButton>
          )}
          <ActionButton
            onClick={onOpen}
            disabled={!isOnline || isLoading}
            className={
              isOnline
                ? 'bg-accent-600 hover:bg-violet-700 text-white'
                : 'bg-gray-100 text-gray-400'
            }
          >
            Open
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  mono?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, mono }) => (
  <div>
    <span className="text-gray-500 dark:text-gray-400">{label}:</span>
    <p className={`text-gray-900 dark:text-white ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
  </div>
);
