import styled from 'styled-components';
import { useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { display_xl, display_large, title_large, body_large} from '../../styles/font';
import { useSales } from '../../hooks/useSales';

const DailyStatsPage = () => {

  const { todaySalesData, timeSalesData, rankSalesData } = useSales();

  const [sortType, setSortType] = useState('sales');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const SORT_OPTIONS = [
    { value: 'sales', label: '매출순' },
    { value: 'review', label: '리뷰순' }
  ];
  const selectedSortLabel = SORT_OPTIONS.find(option => option.value === sortType)?.label;
  
  const sortedMenuData = [...rankSalesData].sort((a, b) => {
    if (sortType === 'sales') {
      return b.sales - a.sales; // 매출순 (높은 순)
    } else {
      return b.reviewCount - a.reviewCount; // 리뷰순 (높은 순)
    }
  });

  return (
    <Layout>
      <Sidebar />
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
                <StatValue>{todaySalesData[0]?.sales?.toLocaleString() || 0} 원</StatValue>
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
                    <SortIcon $open={dropdownOpen}>
                      <svg width="1rem" height="1rem" viewBox="0 0 16 16">
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="var(--black)"
                          strokeWidth="0.094rem"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </SortIcon>
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
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.775 18.85C5.375 19.0833 4.96667 19.15 4.55 19.05C4.13333 18.9333 3.80833 18.6917 3.575 18.325C3.35833 17.9583 3.28333 17.5417 3.35 17.075L4.225 12.1C4.225 12.0667 4.225 12.0667 4.225 12.1C4.24167 12.1167 4.25 12.15 4.25 12.2C4.26667 12.2833 4.28333 12.3667 4.3 12.45C4.33333 12.5333 4.35833 12.5833 4.375 12.6L0.75 9.025C0.416667 8.70833 0.241667 8.34167 0.225 7.925C0.208333 7.49167 0.333333 7.10833 0.6 6.775C0.883334 6.44167 1.25 6.25 1.7 6.2L6.425 5.5C6.30833 5.7 6.24167 5.80833 6.225 5.825L8.5 1.225C8.71667 0.824999 9.01667 0.558332 9.4 0.424999C9.8 0.274999 10.1917 0.274999 10.575 0.424999C10.975 0.558332 11.2833 0.824999 11.5 1.225L13.775 5.825C13.6917 5.70833 13.6167 5.59167 13.55 5.475L18.35 6.225C18.8 6.29167 19.15 6.49167 19.4 6.825C19.6667 7.14167 19.7833 7.50833 19.75 7.925C19.7333 8.34167 19.5667 8.70833 19.25 9.025L15.625 12.6C15.575 12.6333 15.5833 12.5417 15.65 12.325C15.7167 12.1083 15.7583 12.0333 15.775 12.1L16.65 17.075C16.7333 17.5417 16.6583 17.9583 16.425 18.325C16.1917 18.675 15.8667 18.9083 15.45 19.025C15.05 19.125 14.6417 19.0667 14.225 18.85L9.7 16.475C9.63333 16.4417 9.66667 16.425 9.8 16.425C9.93333 16.4083 10.0667 16.4083 10.2 16.425C10.3333 16.425 10.3667 16.4417 10.3 16.475L5.775 18.85Z" fill="#FCC900"/>
                        </svg>
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
    </Layout>
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
    ${display_xl}
    color: var(--black);
`;

const TodayDate = styled.div`
    ${display_xl}
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
  ${display_large}
  color: var(--gray700);
`;

const StatValue = styled.div`
  ${display_xl}
  color: var(--black);
  text-align: right;
`;

const SectionTitle = styled.h2`
  ${display_large}
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
  ${title_large}
`;

const SortIcon = styled.div`
  display: flex;
  transition: transform 0.2s;
  transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0deg)'};
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
  color: ${props => props.$selected ? 'var(--primary)' : 'var(--black)'};

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
  ${display_large}
  color: var(--black);
  min-width: 2rem;
`;

const MenuName = styled.div`
  ${display_large}
  flex: 1;
  color: var(--black);
  text-align: left;
`;

const MenuRating = styled.div`
  ${display_large}
  color: var(--orange);
  text-align: center;
  min-width: 16rem;
`;

const MenuSales = styled.div`
  ${display_large}
  min-width: 10rem;
  color: var(--black);
  text-align: right;
`;

const MenuCount = styled.div`
  ${display_large}
  min-width: 3rem;
  color: var(--gray500);
  text-align: right;
`;

const MenuCount2 = styled.div`
  ${display_large}
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