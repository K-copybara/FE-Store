import { authClient } from './client';

//월별 일별 매출 조회
export const getMonthlySales = async (date) => {
  try {
    const res = await authClient.get(
      `/order/api/merchant/stats/daily?month=${date}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//월별 요일별 매출 조회
export const getWeekDaySales = async (date) => {
  try {
    const res = await authClient.get(
      `/order/api/merchant/stats/weekday?month=${date}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//일별 매출 조회
// export const getDailySales = async (date) => {
//   try {
//     const res = await authClient.get(
//       `/order/api/merchant/stats/daily?date=${date}`
//     );
//     return res.data.data;
//   } catch (err) {
//     throw err;
//   }
// };

//일별 시간대별 매출
export const getHourlySales = async (date) => {
  try {
    const res = await authClient.get(
      `/order/api/merchant/stats/hourly?date=${date}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//일별 메뉴 매출(리뷰순/매출순)
export const getMenuSales = async (date, sort) => {
  try {
    const res = await authClient.get(
      `/order/api/merchant/stats/menu?date=${date}?sort=${sort}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
