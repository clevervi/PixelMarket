'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguageCookie } from '@/hooks/useLanguageCookie';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, isMounted } = useLanguageCookie();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸', country: 'USA' },
    { code: 'es' as const, name: 'Español', flag: '🇨🇴', country: 'Colombia' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: 'en' | 'es') => {
    setLanguage(code);
    setIsOpen(false);
    // Recarga la página después de cambiar
    setTimeout(() => window.location.reload(), 0);
  };

  if (!isMounted) {
    return (
      <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#8B4513] bg-white/90 rounded-lg border border-[#8B4513]/30">
        <span>🌐</span>
      </button>
    );
  }

  return (
    <div className="relative z-[120]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/95 text-[#8B4513] border border-[#8B4513]/40 hover:bg-white transition-colors text-sm font-medium shadow-sm"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-2xl z-[130]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-100 transition-colors border-l-4 ${
                language === lang.code ? 'bg-[#FFF8DC] border-l-[#8B4513]' : 'border-l-transparent'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{lang.name}</div>
                <div className="text-xs text-gray-500">{lang.country}</div>
              </div>
              {language === lang.code && <span className="text-[#8B4513] text-lg">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}




