/**
 * Pages translations (Home, Admin, Projects, Groups, etc.)
 */
export const pages = {
  page: {
    home: {
      title: 'Dashboard',
      description: 'Welcome to your dashboard',
      welcome: 'Welcome to AI Platform',
      subtitle: 'Manage your projects, groups, and pods here.',
    },
    dashboard: {
      welcomeBack: 'Welcome back, {name}',
      overview: 'Overview',
      projects: 'Projects',
      groups: 'Groups',
      activeJobs: 'Active Jobs',
      forms: 'Forms',
      recentProjects: 'Recent Projects',
      quickActions: 'Quick Actions',
      submitJob: 'Submit a Job',
      browseFiles: 'Browse Files',
      viewPods: 'View Pods',
      myForms: 'My Forms',
      noProjects: 'No projects yet',
    },
    admin: {
      dashboard: {
        totalProjects: 'Total Projects',
        totalGroups: 'Total Groups',
        pendingForms: 'Pending Forms',
        totalImages: 'Total Images',
        recentAuditLogs: 'Recent Audit Logs',
        quickNavigation: 'Quick Navigation',
        pendingImageRequests: 'Pending Image Requests',
      },
      title: 'Admin Dashboard',
      description: 'Admin center',
      manageProjects: 'Manage Projects',
      manageGroups: 'Manage Groups',
      forms: 'Forms Management',
      auditLogs: {
        title: 'Audit Logs',
        description: 'System security and change tracking',
        breadcrumb: 'Audit Logs',
        heading: 'Audit Trails',
        subHeading: 'Monitor and analyze administrative actions and resource changes.',
        count: 'Showing latest {{count}} records',
        emptyTitle: 'No logs found',
        emptyDesc: 'Adjust filters to see more results.',
      },
    },
    projects: {
      title: 'Projects',
      description: 'List of accessible projects.',
      jobs: {
        activeJobsTitle: 'Active Jobs',
        liveViewFromNamespace: 'Live view from namespace: {namespace}',
        forceRerender: 'Force Re-render',
      },
    },
    jobs: {
      title: 'Job Monitor',
      description: 'Real-time view based on project pods.',
      activeJobsTitle: 'Active Jobs',
      searchPlaceholder: 'Search jobs...',
      breadcrumb: 'Job Monitor',
    },
    manageGroups: {
      title: 'Manage Groups',
      description: 'Manage your organization groups.',
    },
    adminForm: {
      title: 'Forms Dashboard',
      description: 'Manage user-submitted forms.',
    },
    notFound: {
      title: 'Not Found',
      description: 'This is the 404 page for AI Platform.',
      message: "We couldn't find the page you were looking for!",
      back: 'Back to Home',
    },
  },
} as const;
