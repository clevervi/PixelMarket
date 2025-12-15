import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewsletterStore {
  subscribedEmail: string | null;
  isSubscribed: boolean;
  subscribe: (email: string) => Promise<boolean>;
  unsubscribe: () => void;
}

export const useNewsletterStore = create<NewsletterStore>()(
  persist(
    (set) => ({
      subscribedEmail: null,
      isSubscribed: false,
      
      subscribe: async (email) => {
        // Simulated API call
        try {
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return false;
          }
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ 
            subscribedEmail: email,
            isSubscribed: true 
          });
          return true;
        } catch {
          return false;
        }
      },
      
      unsubscribe: () => {
        set({ 
          subscribedEmail: null,
          isSubscribed: false 
        });
      },
    }),
    {
      name: 'newsletter-storage',
    }
  )
);
