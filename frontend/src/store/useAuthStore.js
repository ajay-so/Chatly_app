import { create } from 'zustand';
import createAxiosInstance from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await createAxiosInstance.get('/auth/check');
            set({ authUser: response.data.user });
            get().connectSocket();
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
            get().connectSocket();
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
            get().connectSocket();
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
            get().disconnectSocket();
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

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            withCredentials: true, // this ensures cookies are sent with the connection
        });

        socket.connect();

        set({ socket });

        // listen for online users event
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
