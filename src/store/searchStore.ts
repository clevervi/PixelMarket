import { create } from 'zustand';

interface SearchStore {
  adminSearchTerm: string;
  managerSearchTerm: string;
  userSearchTerm: string;
  setAdminSearchTerm: (term: string) => void;
  setManagerSearchTerm: (term: string) => void;
  setUserSearchTerm: (term: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  adminSearchTerm: '',
  managerSearchTerm: '',
  userSearchTerm: '',
  setAdminSearchTerm: (term) => set({ adminSearchTerm: term }),
  setManagerSearchTerm: (term) => set({ managerSearchTerm: term }),
  setUserSearchTerm: (term) => set({ userSearchTerm: term }),
}));
