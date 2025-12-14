import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[]; // IDs de productos
  setItems: (items: string[]) => void;
  addItem: (productId: string) => Promise<void> | void;
  removeItem: (productId: string) => Promise<void> | void;
  toggleItem: (productId: string) => Promise<void> | void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void> | void;
}

async function syncAdd(productId: string) {
  try {
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
  } catch (e) {
    console.error('Failed to sync add to wishlist', e);
  }
}

async function syncRemove(productId: string) {
  try {
    const url = new URL('/api/wishlist', window.location.origin);
    url.searchParams.set('productId', productId);
    await fetch(url.toString(), { method: 'DELETE' });
  } catch (e) {
    console.error('Failed to sync remove from wishlist', e);
  }
}

async function syncClear() {
  try {
    await fetch('/api/wishlist', { method: 'PUT' });
  } catch (e) {
    console.error('Failed to sync clear wishlist', e);
  }
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      setItems: (items) => set({ items }),

      addItem: async (productId) => {
        set((state) => {
          if (state.items.includes(productId)) return state;
          return { items: [...state.items, productId] };
        });

        if (typeof window !== 'undefined') {
          await syncAdd(productId);
        }
      },

      removeItem: async (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));

        if (typeof window !== 'undefined') {
          await syncRemove(productId);
        }
      },

      toggleItem: async (productId) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(productId)) {
          await removeItem(productId);
        } else {
          await addItem(productId);
        }
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },

      clearWishlist: async () => {
        set({ items: [] });
        if (typeof window !== 'undefined') {
          await syncClear();
        }
      },
    }),
    {
      name: 'wishlist-storage',
      skipHydration: true,
    }
  )
);
