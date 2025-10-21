import axios from 'axios';
import { getReissueToken } from './auth';

export const client = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const authClient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

authClient.interceptors.request.use(
  (config) => {
    const tokenString = localStorage.getItem('token');
    const token = JSON.parse(tokenString);
    if (token?.accessToken) {
      config.headers['Authorization'] = `Bearer ${token.accessToken}`;
    } else {
      console.log('토큰 없음');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

authClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return authClient(originalRequest); //client -> authClient로 바꿨음
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const res = await getReissueToken();
        const newAccessToken = res.accessToken; //payload.access_token->accessToken으로 바꿨음
        const tokenString = localStorage.getItem('token');
        const existingToken = tokenString ? JSON.parse(tokenString) : {};
        const updatedToken = {
          ...existingToken,
          accessToken: newAccessToken,
        };
        localStorage.setItem('token', JSON.stringify(updatedToken));

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authClient(originalRequest); //authClient로 바꿨음
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('token');
        window.location.href = '/login'; //추가했음
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
