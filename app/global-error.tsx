'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif', background: '#081F3E', color: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '480px', padding: '40px', textAlign: 'center', background: '#0D274D', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 style={{ fontSize: '1.6rem', color: '#F5A623', margin: '0 0 12px 0' }}>Liah Academy</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: '0 0 24px 0' }}>
            A temporary client exception occurred. Click to reload.
          </p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
              else reset();
            }}
            style={{ padding: '12px 24px', background: '#F5A623', color: '#081F3E', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
