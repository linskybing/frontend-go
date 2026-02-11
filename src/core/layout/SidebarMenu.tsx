import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, LocaleKey } from '@nthucscc/utils';

type NavItem = {
  name: LocaleKey;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: LocaleKey; path: string; pro?: boolean; new?: boolean }[];
};

type Props = {
  items: NavItem[];
  menuType: 'main' | 'admin';
  openSubmenu: { type: 'main' | 'admin'; index: number } | null;
  subMenuHeight: Record<string, number>;
  subMenuRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  handleSubmenuToggle: (index: number, menuType: 'main' | 'admin') => void;
  isActive: (path: string) => boolean;
  currentTheme: any;
};

export default function SidebarMenu({
  items,
  menuType,
  openSubmenu,
  subMenuHeight,
  subMenuRefs,
  isExpanded,
  isHovered,
  isMobileOpen,
  handleSubmenuToggle,
  isActive,
  currentTheme,
}: Props) {
  const { t } = useTranslation();

  return (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => {
        const isMenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const active = nav.path ? isActive(nav.path) : isMenuOpen;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`group flex items-center w-full rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200
                  ${active ? currentTheme.itemActive : currentTheme.itemHover}
                  ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}
                `}
              >
                <span
                  className={`shrink-0 transition-colors duration-200
                    ${active ? currentTheme.iconActive : currentTheme.iconInactive}`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="ml-3 flex-1 text-left whitespace-nowrap">{t(nav.name)}</span>
                    <span
                      className={`h-5 w-5 transition-transform duration-200 ${isMenuOpen ? `rotate-180 ${currentTheme.iconActive}` : 'text-gray-400'}`}
                    >
                      ▼
                    </span>
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`group flex items-center w-full rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200
                    ${active ? currentTheme.itemActive : currentTheme.itemHover}
                    ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}
                  `}
                >
                  <span
                    className={`shrink-0 transition-colors duration-200
                      ${active ? currentTheme.iconActive : currentTheme.iconInactive}`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="ml-3 whitespace-nowrap">{t(nav.name)}</span>
                  )}
                </Link>
              )
            )}

            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  height: isMenuOpen ? `${subMenuHeight[`${menuType}-${index}`]}px` : '0px',
                }}
              >
                <ul className="mt-1 space-y-1 pl-10 pr-2">
                  {nav.subItems.map((subItem) => {
                    const isSubActive = isActive(subItem.path);
                    return (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
                            ${isSubActive ? currentTheme.itemActive : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}
                          `}
                        >
                          <span className="truncate">{t(subItem.name)}</span>
                          <div className="ml-auto flex items-center gap-1.5">
                            {subItem.new && (
                              <span
                                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${currentTheme.badgeBg}`}
                              >
                                {t('badge.new')}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
