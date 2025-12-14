/**
 * Internationalization Configuration
 * Configuración de Internacionalización
 */

export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
} as const;

export const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
} as const;

export const LANGUAGE_FLAGS = {
  en: '🇺🇸',
  es: '🇨🇴',
} as const;

export const LANGUAGE_COUNTRIES = {
  en: 'USA',
  es: 'Colombia',
} as const;

export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = Object.values(LANGUAGES);
export const SETTINGS_STORE_VERSION = 3; // Increment to force localStorage reset
