'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

const STYLE_QUIZ_KEY = 'style_quiz_seen';

export default function StyleQuizEntryModal() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // No mostrar en la página del quiz ni en dashboard/login
    if (pathname?.startsWith('/style-quiz')) return;
    if (pathname?.startsWith('/dashboard')) return;
    if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) return;

    const seen = window.localStorage.getItem(STYLE_QUIZ_KEY) === 'true';
    if (seen) return;

    // Pequeño delay para no ser invasivo
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const markSeen = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STYLE_QUIZ_KEY, 'true');
    }
  };

  const handleStartQuiz = () => {
    markSeen();
    setIsVisible(false);
    router.push('/style-quiz');
  };

  const handleSkip = () => {
    markSeen();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 relative">
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="mb-4 text-xs uppercase tracking-wide text-amber-600 font-semibold">
          {t.quiz.badge}
        </div>

        <h2 className="text-2xl font-bold text-[#8B4513] mb-3">
          {t.quiz.title}
        </h2>
        <p className="text-gray-700 mb-4">
          {t.quiz.description}
        </p>
        <p className="text-xs text-gray-500 mb-6">
          {t.quiz.noteOnce}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleStartQuiz}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#D2691E] to-[#8B4513] text-white font-semibold hover:opacity-95 transition-colors"
          >
            {t.quiz.startButton}
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            {t.quiz.skipButton}
          </button>
        </div>
      </div>
    </div>
  );
}
