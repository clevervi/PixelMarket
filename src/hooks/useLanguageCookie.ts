'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_LANGUAGE } from '@/config/i18n';

type Language = 'en' | 'es';

export function useLanguageCookie() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE as Language);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Leer la cookie del idioma
    const cookies = document.cookie
      .split('; ')
      .reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);

    const savedLanguage = (cookies['language'] as Language) || DEFAULT_LANGUAGE;
    setLanguageState(savedLanguage as Language);
    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Guardar en cookie con expiración de 1 año
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `language=${lang}; expires=${date.toUTCString()}; path=/`;
  };

  return {
    language,
    setLanguage,
    isMounted,
  };
}
