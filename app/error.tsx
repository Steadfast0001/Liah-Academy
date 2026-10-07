'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log error to console for monitoring
    console.error('Liah Academy Global Error Caught:', error);
  }, [error]);

  const handleClearSessionAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        // Clear potential corrupted tokens/drafts that could cause state crashes
        sessionStorage.clear();
        localStorage.removeItem('liah_admin_token');
        localStorage.removeItem('liah_agent_code');
        localStorage.removeItem('liah_agent_momo');
        window.location.reload();
      }
    } catch {
      if (typeof window !== 'undefined') window.location.reload();
    }
  };

  return (
    <main style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: '#F8FAFC'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: '#FFFFFF',
        padding: '36px 32px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(8, 31, 62, 0.08)',
        border: '1px solid rgba(8, 31, 62, 0.06)'
      }}>
        {/* Animated Status Icon */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: '#FFF8EB',
          border: '2px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          fontSize: '30px'
        }}>
          ⚠️
        </div>

        <h2 style={{ color: '#081F3E', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 10px 0' }}>
          Application State Restored
        </h2>

        <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          A client component encountered an unexpected runtime exception. You can quickly retry, refresh the session, or return to safety below.
        </p>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '12px 22px',
              background: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ↻ Try Again
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
              else reset();
            }}
            style={{
              padding: '12px 22px',
              background: '#F5A623',
              color: '#081F3E',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Reload Page
          </button>

          <button
            type="button"
            onClick={handleClearSessionAndReload}
            style={{
              padding: '12px 20px',
              background: '#F1F5F9',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Clear Session &amp; Reset
          </button>

          <Link
            href="/"
            style={{
              padding: '12px 22px',
              background: '#081F3E',
              color: '#FFFFFF',
              borderRadius: '10px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            Return Home
          </Link>
        </div>

        {/* Collapsible Error Diagnostic Details */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {showDetails ? 'Hide Diagnostic Details' : 'Show Diagnostic Details (Technical)'}
          </button>

          {showDetails && (
            <div style={{
              marginTop: '12px',
              textAlign: 'left',
              background: '#0F172A',
              color: '#94A3B8',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontFamily: 'monospace',
              maxHeight: '160px',
              overflowY: 'auto'
            }}>
              <div style={{ color: '#EF4444', fontWeight: 700, marginBottom: '4px' }}>
                {error?.name || 'Error'}: {error?.message || 'Unknown runtime exception'}
              </div>
              {error?.digest && (
                <div style={{ color: '#64748B', fontSize: '0.72rem' }}>
                  Digest ID: {error.digest}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
