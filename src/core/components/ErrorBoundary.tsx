import React, { ReactNode, ErrorInfo } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { getErrorMessage } from '@/core/errors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundaryUI: Internal component for rendering error UI with i18n support
 * Separated from class component to support useTranslation hook
 */
function ErrorBoundaryUI({
  hasError,
  error,
  errorInfo,
  onReset,
}: {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}) {
  const { t } = useTranslation();

  if (!hasError || !error) {
    return null;
  }

  const errorMessage = getErrorMessage(error);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center w-full h-screen bg-red-50"
    >
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('error.application_error')}</h2>
          <p className="text-gray-600 text-sm">{t('error.application_error_description')}</p>
        </div>

        <div className="mb-6 p-4 bg-red-50 rounded border border-red-200">
          <p className="text-red-700 font-mono text-sm break-words">{errorMessage}</p>
          {import.meta.env.DEV && errorInfo && (
            <details className="mt-4 text-xs text-red-600">
              <summary className="cursor-pointer font-semibold mb-2">
                {t('error.component_stack')}
              </summary>
              <pre className="overflow-auto max-h-40 bg-white p-2 border border-red-200 rounded">
                {errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>

        <button
          onClick={onReset}
          className="w-full px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded transition-colors"
        >
          {t('error.try_again')}
        </button>

        <button
          onClick={() => (window.location.href = '/')}
          className="w-full mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition-colors"
        >
          {t('error.go_home')}
        </button>
      </div>
    </div>
  );
}

/**
 * ErrorBoundary component provides error recovery for React component tree
 * Catches JavaScript errors anywhere in child component tree
 * Implements error-handling-guide best practices with proper error logging
 * Supports i18n for internationalization
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('React Error Boundary caught an error:', error, errorInfo);
    }

    // Update state to display error UI
    this.setState({
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    return (
      <>
        <ErrorBoundaryUI
          hasError={this.state.hasError}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
        {!this.state.hasError && this.props.children}
      </>
    );
  }
}

export default ErrorBoundary;
