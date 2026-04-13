'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Eye, EyeOff, Terminal, User, Cpu } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

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
      const supabase = getSupabaseBrowserClient();

      // 1) Sign in with Supabase Auth to create the session (sb-* cookies)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError || !signInData.user) {
        throw new Error(signInError?.message || 'Authentication sequence failed');
      }

      // 2) Sync with the backend to get the profile (usuarios) and auth_token
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Identity synchronization failed');
      }

      // Persist the user in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName || data.user.name?.split(' ')[0] || '',
        lastName: data.user.lastName || data.user.name?.split(' ')[1] || '',
        role: data.user.role,
      }));

      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'A critical error occurred during authentication');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/20 mb-6 group hover:scale-105 transition-transform duration-500">
            <Terminal className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">
            PixelMarket <span className="text-indigo-500">Nexus</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">
            Secure Terminal Access
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
                <Shield className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Identity Identifier (Email)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500 text-slate-500">
                  <User size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 border border-white/5 bg-slate-800/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-white transition-all placeholder:text-slate-600"
                  placeholder="architect@pixelmarket.tech"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Access Keychain (Password)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500 text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-4 border border-white/5 bg-slate-800/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-white transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-500 focus:ring-indigo-500/50 border-white/10 bg-slate-800 rounded transition-all cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400 font-medium cursor-pointer">
                  Maintain session
                </label>
              </div>
              <Link href="/forgot-password">
                <span className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                  Recovery sequence?
                </span>
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                  <span>Synchronizing...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Execute Authentication <Terminal size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* New Register Link */}
          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <p className="text-sm text-slate-500 mb-3">
              Not yet registered in the Nexus?
            </p>
            <Link href="/register">
              <span className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                Initialize New Entity <Cpu size={14} />
              </span>
            </Link>
          </div>
        </div>

        {/* Demo Credentials Area */}
        <div className="mt-8 bg-indigo-500/5 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 text-center">
          <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">System Demo Protocols</p>
          <div className="grid grid-cols-1 gap-2 text-[11px] font-mono">
            <div className="flex justify-between px-2 py-1.5 bg-slate-900/50 rounded-lg border border-white/5">
              <span className="text-slate-500 uppercase">Lead Architect:</span>
              <span className="text-slate-300">admin@pixelmarket.tech / admin123</span>
            </div>
            <div className="flex justify-between px-2 py-1.5 bg-slate-900/50 rounded-lg border border-white/5">
              <span className="text-slate-500 uppercase">Core Manager:</span>
              <span className="text-slate-300">ops@pixelmarket.tech / ops123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
