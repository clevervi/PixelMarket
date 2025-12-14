'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordLegacyRedirectPage() {
  const router = useRouter();

  // Esta ruta era parte de un flujo legacy /reset-password/[token].
  // El flujo actual usa Supabase recovery link y aterriza en /reset-password (sin token en la ruta).
  useEffect(() => {
    router.replace('/reset-password');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFE4B5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-[#F4A460] text-center">
        <h1 className="text-2xl font-bold text-[#8B4513] mb-2">Password Reset</h1>
        <p className="text-[#2C1810] mb-6">Redirecting to the new reset password flow...</p>
        <Link
          href="/reset-password"
          className="inline-block w-full bg-[#8B4513] text-white py-3 rounded-lg hover:bg-[#D2691E] transition-colors font-semibold"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
