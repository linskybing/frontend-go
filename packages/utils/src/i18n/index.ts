// Import English modules
import { common as enCommon } from './locales/en/common';
import { status as enStatus } from './locales/en/status';
import { navigation as enNavigation } from './locales/en/navigation';
import { errors as enErrors } from './locales/en/errors';
import { auth as enAuth } from './locales/en/auth';
import { groups as enGroups } from './locales/en/groups';
import { projects as enProjects } from './locales/en/projects';
import { storage as enStorage } from './locales/en/storage';
import { admin as enAdmin } from './locales/en/admin';
import { monitor as enMonitor } from './locales/en/monitor';
import { forms as enForms } from './locales/en/forms';
import { members as enMembers } from './locales/en/members';
import { pages as enPages } from './locales/en/pages';
import { misc as enMisc } from './locales/en/misc';

// Import Chinese modules
import { common as zhCommon } from './locales/zh/common';
import { status as zhStatus } from './locales/zh/status';
import { navigation as zhNavigation } from './locales/zh/navigation';
import { errors as zhErrors } from './locales/zh/errors';
import { auth as zhAuth } from './locales/zh/auth';
import { groups as zhGroups } from './locales/zh/groups';
import { projects as zhProjects } from './locales/zh/projects';
import { storage as zhStorage } from './locales/zh/storage';
import { admin as zhAdmin } from './locales/zh/admin';
import { monitor as zhMonitor } from './locales/zh/monitor';
import { forms as zhForms } from './locales/zh/forms';
import { members as zhMembers } from './locales/zh/members';
import { pages as zhPages } from './locales/zh/pages';
import { misc as zhMisc } from './locales/zh/misc';
import { configFile as ZhConfigFile } from './locales/zh/configfile';
import { configFile } from './locales/en/configfile';
// Merge all English modules
const en = {
  ...enCommon,
  ...enStatus,
  ...enNavigation,
  ...enErrors,
  ...enAuth,
  ...enGroups,
  ...enProjects,
  ...enStorage,
  ...enAdmin,
  ...enMonitor,
  ...enForms,
  ...enMembers,
  ...enPages,
  ...enMisc,
  ...configFile,
} as const;

// Merge all Chinese modules
const zh = {
  ...zhCommon,
  ...zhStatus,
  ...zhNavigation,
  ...zhErrors,
  ...zhAuth,
  ...zhGroups,
  ...zhProjects,
  ...zhStorage,
  ...zhAdmin,
  ...zhMonitor,
  ...zhForms,
  ...zhMembers,
  ...zhPages,
  ...zhMisc,
  ...ZhConfigFile,
} as const;

// Define the resource map
const resources = { en, zh } as const;

/**
 * Recursive type helper to convert nested objects into dot-notation paths.
 * Example: { project: { create: { title: '...' } } } -> 'project.create.title'
 */
type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? (T[K] extends string ? K : `${K}.${Path<T[K]>}`) : never;
    }[keyof T]
  : never;

// Automatically derive all valid keys from the English source file
export type LocaleKey = Path<typeof en>;
export type Locale = 'en' | 'zh';

// Export en and zh for type inference (used in type system)
export { en, zh };

/**
 * Helper function to resolve a dot-notation path in a nested object.
 * @param obj The translation object (e.g., en or zh)
 * @param path The dot-notation string (e.g., 'project.create.title')
 * @returns The translated string or undefined if not found
 */
const resolvePath = (obj: unknown, path: string): string | undefined => {
  if (typeof obj !== 'object' || obj === null) return undefined;
  const parts = path.split('.');
  let acc: unknown = obj;
  for (const part of parts) {
    if (typeof acc !== 'object' || acc === null) return undefined;
    acc = (acc as Record<string, unknown>)[part];
    if (acc === undefined) return undefined;
  }
  return typeof acc === 'string' ? acc : undefined;
};

/**
 * Main translation function.
 * @param lang Target language code ('zh' | 'en')
 * @param key The strong-typed key path
 * @param vars Optional variables for interpolation (e.g., { name: 'John' })
 */
export const t = (lang: Locale, key: LocaleKey, vars?: Record<string, string | number>): string => {
  // 1. Get the dictionary for the requested language, default to English if missing
  const dictionary = resources[lang] ?? resources.en;

  // 2. Resolve the value from the nested object
  let text = resolvePath(dictionary, key);

  // 3. Fallback mechanism: If translation is missing in the target language, use English
  if (!text) {
    console.warn(`[i18n] Missing translation for key: "${key}" in language: "${lang}"`);
    text = resolvePath(resources.en, key);
  }

  // 4. Last resort: Return the key itself if even English is missing
  if (!text) return key;

  // 5. Handle variable interpolation (e.g., "Hello {name}" -> "Hello World")
  if (vars) {
    return Object.keys(vars).reduce((acc, k) => {
      const value = String(vars[k]);
      // Use global regex to replace all occurrences of the variable
      return acc.replace(new RegExp(`{${k}}`, 'g'), value);
    }, text);
  }

  return text;
};

export default resources;
