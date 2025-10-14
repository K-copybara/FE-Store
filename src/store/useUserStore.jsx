import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

const useUserStore = create(
    //상태를 sessionStorage, localStorage에 저장
    persist(
        //개발자 도구에서 상태변화 디버깅 가능하게 해줌
        devtools((set, get) => ({
            storeId: null,
            storeName: null,
            tableId: null,
            