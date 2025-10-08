import axios from 'axios';
import { client } from './client';

export const postLogin = async (data) => {
  try {
    const res = await client.post(`api/merchant/auth/login`, data);
    console.log(res.data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const postSignout = async () => {
  try {
    const res = await client.post(`api/merchant/auth/withdraw`);
    console.log(res.data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const postLogout = async () => {
  try {
    const res = await client.post('/api/merchant/auth/logout');
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getReissueToken = async () => {
  try {
    const tokenString = localStorage.getItem('token');
    const token = tokenString ? JSON.parse(tokenString) : null;

    if (!token?.refreshToken) {
      throw new Error('리프레시 토큰 없음');
    }
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/merchant/auth/reissue`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        withCredentials: true,
      }
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
