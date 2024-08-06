import React, { useState } from "react";
import { request, setAuthHeader } from "../helpers/axios_helper";
import queryString from 'query-string';

import Buttons from "./Buttons";
import AuthContent from "./AuthContent";
import LoginForm from "./LoginForm";
import WelcomeContent from "./WelcomeContent";
import LoggedInWelcomeContent from "./LoggedInWelcomeContent";
import FuncionarioPage from "../pages/FuncionarioPage";
import FornecedorPage from "../pages/FornecedorPage";
import ClientePage from "../pages/ClientePage";
import PagamentoPage from '../pages/PagamentoPage';
import ProdutoPage from "../pages/ProdutoPage";
import PedidoPage from "../pages/PedidoPage";
import RemessaPage from "../pages/RemessaPage";
import NavBar from './NavBar';
import axios from "axios";

const AppContent: React.FC = () => {
  const [componentToShow, setComponentToShow] = useState<string>("welcome");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);

  const login = () => {
    setComponentToShow("login");
  };

  const logout = () => {
    setComponentToShow("welcome");
    setAuthHeader(null);
    setIsLoggedIn(false);
    setUsername("");
  };

  const onLogin = async (
    e: React.FormEvent<HTMLFormElement>,
    username: string,
    senha: string
  ) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8083" + "/oauth/oauth/token",
        queryString.stringify({
                username: username, //gave the values directly for testing
                password: senha,
                grant_type: 'password'
        }), {
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
      // const response = await request("POST", "/oauth/oauth/token", {
      //   login: username,
      //   senha: senha,
      //});
      setAuthHeader(response.data.token);
      // setUserRole(response.data.role);
      setUserRole("gerente");
      setIsLoggedIn(true);
      setUsername(username);
      setComponentToShow("loggedInWelcome");
    } catch (error) {
      setAuthHeader(null);
      setComponentToShow("welcome");
    }
  };

  const onRegister = async (
    e: React.FormEvent<HTMLFormElement>,
    username: string,
    senha: string,
    role: string
  ) => {
    e.preventDefault();
    try {
      const response = await request("POST", "/api/usuario", {
        login: username,
        senha: senha,
        role: role,
      });
      onLogin(e, response.data.login, senha);
    } catch (error) {
      setAuthHeader(null);
      setComponentToShow("welcome");
    }
  };

  return (
    <>
      {isLoggedIn && (
        <NavBar
          onNavigate={setComponentToShow}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
        />
      )}
      <Buttons login={login} logout={logout} isLoggedIn={isLoggedIn} />
      {!isLoggedIn && componentToShow === "welcome" && <WelcomeContent />}
      {isLoggedIn && componentToShow === "loggedInWelcome" && (
        <LoggedInWelcomeContent username={username} />
      )}
      {componentToShow === "login" && (
        <LoginForm onLogin={onLogin} onRegister={onRegister} />
      )}
      {componentToShow === "messages" && <AuthContent />}
      {componentToShow === "funcionarios" && <FuncionarioPage />}
      {componentToShow === "fornecedores" && <FornecedorPage />}
      {componentToShow === "clientes" && <ClientePage />}
      {componentToShow === "produtos" && <ProdutoPage />}
      {componentToShow === "pedidos" && <PedidoPage />}
      {componentToShow === "pagamentos" && <PagamentoPage />}
      {componentToShow === "remessas" && <RemessaPage />}
    </>
  );
};

export default AppContent;
