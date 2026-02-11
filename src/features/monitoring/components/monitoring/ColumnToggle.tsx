import React, { useState } from 'react';
import { ColumnKey } from './types';

interface ColumnToggleProps {
  visibleColumns: Set<ColumnKey>;
  onToggle: (column: ColumnKey) => void;
}

const availableColumns: { key: ColumnKey; label: string }[] = [
  { key: 'kind', label: 'Kind' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'age', label: 'Age' },
  { key: 'details', label: 'Details' },
  { key: 'images', label: 'Images' },
  { key: 'restarts', label: 'Restarts' },
  { key: 'labels', label: 'Labels' },
];

export const ColumnToggle: React.FC<ColumnToggleProps> = ({ visibleColumns, onToggle }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        Columns
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-10 p-3 min-w-max">
          {availableColumns.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 mb-2 last:mb-0 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleColumns.has(key)}
                onChange={() => onToggle(key)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnToggle;
