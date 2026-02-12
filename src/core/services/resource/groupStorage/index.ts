/**
 * Group Storage Service - Central export
 */

export * from './storageApi';
export * from './permissionApi';
export * from './fileBrowserApi';
export * from './bindingApi';

// Re-export all functions in a service object for convenience
import * as storageApi from './storageApi';
import * as permissionApi from './permissionApi';
import * as fileBrowserApi from './fileBrowserApi';
import * as bindingApi from './bindingApi';

export const groupStorageService = {
  ...storageApi,
  ...permissionApi,
  ...fileBrowserApi,
  ...bindingApi,
};
