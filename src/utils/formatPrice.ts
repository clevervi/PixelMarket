import type { Currency } from '@/types';

// Tasa de cambio aproximada (en producción, usar una API de tasas de cambio)
const USD_TO_COP = 4100;

export function formatPrice(priceInCOP: number, currency: Currency, language: 'es' | 'en'): string {
  let price = priceInCOP;
  let currencyCode = currency;

  // Convertir a USD si es necesario
  if (currency === 'USD') {
    price = priceInCOP / USD_TO_COP;
  }

  // Formatear según el idioma
  const locale = language === 'es' ? 'es-CO' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(price);
}

export function convertPrice(priceInCOP: number, currency: Currency): number {
  if (currency === 'USD') {
    return priceInCOP / USD_TO_COP;
  }
  return priceInCOP;
}
