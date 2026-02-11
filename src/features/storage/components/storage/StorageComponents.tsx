import React from 'react';
import { useTranslation } from '@nthucscc/utils';
import {
  PencilSquareIcon,
  LockClosedIcon,
  PlayIcon,
  StopIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

// --- Permission Badge ---
// Displays whether the user has "Read/Write" (Admin/Manager) or "Read Only" access.
export const PermissionBadge: React.FC<{ role?: string }> = ({ role }) => {
  const { t } = useTranslation();
  const normalizedRole = role?.toLowerCase();
  // Check if role allows write access
  const isManager = normalizedRole === 'manager' || normalizedRole === 'admin';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isManager ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {isManager ? (
        <PencilSquareIcon className="h-3 w-3" />
      ) : (
        <LockClosedIcon className="h-3 w-3" />
      )}
      {isManager ? t('storage.readWrite') : t('storage.readOnly')}
    </span>
  );
};

// --- Status Badge ---
// Displays an "Online" (Green pulse) or "Offline" (Gray) indicator based on Pod status.
export const StatusBadge: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-semibold ${
        isOnline
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-gray-50 border-gray-200 text-gray-500'
      }`}
    >
      {/* Animated dot for online status */}
      <span
        className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
      />
      {isOnline ? t('storage.online') : t('storage.offline')}
    </div>
  );
};

// --- Action Buttons Interface ---
interface ActionButtonsProps {
  pId: string; // Project ID
  isOnline: boolean; // Is the pod running?
  podExists: boolean; // Does the pod exist (even if failing)?
  isLoading: boolean; // Is an action currently processing?
  onAction: (id: string, action: 'start' | 'stop') => void; // Handler for start/stop
  onOpen: (id: string) => void; // Handler for opening the proxy
  compact?: boolean; // If true, renders smaller buttons for Table View
  canManage?: boolean; // Admin can start/stop
}

// --- Storage Action Buttons ---
// Reusable component for Start, Stop, and Open Browser buttons.
// Used in both Grid and Table views.
export const StorageActionButtons: React.FC<ActionButtonsProps> = ({
  pId,
  isOnline,
  podExists,
  isLoading,
  onAction,
  onOpen,
  compact,
  canManage = true,
}) => {
  const { t } = useTranslation();
  const manageDisabled = isLoading || !canManage;

  // Common styling for buttons
  const baseBtnClass =
    'flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  // Responsive sizing based on 'compact' prop
  const sizeClass = compact ? 'px-3 py-1.5 text-xs' : 'flex-1 py-2.5 text-sm';

  return (
    <div className={`flex items-center ${compact ? 'gap-2 justify-end' : 'gap-3 mt-4'}`}>
      {/* Start / Stop Toggle Logic */}
      {!podExists ? (
        <button
          onClick={() => onAction(pId, 'start')}
          disabled={manageDisabled}
          className={`${baseBtnClass} ${sizeClass} ${
            manageDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-accent-600 hover:bg-accent-700 text-white shadow-sm'
          }`}
          title={canManage ? t('storage.action.start') : 'Admin only'}
        >
          {isLoading ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
          {!compact && t('storage.action.start')}
        </button>
      ) : (
        <button
          onClick={() => onAction(pId, 'stop')}
          disabled={manageDisabled}
          className={`${baseBtnClass} ${sizeClass} ${
            manageDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
          }`}
          title={canManage ? t('storage.action.stop') : 'Admin only'}
        >
          {isLoading ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          ) : (
            <StopIcon className="w-4 h-4" />
          )}
          {!compact && t('storage.action.stop')}
        </button>
      )}

      {/* Open Proxy Button */}
      <button
        onClick={() => onOpen(pId)}
        disabled={!isOnline || isLoading}
        className={`${baseBtnClass} ${sizeClass} ${
          isOnline
            ? 'bg-accent-600 hover:bg-violet-700 text-white shadow-sm'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        title={t('storage.action.open')}
      >
        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        {!compact && t('storage.action.open')}
      </button>
    </div>
  );
};
