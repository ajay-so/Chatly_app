import { create } from 'zustand';
import createAxiosInstance from '../lib/axios.js';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await createAxiosInstance.get('/auth/check');
            set({ authUser: response.data.user });
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
            set({ authUser: response.data.user });
            toast.success('Sign up successful!');
        } catch (error) {
            set({ authUser: null });
            toast.error(error?.response?.data?.message || 'Sign up failed!');
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (userData) => {
        set({ isLoggingIn: true });
        try {
            const response = await createAxiosInstance.post('/auth/login', userData);
            set({ authUser: response.data.user });
            toast.success('Login successful!');
        } catch (error) {
            set({ authUser: null });
            toast.error(error?.response?.data?.message || 'Login failed!');
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await createAxiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || 'logout failed!');
        }
    },

    updateProfile: async (userData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await createAxiosInstance.put("/auth/uploadPic", userData);
            set({ authUser: res.data.user });

            toast.success("Profile updated successfully");
        } catch (err) {
            set({ authUser: null });
            toast.error(err?.response?.data?.message || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
}));

export default useAuthStore;