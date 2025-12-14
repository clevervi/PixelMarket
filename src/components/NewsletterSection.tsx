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
    
    if (!email.trim()) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Please enter your email address'
      });
      return;
    }

    setIsLoading(true);
    const success = await subscribe(email);
    setIsLoading(false);

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
  };

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-r from-[#8B4513] to-[#D2691E] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <FiCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              You are already subscribed!
            </h2>
            <p className="text-xl text-white/90">
              You will receive our latest news and exclusive offers
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-[#8B4513] to-[#D2691E] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <FiMail className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          
          <p className="text-xl text-white/90 mb-8">
            Receive exclusive offers, new collections, and news about Colombian crafts
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-6 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          <p className="text-sm text-white/70 mt-4">
            No spam, only quality content. You can unsubscribe anytime.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">10%</div>
              <div className="text-white/90">Discount on your first purchase</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">✨</div>
              <div className="text-white/90">Early access to new collections</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">🎁</div>
              <div className="text-white/90">Exclusive offers for subscribers only</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
