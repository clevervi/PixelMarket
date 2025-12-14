'use client';

/**
 * EXAMPLE: How to use i18n in different components
 * EJEMPLO: Cómo usar i18n en diferentes componentes
 */

import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import type { Product } from '@/types';

// ============================================================================
// EXAMPLE 1: Simple Button with Translations
// ============================================================================

export function ExampleButton() {
  const { t } = useTranslation();

  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      {t.common.addToCart}
    </button>
  );
}

// ============================================================================
// EXAMPLE 2: Checkout Form Component
// ============================================================================

export function ExampleCheckoutForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">{t.checkout.title}</h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t.checkout.firstName}
          </label>
          <input
            type="text"
            placeholder={t.checkout.firstName}
            className="w-full px-3 py-2 border rounded-md"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t.checkout.lastName}
          </label>
          <input
            type="text"
            placeholder={t.checkout.lastName}
            className="w-full px-3 py-2 border rounded-md"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t.checkout.email}
          </label>
          <input
            type="email"
            placeholder={t.checkout.email}
            className="w-full px-3 py-2 border rounded-md"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t.checkout.placeOrder}
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Language Context Component
// ============================================================================

export function ExampleLanguageContext() {
  const { t, language } = useTranslation();

  return (
    <div className="p-6 bg-white rounded-lg">
      <h3 className="text-xl font-bold mb-4">Current Language: {language}</h3>
      
      {language === 'es' ? (
        <div className="p-4 bg-blue-50 rounded border border-blue-200">
          <p className="font-medium">Estás viendo el contenido en español</p>
        </div>
      ) : (
        <div className="p-4 bg-green-50 rounded border border-green-200">
          <p className="font-medium">You are viewing content in English</p>
        </div>
      )}
    </div>
  );
}
