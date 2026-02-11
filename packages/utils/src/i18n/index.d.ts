import en from './locales/en';
type DeepString<T> = T extends string ? string : { [K in keyof T]: DeepString<T[K]> };
export type Locale = 'en' | 'zh';
export type LocaleKey = string;
export type I18nResource = DeepString<typeof en>;
declare const resources: {
  readonly en: I18nResource;
  readonly zh: I18nResource;
};
/**
 * Main translation function.
 * @param lang Target language code ('zh' | 'en')
 * @param key Key path
 * @param vars Optional variables for interpolation
 */
export declare const t: (
  lang: Locale,
  key: LocaleKey,
  vars?: Record<string, string | number>,
) => string;

export default resources;
