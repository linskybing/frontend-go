/**
 * Error messages
 */
export const errors = {
  error: {
    fetch: 'Failed to fetch data',
    fetchGroups: 'Failed to fetch groups',
    fetchData: 'Failed to fetch data',
    createGroup: 'Failed to create group',
    deleteGroup: 'Failed to delete group',
    deleteFailed: 'Delete failed',
    initData: 'Failed to initialize data',
    selectGroup: 'Please select a group',
    invalidProjectData: 'Invalid project data',
    createProject: 'Failed to create project',
    deleteProject: 'Failed to delete project',
    userNotLogged: 'User not logged in',
    application_error: 'Application Error',
    application_error_description: 'Something went wrong. We apologize for the inconvenience.',
    component_stack: 'Component Stack',
    try_again: 'Try Again',
    go_home: 'Go Home',
  },
} as const;
