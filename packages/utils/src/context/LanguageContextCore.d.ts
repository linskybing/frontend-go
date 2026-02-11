import React from 'react';
import type { Locale } from '../i18n';
export type LanguageContextType = {
  language: Locale;
  setLanguage: React.Dispatch<React.SetStateAction<Locale>>;
  toggleLanguage: () => void;
};
export declare const LanguageContext: React.Context<LanguageContextType>;
export default LanguageContext;
//# sourceMappingURL=LanguageContextCore.d.ts.map
