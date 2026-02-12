import React, { useEffect } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { SearchInput } from '@nthucscc/components-shared';
import useSearch from '@/shared/hooks/useSearch'; // Import the new hook

interface SearchBarProps {
  onDebouncedChange: (s: string) => void; // New prop for debounced changes
  initialSearchTerm?: string; // Optional initial search term
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onDebouncedChange,
  initialSearchTerm = '',
  className = '',
  placeholder,
}) => {
  const { t } = useTranslation();
  const ph = placeholder ?? `${t('form.label.title')}/${t('form.label.description')}`;

  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch(
    async (_term) => {
      // This searchFunction is a placeholder, as the actual search logic
      // will be handled by the parent component using onDebouncedChange.
      // We just need to return an empty array or handle it as appropriate
      // to satisfy the hook's type signature.
      return Promise.resolve([]);
    },
    { debounceTime: 500 },
  );

  // Initialize search term if provided
  useEffect(() => {
    if (initialSearchTerm && searchTerm === '') {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm, setSearchTerm, searchTerm]);

  // Notify parent component of debounced search term changes
  useEffect(() => {
    onDebouncedChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onDebouncedChange]);

  return (
    <div className={`min-w-[180px] ${className}`}>
      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder={ph} />
    </div>
  );
};

export default SearchBar;
