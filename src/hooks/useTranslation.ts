import { useLanguageCookie } from './useLanguageCookie';
import { es } from '@/locales/es';
import { en } from '@/locales/en';

export function useTranslation() {
  const { language } = useLanguageCookie();
  
  const translations = language === 'es' ? es : en;
  
  return { t: translations, language };
}
