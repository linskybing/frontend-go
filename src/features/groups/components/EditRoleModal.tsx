// src/components/EditRoleModal.tsx

import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { UserGroupUser } from '@/core/interfaces/userGroup'; // Use the correct, consistent type

// --- Helper Data & Components --- //

const roles = [
  {
    name: 'Administrator',
    value: 'admin' as const,
    description: 'Full permissions for all resources and settings.',
  },
  {
    name: 'Project Manager',
    value: 'manager' as const,
    description: 'Can manage members and specific resources.',
  },
  {
    name: 'User',
    value: 'user' as const,
    description: 'Can view and interact with assigned resources.',
  },
];

/**
 * A check icon component for the selected role.
 */
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
    <path
      d="M7 13l3 3 7-7"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Main Component --- //

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserGroupUser;
  onUpdate: (newRole: 'admin' | 'manager' | 'user') => Promise<void>;
}

export default function EditRoleModal({ isOpen, onClose, user, onUpdate }: EditRoleModalProps) {
  // --- State Management --- //
  const [selectedRole, setSelectedRole] = useState(user.Role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if the user prop changes while the modal is open
  useEffect(() => {
    setSelectedRole(user.Role);
  }, [user]);

  // --- Handlers --- //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onUpdate(selectedRole);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state on close to avoid showing old data briefly on reopen
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  // --- Render --- //
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop */}
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

        {/* Modal Panel */}
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
                Edit Role
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Change permission level for:{' '}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {user.Username}
                </span>
                .
              </Dialog.Description>

              {/* Custom Radio Group for Role Selection */}
              <div className="mt-4 w-full">
                <RadioGroup value={selectedRole} onChange={setSelectedRole}>
                  <RadioGroup.Label className="sr-only">Role</RadioGroup.Label>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <RadioGroup.Option
                        key={role.name}
                        value={role.value}
                        className={({ active, checked }) =>
                          `${active ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300' : ''}
                          ${checked ? 'bg-sky-600 text-white' : 'bg-white dark:bg-gray-900/75'}
                          relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none transition`
                        }
                      >
                        {({ checked }) => (
                          <>
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium ${checked ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}
                                  >
                                    {role.name}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={`inline ${checked ? 'text-sky-100' : 'text-gray-500 dark:text-gray-400'}`}
                                  >
                                    {role.description}
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              {checked && (
                                <div className="flex-shrink-0 text-white">
                                  <CheckIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:ring-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-md bg-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Role'}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
