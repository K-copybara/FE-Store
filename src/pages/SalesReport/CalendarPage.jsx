import {React, useState} from 'react';
import styled from 'styled-components';
import { bold36, reg24 } from '../../styles/font';
import Sidebar from '../../components/Sidebar';

import PrevMonthIcon from '../../assets/icons/Calendar/prevmonth-icon.svg?react';
import NextMonthIcon from '../../assets/icons/Calendar/nextmonth-icon.svg?react';

const CalendarPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date()); 

    const dailySalesData = [
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
    ];

  const weeklySalesArray = [
    { weekday: "MONDAY", sales: 520000 },
    { weekday: "TUESDAY", sales: 430000 },
    { weekday: "WEDNESDAY", sales: 610000 },
    { weekday: "THURSDAY", sales: 480000 },
    { weekday: "FRIDAY", sales: 750000 },
    { weekday: "SATURDAY", sales: 880000 },
    { weekday: "SUNDAY", sales: 790000 }
  ];

  const weeklySalesData = weeklySalesArray.reduce((acc, item) => {
  const dayMapping = {
    "SUNDAY": "일", "MONDAY": "월", "TUESDAY": "화", "WEDNESDAY": "수",
    "THURSDAY": "목", "FRIDAY": "금", "SATURDAY": "토"
  };
  acc[dayMapping[item.weekday]] = item.sales;
  return acc;
}, {});

  // 달력 데이터 생성
  const getKoreanToday = () => {
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;
    
    return `${year}-${month}-${day}`;
  };

  // 한국시간 기준으로 Date 객체를 YYYY-MM-DD 형식으로 변환
  const getKoreanDateString = (date) => {
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const parts = formatter.formatToParts(date);
    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;
    
    return `${year}-${month}-${day}`;
  };

  const todayString = getKoreanToday();

  const generateCalendarData = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOfWeek = new Date(firstDay);
    startOfWeek.setDate(firstDay.getDate() - firstDay.getDay());
    const lastWeekStart = new Date(lastDay);
    lastWeekStart.setDate(lastDay.getDate() - lastDay.getDay());

    const weeks = [];
    const currentWeek = new Date(startOfWeek);
    
    // 마지막 날짜가 포함된 주까지만 반복
    while (currentWeek <= lastWeekStart) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeek);
        
        // 한국시간 기준으로 날짜 문자열 생성
        const dateString = getKoreanDateString(date);
        const sales = dailySalesData.find(item => item.date === dateString)?.sales || 0;
        const isCurrentMonth = date.getMonth() === month;
        const isToday = dateString === todayString;
        
        week.push({
          date: new Date(date),
          dateString,
          sales,
          isCurrentMonth,
          isToday
        });
        
        currentWeek.setDate(currentWeek.getDate() + 1);
      }
      weeks.push(week);
    }
    
    return weeks;
  };

  // 주별 총 매출 계산 함수
  const getWeekTotal = (week) => {
    return week.reduce((total, day) => {
      return total + (day.isCurrentMonth ? day.sales : 0);
    }, 0);
  };

  const getWeekNumberInMonth = (date) => {
    // 해당 달의 첫 번째 날짜
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // 해당 날짜까지의 일수 계산
    const dayOfMonth = date.getDate();
    // 첫 번째 주의 시작 요일 (일요일=0)
    const firstDayOfWeek = firstDay.getDay();
    // 주차 계산 (첫 주는 항상 1주)
    return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
  };

  
  const weeks = generateCalendarData();
  const monthTotal = weeklySalesArray.reduce((sum, item) => sum + item.sales, 0);

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  
  return (
    <Layout>
      <Sidebar />
      <CalendarContainer>
        {/* 달력 헤더 */}
        <CalendarHeader>
          <MonthNavigation>
            <NavButton onClick={handlePrevMonth}>
              <PrevMonthIcon />
            </NavButton>
            <MonthTitle>
              {selectedMonth.getFullYear()}. {selectedMonth.getMonth() + 1}
            </MonthTitle>
            <NavButton onClick={handleNextMonth}>
              <NextMonthIcon />
            </NavButton>
          </MonthNavigation>
        </CalendarHeader>

        {/* 달력 테이블 */}
        <CalendarWrapper>
          <CalendarTable>
            {/* 요일 헤더 */}
            <thead>
              <HeaderRow>
                <DayHeader>일</DayHeader>
                <DayHeader>월</DayHeader>
                <DayHeader>화</DayHeader>
                <DayHeader>수</DayHeader>
                <DayHeader>목</DayHeader>
                <DayHeader>금</DayHeader>
                <DayHeader>토</DayHeader>
                <DayHeader>합계</DayHeader>
              </HeaderRow>
            </thead>

            <tbody>
              {/* 주별 데이터 */}
                 {weeks.map((week, weekIndex) => {
                const firstDateOfWeek = week.find(day => day.isCurrentMonth)?.date || week[0].date;
                const weekNumber = getWeekNumberInMonth(firstDateOfWeek);
                
                return (
                  <DataRow key={weekIndex}>
                    {week.map((day, dayIndex) => (
                      <DayCell 
                        key={dayIndex} 
                        isCurrentMonth={day.isCurrentMonth}
                        isToday={day.isToday}
                      >
                        <DayCellContent>
                          <DateNumber 
                            isCurrentMonth={day.isCurrentMonth}
                            isToday={day.isToday}
                          >
                            {day.date.getDate()}
                          </DateNumber>
                          {day.isCurrentMonth && (
                            <SalesAmount isToday={day.isToday}>
                              {day.sales.toLocaleString()}
                            </SalesAmount>
                          )}
                        </DayCellContent>
                      </DayCell>
                    ))}
                    <WeekTotalCell>
                      <WeekTotalContent>
                        <WeekNumber>
                          {weekNumber}주
                        </WeekNumber>
                        <WeekSalesAmount>
                          {getWeekTotal(week).toLocaleString()}
                        </WeekSalesAmount>
                      </WeekTotalContent>
                    </WeekTotalCell>
                  </DataRow>
                );
              })}
            </tbody>
          </CalendarTable>
        </CalendarWrapper>
        {/* 요일별 합계 섹션 (별도 분리) */}
        <WeeklyTotalSection>
          <WeeklyTotalGrid>
            {['일', '월', '화', '수', '목', '금', '토'].map((dayName) => (
              <WeeklyTotalBox>
                <DayLabel>{dayName}</DayLabel>
                <TotalAmount>{weeklySalesData[dayName]?.toLocaleString() || 0}</TotalAmount>
              </WeeklyTotalBox>
            ))}
            <MonthTotalBox>
              <DayLabel>총</DayLabel>
              <TotalAmount>{monthTotal.toLocaleString()}</TotalAmount>
            </MonthTotalBox>
          </WeeklyTotalGrid>
        </WeeklyTotalSection>
      </CalendarContainer>
    </Layout>
  );
};

export default CalendarPage;

// 스타일 컴포넌트들
const Layout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.25rem;
  height: 100%;
  width: 100%;
  background: var(--background);
`;

const CalendarContainer = styled.div`
  display: flex;
  padding: 2.9375rem 2.9375rem 4.9375rem 2.9375rem;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 0.75rem;
  border-radius: 1.25rem;
  background-color: var(--white);
  flex: 1;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
`;

const CalendarHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
`;

const MonthTitle = styled.h1`
  ${bold36}
  color: var(--black);
  width: 10rem;  
  text-align: center; 
`;

const CalendarWrapper = styled.div`
  width: 100%;
    /* 첫 번째 행의 첫 번째 셀 */
  &:first-child {
    border-top-left-radius: 0.625rem;
  }
  
  /* 첫 번째 행의 마지막 셀 */
  &:last-child {
    border-top-right-radius: 0.625rem;
  }
`;

const CalendarTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
`;

const HeaderRow = styled.tr`
  background: var(--third);
`;

const DayHeader = styled.th`
  ${reg24}
  color: var(--black);
  padding: 0.5rem 3.6875rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border: 1px solid var(--secondary);
  width: 12.5%;
`;

const DataRow = styled.tr`

`;

const DayCell = styled.td`
  border: 1px solid var(--third);
  padding: 0.9375rem 1rem;
  vertical-align: top;
  height: 13vh;
`;

const DayCellContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DateNumber = styled.div`
  ${reg24}
  color: ${props => {
    if (props.isToday) return 'var(--gray500)';
    if (props.isCurrentMonth) return 'var(--gray500)';
    return 'var(--gray300)';
  }};
`;

const SalesAmount = styled.div`
  ${reg24}
  color: var(--black);
  align-self: flex-end;
`;

const WeekTotalCell = styled.td`
  background: var(--white);
  border: 1px solid var(--third);
  padding: 0.9375rem 1rem;
  vertical-align: top;
  height: 13vh;
`;

const WeekTotalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WeekNumber = styled.div`
  ${reg24}
  color: var(--gray500);
`;

const WeekSalesAmount = styled.div`
  ${reg24}
  color: var(--black);
  align-self: flex-end;
`;

const WeeklyTotalSection = styled.div`
  width: 100%;
`;

const WeeklyTotalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr); /* 7일 + 월계 = 8개 */
  background: var(--white);
`;

const WeeklyTotalBox = styled.div`
  border: 1px solid var(--secondary);
  display: flex;
  flex-direction: column;

  gap: 2rem;
  /* 달력 셀과 동일한 높이 */
  min-height: 13vh; /* DayCell과 동일 */
  padding: 0.9375rem 1rem;
  vertical-align: top;
  box-sizing: border-box;
`;

const MonthTotalBox = styled.div`
  border: 1px solid var(--secondary);
  display: flex;
  flex-direction: column;

  gap: 2rem;
  /* 달력 셀과 동일한 높이 */
  min-height: 13vh; /* DayCell과 동일 */
  padding: 0.9375rem 1rem;
  vertical-align: top;
  box-sizing: border-box;
`;

const DayLabel = styled.div`
  ${reg24}
  color: var(--gray500);
`;

const TotalAmount = styled.div`
  ${reg24}
  color: var(--black);
  align-self: flex-end;
`;