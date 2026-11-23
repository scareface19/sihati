'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function PatientSingleRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const targetId = user?.id || 1;
    router.replace(`/patients/${targetId}`);
  }, [router, user]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="animate-pulse flex items-center gap-3 text-emerald-700 font-bold text-sm">
        <span className="w-3 h-3 bg-emerald-600 rounded-full animate-ping"></span>
        <span>جارٍ فتح الملف الطبي للمريض...</span>
      </div>
    </div>
  );
}
