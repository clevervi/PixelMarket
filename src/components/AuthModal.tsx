'use client';

import { useState } from 'react';
import { X, Mail, Lock, Terminal, Cpu, ArrowRight } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useUserStore();
  const { addNotification } = useNotificationStore();

  // Login form
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await login(loginData.email, loginData.password);

      if (result.success) {
        addNotification({
          type: 'success',
          title: 'ACCESS GRANTED',
          message: result.message || 'Identity synchronized with Nexus core.'
        });
        onClose();
        setLoginData({ email: '', password: '' });
      } else {
        addNotification({
          type: 'error',
          title: 'ACCESS DENIED',
          message: result.message || 'Invalid credentials provided.'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      addNotification({
        type: 'error',
        title: 'TERMINAL ERROR',
        message: 'A critical synchronization failure occurred.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (registerData.password !== registerData.confirmPassword) {
      addNotification({
        type: 'error',
        title: 'VALIDATION ERROR',
        message: 'Access keys do not match.'
      });
      return;
    }

    if (registerData.password.length < 6) {
      addNotification({
        type: 'error',
        title: 'SECURITY ALERT',
        message: 'Access key complexity too low. Min 6 characters.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone || undefined
      });

      if (result.success) {
        addNotification({
          type: 'success',
          title: 'ENTITY INITIALIZED',
          message: result.message || 'Nexus profile successfully created.'
        });
        setMode('login');
        setRegisterData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phone: ''
        });
      } else {
        addNotification({
          type: 'error',
          title: 'INITIALIZATION FAILED',
          message: result.message || 'Error creating entity profile.'
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      addNotification({
        type: 'error',
        title: 'SYSTEM ERROR',
        message: 'Unexpected failure during entity creation.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)] overflow-hidden">
          
          {/* Header */}
          <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Terminal size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                  Nexus <span className="text-white/70">Console</span>
                </h2>
                <div className="h-1 w-12 bg-white/30 rounded-full" />
              </div>
            </div>
            <p className="text-indigo-100 text-sm font-medium">
              {mode === 'login' 
                ? 'Authorized Access Required' 
                : 'Initialize New Operations Entity'
              }
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 bg-slate-900/50 backdrop-blur-xl">
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                    Entity Identifier (Email)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-white/5 bg-slate-800/40 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-white transition-all text-sm placeholder:text-slate-700"
                      placeholder="architect@pixelmarket.tech"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                    Nexus access key
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-white/5 bg-slate-800/40 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-white transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                  ) : (
                    <>
                      Synchronize <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                      Given Name
                    </label>
                    <input
                      type="text"
                      required
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-white/5 bg-slate-800/40 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-white transition-all text-sm placeholder:text-slate-700"
                      placeholder="Lead"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                      Family Name
                    </label>
                    <input
                      type="text"
                      required
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-white/5 bg-slate-800/40 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-white transition-all text-sm placeholder:text-slate-700"
                      placeholder="Architect"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                    Global Identifier
                  </label>
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-white/5 bg-slate-800/40 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-white transition-all text-sm placeholder:text-slate-700"
                    placeholder="email@nexus.tech"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                    Key Complexity
                  </label>
                  <input
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-white/5 bg-slate-800/40 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-white transition-all text-sm"
                    placeholder="••••••••"
                  />
                  <p className="text-[10px] text-slate-600 mt-2 ml-1">Min 6 characters required.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                    Verify Key
                  </label>
                  <input
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-white/5 bg-slate-800/40 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-white transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                  ) : (
                    <>
                      Initialize <Cpu size={14} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer switcher */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors"
              >
                {mode === 'login' 
                  ? 'Request Initialization Protocol' 
                  : 'Return to Terminal Access'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
