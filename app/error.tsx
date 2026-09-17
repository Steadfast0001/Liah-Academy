'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Route Error caught:', error);
  }, [error]);

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '520px', width: '100%', background: '#FFFFFF', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 50px rgba(8, 31, 62, 0.08)', border: '1px solid rgba(8, 31, 62, 0.06)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFF8EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '28px' }}>
          ⚠️
        </div>
        <h2 style={{ color: '#081F3E', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 10px 0' }}>
          System Refresh Required
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          The application encountered a client runtime state update. Click below to refresh the page view.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
              else reset();
            }}
            style={{ padding: '12px 24px', background: '#F5A623', color: '#081F3E', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Reload Page
          </button>
          <Link
            href="/"
            style={{ padding: '12px 24px', background: '#081F3E', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
