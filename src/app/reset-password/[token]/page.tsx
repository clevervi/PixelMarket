'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  // Validar token al cargar
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
        if (response.ok) {
          setIsValidToken(true);
        } else {
          setError('Reset link is invalid or has expired');
        }
      } catch (err) {
        setError('Failed to validate reset link');
      } finally {
        setValidating(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFE4B5]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mb-4"></div>
          <p className="text-[#2C1810] font-semibold">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFE4B5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2">
            Create New Password
          </h1>
          <p className="text-[#2C1810]">
            Enter your new password below
          </p>
        </div>

        {success ? (
          /* Success State */
          <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-[#F4A460] text-center">
            <div className="mb-4 flex justify-center">
              <FiCheckCircle size={60} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#8B4513] mb-2">
              Password Reset Successfully!
            </h2>
            <p className="text-[#2C1810] mb-6">
              Your password has been reset. Redirecting to login...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513] mx-auto"></div>
          </div>
        ) : !isValidToken ? (
          /* Invalid Token State */
          <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-red-300 text-center">
            <div className="mb-4 flex justify-center">
              <FiXCircle size={60} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-[#2C1810] mb-6">
              {error || 'This reset link is invalid or has expired. Please request a new one.'}
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full bg-[#8B4513] text-white py-3 rounded-lg hover:bg-[#D2691E] transition-colors font-semibold"
            >
              Request New Reset Link
            </Link>
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

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#8B4513] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent bg-white text-[#2C1810]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#8B4513] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent bg-white text-[#2C1810]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-900 mb-2">Password requirements:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li className={password.length >= 8 ? 'text-green-600' : ''}>
                    ✓ At least 8 characters
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || password.length < 8}
                className="w-full bg-[#8B4513] text-white py-3 rounded-lg hover:bg-[#D2691E] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Resetting...</span>
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <Link 
                href="/login"
                className="text-sm text-[#8B4513] hover:text-[#D2691E] transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
