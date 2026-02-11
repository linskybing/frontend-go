import React from 'react';

interface TabSwitcherProps {
  tab: string;
  setTab: (tab: string) => void;
  tabs: { key: string; label: string }[];
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tab, setTab, tabs }) => (
  <div className="mb-6 flex gap-2">
    {tabs.map((t) => (
      <button
        key={t.key}
        className={`px-4 py-2 rounded-t-lg border-b-2 transition-colors font-semibold ${tab === t.key ? 'border-violet-600 text-accent-600 bg-white dark:bg-gray-800' : 'border-transparent text-gray-500 bg-gray-100 dark:bg-gray-700'}`}
        onClick={() => setTab(t.key)}
      >
        {t.label}
      </button>
    ))}
  </div>
);

export default TabSwitcher;
