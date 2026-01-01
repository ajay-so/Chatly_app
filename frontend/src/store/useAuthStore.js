import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    authUser: {
        id: null,
        name : "Ajay Kumar",
        email : "ajayroy9065@gmail.com",
    },
    isAuthenticated: false,
    isLoading : false,
    login: () => set({ isAuthenticated: true, isLoading: false }),
    logout: () => set({ isAuthenticated: false }),
  }));

export default useAuthStore;