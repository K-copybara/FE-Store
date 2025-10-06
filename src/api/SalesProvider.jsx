// contexts/SalesProvider.jsx
import React, { useState } from 'react';
import { SalesContext } from './SalesContext';

export const SalesProvider = ({ children }) => {
  // 더미 일별 매출 데이터
  const [dailySalesData, setDailySalesData] = useState([
    { date: "2025-09-01", sales: 152000 },
    { date: "2025-09-02", sales: 98000 },
    { date: "2025-09-03", sales: 175000 },
    { date: "2025-09-04", sales: 134000 },
    { date: "2025-09-05", sales: 189000 },
    { date: "2025-09-06", sales: 225000 },
    { date: "2025-09-07", sales: 167000 },
    { date: "2025-09-08", sales: 143000 },
    { date: "2025-09-09", sales: 156000 },
    { date: "2025-09-10", sales: 198000 },
    { date: "2025-09-11", sales: 176000 },
    { date: "2025-09-12", sales: 187000 },
    { date: "2025-09-13", sales: 234000 },
    { date: "2025-09-14", sales: 201000 },
    { date: "2025-09-15", sales: 165000 },
    { date: "2025-09-16", sales: 142000 },
    { date: "2025-09-17", sales: 159000 },
    { date: "2025-09-18", sales: 183000 },
    { date: "2025-09-19", sales: 177000 },
    { date: "2025-09-20", sales: 195000 },
    { date: "2025-09-21", sales: 251000 },
    { date: "2025-09-22", sales: 189000 },
    { date: "2025-09-23", sales: 167000 },
    { date: "2025-09-24", sales: 145000 },
    { date: "2025-09-25", sales: 178000 },
    { date: "2025-09-26", sales: 192000 },
    { date: "2025-09-27", sales: 186000 },
    { date: "2025-09-28", sales: 203000 },
    { date: "2025-09-29", sales: 219000 },
    { date: "2025-09-30", sales: 174000 }
  ]);

  // 더미 요일별 매출 데이터
  const [weeklySalesData, setWeeklySalesData] = useState([
    { weekday: "MONDAY", sales: 520000 },
    { weekday: "TUESDAY", sales: 430000 },
    { weekday: "WEDNESDAY", sales: 610000 },
    { weekday: "THURSDAY", sales: 480000 },
    { weekday: "FRIDAY", sales: 750000 },
    { weekday: "SATURDAY", sales: 880000 },
    { weekday: "SUNDAY", sales: 790000 }
  ]);

  const [selectedMonth, setSelectedMonth] = useState(new Date()); // 2025년 9월

  // 날짜별 매출 데이터 조회 함수
  const getSalesByDate = (dateString) => {
    const sale = dailySalesData.find(item => item.date === dateString);
    return sale ? sale.sales : 0;
  };

  // 요일별 총 매출 계산
  const getWeeklyTotals = () => {
    return weeklySalesData.map(item => item.sales); // [일, 월, 화, 수, 목, 금, 토] 순서
  };

  //오늘 날짜의 매출, 매출건수
  const [todaySalesData, setTodaySalesData] = useState([
    { date: "2025-09-29", sales: 19180400, orders: 42 },
  ]);

  //일별 시간대별 매출 조회
  const [timeSalesData, setTimeSalesData] = useState([
    { "hour": "09", "sales": 25000, "orderCount": 3 },
    { "hour": "10", "sales": 48000, "orderCount": 5 },
    { "hour": "11", "sales": 92000, "orderCount": 9 },
    { "hour": "12", "sales": 134000, "orderCount": 12 },
    { "hour": "13", "sales": 25000, "orderCount": 3 },
    { "hour": "10", "sales": 48000, "orderCount": 5 },
    { "hour": "11", "sales": 92000, "orderCount": 9 },
    { "hour": "12", "sales": 134000, "orderCount": 12 },
    { "hour": "09", "sales": 25000, "orderCount": 3 },
    { "hour": "10", "sales": 48000, "orderCount": 5 },
    { "hour": "11", "sales": 92000, "orderCount": 9 },
    { "hour": "12", "sales": 134000, "orderCount": 12 },
  ]);

  //일별 메뉴 매출(리뷰순/매출순)
  const [rankSalesData, setRankSalesData] = useState([
    { "menuId": 1, "name": "아메리카노", "sales": 120000, "reviewCount": 4.5, "orderCount": 20},
    { "menuId": 2, "name": "카페라떼", "sales": 95000, "reviewCount": 4, "orderCount": 15 },
    { "menuId": 3, "name": "바닐라라떼", "sales": 60000, "reviewCount": 5, "orderCount": 10 },
    { "menuId": 4, "name": "아메리카노", "sales": 120000, "reviewCount": 4.5, "orderCount": 20},
    { "menuId": 5, "name": "카페라떼", "sales": 95000, "reviewCount": 4, "orderCount": 15 },
    { "menuId": 6, "name": "바닐라라떼", "sales": 60000, "reviewCount": 5, "orderCount": 10 },
    { "menuId": 7, "name": "아메리카노", "sales": 120000, "reviewCount": 4.5, "orderCount": 20},
    { "menuId": 8, "name": "카페라떼", "sales": 95000, "reviewCount": 4, "orderCount": 15 },
    { "menuId": 9, "name": "바닐라라떼", "sales": 60000, "reviewCount": 5, "orderCount": 10 },
    { "menuId": 10, "name": "아메리카노", "sales": 120000, "reviewCount": 4.5, "orderCount": 20},
    { "menuId": 11, "name": "카페라떼", "sales": 95000, "reviewCount": 4, "orderCount": 15 },
    { "menuId": 12, "name": "바닐라라떼", "sales": 60000, "reviewCount": 5, "orderCount": 10 }
    ]);

  const value = {
    dailySalesData,
    weeklySalesData,
    selectedMonth,
    todaySalesData,
    timeSalesData,
    rankSalesData,
    setDailySalesData,
    setSelectedMonth,
    setWeeklySalesData,
    setTodaySalesData,
    setTimeSalesData,
    setRankSalesData,
    getSalesByDate,
    getWeeklyTotals
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};
