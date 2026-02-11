import React, { useState, Fragment } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Dialog, Transition, Combobox, RadioGroup } from '@headlessui/react';
import { CheckIcon as CheckMarkIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

// --- Interfaces & Data --- //

interface User {
  Uid: string;
  Username: string;
  // Added for avatar display
  avatar?: string;
}

export interface FormData {
  uid: string;
  role: 'user' | 'admin' | 'manager';
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[]; // A list of users that can be invited
  onSubmit: (formData: FormData) => Promise<void>;
}

import { LocaleKey } from '@nthucscc/utils';

const roles: { nameKey: LocaleKey; value: 'user' | 'admin' | 'manager'; descKey: LocaleKey }[] = [
  {
    nameKey: 'role.admin.name' as LocaleKey,
    value: 'admin',
    descKey: 'role.admin.desc' as LocaleKey,
  },
  {
    nameKey: 'role.manager.name' as LocaleKey,
    value: 'manager',
    descKey: 'role.manager.desc' as LocaleKey,
  },
  {
    nameKey: 'role.user.name' as LocaleKey,
    value: 'user',
    descKey: 'role.user.desc' as LocaleKey,
  },
];

// --- Helper Components --- //

// Helper component for the checkmark icon in the role selection
const RoleCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx={12} cy={12} r={12} fill="currentColor" opacity="0.2" />
    <path
      d="M7 13l3 3 7-7"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Helper to generate a consistent background color for avatars based on username
const generateAvatarBgColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 50%, 70%)`;
  return color;
};

// --- Main Component --- //

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose, users, onSubmit }) => {
  // --- Internal State Management --- //
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'manager'>('user');
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // --- Derived State --- //
  // Filter users based on the search query
  const filteredUsers =
    query === ''
      ? users
      : users.filter((user) =>
          user.Username.toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  // --- Event Handlers --- //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError(t('invite.selectUserError'));
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ uid: selectedUser.UID, role: selectedRole });
      handleClose(); // Close and reset on success
    } catch (err) {
      setError(err instanceof Error ? err.message : t('invite.unknownError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resets all state fields when the modal is closed
  const handleClose = () => {
    setSelectedUser(null);
    setSelectedRole('user');
    setQuery('');
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Modal Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

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
              // Increased modal width from max-w-md to max-w-lg
              className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800"
            >
              <Dialog.Title
                as="h3"
                className="text-xl font-semibold leading-6 text-gray-900 dark:text-white"
              >
                {t('invite.title')}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('invite.description')}
              </Dialog.Description>

              {/* User Selection Combobox */}
              <div className="relative mt-4">
                <Combobox value={selectedUser} onChange={setSelectedUser}>
                  <Combobox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('invite.userLabel')} <span className="text-red-500">*</span>
                  </Combobox.Label>
                  <div className="relative mt-1">
                    <Combobox.Input
                      className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      displayValue={(user: User | null) => user?.Username || ''}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t('invite.userSearchPlaceholder')}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                  >
                    <Combobox.Options className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm dark:bg-gray-700">
                      {filteredUsers.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-300">
                          {t('invite.noResults')}
                        </div>
                      ) : (
                        filteredUsers.map((user) => (
                          <Combobox.Option
                            key={user.UID}
                            value={user}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-accent-600 text-white' : 'text-gray-900 dark:text-white'}`
                            }
                          >
                            {({ selected, active }) => (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {/* [NEW] User Avatar */}
                                  <div
                                    style={{
                                      backgroundColor: generateAvatarBgColor(user.Username),
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                                  >
                                    {user.Username.charAt(0).toUpperCase()}
                                  </div>
                                  <span
                                    className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}
                                  >
                                    {user.Username}
                                  </span>
                                </div>
                                {selected && (
                                  <span
                                    className={`flex items-center ${active ? 'text-white' : 'text-accent-600'}`}
                                  >
                                    <CheckMarkIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </div>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </Combobox>
              </div>

              {/* Role Selection RadioGroup */}
              <div className="mt-5">
                <RadioGroup value={selectedRole} onChange={setSelectedRole}>
                  <RadioGroup.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role <span className="text-red-500">*</span>
                  </RadioGroup.Label>
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {roles.map((role) => (
                      <RadioGroup.Option
                        key={role.value}
                        value={role.value}
                        className={({ active, checked }) =>
                          `${active ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-blue-400' : ''} ${checked ? 'bg-accent-600 text-white' : 'bg-white dark:bg-gray-900/75'} relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none transition`
                        }
                      >
                        {({ checked }) => (
                          <div className="flex w-full items-start">
                            <div className="text-sm">
                              <RadioGroup.Label
                                as="p"
                                className={`font-semibold ${checked ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}
                              >
                                {t(role.nameKey)}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className={`inline ${checked ? 'text-accent-100' : 'text-gray-500 dark:text-gray-400'}`}
                              >
                                {t(role.descKey)}
                              </RadioGroup.Description>
                            </div>
                            {checked && (
                              <div className="ml-auto flex-shrink-0 text-white">
                                <RoleCheckIcon className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Error Message Display */}
              {error && (
                <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:ring-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedUser}
                  className="inline-flex justify-center rounded-md bg-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Inviting...' : 'Invite Member'}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InviteUserModal;
