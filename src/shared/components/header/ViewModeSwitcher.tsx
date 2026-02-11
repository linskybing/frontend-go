import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@nthucscc/utils';

type ViewMode = 'user' | 'admin';

const ViewModeSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin (safely parse localStorage)
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setIsAdmin(parsed && parsed.is_super_admin === true);
      } catch (err) {
        // If userData is corrupted, default to non-admin
        // eslint-disable-next-line no-console
        console.warn('Failed to parse userData from localStorage', err);
        setIsAdmin(false);
      }
    }

    // Load saved viewMode from localStorage
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode === 'admin') {
      setViewMode('admin');
    } else {
      setViewMode('user');
    }
  }, []);

  const handleToggle = () => {
    if (viewMode === 'user') {
      setViewMode('admin');
      localStorage.setItem('viewMode', 'admin');
      // Navigate to admin dashboard
      navigate('/admin');
    } else {
      setViewMode('user');
      localStorage.removeItem('viewMode');
      // Navigate to user dashboard
      if (location.pathname.startsWith('/admin')) {
        navigate('/');
      }
    }
  };

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      aria-label={viewMode === 'user' ? t('view.toggleToAdmin') : t('view.toggleToUser')}
      title={viewMode === 'user' ? t('view.toggleToAdmin') : t('view.toggleToUser')}
    >
      {viewMode === 'user' ? (
        <ShieldCheckIcon className="h-5 w-5" />
      ) : (
        <UserIcon className="h-5 w-5" />
      )}
      <span className="absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center px-1 py-0.5 text-[9px] font-bold leading-3 rounded-full bg-accent-500 text-white dark:bg-accent-600">
        {viewMode === 'user' ? 'A' : 'U'}
      </span>
    </button>
  );
};

export default ViewModeSwitcher;
