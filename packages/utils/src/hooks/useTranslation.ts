import { useLanguage } from '../context/LanguageContext';
import { t as translate, LocaleKey, Locale } from '../i18n';
import { useCallback } from 'react';

export const useTranslation = (): {
  t: (key: LocaleKey, vars?: Record<string, string | number>) => string;
  lang: Locale;
} => {
  const { language } = useLanguage();
  const t = useCallback(
    (key: LocaleKey, vars?: Record<string, string | number>) => {
      return translate(language, key, vars);
    },
    [language],
  );
  return { t, lang: language } as const;
};

export default useTranslation;
