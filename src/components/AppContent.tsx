import React, { useState } from 'react';

import { request, setAuthHeader } from '../helpers/axios_helper';

import Buttons from './Buttons';
import AuthContent from './AuthContent';
import LoginForm from './LoginForm';
import WelcomeContent from './WelcomeContent';

const AppContent: React.FC = () => {
  const [componentToShow, setComponentToShow] = useState<string>('welcome');

  const login = () => {
    setComponentToShow('login');
  };

  const logout = () => {
    setComponentToShow('welcome');
    setAuthHeader(null);
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>, username: string, senha: string) => {
    e.preventDefault();
    try {
      const response = await request('POST', '/usuario/auth', {
        login: username,
        senha: senha,
      });
      setAuthHeader(response.data.token);
      setComponentToShow('messages');
    } catch (error) {
      setAuthHeader(null);
      setComponentToShow('welcome');
    }
  };

  const onRegister = async (e: React.FormEvent<HTMLFormElement>, username: string, senha: string, role: string) => {
    e.preventDefault();
    try {
      const response = await request('POST', '/usuario', {
        login: username,
        senha: senha,
        role: role,
      });
      onLogin(e, response.data.login,senha);
    } catch (error) {
      setAuthHeader(null);
      setComponentToShow('welcome');
    }
  };

  return (
    <>
      <Buttons login={login} logout={logout} />

      {componentToShow === 'welcome' && <WelcomeContent />}
      {componentToShow === 'login' && <LoginForm onLogin={onLogin} onRegister={onRegister} />}
      {componentToShow === 'messages' && <AuthContent />}
    </>
  );
};

export default AppContent;