// src/components/groups/CreateGroupModal.tsx

import React, { useState, Fragment } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Dialog, Transition } from '@headlessui/react';
import { Group } from '@/core/interfaces/group';
import { createGroup } from '@/core/services/groupService'; // Assuming you have this service function

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (newGroup: Group) => void;
}

/**
 * A modal dialog for creating a new group.
 * It contains a form and handles the submission logic.
 */
const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onGroupCreated }) => {
  // --- State for form inputs and submission status --- //
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // --- Handlers --- //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError(t('groups.form.nameRequired'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call your API service to create the group
      const newGroup = await createGroup({
        group_name: groupName,
        description: description,
      });
      onGroupCreated(newGroup); // Pass the new group back to the parent
      handleClose(); // Close and reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : t('groups.form.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resets state when the modal is closed
  const handleClose = () => {
    setGroupName('');
    setDescription('');
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              as="form"
              onSubmit={handleSubmit}
              className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800"
            >
              <Dialog.Title
                as="h3"
                className="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
              >
                {t('groups.form.title')}
              </Dialog.Title>

              {/* Form Fields */}
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="groupName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('groups.nameLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('groups.descriptionLabel')}
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:ring-0"
                >
                  {t('groups.form.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-md bg-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('groups.form.creating') : t('groups.form.title')}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateGroupModal;
