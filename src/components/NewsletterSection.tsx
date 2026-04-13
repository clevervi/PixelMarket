"use client";

import { useState } from 'react';
import { FiMail, FiCheck } from 'react-icons/fi';
import { useNewsletterStore } from '@/store/newsletterStore';
import { useNotificationStore } from '@/store/notificationStore';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { subscribe, isSubscribed } = useNewsletterStore();
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;
    
    if (!email.trim()) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Please enter your email address'
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await subscribe(email);

      if (success) {
        addNotification({
          type: 'success',
          title: '¡Subscription successful!',
          message: 'You have successfully subscribed to our newsletter'
        });
        setEmail('');
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Invalid email address'
        });
      }
    } catch (error) {
      console.error('Newsletter subscribe error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to subscribe. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 backdrop-blur-md border border-accent/30 rounded-full mb-6">
              <FiCheck className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Access Granted!
            </h2>
            <p className="text-xl text-slate-400">
              You are now part of our exclusive developer inner circle.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 py-20 relative overflow-hidden border-t border-white/5">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-2xl mb-6 transform rotate-3">
            <FiMail className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Elevate Your Stack
          </h2>
          
          <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Get priority access to premium software drops, exclusive UI kits, and limited-run developer hardware.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-16">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engineer@pixelmarket.tech"
              className="flex-1 px-8 py-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-secondary transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-95"
            >
              {isLoading ? 'System Processing...' : 'Join The Nexus'}
            </button>
          </form>

          {/* Developer Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all hover:bg-white/10">
              <div className="text-3xl font-black text-accent mb-2">15%</div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-widest">Initial Credit</div>
              <p className="text-xs text-slate-500 mt-2">Discount for your first asset license acquisition.</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all hover:bg-white/10">
              <div className="text-3xl font-black text-primary mb-2">RC</div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-widest">Early Access</div>
              <p className="text-xs text-slate-500 mt-2">Download release candidates 48h before public launch.</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all hover:bg-white/10">
              <div className="text-3xl font-black text-tech-purple mb-2">API</div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-widest">Private Docs</div>
              <p className="text-xs text-slate-500 mt-2">Exclusive access to extended documentation & source.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
