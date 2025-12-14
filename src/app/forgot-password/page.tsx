'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process request');
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFE4B5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2">
            Reset Password
          </h1>
          <p className="text-[#2C1810]">
            No worries! We'll help you reset your password.
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-[#F4A460] text-center">
            <div className="mb-4 flex justify-center">
              <FiCheckCircle size={60} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#8B4513] mb-2">
              Check your email
            </h2>
            <p className="text-[#2C1810] mb-4">
              If an account exists with that email, you'll receive a password reset link shortly.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              The link will expire in 1 hour for security reasons.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-[#8B4513] text-white py-3 rounded-lg hover:bg-[#D2691E] transition-colors font-semibold"
              >
                Back to Login
              </button>
              <button
                onClick={() => setSuccess(false)}
                className="w-full bg-white text-[#8B4513] py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold border border-[#8B4513]"
              >
                Try another email
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-[#F4A460]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#8B4513] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent bg-white text-[#2C1810]"
                    placeholder="you@example.com"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll send you an email with instructions to reset your password.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B4513] text-white py-3 rounded-lg hover:bg-[#D2691E] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <Link 
                href="/login"
                className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#D2691E] transition-colors font-semibold"
              >
                <FiArrowLeft size={16} />
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
