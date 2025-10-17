import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

export const useUserStore = create((set) => ({
  storeId: null,

  loadStoreId: () => {
    try {
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      
      if (!token?.accessToken) {
        console.warn('토큰 없음');
        return;
      }
      
      const decoded = jwtDecode(token.accessToken);
      console.log('디코딩된 토큰:', decoded);
      
      set({ storeId: decoded.storeId });
    } catch (error) {
      console.error('토큰 디코딩 실패:', error);
    }
  },

  // 초기화 (로그아웃 시)
  reset: () => set({ storeId: null }),
}));