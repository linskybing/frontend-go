/**
 * Form and Audit log translations
 */
export const forms = {
  // Top-level keys for backward compatibility
  form_status_pending: 'Pending',
  form_status_approved: 'Approved',
  form_status_rejected: 'Rejected',
  form_status_processing: 'Processing',
  form_status_completed: 'Completed',
  form: {
    title: 'Submit Form',
    subtitle: 'Create a new form request or report',
    type: {
      general: 'General',
      bug: 'Bug Report',
      feature: 'Feature Request',
    },
    status: {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      processing: 'Processing',
      completed: 'Completed',
    },
    action: {
      process: 'Process',
      reject: 'Reject',
      complete: 'Complete',
    },
    label: {
      title: 'Title',
      description: 'Description',
      project: 'Project',
    },
    select: {
      none: 'None',
    },
    error: {
      titleRequired: 'Title is required',
      submitFailed: 'Submission failed',
    },
    success: {
      submitted: 'Submitted successfully, admin will review soon.',
    },
    createFailed: 'Failed to create form',
    created: 'Form created successfully!',
    field: {
      title: 'Title',
      description: 'Description',
      tag: 'Custom Tag (Optional)',
    },
    exampleTitle: 'Example Title',
    placeholder: {
      title: 'Enter title...',
      description: {
        base: 'Enter description...',
        long: 'Enter detailed description...',
      },
      tag: 'e.g. urgent, frontend, etc.',
    },
    projectId: 'Project ID: {id}',
    cancel: 'Cancel',
    submitting: 'Submitting...',
    submit: 'Submit',
    viewDetails: 'View Details & Messages',
    viewMessages: 'Messages',
    messages: {
      title: 'Messages',
      empty: 'No messages yet. Start a conversation!',
      loading: 'Loading messages...',
      placeholder: 'Type your message...',
      send: 'Send',
      sending: 'Sending...',
      completed: 'This form is completed. No more messages can be added.',
    },
    history: {
      title: 'History',
      empty: 'No history found.',
      loading: 'Loading history...',
    },
    apply: {
      title: 'Apply',
    },
    page: {
      title: 'Form Page',
      description: 'Submit and manage your forms.',
    },
  },
  filter: {
    title: 'Filter Criteria',
    userId: 'User ID',
    resource: 'Resource',
    action: 'Action',
    limit: 'Rows',
    dateRange: 'Time Range',
    placeholder: {
      userId: 'Search by ID...',
      resource: 'e.g. project, user',
      action: 'e.g. create, update',
    },
  },
  log: {
    noDescription: 'No description recorded',
    view: 'View Changes',
    hide: 'Hide Details',
    before: 'Before',
    after: 'After',
  },
} as const;
