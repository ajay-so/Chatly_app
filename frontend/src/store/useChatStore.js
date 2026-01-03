import { create } from 'zustand';
import createAxiosInstance from '../lib/axios.js';


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
      set({ allContacts: response.data });
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await createAxiosInstance.get("/messages/chats");
      set({ chats: response.data });
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to load chat partners");
    } finally {
      set({ isUsersLoading: false });
    }
  },
}))