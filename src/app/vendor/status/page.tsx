'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function ApplicationStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'approved' | 'pending' | 'rejected' | 'not-found'>('loading');
  const [applicationEmail, setApplicationEmail] = useState('');

  useEffect(() => {
    // Obtener email de la URL o del localStorage
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get('email') || localStorage.getItem('vendor-apply-email');

    if (email) {
      setApplicationEmail(email);
      checkApplicationStatus(email);
    } else {
      setStatus('not-found');
    }
  }, []);

  const checkApplicationStatus = async (email: string) => {
    try {
      const response = await fetch(`/api/vendor/status?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.application?.status || 'not-found');
      } else {
        setStatus('not-found');
      }
    } catch (error) {
      console.error('Failed to check status:', error);
      setStatus('not-found');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFE4B5] py-12 px-4">
      <div className="max-w-2xl w-full">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin mb-4 flex justify-center">
              <div className="h-12 w-12 border-4 border-[#8B4513] border-t-transparent rounded-full" />
            </div>
            <p className="text-gray-600">Checking your application status...</p>
          </div>
        )}

        {status === 'approved' && (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <FiCheckCircle size={80} className="text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-[#8B4513] mb-4">¡Application Approved!</h1>
            <p className="text-lg text-gray-700 mb-2">Great news! Your vendor application has been approved.</p>
            <p className="text-gray-600 mb-8">
              You can now access the Store Manager dashboard to add and manage your products.
            </p>

            <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-[#F4A460] mb-6">
              <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Next Steps:</h2>
              <ol className="text-left space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-[#8B4513] text-white flex items-center justify-center font-bold">1</span>
                  <span className="text-gray-800">Log in with your email and password</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-[#8B4513] text-white flex items-center justify-center font-bold">2</span>
                  <span className="text-gray-800">Go to Store Manager from your profile menu</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-[#8B4513] text-white flex items-center justify-center font-bold">3</span>
                  <span className="text-gray-800">Start adding and managing your products</span>
                </li>
              </ol>
            </div>

            <button
              onClick={handleLogin}
              className="bg-[#8B4513] text-white px-8 py-3 rounded-lg hover:bg-[#D2691E] transition-colors font-semibold mb-3 w-full"
            >
              Go to Login
            </button>
            <button
              onClick={handleHome}
              className="text-[#8B4513] hover:underline font-medium"
            >
              Back to Home
            </button>
          </div>
        )}

        {status === 'pending' && (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <FiAlertCircle size={80} className="text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold text-[#8B4513] mb-4">Application Pending</h1>
            <p className="text-lg text-gray-700 mb-2">Your application is still being reviewed.</p>
            <p className="text-gray-600 mb-8">
              We'll notify you via email when your application is approved or if we need more information.
            </p>
            <button
              onClick={handleHome}
              className="bg-[#8B4513] text-white px-8 py-3 rounded-lg hover:bg-[#D2691E] transition-colors font-semibold"
            >
              Back to Home
            </button>
          </div>
        )}

        {status === 'rejected' && (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <FiAlertCircle size={80} className="text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-[#8B4513] mb-4">Application Rejected</h1>
            <p className="text-lg text-gray-700 mb-8">
              Unfortunately, your application was not approved at this time. You can contact us for more information or try again later.
            </p>
            <button
              onClick={handleHome}
              className="bg-[#8B4513] text-white px-8 py-3 rounded-lg hover:bg-[#D2691E] transition-colors font-semibold"
            >
              Back to Home
            </button>
          </div>
        )}

        {status === 'not-found' && (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <FiAlertCircle size={80} className="text-gray-400" />
            </div>
            <h1 className="text-4xl font-bold text-[#8B4513] mb-4">Application Not Found</h1>
            <p className="text-lg text-gray-700 mb-8">
              We couldn't find an application associated with this account. Please apply first.
            </p>
            <button
              onClick={() => router.push('/vendor/apply')}
              className="bg-[#8B4513] text-white px-8 py-3 rounded-lg hover:bg-[#D2691E] transition-colors font-semibold mb-3 w-full"
            >
              Apply Now
            </button>
            <button
              onClick={handleHome}
              className="text-[#8B4513] hover:underline font-medium"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
