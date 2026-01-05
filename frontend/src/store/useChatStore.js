import { create } from 'zustand';
import createAxiosInstance from '../lib/axios.js';
import { TruckElectric } from 'lucide-react';


export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await createAxiosInstance.get("/messages/contacts");
      set({ allContacts: response.data.data });
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to load contacts");
      set({ allContacts: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await createAxiosInstance.get("/messages/chats");
      set({ chats: response.data.data });
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to load chat partners");
      set({ chats: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await createAxiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data.data });
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to load messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}))