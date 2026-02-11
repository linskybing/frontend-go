import React from 'react';
import { GridShape } from '@nthucscc/ui';
import { ThemeToggleButton } from '@nthucscc/components-shared';
import { useLanguage, useTranslation } from '@nthucscc/utils';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { toggleLanguage, language } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-slate-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <p className="text-center text-gray-400 dark:text-white/60">AI platform</p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLanguage()}
              className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label={t('language.aria')}
              title={language === 'zh' ? t('language.switchToEn') : t('language.switchToZh')}
            >
              <span className="sr-only">{t('language.switchLabel')}</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.546-3.131 1.57-4.345"
                />
              </svg>

              <span className="absolute bottom-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium leading-3 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 translate-x-1/4 translate-y-1/4">
                {language === 'zh' ? 'ZH' : 'EN'}
              </span>
            </button>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </div>
  );
}
