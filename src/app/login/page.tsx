'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabaseBrowserClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1) Login en Supabase Auth para crear la sesión (cookies sb-*)
      const { data: signInData, error: signInError } = await supabaseBrowserClient.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError || !signInData.user) {
        throw new Error(signInError?.message || 'Login failed');
      }

      // 2) Sincronizar con el backend para obtener el perfil (usuarios) y auth_token
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Guardar usuario en localStorage (para código cliente que ya lo usa)
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName || data.user.name?.split(' ')[0] || '',
        lastName: data.user.lastName || data.user.name?.split(' ')[1] || '',
        role: data.user.role,
      }));

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFE4B5] dark:bg-[#FFE4B5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand dark:text-[#F4A460] mb-2">
            Ancestral heartbeat
          </h1>
          <p className="text-brand dark:text-brand">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-white rounded-xl shadow-2xl p-8 border-2 border-[#F4A460]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#8B4513] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent bg-white text-[#2C1810]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#8B4513] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#8B4513] focus:ring-[#8B4513] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#2C1810]">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-[#8B4513] dark:text-[#F4A460] hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Link 
              href="/register"
              className="font-medium text-[#8B4513] dark:text-[#F4A460] hover:underline"
            >
              Create a new account →
            </Link>
          </div>

          {/* Vendor Application Link */}
          <div className="mt-4 text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-[#2C1810] mb-2">
              Want to sell on our platform?
            </p>
            <Link 
              href="/vendor/apply"
              className="text-sm font-semibold text-[#8B4513] dark:text-[#F4A460] hover:underline"
            >
              Apply to become a vendor →
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-[#FFF8DC] rounded-lg p-4 border border-[#F4A460]">
          <p className="text-xs font-semibold text-[#8B4513] mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-[#2C1810]">
            <p><strong>Admin:</strong> admin@latido.com / admin123</p>
            <p><strong>Store Manager:</strong> manager@latido.com / manager123</p>
            <p><strong>User:</strong> user@latido.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
