import React from 'react';
import { useTranslation } from '@nthucscc/utils';
import { SearchInput } from '@nthucscc/components-shared';

interface SearchBarProps {
  value: string;
  onChange: (s: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, className = '', placeholder }) => {
  const { t } = useTranslation();
  const ph = placeholder ?? `${t('form.label.title')}/${t('form.label.description')}`;
  return (
    <div className={`min-w-[180px] ${className}`}>
      <SearchInput value={value} onChange={onChange} placeholder={ph} />
    </div>
  );
};

export default SearchBar;
