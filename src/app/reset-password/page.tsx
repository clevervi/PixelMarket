import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFE4B5]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mb-4"></div>
            <p className="text-[#2C1810] font-semibold">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
