'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TrackerInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const refParam = searchParams.get('ref') || searchParams.get('referral');
    if (refParam) {
      const cleanRef = refParam.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
      if (cleanRef) {
        try {
          localStorage.setItem('liah_ref', cleanRef);
          document.cookie = `liah_ref=${encodeURIComponent(cleanRef)}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax`;
        } catch {
          // Ignore private browsing storage restrictions
        }
      }
    }
  }, [searchParams]);

  return null;
}

export default function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}
