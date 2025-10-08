import { client } from './client';

export const getStoreInfo = async (storeId) => {
  try {
    const res = await client.get(`/api/merchant/store/${storeId}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const patchStoreInfo = async () => {
  try {
    const res = await client.patch(`/api/merchant/store/notice`, data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const patchStoreHours = async () => {
  try {
    const res = await client.patch(`/api/merchant/store/hours`, data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getMenuInfo = async () => {
  try {
    const res = await client.get(`/api/merchant/store/menu`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

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

    const res = await client.post(`/api/merchant/store/menu`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

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

    const res = await client.patch(
      `/api/merchant/store/menu/${menuId}`,
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

export const deleteMenu = async () => {
  try {
    const res = await client.delete(`/api/merchant/store/menu/${menuId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const postSoldout = async (menuId) => {
  try {
    const res = await client.post(`/api/merchant/store/menu/${menuId}/soldout`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getCategories = async () => {
  try {
    const res = await client.get(`/api/merchant/store/category`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const postCategory = async (data) => {
  try {
    const res = await client.post(`/api/merchant/store/category`, data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const deleteCategory = async (catId) => {
  try {
    const res = await client.delete(`/api/merchant/store/category/${catId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const patchCategoryOrder = async (data) => {
  try {
    const res = client.patch(`/api/merchant/store/category/order`, data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
