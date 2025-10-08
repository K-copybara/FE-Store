import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem('token'),
}));
