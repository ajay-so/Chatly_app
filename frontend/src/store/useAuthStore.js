import { create } from 'zustand';
import createAxiosInstance from '../lib/axios.js';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: false,
    isSigningUp: false,
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await createAxiosInstance.get('/auth/check');
            set({ authUser: response.data });
        } catch (error) {
            set({
                authUser: null,
            });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

  signUp: async (userData) => {
        set({ isSigningUp: true });
        try {
            const response = await createAxiosInstance.post('/auth/signup', userData);
            set({ authUser: response.data });
            toast.success('Sign up successful!');
        } catch (error) {
            set({ authUser: null });
            toast.error(error?.response?.data?.message || 'Sign up failed!');
        } finally {
            set({  isSigningUp: false });
        }
    },
}));

export default useAuthStore;