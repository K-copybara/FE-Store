import styled from 'styled-components';
import { useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { useLocation } from 'react-router-dom';
import { body_large, bold36, bold24, bold18, reg24} from '../../styles/font';

import MenuRatingIcon from '../../assets/icons/DailyStats/menurating-icon.svg?react';
import SortIcon from '../../assets/icons/DailyStats/sortarrow-icon.svg?react';

const DailyStatsPage = () => {

  const location = useLocation();

  // 오늘 날짜 구하기. 매출조회/일별매출통계 바로 클릭 시 실행
  const getTodayString = () => {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const parts = formatter.formatToParts(today);
    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;
    
    return `${year}-${month}-${day}`;
  };
  const selectedDate = location.state?.date || getTodayString(); //달력에서 받아온 날짜 || 오늘 날짜
  
  const todaySalesData = [
    { date: selectedDate, sales: 19180400, orders: 42 },
  ];

  const timeSalesData = [
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
  ];  

  const rankSalesData = [
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
    ];

  const [sortType, setSortType] = useState('sales');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const SORT_OPTIONS = [
    { value: 'sales', label: '매출순' },
    { value: 'review', label: '리뷰순' },
  ];
  const selectedSortLabel = SORT_OPTIONS.find(
    (option) => option.value === sortType
  )?.label;

  const sortedMenuData = [...rankSalesData].sort((a, b) => {
    if (sortType === 'sales') {
      return b.sales - a.sales; // 매출순 (높은 순)
    } else {
      return b.reviewCount - a.reviewCount; // 리뷰순 (높은 순)
    }
  });

  return (
    <>
      <MainContent>
        <Header>
          <Title>일별 매출 통계</Title>
          <TodayDate>{todaySalesData[0]?.date}</TodayDate>
        </Header>

        <ContentRow>
          <LeftColumn>
            <StatsRow>
              <StatBlock>
                <StatLabel>총 매출</StatLabel>
                <StatValue>
                  {todaySalesData[0]?.sales?.toLocaleString() || 0} 원
                </StatValue>
              </StatBlock>
              <StatBlock>
                <StatLabel>주문 건수</StatLabel>
                <StatValue>{todaySalesData[0]?.orders || 0} 건</StatValue>
              </StatBlock>
            </StatsRow>

            <MenuSection>
              <MenuHeader>
                <SectionTitle>메뉴별 통계</SectionTitle>
                <SortSelect ref={dropdownRef}>
                  <SortButton
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                  >
                    <SortText>{selectedSortLabel}</SortText>
                    <Sort $open={dropdownOpen}>
                      <SortIcon />
                    </Sort>
                  </SortButton>
                  {dropdownOpen && (
                    <SortDropdown role="listbox">
                      {SORT_OPTIONS.map((option) => (
                        <SortDropdownItem
                          key={option.value}
                          $selected={option.value === sortType}
                          role="option"
                          aria-selected={option.value === sortType}
                          onClick={() => {
                            setSortType(option.value);
                            setDropdownOpen(false);
                          }}
                        >
                          {option.label}
                        </SortDropdownItem>
                      ))}
                    </SortDropdown>
                  )}
                </SortSelect>
              </MenuHeader>

              <MenuList>
                {sortedMenuData.map((item, idx) => (
                  <MenuListItem key={item.menuId}>
                    <MenuRank>{idx + 1}.</MenuRank>
                    <MenuName>{item.name}</MenuName>

                    <MenuRating>
                        <MenuRatingIcon />
                        {item.reviewCount}</MenuRating>
                    <MenuSales>{item.sales?.toLocaleString()}원 </MenuSales>
                    <MenuCount> / {item.orderCount}건</MenuCount>
                  </MenuListItem>
                ))}
              </MenuList>
            </MenuSection>
          </LeftColumn>

          <RightColumn>
            <TimeSection>
              <SectionTitle>시간대별 매출 현황</SectionTitle>
              <TimeList>
                {timeSalesData.map((slot) => (
                  <MenuListItem key={slot.hour}>
                    <MenuName>{slot.hour}시</MenuName>
                    <MenuCount2>{slot.orderCount}건</MenuCount2>
                    <MenuSales>{slot.sales?.toLocaleString()}원</MenuSales>
                  </MenuListItem>
                ))}
              </TimeList>
            </TimeSection>
          </RightColumn>
        </ContentRow>
      </MainContent>
    </>
  );
};
export default DailyStatsPage;

const Layout = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Title = styled.h1`  
    ${bold36}
    color: var(--black);
`;

const TodayDate = styled.div`
    ${bold36}
    color: var(--black);
`;
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1.5rem 1.875rem;
`;
const StatBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--white);
  border-radius: 1.25rem;
  padding: 1.3125rem 1.875rem;
  flex-shrink: 0;
  height: 10rem;
`;

const StatLabel = styled.div`
  ${bold24}
  color: var(--gray700);
`;

const StatValue = styled.div`
  ${bold36}
  color: var(--black);
  text-align: right;
`;

const SectionTitle = styled.h2`
  ${bold24}
  color: var(--gray700);
  margin-bottom: 1.25rem;
`;

const MenuSection = styled.div`
  background: var(--white);
  border-radius: 1.25rem;
  padding: 1.875rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box; /**/
  overflow: hidden;
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SortSelect = styled.div`
  position: relative;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 0.5rem;
  width: 100%;
`;

const SortText = styled.span`
  ${bold18}
  color: var(--black);
`;

const Sort = styled.div`
  display: flex;
  transition: transform 0.2s;
  transform: ${(props) => (props.$open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const SortDropdown = styled.div`
  position: absolute;
  background: var(--white);
  border: 1px solid var(--gray300);
  border-radius: 0.625rem;
  z-index: 1000;
  overflow: hidden;
`;

const SortDropdownItem = styled.div`
  ${body_large}
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${(props) => (props.$selected ? 'var(--primary)' : 'var(--black)')};

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray100);
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
  overflow-y: auto;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--gray100);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gray300);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray400);
  }
`;

const MenuListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid var(--gray300);
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }
`;

const MenuRank = styled.div`
  ${bold24}
  color: var(--black);
  min-width: 2rem;
`;

const MenuName = styled.div`
  ${bold24}
  flex: 1;
  color: var(--black);
  text-align: left;
`;

const MenuRating = styled.div`
  ${reg24}
  color: var(--orange);
  text-align: center;
  min-width: 16rem;
`;

const MenuSales = styled.div`
  ${reg24}
  min-width: 10rem;
  color: var(--black);
  text-align: right;
`;

const MenuCount = styled.div`
  ${reg24}
  min-width: 3rem;
  color: var(--gray500);
  text-align: right;
`;

const MenuCount2 = styled.div`
  ${reg24}
  min-width: 3rem;
  color: var(--black);
  text-align: right;
`;

const ContentRow = styled.div`
  display: flex;
  gap: 1.25rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 70%;
  /* height: 100%; 제거 */
  min-height: 0; /* flex 축소 허용 */

  overflow: hidden;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1.25rem;
`;

const RightColumn = styled.div`
  flex: 1;
  min-height: 0; /* 추가 */
  display: flex; /* 추가 */
  flex-direction: column; /* 추가 */
  overflow: hidden; /* 추가 */
`;

const TimeSection = styled.div`
  background: var(--white);
  border-radius: 1.25rem;
  padding: 1.88rem;
  /* height: 100%; 제거 */
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex: 1; /* RightColumn 공간 차지 */
  overflow: hidden; /* 추가 */
`;

const TimeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1; /* TimeSection의 나머지 공간 차지 */
  overflow-y: auto;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--gray100);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gray300);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray400);
  }
`;
