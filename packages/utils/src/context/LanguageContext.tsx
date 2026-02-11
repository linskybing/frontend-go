/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { LanguageContext, type LanguageContextType } from './LanguageContextCore';

// If Locale is a value, you likely want to use its type or define a union type for language
type Language = 'en' | 'zh';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = React.useState<Language>('en');
  const toggleLanguage = () => setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  return React.useContext(LanguageContext);
};

export default LanguageContext;
