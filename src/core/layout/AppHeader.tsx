import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@nthucscc/utils';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useSidebar } from '../context/hooks/useSidebar';
import { useTranslation } from '@nthucscc/utils';
import { ThemeToggleButton } from '@nthucscc/components-shared';
// import NotificationDropdown from '@/shared/components/header/NotificationDropdown';
import UserDropdown from '@/shared/components/header/UserDropdown';

const LanguageButton: React.FC = () => {
  const { toggleLanguage, language } = useLanguage();
  return (
    <button
      onClick={() => toggleLanguage()}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      aria-label="Toggle Language"
      title={language === 'zh' ? 'Switch to English' : 'Switch to Chinese'}
    >
      <GlobeAltIcon className="h-5 w-5" />
      <span className="absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium leading-3 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
        {language === 'zh' ? 'ZH' : 'EN'}
      </span>
    </button>
  );
};

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [username, setUsername] = useState<string | null>(null);
  const { t } = useTranslation();
  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white/80 dark:bg-gray-900/80 border-gray-200 backdrop-blur-sm z-30 dark:border-gray-800 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-5 w-5" />}
          </button>

          <Link to="/" className="lg:hidden">
            <img className="dark:hidden" src="./images/logo/logo.svg" alt="Logo" />
            <img className="hidden dark:block" src="./images/logo/logo-dark.svg" alt="Logo" />
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <EllipsisHorizontalIcon className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-accent-300 focus:outline-hidden focus:ring-3 focus:ring-accent-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-accent-800 xl:w-[430px]"
                />
                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? 'flex' : 'hidden'
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* <!-- Dark Mode Toggler --> */}
            <ThemeToggleButton />
            {/* Language button (single, notification-style) */}
            <LanguageButton />
            {/* Notification dropdown */}
            {/* <NotificationDropdown /> */}
            {/* <!-- Notification Menu Area --> */}
          </div>
          {/* Display username */}
          {username && <span className="text-gray-700 dark:text-white/90 text-sm">{username}</span>}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
