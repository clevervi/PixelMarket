import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_LANGUAGE } from '@/config/i18n';
import type { Theme, Language, Currency } from '@/types';

interface SettingsStore {
  theme: Theme;
  language: Language;
  currency: Currency;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      language: DEFAULT_LANGUAGE as Language,
      currency: 'COP',

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      },

      setLanguage: (language) => {
        set({ language });
      },

      setCurrency: (currency) => {
        set({ currency });
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
