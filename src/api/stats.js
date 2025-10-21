import { authClient } from './client';

//월별 일별 매출 조회
export const getMonthlySales = async (date, storeId) => {
  try {
    const res = await authClient.get(
      `api/merchant/stats/daily?month=${date}&storeId=${storeId}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//월별 요일별 매출 조회
export const getWeekDaySales = async (date, storeId) => {
  try {
    const res = await authClient.get(
      `api/merchant/stats/weekday?month=${date}&storeId=${storeId}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//일별 매출, 주문건수
export const getDailyOrderSales = async (date, storeId) => {
  try {
    const res = await authClient.get(
      `api/merchant/stats/daily/order?date=${date}&storeId=${storeId}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//일별 시간대별 매출
export const getHourlySales = async (date, storeId) => {
  try {
    const res = await authClient.get(
      `api/merchant/stats/hourly?date=${date}&storeId=${storeId}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//일별 메뉴 매출(리뷰순/매출순)
export const getMenuSales = async (date, sort, storeId) => {
  try {
    const res = await authClient.get(
      `api/merchant/stats/menu?date=${date}&sort=${sort}&storeId=${storeId}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
