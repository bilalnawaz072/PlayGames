'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeveloperPortalPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans p-6 text-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-lime-400">Developer Portal Consolidated</h1>
        <p className="text-sm text-slate-400">
          Game management is now centralized under Admin Control. Redirecting to Admin Studio...
        </p>
      </div>
    </div>
  );
}
