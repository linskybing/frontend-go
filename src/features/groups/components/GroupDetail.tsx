import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@nthucscc/utils';
import { PageMeta } from '@nthucscc/components-shared';
import { PageBreadcrumb } from '@nthucscc/ui';
import { ChartBarIcon, UsersIcon, CubeIcon } from '@heroicons/react/24/outline';
import { UserGroupUser } from '@/core/interfaces/userGroup';
import InviteUserModal, { FormData } from '../components/InviteUserModal';
import EditRoleModal from '../components/EditRoleModal';
import GroupOverviewTab from './GroupOverviewTab';
import GroupMembersTab from './GroupMembersTab';
import GroupStorageList from './storage/GroupStorageList';
import useGroupDetail from './useGroupDetail';

export default function GroupDetail() {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id?: string }>();

  const [activeTab, setActiveTab] = useState('overview');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<UserGroupUser | null>(null);

  const {
    group,
    groupUsers,
    canManage,
    loading,
    error,
    handleInviteSubmit,
    handleDeleteUser,
    handleUpdateRole,
  } = useGroupDetail(id);

  useEffect(() => {
    if (activeTab !== 'members' && selectedUserToEdit) {
      setSelectedUserToEdit(null);
    }
  }, [activeTab, selectedUserToEdit]);

  if (loading) return <div className="p-10 text-center animate-pulse">{t('common.loading')}</div>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (!group) return <p className="p-10 text-center text-gray-500">{t('groups.notFound')}</p>;

  return (
    <>
      <PageMeta title={`${group.GroupName} | Groups`} description={group.Description} />
      <PageBreadcrumb pageTitle={group.GroupName} />

      <div className="mb-6 mt-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: t('groups.tab.overview'), icon: ChartBarIcon },
            { id: 'members', label: t('groups.tab.members'), icon: UsersIcon },
            { id: 'storage', label: t('groups.tab.storage'), icon: CubeIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && <GroupOverviewTab group={group} />}

        {activeTab === 'members' && (
          <GroupMembersTab
            groupUsers={groupUsers}
            canManage={canManage}
            onInvite={() => setIsInviteModalOpen(true)}
            onEdit={(user) => setSelectedUserToEdit(user)}
            onRemove={handleDeleteUser}
          />
        )}

        {activeTab === 'storage' && <GroupStorageList groupId={group.GID} canManage={canManage} />}
      </div>

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        users={[]}
        onSubmit={async (formData: FormData) => {
          await handleInviteSubmit(formData);
          setIsInviteModalOpen(false);
        }}
      />

      {selectedUserToEdit && (
        <EditRoleModal
          isOpen={!!selectedUserToEdit}
          onClose={() => setSelectedUserToEdit(null)}
          user={selectedUserToEdit}
          onUpdate={async (newRole) => {
            if (!selectedUserToEdit) return;
            await handleUpdateRole(selectedUserToEdit, newRole);
            setSelectedUserToEdit(null);
          }}
        />
      )}
    </>
  );
}
