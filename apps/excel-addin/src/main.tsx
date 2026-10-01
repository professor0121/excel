import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.js';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Task pane uncaught render error:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#f85149', background: '#0d1117', height: '100vh', fontFamily: 'sans-serif' }}>
          <h3 style={{ marginBottom: '8px', color: '#f85149' }}>Something went wrong</h3>
          <p style={{ fontSize: '12px', color: '#8b949e', marginBottom: '12px' }}>
            {this.state.error?.message || 'An unexpected error occurred in the task pane.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: '#1f6feb',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Reload Task Pane
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
