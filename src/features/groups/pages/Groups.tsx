import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '@/core/interfaces/group';
import { getGroups } from '@/core/services/groupService';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { PageLayout } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
import { Pagination, SearchInput } from '@nthucscc/components-shared';
import { canCreateGroup } from '@/shared/utils/permissions';

// Components
import GroupCard from '../components/groups/GroupCard';
import LoadingState from '../components/groups/LoadingState';
import ErrorState from '../components/groups/ErrorState';
import EmptyState from '../components/groups/EmptyState';
import CreateGroupModal from '../components/groups/CreateGroupModal';

export default function Groups() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- State Management --- //
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Permission check
  const showCreateButton = canCreateGroup();

  // --- Data Fetching Effect --- //
  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) throw new Error(t('groups.error.userNotLogged'));

        const userData = JSON.parse(userDataString);
        const userId = userData?.user_id;
        if (!userId) throw new Error(t('groups.error.userIdMissing'));

        const [allGroups, userGroupMappings] = await Promise.all([
          getGroups(),
          getGroupsByUser(userId),
        ]);

        // Filter groups that the user belongs to
        const userGroupIds = new Set(userGroupMappings.map((ug) => ug.GID));
        const filteredGroups = allGroups.filter((group) => userGroupIds.has(group.GID));
        setGroups(filteredGroups);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('groups.error.unknown'));
      } finally {
        setLoading(false);
      }
    };
    fetchUserGroups();
  }, [t]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- Handlers --- //
  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  const handleGroupCreated = (newGroup: Group) => {
    setGroups((prev) => [...prev, newGroup]);
    setIsCreateModalOpen(false);
  };

  // --- Filtering and Pagination --- //
  const filteredGroups = groups.filter(
    (group) =>
      group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.Description && group.Description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- Conditional Rendering --- //
  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;

    // If no groups exist, show EmptyState (without action)
    if (groups.length === 0) return <EmptyState onActionClick={() => {}} />;

    if (filteredGroups.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          {t('groups.noMatch', { term: searchTerm })}
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedGroups.map((group) => (
            <GroupCard key={group.GID} group={group} onClick={() => handleGroupClick(group.GID)} />
          ))}
        </div>
        <Pagination current={currentPage} total={totalPages} onPageChange={setCurrentPage} />
      </>
    );
  };

  // --- Render --- //
  return (
    <PageLayout
      title={t('groups.page.title')}
      description={t('groups.page.description')}
      breadcrumb={t('breadcrumb.groups') || 'Groups'}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50 sm:p-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('groups.myGroups')}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('groups.subtitle')}</p>
          </div>
          <div className="flex w-full sm:w-auto gap-3 items-center">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('groups.searchPlaceholder')}
            />
            {showCreateButton && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center rounded-md bg-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 whitespace-nowrap"
              >
                <svg
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                {t('groups.createNew')}
              </button>
            )}
          </div>
        </div>
        {renderContent()}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </PageLayout>
  );
}
