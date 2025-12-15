import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Address, PaymentMethod, Order } from '@/types';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface UserStore {
  user: User | null;
  users: User[]; // List of registered users
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  removeAddress: (addressId: string) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  updatePaymentMethod: (methodId: string, method: Partial<PaymentMethod>) => void;
  removePaymentMethod: (methodId: string) => void;
  addOrder: (order: Order) => void;
}


export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,

      register: async (data: RegisterData) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const { users } = get();
        
        // Check whether the email already exists
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
          return { success: false, message: 'Este correo ya está registrado' };
        }

        // Create a new user
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          addresses: [],
          paymentMethods: [],
          wishlist: [],
          orders: [],
          createdAt: new Date(),
        };

        // Save user in the list and log in automatically
        set({ 
          users: [...users, newUser],
          user: newUser, 
          isAuthenticated: true 
        });

        return { success: true, message: 'Cuenta creada exitosamente' };
      },

      login: async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const { users } = get();
        
        // Find user by email (in production validate password with a hash)
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!foundUser) {
          return { success: false, message: 'Usuario no encontrado' };
        }

        // In production, validate the password
        // For now, any password is accepted for testing
        if (password.length < 6) {
          return { success: false, message: 'Contraseña inválida' };
        }

        set({ user: foundUser, isAuthenticated: true });
        return { success: true, message: 'Inicio de sesión exitoso' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      addAddress: (address) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: [...(state.user.addresses || []), address],
            },
          };
        });
      },

      updateAddress: (addressId, address) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: state.user.addresses?.map((addr) =>
                addr.id === addressId ? { ...addr, ...address } : addr
              ) || [],
            },
          };
        });
      },

      removeAddress: (addressId) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: state.user.addresses?.filter((addr) => addr.id !== addressId) || [],
            },
          };
        });
      },

      addPaymentMethod: (method) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              paymentMethods: [...(state.user.paymentMethods || []), method],
            },
          };
        });
      },

      updatePaymentMethod: (methodId, method) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              paymentMethods: state.user.paymentMethods?.map((m) =>
                m.id === methodId ? { ...m, ...method } : m
              ) || [],
            },
          };
        });
      },

      removePaymentMethod: (methodId) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              paymentMethods: state.user.paymentMethods?.filter(
                (pm) => pm.id !== methodId
              ) || [],
            },
          };
        });
      },

      addOrder: (order) => {
        set((state) => {
          if (!state.user) return state;
          return {
            ...state,
            user: {
              ...state.user,
              orders: [order, ...(state.user.orders || [])],
            },
          };
        });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
