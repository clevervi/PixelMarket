"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('The password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error creating account');

      setSuccess('Account created. Redirecting to login...');
      setTimeout(() => router.push('/login'), 900);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFE4B5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand dark:text-[#F4A460] mb-2">Ancestral heartbeat</h1>
          <p className="text-brand dark:text-brand">Create your account</p>
        </div>

        <div className="bg-white dark:bg-white rounded-xl shadow-2xl p-8 border-2 border-[#F4A460]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-2">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="firstName" required value={form.firstName} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-2">Last Name</label>
                <input name="lastName" required value={form.lastName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">Phone (Optional)</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="password" type="password" required value={form.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-[#2C1810]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#8B4513] font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
