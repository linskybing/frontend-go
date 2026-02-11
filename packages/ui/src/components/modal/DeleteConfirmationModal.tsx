import React, { useRef, useEffect } from 'react';
import { useTranslation } from '@nthucscc/utils';
// Assuming the Button component is available via relative path
import Button from '../button/Button';

// Interface to define the structure of the item being deleted
// The item can be a Group, Project, or any other entity that needs deletion confirmation.
interface DeletableItem {
  GID?: string;
  GroupName?: string;
  PID?: string;
  ProjectName?: string;
  CFID?: string; // Added for completeness (e.g., Config File ID)
  Filename?: string; // Added for completeness (e.g., Config File Name)
}

interface DeleteConfirmationModalProps {
  // Controls the visibility of the modal
  isOpen: boolean;
  // Handler to close the modal (e.g., on Cancel or overlay click)
  onClose: () => void;
  // Handler to execute the delete action (called upon confirmation)
  onConfirm: () => void;
  // The specific item object that is about to be deleted
  item: DeletableItem | null;
  // The user-friendly type of the item (e.g., "Group", "Project")
  itemType: string;
  // Loading state, used to disable buttons during the API call
  loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  itemType,
  loading = false,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press to close the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, onClose]);

  // Do not render if the modal is closed or no item is selected
  if (!isOpen || !item) {
    return null;
  }

  // Determine the display name, covering various item types
  const itemName =
    item.GroupName ||
    item.ProjectName ||
    item.Filename ||
    (item.GID ? `ID: ${item.GID}` : '') ||
    (item.PID ? `ID: ${item.PID}` : '') ||
    (item.CFID ? `ID: ${item.CFID}` : '') ||
    'Unknown Item';

  return (
    // Modal Overlay container (fixed position with high z-index)
    <div
      ref={modalRef}
      // Outer z-index is 50
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background backdrop/overlay */}
        <div
          className="fixed inset-0 bg-black/40 transition-opacity dark:bg-black/50 z-40"
          aria-hidden="true"
          onClick={onClose}
        ></div>
        {/* This is used to vertically center the modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Panel (The actual content box) */}
        <div
          // Added 'relative z-50' to ensure content panel floats above the z-40 backdrop
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden 
                     shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full 
                     dark:bg-gray-800 relative z-50"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800">
            <div className="sm:flex sm:items-start">
              {/* Alert Icon (Visual indicator for a destructive action) */}
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-900/50">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Modal Content - Title and Warning Message */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-bold text-gray-900 dark:text-white"
                  id="modal-title"
                >
                  {t('deleteConfirmation.title', { itemType })}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('deleteConfirmation.message', { itemType })}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {' '}
                      "{itemName}"
                    </span>
                    ? {t('deleteConfirmation.irreversible')}
                  </p>
                  <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-500">
                    {t('deleteConfirmation.dataLoss')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer (Action Buttons) */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-gray-900/50">
            {/* Confirm Delete Button (Red, primary action) */}
            <Button
              type="button"
              onClick={onConfirm}
              disabled={loading} // Disabled when an API call is in progress
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm 
                          px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm
                          disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
              {loading
                ? t('deleteConfirmation.deleting')
                : t('deleteConfirmation.confirmButton', { itemType })}
            </Button>

            {/* Cancel Button (Secondary action) */}
            <Button
              type="button"
              onClick={onClose}
              disabled={loading} // Also disabled during the API call
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm 
                          px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm 
                          dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600
                          disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
