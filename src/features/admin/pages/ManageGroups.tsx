// ManageGroups.tsx (Final Component Implementation)

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { PageLayout } from '@nthucscc/ui';
import {
  getGroups,
  createGroup,
  CreateGroupInput,
  deleteGroup,
} from '@/core/services/groupService';
import { Group } from '@/core/interfaces/group';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@nthucscc/utils';
import GroupList from '@/features/groups/components/GroupList';
import CreateGroupForm from '@/features/groups/components/CreateGroupForm';
import { Button } from '@nthucscc/ui';
// Ensure this import path is correct
import { DeleteConfirmationModal } from '@nthucscc/ui';

// SVG Icon for the New Group button
const PlusIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export default function ManageGroups() {
  // Master list of all groups
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  // List displayed after filtering
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);

  // Form States (for Modal)
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  // UI/API States
  const [loading, setLoading] = useState(true); // Used for initial data fetch
  const [formLoading, setFormLoading] = useState(false); // Used ONLY for form submission (Creation/Deletion)
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Create Modal control

  // DELETE CONFIRMATION STATES
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  // -------------------------

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  /**
   * Handler to update the search term state.
   */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Closes the creation modal and resets form/error state.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGroupName('');
    setDescription('');
    setError(null); // Clear error on close
  };

  /**
   * Closes the delete modal and resets temporary state.
   */
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setGroupToDelete(null);
    setError(null);
  };

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const fetchedGroups = await getGroups();
        setAllGroups(fetchedGroups);
        setFilteredGroups(fetchedGroups); // Initialize filtered list
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.fetchGroups'));
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [t]);

  // --- REAL-TIME SEARCH FILTERING LOGIC ---
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      setFilteredGroups(allGroups);
      return;
    }

    const results = allGroups.filter((group) => {
      const nameMatch = group.GroupName?.toLowerCase().includes(term);
      const descMatch = group.Description?.toLowerCase().includes(term);
      const idMatch = group.GID ? String(group.GID).includes(term) : false;

      return nameMatch || descMatch || idMatch;
    });

    setFilteredGroups(results);
  }, [searchTerm, allGroups]); // Updates when search term changes or master list is modified

  /**
   * Handles the group creation form submission.
   */
  const handleCreateGroup = async (e: FormEvent) => {
    e.preventDefault();
    const input: CreateGroupInput = { group_name: groupName, description };

    try {
      setFormLoading(true); // Lock form fields
      setError(null);

      const newGroup = await createGroup(input);

      // Update the master list; filter will update automatically
      setAllGroups((prev) => [...prev, newGroup]);
      handleCloseModal(); // Creation successful, close modal
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.createGroup'));
    } finally {
      setFormLoading(false); // Unlock form fields
    }
  };

  /**
   * Opens the delete confirmation modal, setting the group to be deleted.
   */
  const handleDeleteClick = (group: Group) => {
    // Only allow deletion if no other action is currently processing
    if (formLoading) return;
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  /**
   * Executes the deletion API call after user confirmation in the modal.
   */
  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;

    const groupId = groupToDelete.GID;

    // Set loading state for delete operation and immediately close the modal
    setFormLoading(true);
    handleCloseDeleteModal();

    try {
      const res = await deleteGroup(groupId);
      if (res.message === 'Group deleted') {
        // Optimistically update the UI list
        setAllGroups((prev) => prev.filter((g) => g.GID !== groupId));
      } else {
        // Display error from API response
        setError(res.message || t('error.deleteGroup'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.deleteFailed'));
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <PageLayout
      title={t('page.manageGroups.title')}
      description={t('page.manageGroups.description')}
    >
      {/* Main Content Container: Enhanced styling for dashboard view */}
      <div className="min-h-screen rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:p-10">
        {/* Top Action Bar: Create Button */}
        <div className="flex justify-end mb-8">
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            // Disable create button if any other action (creation/deletion) is loading
            disabled={formLoading}
            // Consistent violet styling
            className="
                          flex items-center space-x-2 px-4 py-2 text-sm font-semibold 
                          bg-accent-600 text-white rounded-lg shadow-md
                          hover:bg-violet-700 transition duration-150 
                          focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50
                          disabled:opacity-50 disabled:cursor-not-allowed
                      "
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('button.newGroup')}</span>
          </Button>
        </div>

        {/* Group List Component (Includes Search Bar) */}
        <GroupList
          groups={filteredGroups} // Pass filtered data
          loading={loading}
          error={error}
          onGroupClick={handleGroupClick}
          // Pass the handler to open the modal (which expects a Group object)
          onDeleteGroup={handleDeleteClick}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          // Pass formLoading state to GroupList to disable delete buttons
          isActionLoading={formLoading}
        />
      </div>

      {/* Create Group Modal (Conditional Rendering) */}
      <CreateGroupForm
        groupName={groupName}
        description={description}
        // Use dedicated form loading state
        loading={formLoading}
        error={error}
        isOpen={isModalOpen} // Modal control
        onClose={handleCloseModal} // Close handler
        // Handlers
        onGroupNameChange={(e: ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
        onDescriptionChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
        onSubmit={handleCreateGroup}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        item={groupToDelete}
        itemType="Group" // Specifies the type of item being deleted
        loading={formLoading} // Pass loading state to disable modal buttons during API call
        // Note: DeleteConfirmationModal must be designed to handle the 'item' prop being null initially
      />
    </PageLayout>
  );
}
