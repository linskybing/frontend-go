import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-accent-300 focus:outline-none focus:ring-2 focus:ring-accent-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder || 'Search...'}
  />
);

export default SearchInput;
