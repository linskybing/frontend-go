import { useState, useEffect } from 'react';
import {
  getAllowedImages,
  addProjectImage,
  removeProjectImage,
  requestImage,
  approveImageRequest,
  getProjectImageRequests,
  AllowedImage,
  AddProjectImageInput,
  ImageRequest,
} from '@/core/services/imageService';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@nthucscc/utils';
import { isSuperAdmin, isAdminLike } from '@/shared/utils/permissions';
import ProjectImageAddForm from './ProjectImageAddForm';
import ProjectImageList from './ProjectImageList';
import ProjectImageRequests from './ProjectImageRequests';
import ProjectImageAbout from './ProjectImageAbout';
// Split components exist but the management file currently renders inline lists.
// Removed direct imports to avoid unused import errors until replacement is activated.

interface ProjectImageManagementProps {
  projectId: string;
}

export default function ProjectImageManagement({ projectId }: ProjectImageManagementProps) {
  const { t } = useTranslation();
  const [images, setImages] = useState<AllowedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ImageRequest[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  type FormDataType = AddProjectImageInput & { createAsGlobal?: boolean };
  const [formData, setFormData] = useState<FormDataType>({ name: '', tag: '' });
  const [adding, setAdding] = useState(false);
  const [isSuperAdminFlag, setIsSuperAdminFlag] = useState(false);
  const [isAdminLikeFlag, setIsAdminLikeFlag] = useState(false);

  const loadImages = async () => {
    try {
      setLoading(true);
      // console.log('Loading images for project:', projectId);
      const data = await getAllowedImages(projectId);
      // console.log('Loaded images data:', data);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load images:', err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const data = await getProjectImageRequests(projectId);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load project image requests:', err);
      setRequests([]);
    }
  };

  useEffect(() => {
    loadImages();
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    setIsSuperAdminFlag(isSuperAdmin());
    setIsAdminLikeFlag(isAdminLike());
  }, []);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tag) return;
    try {
      setAdding(true);
      if (isSuperAdminFlag && formData.createAsGlobal) {
        // Super-admin: create a request then immediately approve as global
        const req = await requestImage({ name: formData.name, tag: formData.tag });
        await approveImageRequest(req.ID, 'Created by super-admin as global', true);
        await loadImages();
        // Ensure the newly-approved image shows an approved status in the UI
        setImages((prev) =>
          prev.map((img) =>
            img.Name === formData.name && img.Tag === formData.tag
              ? { ...img, Status: 'approved' }
              : img,
          ),
        );
      } else if (isAdminLikeFlag) {
        // Super-admin: add directly to project (allowed image)
        const newImage = await addProjectImage(projectId, formData);
        // Tentatively add with approved status for immediate feedback,
        // then reload and ensure the approved status is set.
        setImages((prev) => [...prev, { ...newImage, Status: 'approved' }]);
        await loadImages();
        setImages((prev) =>
          prev.map((img) =>
            img.Name === formData.name && img.Tag === formData.tag
              ? { ...img, Status: 'approved' }
              : img,
          ),
        );
      } else {
        // Project admins and regular users: always submit a request
        const req = await requestImage({
          name: formData.name,
          tag: formData.tag,
          project_id: projectId,
        });
        // add the request to the project requests table (not the allowed images list)
        setRequests((prev) => [req, ...(prev || [])]);
        // refresh server-side requests to keep in sync
        await loadRequests();
        alert(t('project.images.requestSubmitted'));
      }
      setFormData({ name: '', tag: '' });
      setShowAddForm(false);
    } catch (err) {
      alert(t('project.images.addError') + (err instanceof Error ? err.message : String(err)));
      await loadImages();
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    if (!confirm(t('project.images.confirmRemove'))) return;
    try {
      await removeProjectImage(projectId, imageId);
      setImages((prev) => prev.filter((img) => img.ID !== imageId));
    } catch (err) {
      alert(t('project.images.removeError') + (err instanceof Error ? err.message : String(err)));
      await loadImages();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('project.images.title')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('project.images.description')}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {t('project.images.add')}
        </button>
      </div>

      {showAddForm && (
        <ProjectImageAddForm
          formData={formData}
          setFormData={(f) => setFormData(f)}
          onSubmit={handleAddImage}
          onCancel={() => {
            setShowAddForm(false);
            setFormData({ name: '', tag: '' });
          }}
          adding={adding}
          isSuperAdminFlag={isSuperAdminFlag}
        />
      )}
      {loading ? (
        <div className="text-center py-8 text-gray-500">{t('project.images.loading')}</div>
      ) : (
        <>
          <ProjectImageList images={images} onRemove={handleRemoveImage} />
          <ProjectImageRequests requests={requests} />
          <ProjectImageAbout />
        </>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium mb-1">{t('project.images.about.title')}</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <strong>{t('project.images.about.globalLabel')}</strong>{' '}
                {t('project.images.about.globalDesc')}
              </li>
              <li>
                <strong>{t('project.images.about.projectLabel')}</strong>{' '}
                {t('project.images.about.projectDesc')}
              </li>
              <li>{t('project.images.about.accessible')}</li>
              <li>{t('project.images.about.allowed')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
