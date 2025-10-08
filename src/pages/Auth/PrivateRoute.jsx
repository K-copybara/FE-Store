import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function PrivateRoute() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

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

  if (isLoading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.25rem 1.5rem;
`;
