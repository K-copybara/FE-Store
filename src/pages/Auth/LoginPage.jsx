import styled from 'styled-components';
import backgroundUrl from '../../assets/background.svg';
import LOGO from '../../assets/logo.svg?react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { postLogin } from '../../api/auth';

const LoginPage = () => {
  const [login, setLogin] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChangeLogin = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const Login = async () => {
    const { email, password } = login;
    console.log(email, password);
    if (email?.trim() && password?.trim()) {
      try {
        const res = await postLogin(login);

        const token = {
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          expiresIn: res.accessTokenExpiresIn,
        };
        localStorage.setItem('token', JSON.stringify(token));

        const loadStoreId = useUserStore.getState().loadStoreId;
        loadStoreId();
        navigate('/', { replace: true });
      } catch (err) {
        alert('로그인에 실패했습니다. 이메일과 비밀번호를 다시 확인해주세요.');
        console.error(err);
      }
    }
  };

  return (
    <Layout>
      <LeftSection>
        <LOGO_IMG />
        <LoginForm>
          <InputContainer>
            <Input
              type="text"
              value={login.email}
              name="email"
              onChange={onChangeLogin}
              required
              placeholder="Email"
            />
            <Input
              type="password"
              value={login.password}
              name="password"
              onChange={onChangeLogin}
              required
              placeholder="password"
            />
          </InputContainer>

          <LoginButton onClick={Login}>로그인</LoginButton>
        </LoginForm>
      </LeftSection>
      <BACK_IMG />
    </Layout>
  );
};

export default LoginPage;

const Layout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;

  align-items: center;
  background-color: var(--white);
`;

const LeftSection = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 5rem;
  padding: 0 2rem;
`;

const BACK_IMG = styled.aside`
  flex: 0 1 40%;
  max-width: 40%;
  align-self: stretch;
  background: url(${backgroundUrl}) center / cover no-repeat;
`;

const LOGO_IMG = styled(LOGO)`
  width: 20rem;
`;

const LoginForm = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const InputContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 25rem;
  height: 2.5rem;
  padding: 0.625rem 1.4375rem;
  align-items: center;

  border-radius: 0.5rem;
  border: 1px solid var(--gray700);
  background: var(--gray100);
`;

const LoginButton = styled.button`
  display: flex;
  width: 5rem;
  height: 6rem;
  justify-content: center;
  align-items: center;

  border-radius: 0.625rem;
  background: var(--primary);
  color: var(--white);
`;
