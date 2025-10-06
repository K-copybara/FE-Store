import React, { useState, useEffect } from 'react';
import { StoreInfoContext } from './StoreInfoContext';

export const StoreInfoProvider = ({ children }) => {
  // 더미 상점 정보 데이터
  const [storeInfo, setStoreInfo] = useState({
    storeId: 1,
    shopName: "딤딤섬",
    notice: "안녕하세요 딤딤섬입니다. 1인 2주문 해주세요.",
    businessHoursDetail: [
      {
        dayOfWeek: "MONDAY",
        openTime: "11:00",
        closeTime: "23:00",
        breakOpenTime: "15:00",
        breakCloseTime: "17:00"
      },
      {
        dayOfWeek: "TUESDAY", 
        openTime: "11:00",
        closeTime: "23:00",
        breakOpenTime: "15:00",
        breakCloseTime: "17:00"
      },
      {
        dayOfWeek: "WEDNESDAY",
        openTime: "11:00", 
        closeTime: "23:00",
        breakOpenTime: "15:00",
        breakCloseTime: "17:00"
      },
      {
        dayOfWeek: "THURSDAY",
        openTime: "11:00",
        closeTime: "23:00", 
        breakOpenTime: "15:00",
        breakCloseTime: "17:00"
      },
      {
        dayOfWeek: "FRIDAY",
        openTime: "11:00",
        closeTime: "23:00",
        breakOpenTime: "15:00", 
        breakCloseTime: "17:00"
      },
      {
        dayOfWeek: "SATURDAY",
        openTime: "10:00",
        closeTime: "24:00",
        breakOpenTime: null,
        breakCloseTime: null
      },
      {
        dayOfWeek: "SUNDAY",
        openTime: "10:00",
        closeTime: "22:00",
        breakOpenTime: null,
        breakCloseTime: null
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 요일 변환 맵
  const dayOfWeekMap = {
    'SUNDAY': '일',
    'MONDAY': '월', 
    'TUESDAY': '화',
    'WEDNESDAY': '수',
    'THURSDAY': '목',
    'FRIDAY': '금',
    'SATURDAY': '토'
  };

  const dayOfWeekReverseMap = {
    '일': 'SUNDAY',
    '월': 'MONDAY',
    '화': 'TUESDAY', 
    '수': 'WEDNESDAY',
    '목': 'THURSDAY',
    '금': 'FRIDAY',
    '토': 'SATURDAY'
  };

  // 요일 순서 배열
  const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  // 카테고리 조회
  const [categories, setCategories] = useState([
    {categoryId: 1, name: '신메뉴', order: 0, menuCount: 1},
    {categoryId: 2, name: '딤섬', order: 1, menuCount: 0},
    {categoryId: 3, name: '식사류', order: 2, menuCount: 0},
    {categoryId: 4, name: '음료', order: 3, menuCount: 0}
  ]);

  //  통합된 메뉴 데이터 (모든 정보를 하나의 배열로 관리)
  const [menus, setMenus] = useState([
    {
      menuId: 1,
      categoryId: 1,
      name: "아메리카노",
      price: 4000,
      description: "진한 에스프레소와 뜨거운 물로 만든 클래식 아메리카노",
      status: "ON_SALE",
      image: "src/assets/mandoo.svg",
      spicyLevel: 2,
      allergies: ["땅콩", "우유", "달걀", "오징어"],
      extraInfo: "황산고추가 강한 음식입니다. 조리 시간이 짧아요."
    }
  ]);

  // 상점 정보 불러오기 (더미 함수)
  const fetchStoreInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('상점 정보 조회 완료');
      // 이미 storeInfo에 더미 데이터가 있으므로 별도 설정 불필요
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 공지사항 업데이트
  const updateNotice = async (newNotice) => {
    try {
      setLoading(true);
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('공지 수정 API 호출:', { notice: newNotice });
      
      // 로컬 상태 업데이트
      setStoreInfo(prev => ({ ...prev, notice: newNotice }));
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('공지 업데이트 실패:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // 영업시간 업데이트 (EditSection 형식 → API 형식 변환)
  const updateBusinessHours = async (editSectionFormat) => {
    try {
      setLoading(true);
      
      // EditSection 형식을 API 형식으로 변환
      const apiFormat = editSectionFormat.map(item => ({
        dayOfWeek: dayOfWeekReverseMap[item.day],
        openTime: item.startTime,
        closeTime: item.endTime,
        breakOpenTime: item.breakStart || null,
        breakCloseTime: item.breakEnd || null
      }));

      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('영업시간 수정 API 호출:', { businessHours: apiFormat });
      
      // 로컬 상태 업데이트
      setStoreInfo(prev => ({ 
        ...prev, 
        businessHoursDetail: apiFormat 
      }));
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('영업시간 업데이트 실패:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // API 형식을 EditSection 형식으로 변환 (요일 순서대로 정렬)
  const getBusinessHoursForEdit = () => {
    if (!storeInfo?.businessHoursDetail) return null;

    // 요일 순서대로 정렬
    const sortedHours = DAY_ORDER.map(dayOfWeek => {
      const found = storeInfo.businessHoursDetail.find(item => item.dayOfWeek === dayOfWeek);
      return found || {
        dayOfWeek,
        openTime: "11:00",
        closeTime: "21:00", 
        breakOpenTime: "15:00",
        breakCloseTime: "17:00"
      };
    });

    return sortedHours.map(item => ({
      day: dayOfWeekMap[item.dayOfWeek],
      dayEng: item.dayOfWeek.toLowerCase(),
      startTime: item.openTime,
      endTime: item.closeTime,
      breakStart: item.breakOpenTime || '',
      breakEnd: item.breakCloseTime || ''
    }));
  };

  // 공지사항 가져오기 함수
  const getNotice = () => {
    return storeInfo?.notice || '';
  };

  // 가게명 가져오기 함수
  const getShopName = () => {
    return storeInfo?.shopName || '';
  };

  // 컴포넌트 마운트시 데이터 로드
  useEffect(() => {
    fetchStoreInfo();
  }, []);

  // 카테고리 조회 함수
  const fetchCategories = async () => {
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('카테고리 조회 API 호출');
      
      // 더미 응답 시뮬레이션
      const response = {
        success: true,
        message: "카테고리 조회 성공",
        data: categories
      };
      
      return response;
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
      throw error;
    }
  };

  // 카테고리 생성
  const createCategory = async (name) => {
    try {
      setLoading(true);
      
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('카테고리 생성 API 호출:', { name });
      
      // 새 카테고리 ID 생성
      const newCategoryId = Math.max(...categories.map(c => c.categoryId)) + 1;
      const newCategory = {
        categoryId: newCategoryId,
        name,
        order: categories.length,
        menuCount: 0
      };
      
      // 로컬 상태 업데이트
      setCategories(prev => [...prev, newCategory]);
      
      setLoading(false);
      return { 
        success: true, 
        message: "카테고리 생성 성공", 
        data: { categoryId: newCategoryId } 
      };
    } catch (error) {
      console.error('카테고리 생성 실패:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // 카테고리 삭제
  const deleteCategory = async (categoryId) => {
    try {
      const categoryToDelete = categories.find(cat => cat.categoryId === categoryId);
      
      if (!categoryToDelete) {
        throw new Error('카테고리를 찾을 수 없습니다.');
      }
      
      if (categoryToDelete.menuCount > 0) {
        throw new Error('메뉴가 있는 카테고리는 삭제할 수 없습니다.');
      }
      
      setLoading(true);
      
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 400));
      console.log('카테고리 삭제 API 호출:', { categoryId });
      
      // 로컬 상태 업데이트
      setCategories(prev => prev.filter(cat => cat.categoryId !== categoryId));
      
      setLoading(false);
      return { 
        success: true, 
        message: "카테고리 삭제 성공" 
      };
    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  //  카테고리 순서 변경
  const updateCategoryOrder = async (categoryOrders) => {
    try {
      setLoading(true);
      
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 700));
      console.log('카테고리 순서 변경 API 호출:', { categoryOrders });
      
      // 순서 업데이트된 카테고리 생성
      const updatedCategories = categories.map(category => {
        const orderUpdate = categoryOrders.find(order => order.categoryId === category.categoryId);
        return orderUpdate 
          ? { ...category, order: orderUpdate.order }
          : category;
      }).sort((a, b) => a.order - b.order); // order 순으로 정렬
      
      // 로컬 상태 업데이트
      setCategories(updatedCategories);
      
      setLoading(false);
      return { 
        success: true, 
        message: "카테고리 순서 변경 성공", 
        data: updatedCategories 
      };
    } catch (error) {
      console.error('카테고리 순서 변경 실패:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  //  헬퍼 함수들 (간소화됨)
  const getCategories = () => {
    return categories.sort((a, b) => a.order - b.order);
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.categoryId === categoryId);
  };

  const canDeleteCategory = (categoryId) => {
    const category = getCategoryById(categoryId);
    return category && category.menuCount === 0;
  };

  //  메뉴 헬퍼 함수들 (단순화됨)
  const getMenus = () => {
    return menus;
  };

  const getMenuById = (menuId) => {
    return menus.find(menu => menu.menuId === menuId);
  };

  //  getMenuDetailById와 getFullMenuById는 이제 동일함
  const getMenuDetailById = (menuId) => {
    return menus.find(menu => menu.menuId === menuId);
  };

  const getFullMenuById = (menuId) => {
    return menus.find(menu => menu.menuId === menuId);
  };

  const getMenusByCategory = (categoryId) => {
    return menus.filter(menu => menu.categoryId === categoryId);
  };

  //  목록용 데이터만 필요할 때 (성능 최적화용)
  const getMenusForList = () => {
    return menus.map(menu => ({
      menuId: menu.menuId,
      name: menu.name,
      price: menu.price,
      status: menu.status,
      image: menu.image
    }));
  };

  // 메뉴 조회
  const fetchMenus = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('메뉴 조회 API 호출');
      
      const response = {
        success: true,
        message: "메뉴 조회 성공",
        data: menus 
      };
      
      return response;
    } catch (error) {
      console.error('메뉴 조회 실패:', error);
      throw error;
    }
  };

  //  메뉴 등록 (간소화된 로직)
    const createMenu = async (menuData) => {
    try {
        setLoading(true);

        // 실제 구현 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('메뉴 등록 API 호출 (JSON):', menuData);
        
        const newMenuId = menus.length === 0 ? 1 : Math.max(...menus.map(m => m.menuId)) + 1;
        
        //  통합된 메뉴 객체 생성 (이미지는 기본값)
        const newMenu = {
        menuId: newMenuId,
        categoryId: menuData.categoryId,
        name: menuData.name,
        price: menuData.price,
        description: menuData.description,
        status: "ON_SALE",
        image: "src/assets/mandoo.svg", //  기본 이미지 (나중에 업데이트됨)
        spicyLevel: menuData.spicyLevel || 0,
        allergies: menuData.allergies || [],
        extraInfo: menuData.extraInfo || ""
        };
        
        //  상태 업데이트
        setMenus(prev => [...prev, newMenu]);
        
        //  카테고리 메뉴 개수 증가
        setCategories(prev => prev.map(cat => 
        cat.categoryId === menuData.categoryId 
            ? { ...cat, menuCount: cat.menuCount + 1 }
            : cat
        ));
        
        setLoading(false);
        return { 
        success: true, 
        message: "메뉴 등록 성공",
        data: { menuId: newMenuId }
        };
    } catch (error) {
        console.error('메뉴 등록 실패:', error);
        setLoading(false);
        return { success: false, error: error.message };
    }
};
//  이미지 업로드 전용 함수
    const uploadMenuImage = async (menuId, imageFile) => {
    try {
        setLoading(true);

        //  FormData로 이미지만 전송하는 API 시뮬레이션
        const formData = new FormData();
        formData.append('menuImage', imageFile);
        formData.append('menuId', menuId);

        // 실제 API 호출 시뮬레이션
        console.log('이미지 업로드 API 호출 (multipart/form-data):', {
            menuId,
            fileName: imageFile.name,
            fileSize: imageFile.size
        });

        //  이미지 URL 생성 (실제로는 서버에서 반환받은 URL 사용)
        const imageUrl = URL.createObjectURL(imageFile);
        
        //  해당 메뉴의 이미지 필드 업데이트
        setMenus(prev => prev.map(menu =>
        menu.menuId === menuId
            ? { ...menu, image: imageUrl }
            : menu
        ));

        setLoading(false);
        return {
        success: true,
        message: "이미지 업로드 성공",
        data: { imagePath: imageUrl }
        };

    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        setLoading(false);
        return { success: false, error: error.message };
    }
    };

  //  메뉴 삭제
  const deleteMenu = async (menuId) => {
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 400));
      console.log('메뉴 삭제 API 호출:', { menuId });
      
      const menuToDelete = menus.find(menu => menu.menuId === menuId);
      
      //  메뉴 제거
      setMenus(prev => prev.filter(menu => menu.menuId !== menuId));
      
      //  카테고리 메뉴 개수 감소
      if (menuToDelete) {
        setCategories(prev => prev.map(cat => 
          cat.categoryId === menuToDelete.categoryId 
            ? { ...cat, menuCount: Math.max(0, cat.menuCount - 1) }
            : cat
        ));
      }
      
      setLoading(false);
      return { 
        success: true, 
        message: "메뉴 삭제 성공"
      };
    } catch (error) {
      console.error('메뉴 삭제 실패:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  //  메뉴 수정
  const updateMenu = async (menuId, menuData) => {
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('메뉴 수정 API 호출:', { menuId, ...menuData });
      
      const originalMenu = menus.find(menu => menu.menuId === menuId);
      
      //  메뉴 정보 업데이트
      setMenus(prev => prev.map(menu =>
        menu.menuId === menuId
          ? { 
              ...menu,
              categoryId: menuData.categoryId,
              name: menuData.name,
              price: menuData.price,
              description: menuData.description,
              image: menuData.image || menu.image,
              status: menuData.status || menu.status,
              spicyLevel: menuData.spicyLevel || 0,
              allergies: menuData.allergies || [],
              extraInfo: menuData.extraInfo || ""
            }
          : menu
      ));
      
      //  카테고리가 변경된 경우 메뉴 개수 업데이트
      if (originalMenu && originalMenu.categoryId !== menuData.categoryId) {
        setCategories(prev => prev.map(cat => {
          if (cat.categoryId === originalMenu.categoryId) {
            return { ...cat, menuCount: Math.max(0, cat.menuCount - 1) };
          } else if (cat.categoryId === menuData.categoryId) {
            return { ...cat, menuCount: cat.menuCount + 1 };
          }
          return cat;
        }));
      }
      
      setLoading(false);
      return { 
        success: true, 
        message: "메뉴 수정 성공"
      };
    } catch (error) {
      console.error('메뉴 수정 실패:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const value = {
    // 상태 데이터
    storeInfo,
    loading,
    error,
    
    // 카테고리
    categories,
    setCategories,
    fetchCategories,
    createCategory,
    deleteCategory,
    updateCategoryOrder,
    getCategories,
    getCategoryById,
    canDeleteCategory,
    
    //  메뉴 (간소화됨)
    menus,
    getMenus,
    getMenuById,
    getMenuDetailById,  // 이제 getMenuById와 동일
    getFullMenuById,    // 이제 getMenuById와 동일
    getMenusByCategory,
    getMenusForList,    // 새로 추가: 목록용 최적화 함수
    setMenus,
    fetchMenus,
    createMenu,        //  JSON 전용
    uploadMenuImage,   //  이미지 전용
    deleteMenu,
    updateMenu,

    // 상태 업데이트 함수
    setStoreInfo,
    setLoading,
    setError,
    
    // API 호출 함수
    fetchStoreInfo,
    updateNotice,
    updateBusinessHours,
    
    // 헬퍼 함수
    getBusinessHoursForEdit,
    getNotice,
    getShopName,
    
    // 변환 맵 (필요시 사용)
    dayOfWeekMap,
    dayOfWeekReverseMap
  };

  return (
    <StoreInfoContext.Provider value={value}>
      {children}
    </StoreInfoContext.Provider>
  );
};
