// Shared Components Package
console.log('components-shared package loaded');

// Route guards
export { default as PrivateRoute } from './PrivateRoute';
export { default as PublicRoute } from './PublicRoute';

// Theme
export { ThemeToggleButton } from './ThemeToggleButton';

// Common components
export { default as SearchInput } from './SearchInput';
export { default as Pagination } from './Pagination';
export { default as PageMeta } from './PageMeta';

// Auth forms
export * from './auth/SignInForm';
export * from './auth/SignUpForm';
export * from './auth/ForgotPasswordForm';
