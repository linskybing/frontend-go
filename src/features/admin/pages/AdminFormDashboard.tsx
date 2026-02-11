import { useState, useEffect, useCallback } from 'react';
import { getAllForms, updateFormStatus } from '@/core/services/formService';
import { Form, FormStatus } from '@/core/interfaces/form';
import FormDetailModal from '@/features/forms/components/FormDetailModal';
import { PageLayout } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function AdminFormDashboard() {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user_id from localStorage
  const getCurrentUserId = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.user_id || 0;
      }
    } catch (e) {
      console.error('Failed to parse userData:', e);
    }
    return 0;
  };

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllForms();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.initData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleStatusChange = async (id: string, newStatus: FormStatus) => {
    try {
      await updateFormStatus(id, newStatus);
      setTickets((prev) => prev.map((t) => (t.ID === id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      alert(
        (t('form.createFailed') || 'Unable to update status: ') +
          (err instanceof Error ? err.message : String(err)),
      );
    }
  };

  const getStatusColor = (status: FormStatus) => {
    switch (status) {
      case FormStatus.Pending:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case FormStatus.Processing:
        return 'bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-300';
      case FormStatus.Completed:
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case FormStatus.Rejected:
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: FormStatus) => {
    switch (status) {
      case FormStatus.Pending:
        return t('form.status.pending') || 'Pending';
      case FormStatus.Processing:
        return t('form.status.processing') || 'Processing';
      case FormStatus.Completed:
        return t('form.status.completed') || 'Completed';
      case FormStatus.Rejected:
        return t('form.status.rejected') || 'Rejected';
      default:
        return status;
    }
  };

  const handleViewDetails = (form: Form) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  if (loading)
    return <div className="p-6 text-center">{t('loading.forms') || 'Loading forms...'}</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <PageLayout
      title={t('page.adminForm.title') || 'Forms Dashboard'}
      description={t('page.adminForm.description') || ''}
      breadcrumb={t('page.admin.forms') || 'Forms'}
    >
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.id') || 'ID'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.user') || 'User'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.project') || 'Project'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.titleDesc') || 'Title / Description'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.status') || 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.actions') || 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {tickets.map((ticket) => (
                <tr key={ticket.ID}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    #{ticket.ID}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {ticket.user?.Username || ticket.user_id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {ticket.project ? (
                      <span className="font-mono">{ticket.project.ProjectName}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {ticket.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {ticket.description}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        ticket.status,
                      )}`}
                    >
                      {getStatusText(ticket.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleViewDetails(ticket)}
                        className="flex items-center gap-1 px-3 py-1 bg-accent-600 hover:bg-accent-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        <ChatBubbleLeftIcon className="h-3 w-3" />
                        {t('form.viewMessages')}
                      </button>
                      {ticket.status === FormStatus.Pending && (
                        <>
                          <button
                            onClick={() => handleStatusChange(ticket.ID, FormStatus.Processing)}
                            className="text-accent-600 hover:text-accent-900 dark:text-accent-400 dark:hover:text-accent-300"
                          >
                            {t('form.action.process')}
                          </button>
                          <button
                            onClick={() => handleStatusChange(ticket.ID, FormStatus.Rejected)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {t('form.action.reject')}
                          </button>
                        </>
                      )}
                      {ticket.status === FormStatus.Processing && (
                        <button
                          onClick={() => handleStatusChange(ticket.ID, FormStatus.Completed)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          {t('form.action.complete')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Detail Modal with Messages */}
      <FormDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        form={selectedForm}
        currentUserId={getCurrentUserId()}
      />
    </PageLayout>
  );
}
