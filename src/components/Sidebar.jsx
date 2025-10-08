import React, { useState } from 'react';
import styled from 'styled-components';
import {bold36, bold24} from "../styles/font"; 
import {NavLink} from 'react-router-dom';

import OrderIcon from '../assets/icons/Sidebar/order-icon.svg?react';
import SalesIcon from '../assets/icons/Sidebar/sales-icon.svg?react';
import StoreInfoIcon from '../assets/icons/Sidebar/storeinfo-icon.svg?react';
import DropArrowIcon from '../assets/icons/Sidebar/droparrow-icon.svg?react';
import CalendarIcon from '../assets/icons/Sidebar/calendar-icon.svg?react';
import DailyStatsIcon from '../assets/icons/Sidebar/dailystats-icon.svg?react';

const Sidebar = () => {

  const [showSalesDropdown, setShowSalesDropdown] = useState(false);

  const toggleSalesDropdown = () => {
    setShowSalesDropdown(!showSalesDropdown);
  };

  return (
    <SidebarWrapper>
      <StoreName>딤딤섬 명동점</StoreName>

      <MenuList>
        <MenuItem>
          <StyledNavLink to="/">
            <OrderIcon />
            주문관리
          </StyledNavLink>
        </MenuItem>
        <Line />
        <MenuItem>
          <SalesMenuItem onClick={toggleSalesDropdown}>
            <SalesIcon />
            매출조회
            <DropdownArrow isOpen={showSalesDropdown}>
              <DropArrowIcon />
            </DropdownArrow>
          </SalesMenuItem>
          
          <DropdownMenu isOpen={showSalesDropdown}>
            <SubMenuItem>
              <StyledNavLink to="/SalesReport/Calendar">
                <CalendarIcon />
                달력
              </StyledNavLink>
            </SubMenuItem>
            <SubMenuItem>
              <StyledNavLink to="/SalesReport/DailyStats">
                <DailyStatsIcon />
                일별 매출 통계
              </StyledNavLink>
            </SubMenuItem>
          </DropdownMenu>
        </MenuItem>
        <Line />
        <MenuItem>
          <StyledNavLink to="/StoreInfo">
            <StoreInfoIcon />
            가게정보
          </StyledNavLink>
        </MenuItem>
      </MenuList>
    </SidebarWrapper>
  );
};

export default Sidebar;

const SidebarWrapper = styled.aside`
  display: flex;
  padding: 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap:3.75rem;

  width: 22.1875rem;
  flex-shrink: 0; 
  height: 100%;
  background-color: var(--white);
  border-radius: 1.25rem;
`;

const StoreName = styled.div`
  ${bold36}
  color: var(--black);
  padding: 0.625rem;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;

  border-radius: 1.25rem;
  background: var(--gray100);
`;

// 메뉴 전체를 감싸는 ul 태그
const MenuList = styled.ul`
  list-style: none; /* li의 기본 점 모양 제거 */
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 각 메뉴 아이템 사이의 간격 */
`;

const Line = styled.div`
  border-bottom: 1px solid var(--gray300);
  width: 100%;  
`;
// 각 메뉴 아이템을 위한 li 태그 (보통 스타일은 링크에 직접 줍니다)
const MenuItem = styled.li`
  alig-items: flex-start;
  align-self-stretch;
  padding: 0.62rem;
`;

// 클릭 가능한 링크 (NavLink)
const StyledNavLink = styled(NavLink)`
  ${bold24}
  display: flex; /* 링크가 li 영역 전체를 차지하도록 */
  border-radius: 0.5rem;
  text-decoration: none;
  gap: 0.75rem;

  color: var(--gray700);

  /* 마우스를 올렸을 때 스타일 */
  &:hover {
    color: var(--black);
  }

  /* 현재 활성화된 페이지일 때의 스타일 */
  &.active {
    color: var(--primary);
  }
`;

const SalesMenuItem = styled.div`
  ${bold24}
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  gap: 0.75rem;
  color: var(--gray700);

  cursor: pointer;

  &:hover {
    color: var(--black);
  }

`;

const DropdownArrow = styled.div`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const DropdownMenu = styled.div`
  max-height: ${props => props.isOpen ? '200px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding-left: 1rem;
  margin-top: ${props => props.isOpen ? '0.5rem' : '0'};
`;

const SubMenuItem = styled.div`
  margin: 0.25rem 0;
  
  ${StyledNavLink} {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;