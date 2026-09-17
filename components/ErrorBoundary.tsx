'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('UI Notice: Component error caught:', error?.message, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div style={{ padding: '24px', textAlign: 'center', margin: '20px auto', maxWidth: '500px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(8, 31, 62, 0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#081F3E', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px 0' }}>Display Notice</h3>
          <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0 0 16px 0' }}>
            A temporary browser rendering glitch occurred in this widget.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '8px 18px', background: '#F5A623', color: '#081F3E', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Refresh Widget
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
