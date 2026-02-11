/* eslint-disable react-refresh/only-export-components */
import React, { createContext } from 'react';
import type { Locale } from '../i18n';

export type LanguageContextType = {
  language: Locale;
  setLanguage: React.Dispatch<React.SetStateAction<Locale>>;
  toggleLanguage: () => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: (() => {}) as React.Dispatch<React.SetStateAction<Locale>>,
  toggleLanguage: () => {},
});

export default LanguageContext;
