import { client } from './client';

export const getMonthlySales = async (date) => {
  try {
    const res = await client.get(`/api/merchant/stats/daily?month=${date}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getWeekDaySales = async (date) => {
  try {
    const res = await client.get(`/api/merchant/stats/weekday?month=${date}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getDailySales = async (date) => {
  try {
    const res = await client.get(`/api/merchant/stats/daily?date=${date}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getHourlySales = async (date) => {
  try {
    const res = await client.get(`/api/merchant/stats/hourly?date=${date}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getMenuSales = async (date, sort) => {
  try {
    const res = await client.get(
      `/api/merchant/stats/menu?date=${date}?sort=${sort}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
