import { create } from 'zustand';
import { getStoreInfo } from '../api/store';

export const useUserStore = create((set) => ({
  storeId: null,
  //storeInfo: null,
  isLoading: false,
  error: null,

  // storeId 가져오기
  fetchStoreInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getStoreInfo();
      set({ 
        storeId: data.storeId,  // 또는 data.id
        //storeInfo: data,
        isLoading: false 
      });
    } catch (error) {
      set({ error, isLoading: false });
      console.error('상점 정보 조회 실패:', error);
    }
  },

  // 초기화 (로그아웃 시)
  reset: () => set({ 
    storeId: null, 
    //storeInfo: null, 
    isLoading: false, 
    error: null 
  }),
}));