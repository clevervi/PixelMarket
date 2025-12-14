/**
 * Translation Helper Functions
 * Funciones auxiliares para traducciones
 */

import { es } from '@/locales/es';
import { en } from '@/locales/en';

type Language = 'en' | 'es';

export const getTranslations = (language: Language = 'es') => {
  return language === 'en' ? en : es;
};

export const translate = (key: string, language: Language = 'es'): string => {
  const translations = getTranslations(language);
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};
