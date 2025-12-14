"use client";

import { useState, useEffect } from 'react';
import { FiX, FiGift, FiTag } from 'react-icons/fi';
import { useNewsletterStore } from '@/store/newsletterStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useTranslation } from '@/hooks/useTranslation';

interface PromoPopupProps {
  delay?: number; // Tiempo de espera antes de mostrar (en ms)
}

export default function PromoPopup({ delay = 5000 }: PromoPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { subscribe, isSubscribed } = useNewsletterStore();
  const { addNotification } = useNotificationStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // No mostrar si ya está suscrito
    if (isSubscribed) return;

    const quizSeen = window.localStorage.getItem('style_quiz_seen') === 'true';
    if (!quizSeen) return; // Esperar a que el usuario haya visto/decidido sobre el quiz

    // Verificar si el popup ya se mostró alguna vez en este dispositivo
    const popupShown = window.localStorage.getItem('welcome_coupon_shown') === 'true';
    if (popupShown) return;

    // Mostrar después del delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      window.localStorage.setItem('welcome_coupon_shown', 'true');
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, isSubscribed]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      addNotification({
        type: 'error',
        title: t.common.error,
        message: t.promo.errors.missingEmail,
      });
      return;
    }

    setIsLoading(true);
    const success = await subscribe(email);
    setIsLoading(false);

    if (success) {
      // Registrar uso del cupón a nivel backend si el usuario está autenticado
      try {
        await fetch('/api/coupons/use', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: 'BIENVENIDA10' }),
        }).catch(() => undefined);
      } catch {
        // Silenciar errores de tracking de cupón; la experiencia del usuario no depende de esto
      }

      addNotification({
        type: 'success',
        title: t.promo.successTitle,
        message: t.promo.successMessage,
      });
      setIsVisible(false);
    } else {
      addNotification({
        type: 'error',
        title: t.common.error,
        message: t.promo.errors.invalidEmail,
      });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header con gradiente vertical */}
          <div className="bg-gradient-to-b from-[#8B4513] to-[#D2691E] text-white p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <FiGift className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {t.promo.title}
            </h2>
            <p className="text-lg text-white/90">
              {t.promo.subtitle}
            </p>
          </div>

          {/* Contenido */}
          <div className="p-8">
            <p className="text-center text-gray-600 mb-6">
              {t.promo.description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.promo.emailPlaceholder}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary transition-all"
                disabled={isLoading}
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#D2691E] to-[#8B4513] text-white font-bold rounded-xl transition-all shadow-lg hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t.common.loading : t.promo.button}
              </button>
            </form>

            {/* Cupón preview - white dashed box with tag icon */}
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-dashed border-yellow-400">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Coupon code</div>
                  <div className="text-lg font-bold text-gray-900 tracking-wider">
                    BIENVENIDO10
                  </div>
                </div>
                <FiTag className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              {t.promo.footerNote}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
