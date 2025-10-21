import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import { SSEProviders } from '../../components/SSE/SSEProviders';
import { useUserStore } from '../../store/useUserStore';

export default function PrivateRoute() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  const { storeId, loadStoreId } = useUserStore();

  useEffect(() => {
    const checkAuth = () => {
      const token = JSON.parse(localStorage.getItem('token'));

      if (!token) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (storeId == null) loadStoreId();
  }, [storeId, loadStoreId]);

  if (isLoading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return (
    <SSEProviders>
      <Wrapper>
        <Sidebar />
        <Outlet />
      </Wrapper>
    </SSEProviders>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1.25rem 1.5rem;
  gap: 1.25rem;
`;
