import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { body_large, bold36, bold24, bold18, reg24 } from '../../styles/font';
import { useUserStore } from '../../store/useUserStore';

import MenuRatingIcon from '../../assets/icons/DailyStats/menurating-icon.svg?react';
import SortIcon from '../../assets/icons/DailyStats/sortarrow-icon.svg?react';

import {
  getDailyOrderSales,
  getHourlySales,
  getMenuSales,
} from '../../api/stats';

const DailyStatsPage = () => {
  const storeId = useUserStore((state) => state.storeId);
  const location = useLocation();

  // 오늘 날짜 구하기. 매출조회/일별매출통계 바로 클릭 시 실행
  const getTodayString = () => {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const parts = formatter.formatToParts(today);
    const year = parts.find((part) => part.type === 'year').value;
    const month = parts.find((part) => part.type === 'month').value;
    const day = parts.find((part) => part.type === 'day').value;

    return `${year}-${month}-${day}`;
  };
  const selectedDate = location.state?.date || getTodayString(); //달력에서 받아온 날짜 || 오늘 날짜

  const [todaySalesData, setTodaySalesData] = useState([
    //해당 날짜 매출, 주문건수
    { date: selectedDate, sales: 0, orders: 0 },
  ]);
  const [timeSalesData, setTimeSalesData] = useState([]); //시간별 매출 조회
  const [rankSalesData, setRankSalesData] = useState([]); //메뉴별 매출순, 리뷰순 조회
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      return b.sales - a.sales;
    } else if (sortType === 'review') {
      return b.reviewCount - a.reviewCount;
    }
    return 0;
  });

  useEffect(() => {
    const fetchDailyStats = async () => {
      setLoading(true);
      setError(null);

      if (!storeId) {
        setError(new Error('storeId가 없습니다.'));
        setLoading(false);
        return;
      }

      try {
        const [dailyData, hourlyData, menuData] = await Promise.all([
          getDailyOrderSales(selectedDate, storeId),
          getHourlySales(selectedDate, storeId),
          getMenuSales(selectedDate, sortType, storeId),
        ]);
        console.log('일별 매출 데이터:', dailyData);
        console.log('시간대별 매출 데이터:', hourlyData);
        console.log('메뉴별 매출 데이터:', menuData);

        setTodaySalesData([
          {
            date: selectedDate,
            sales: dailyData.sales || 0,
            orders: dailyData.orders || 0,
          },
        ]);

        setTimeSalesData(hourlyData);
        setRankSalesData(menuData);
      } catch (error) {
        setError(error);
        console.error('일별 매출 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyStats();
  }, [selectedDate, sortType, storeId]); //날짜, 정렬 변경될 때마다 실행

  //이건 정렬 변경할 때 전체 새로고침 안되게 할라고 만든거
  // useEffect(() => {
  //   const fetchMenuData = async () => {
  //     if (!storeId) return;

  //     try {
  //       const menuData = await getMenuSales(selectedDate, sortType, storeId);
  //       console.log('메뉴별 매출 데이터 (정렬 변경):', menuData);
  //       setRankSalesData(menuData);
  //     } catch (error) {
  //       console.error('메뉴 데이터 조회 실패:', error);
  //     }
  //   };

  //   fetchMenuData();
  // }, [sortType]);

  if (loading) return <MenuSection>로딩중...</MenuSection>;
  if (error) return <MainContent>에러 발생: {error.message}</MainContent>;

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
                {sortedMenuData
                  .filter((item) => item.sales > 0)
                  .map((item, idx) => (
                    <MenuListItem key={item.menuId}>
                      <MenuRank>{idx + 1}.</MenuRank>
                      <MenuName>{item.name}</MenuName>

                      <MenuRating>
                        <MenuRatingIcon />
                        {item.reviewCount}
                      </MenuRating>
                      <MenuSalesCount>
                        <MenuSales>{item.sales?.toLocaleString()}원 </MenuSales>
                        <MenuCount> / {item.orderCount}건</MenuCount>
                      </MenuSalesCount>
                    </MenuListItem>
                  ))}
              </MenuList>
            </MenuSection>
          </LeftColumn>

          <RightColumn>
            <TimeSection>
              <SectionTitle>시간대별 매출 현황</SectionTitle>
              <TimeList>
                {timeSalesData.map((slot, index) => (
                  <MenuListItem key={index}>
                    <MenuName2>{slot.hour}시</MenuName2>
                    <MenuCount2>{slot.orderCount}건</MenuCount2>
                    <MenuSales>{slot.sales?.toLocaleString() || 0}원</MenuSales>
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
  white-space: nowrap;
`;

const TodayDate = styled.div`
  ${bold36}
  color: var(--black);
  white-space: nowrap;
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
  white-space: nowrap;
`;

const StatValue = styled.div`
  ${bold36}
  color: var(--black);
  text-align: right;
  white-space: nowrap;
`;

const SectionTitle = styled.h2`
  ${bold24}
  color: var(--gray700);
  margin-bottom: 1.25rem;
  white-space: nowrap;
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
    background: var(--gray300);
  }
`;

const MenuListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--gray300);
  transition: background-color 0.2s;
  justify-content: space-between;
  &:last-child {
    border-bottom: none;
  }
`;

const MenuRank = styled.div`
  ${bold24}
  color: var(--black);
  // min-width: 1.2rem;
  flex-shrink: 0;
  white-space: nowrap;
`;

const MenuName = styled.div`
  ${bold24}
  min-width: 10rem;
  color: var(--black);
  text-align: left;
  overflow: hidden;
  white-space: nowrap; //한 줄 유지
`;

const MenuName2 = styled.div`
  ${bold24}
  min-width: 4rem;
  color: var(--black);
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
`;

const MenuRating = styled.div`
  ${reg24}
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 6rem;
  flex-shrink: 0; //축소 방지
`;

const MenuRatingCount = styled.div`
  ${reg24}
  width: 3rem;
  color: var(--black);
`;

const MenuSalesCount = styled.div`
  ${reg24}
  display: flex;
  flex: 1;
  flex-direction: row;
  min-width: 13rem;
  flex-shrink: 0;
  justify-content: flex-end;
`;

const MenuSales = styled.div`
  ${reg24}
  min-width: 7rem;
  color: var(--black);
  text-align: right;
  white-space: nowrap;
`;

const MenuCount = styled.div`
  ${reg24}
  color: var(--gray500);
  text-align: right;
  white-space: nowrap;
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
  min-height: 0;

  overflow: hidden;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1.25rem;
`;

const RightColumn = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TimeSection = styled.div`
  background: var(--white);
  border-radius: 1.25rem;
  padding: 1.88rem;
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex: 1; /* RightColumn 공간 차지 */
  overflow: hidden;
`;

const TimeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
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
    background: var(--gray300);
  }
`;
