import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation, LocaleKey } from '@nthucscc/utils';
import {
  HomeIcon,
  FolderIcon,
  PlayCircleIcon,
  UserGroupIcon,
  ServerStackIcon,
  FolderOpenIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  CircleStackIcon,
  PhotoIcon,
  ArrowPathIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import { useSidebar } from '../context/hooks/useSidebar';
import { useAuth } from '../context/useAuth'; // New import
import SidebarMenu from './SidebarMenu';

// --- Types ---
type NavItem = {
  name: LocaleKey;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: LocaleKey; path: string; pro?: boolean; new?: boolean }[];
};

// --- Navigation Data ---
const navItems: NavItem[] = [
  { icon: <HomeIcon className="h-5 w-5" />, name: 'sidebar.overview', path: '/' },
  { icon: <FolderIcon className="h-5 w-5" />, name: 'sidebar.projects', path: '/projects' },
  { icon: <PlayCircleIcon className="h-5 w-5" />, name: 'sidebar.jobs', path: '/jobs' },
  { icon: <RectangleStackIcon className="h-5 w-5" />, name: 'sidebar.workflows', path: '/workflows' },
  { icon: <UserGroupIcon className="h-5 w-5" />, name: 'sidebar.groups', path: '/groups' },
  { icon: <ServerStackIcon className="h-5 w-5" />, name: 'sidebar.pods', path: '/pod-tables' },
  {
    icon: <FolderOpenIcon className="h-5 w-5" />,
    name: 'sidebar.fileBrowser',
    path: '/file-browser',
  },
  { icon: <DocumentTextIcon className="h-5 w-5" />, name: 'sidebar.forms', path: '/my-forms' },
];

const adminItems: NavItem[] = [
  { icon: <Squares2X2Icon className="h-5 w-5" />, name: 'admin.dashboard', path: '/admin' },
  {
    icon: <FolderIcon className="h-5 w-5" />,
    name: 'page.admin.manageProjects',
    path: '/admin/manage-projects',
  },
  {
    icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
    name: 'page.admin.auditLogs.title',
    path: '/admin/audit-logs',
  },
  {
    icon: <UserGroupIcon className="h-5 w-5" />,
    name: 'page.admin.manageGroups',
    path: '/admin/manage-groups',
  },
  {
    icon: <DocumentTextIcon className="h-5 w-5" />,
    name: 'page.admin.forms',
    path: '/admin/forms',
  },
  {
    icon: <CircleStackIcon className="h-5 w-5" />,
    name: 'admin.storageManagement.title',
    path: '/admin/storage-management',
  },
  {
    icon: <PhotoIcon className="h-5 w-5" />,
    name: 'sidebar.manageImages',
    path: '/admin/manage-images',
  },
  {
    icon: <ArrowPathIcon className="h-5 w-5" />,
    name: 'sidebar.imageRequests',
    path: '/admin/image-requests',
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const { isAdmin, viewMode, switchViewMode } = useAuth(); // Consume from AuthContext
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    // Exact match only - no prefix matching to avoid overlaps
    // (e.g., /admin should not match /admin/manage-groups)
    return location.pathname === path;
  };

  // --- State ---
  const [openSubmenu, setOpenSubmenu] = useState<{ type: 'main' | 'admin'; index: number } | null>(
    null,
  );
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // --- Theme Configuration ---
  const themeConfig = {
    user: {
      sidebarBg: 'bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-800',
      itemActive: 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400',
      itemHover: 'hover:bg-gray-50 text-gray-600 dark:text-gray-400 dark:hover:bg-slate-800/50',
      iconActive: 'text-accent-600 dark:text-accent-400',
      iconInactive:
        'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300',
      logoText: 'text-gray-900 dark:text-white',
      sectionTitle: 'text-gray-500 dark:text-gray-400',
      toggleButton:
        'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300',
      adminTag:
        'bg-accent-50 text-accent-700 border border-accent-200 dark:bg-accent-500/10 dark:text-accent-400 dark:border-accent-500/30',
      badgeBg: 'bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400',
    },
    admin: {
      sidebarBg: 'bg-zinc-900 border-zinc-800 dark:bg-slate-950 dark:border-slate-900',
      itemActive: 'bg-amber-500/15 text-amber-400 dark:bg-amber-500/15 dark:text-amber-400',
      itemHover: 'hover:bg-white/5 text-zinc-400 dark:hover:bg-white/5 dark:text-zinc-400',
      iconActive: 'text-amber-400 dark:text-amber-400',
      iconInactive:
        'text-zinc-500 group-hover:text-zinc-300 dark:text-zinc-500 dark:group-hover:text-zinc-300',
      logoText: 'text-white dark:text-white',
      sectionTitle: 'text-zinc-500 dark:text-zinc-500',
      toggleButton:
        'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700',
      adminTag:
        'bg-amber-500/15 text-amber-400 border border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
      badgeBg: 'bg-amber-500/15 text-amber-400 dark:bg-amber-500/15 dark:text-amber-400',
    },
  };

  const currentTheme = themeConfig[viewMode];

  // --- Effects ---
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'admin') => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  // --- Render Helpers ---
  // Moved menu rendering into SidebarMenu to keep this file focused.

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r transition-all duration-300 ease-in-out mt-16 lg:mt-0
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${currentTheme.sidebarBg}
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- Branding / Logo --- */}
      <div
        className={`flex h-20 items-center justify-between px-3 ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start lg:px-8'}`}
      >
        <Link to="/" className="flex-1">
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ width: isExpanded || isHovered || isMobileOpen ? 'auto' : '2ch' }}
          >
            <span
              className={`text-xl font-bold whitespace-nowrap transition-colors ${currentTheme.logoText}`}
            >
              {t('brand.name')}
            </span>
          </div>
        </Link>
        {/* Sidebar toggle button - visible on mobile when expanded */}
        {isMobileOpen && (
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* --- Menu Links --- */}
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar pb-4">
        <nav className="flex-1 space-y-6 px-3">
          {viewMode === 'user' && (
            <div>
              <div
                className={`mb-3 px-3 text-xs font-bold uppercase tracking-wider ${currentTheme.sectionTitle} ${!isExpanded && !isHovered ? 'lg:hidden' : ''}`}
              >
                {t('sidebar.menu')}
              </div>
              <SidebarMenu
                items={navItems}
                menuType="main"
                openSubmenu={openSubmenu}
                subMenuHeight={subMenuHeight}
                subMenuRefs={subMenuRefs}
                isExpanded={isExpanded}
                isHovered={isHovered}
                isMobileOpen={isMobileOpen}
                handleSubmenuToggle={handleSubmenuToggle}
                isActive={isActive}
                currentTheme={currentTheme}
              />
            </div>
          )}

          {isAdmin && viewMode === 'admin' && (
            <div>
              <div
                className={`mb-3 px-3 text-xs font-bold uppercase tracking-wider ${currentTheme.sectionTitle} ${!isExpanded && !isHovered ? 'lg:hidden' : ''}`}
              >
                {t('sidebar.admin')}
              </div>
              <SidebarMenu
                items={adminItems}
                menuType="admin"
                openSubmenu={openSubmenu}
                subMenuHeight={subMenuHeight}
                subMenuRefs={subMenuRefs}
                isExpanded={isExpanded}
                isHovered={isHovered}
                isMobileOpen={isMobileOpen}
                handleSubmenuToggle={handleSubmenuToggle}
                isActive={isActive}
                currentTheme={currentTheme}
              />
            </div>
          )}
        </nav>

        {/* --- View Mode Switcher --- */}
        {isAdmin && (isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-auto px-5 pt-4 pb-4">
            <button
              onClick={() => {
                switchViewMode(viewMode === 'admin' ? 'user' : 'admin');
              }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 shadow-sm
                ${currentTheme.toggleButton}
              `}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>{viewMode === 'admin' ? t('view.toggleToUser') : t('view.toggleToAdmin')}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
