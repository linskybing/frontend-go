import { useEffect, useState, FormEvent } from 'react';
import UserFormApply from '../components/form/UserFormApply';
import UserFormHistory from '../components/form/UserFormHistory';
import TabSwitcher from '../components/form/TabSwitcher';
import FormDetailModal from '../components/FormDetailModal';
import { PageLayout } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
import { getProjects } from '@/core/services/projectService';
import { createForm, getMyForms } from '@/core/services/formService';
import { Form } from '@/core/interfaces/form';
import { Project } from '@/core/interfaces/project';

type ViewMode = 'grid' | 'list';

export default function UserFormDashboard() {
  // Add tab state: 'history' or 'apply'
  const [tab, setTab] = useState<'history' | 'apply'>('history');
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  const [myForms, setMyForms] = useState<Form[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const filteredForms = (myForms || []).filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchForms = async () => {
      setLoadingForms(true);
      try {
        const data = await getMyForms();
        setMyForms(data);
      } catch (e) {
        // ignore
      } finally {
        setLoadingForms(false);
      }
    };
    fetchForms();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (e) {
        /* ignore silently */
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('form.error.titleRequired'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createForm({
        project_id: selectedProject ? Number(selectedProject) : undefined,
        title: title.trim(),
        description,
        tag: '',
      });
      setSuccess(t('form.success.submitted'));
      setTitle('');
      setDescription('');
      setSelectedProject(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('form.error.submitFailed'));
    } finally {
      setLoading(false);
    }
  };

  const statusText = (s?: string) => (s ? t(`form_status_${s.toLowerCase()}` as any) : '');

  const handleViewDetails = (form: Form) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  return (
    <PageLayout
      title={t('form.page.title')}
      description={t('form.page.description')}
      breadcrumb={t('form.page.title')}
    >
      <TabSwitcher
        tab={tab}
        setTab={setTab as any}
        tabs={[
          { key: 'history', label: t('form.history.title') },
          { key: 'apply', label: t('form.apply.title') },
        ]}
      />

      {tab === 'history' && (
        <UserFormHistory
          loadingForms={loadingForms}
          filteredForms={filteredForms}
          currentForms={currentForms}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          statusText={statusText}
          onViewDetails={handleViewDetails}
        />
      )}
      {tab === 'apply' && (
        <UserFormApply
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          loading={loading}
          error={error}
          success={success}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Form Detail Modal with Messages */}
      <FormDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        form={selectedForm}
        currentUserid={String(getCurrentUserId())}
      />
    </PageLayout>
  );
}
