import { authClient } from './client';

//상점 정보 조회
export const getStoreInfo = async () => {
  try {
    const res = await authClient.get(`/shop/api/merchant/store/me`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//상점 정보 수정:공지
export const patchStoreNotice = async (data) => {
  try {
    const res = await authClient.patch(`/shop/api/merchant/store/notice`, data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

//상점 정보 수정:영업시간
export const patchStoreHours = async (data) => {
  try {
    const res = await authClient.patch(`/shop/api/merchant/store/hours`, data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

//메뉴 조회
export const getMenuInfo = async () => {
  try {
    const res = await authClient.get(`/shop/api/merchant/store/menu`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//메뉴 상세 조회
export const getMenuDetail = async () => {
  try {
    const res = await authClient.get(`/shop/api/merchant/store/menu/${menuId}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};


//메뉴 등록
export const postMenuInfo = async (data, imgFile) => {
  try {
    const formData = new FormData();

    formData.append(
      //키 이름 확인 필요
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (imgFile) {
      formData.append('image', imgFile);
    }

    const res = await authClient.post(
      `/shop/api/merchant/store/menu`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

//메뉴 수정
export const patchMenuInfo = async (menuId, data, imgFile) => {
  try {
    // bool값 확인하기
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (imgFile) {
      formData.append('image', imgFile);
    }

    const res = await authClient.patch(
      `/shop/api/merchant/store/menu/${menuId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

//메뉴 삭제
export const deleteMenu = async (menuId) => {
  try {
    const res = await authClient.delete(
      `/shop/api/merchant/store/menu/${menuId}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

//일시 품절 설정
export const postSoldout = async (menuId) => {
  try {
    const res = await authClient.post(
      `/shop/api/merchant/store/menu/${menuId}/soldout`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

//카테고리 조회
export const getCategories = async () => {
  try {
    const res = await authClient.get(`/shop/api/merchant/store/category`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//카테고리 생성
export const postCategory = async (data) => {
  try {
    const res = await authClient.post(
      `/shop/api/merchant/store/category`,
      data
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//카테고리 삭제
export const deleteCategory = async (catId) => {
  try {
    const res = await authClient.delete(
      `/shop/api/merchant/store/category/${catId}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

//카테고리 순서 변경
export const patchCategoryOrder = async (data) => {
  try {
    const res = authClient.patch(
      `/shop/api/merchant/store/category/order`,
      data
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
