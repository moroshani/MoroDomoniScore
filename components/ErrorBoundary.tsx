// @ts-nocheck
import React from 'react';

type ErrorBoundaryProps = React.PropsWithChildren;

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('App error boundary caught:', error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="glass-card p-6 max-w-md">
            <h1 className="text-2xl font-bold mb-3">مشکلی رخ داد</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              لطفاً صفحه را دوباره بارگذاری کنید.
            </p>
            <button onClick={this.handleReload} className="btn-primary">
              بارگذاری مجدد
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
