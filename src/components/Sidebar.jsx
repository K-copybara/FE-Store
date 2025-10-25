import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { bold36, bold24, reg18 } from '../styles/font';
import { NavLink, useNavigate } from 'react-router-dom';

import OrderIcon from '../assets/icons/Sidebar/order-icon.svg?react';
import SalesIcon from '../assets/icons/Sidebar/sales-icon.svg?react';
import StoreInfoIcon from '../assets/icons/Sidebar/storeinfo-icon.svg?react';
import DropArrowIcon from '../assets/icons/Sidebar/droparrow-icon.svg?react';
import CalendarIcon from '../assets/icons/Sidebar/calendar-icon.svg?react';
import DailyStatsIcon from '../assets/icons/Sidebar/dailystats-icon.svg?react';
import { postLogout } from '../api/auth';
import { getStoreInfo } from '../api/store';
import CarouselBanner from './Carousel';

const Sidebar = () => {
  const [showSalesDropdown, setShowSalesDropdown] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSalesDropdown = () => {
    setShowSalesDropdown(!showSalesDropdown);
  };

  useEffect(() => {
    const fetchStoreInfo = async () => {
      setLoading(true);
      try {
        const data = await getStoreInfo();
        console.log('가게 정보 조회 성공:', data);
        setStoreData(data);
      } catch (error) {
        setError(error);
        console.error('가게 정보 조회 실패', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, []);

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        const res = await postLogout();
        window.localStorage.removeItem('token');
      } catch (err) {
        console.error(err);
      } finally {
        navigate('/login', { replace: true });
      }
    }
  };

  return (
    <SidebarWrapper>
      <StoreName>{storeData?.shopName}</StoreName>
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
      <LogoutContainer>
        <CarouselBanner />
        <BottomLine />
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </LogoutContainer>
    </SidebarWrapper>
  );
};

export default Sidebar;

const SidebarWrapper = styled.aside`
  display: flex;
  padding: 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 3.75rem;

  width: 20%;
  min-width: 20rem;
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

const MenuList = styled.ul`
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Line = styled.div`
  border-bottom: 0.5px solid var(--gray300);
  width: 100%;
`;
const MenuItem = styled.li`
  align-items: flex-start;
  align-self: stretch;
  padding: 0.62rem;
`;

const StyledNavLink = styled(NavLink)`
  ${bold24}
  display: flex; /* 링크가 li 영역 전체를 차지하도록 */
  border-radius: 0.5rem;
  text-decoration: none;
  gap: 0.75rem;

  color: var(--gray700);

  &:hover {
    color: var(--black);
  }

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
  transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const DropdownMenu = styled.div`
  max-height: ${(props) => (props.isOpen ? '200px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding-left: 1rem;
  margin-top: ${(props) => (props.isOpen ? '0.5rem' : '0')};
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

const LogoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: auto;
`;

const BottomLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--gray300);
`;

const LogoutButton = styled.div`
  width: 100%;
  display: flex;
  padding: 0.8rem 1rem;
  padding-bottom: 0;
  ${reg18}
  color: var(--gray500);

  cursor: pointer;
`;
