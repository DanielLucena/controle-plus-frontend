import React, { useState, ChangeEvent, FormEvent } from 'react';
import classNames from 'classnames';

interface LoginFormProps {
  onLogin: (e: FormEvent<HTMLFormElement>, username: string, senha: string) => void;
  onRegister: (e: FormEvent<HTMLFormElement>, username: string, senha: string, role: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister }) => {
  const [active, setActive] = useState<'login' | 'register'>('login');
  const [login, setLogin] = useState('');
  const [senha, setsenha] = useState('');
  const [role, setRole] = useState('');

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case 'login':
        setLogin(value);
        break;
      case 'senha':
        setsenha(value);
        break;
      case 'role':
        setRole(value);
        break;
      default:
        break;
    }
  };

  const onSubmitLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(e, login, senha);
  };

  const onSubmitRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onRegister(e, login, senha, role);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-4">
        <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link", { active: active === 'login' })}
              id="tab-login"
              onClick={() => setActive('login')}
            >
              Login
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={classNames("nav-link", { active: active === 'register' })}
              id="tab-register"
              onClick={() => setActive('register')}
            >
              Register
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div className={classNames("tab-pane", "fade", { "show active": active === 'login' })} id="pills-login">
            <form onSubmit={onSubmitLogin}>
              <div className="form-outline mb-4">
                <input
                  type="text"
                  id="loginName"
                  name="login"
                  className="form-control"
                  onChange={onChangeHandler}
                />
                <label className="form-label" htmlFor="loginName">Username</label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="loginsenha"
                  name="senha"
                  className="form-control"
                  onChange={onChangeHandler}
                />
                <label className="form-label" htmlFor="loginsenha">senha</label>
              </div>

              <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>
            </form>
          </div>
          <div className={classNames("tab-pane", "fade", { "show active": active === 'register' })} id="pills-register">
            <form onSubmit={onSubmitRegister}>
              <div className="form-outline mb-4">
                <input
                  type="text"
                  id="registerLogin"
                  name="login"
                  className="form-control"
                  onChange={onChangeHandler}
                />
                <label className="form-label" htmlFor="registerLogin">Username</label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="registersenha"
                  name="senha"
                  className="form-control"
                  onChange={onChangeHandler}
                />
                <label className="form-label" htmlFor="registersenha">senha</label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="text"
                  id="registerRole"
                  name="role"
                  className="form-control"
                  onChange={onChangeHandler}
                />
                <label className="form-label" htmlFor="registerRole">Role</label>
              </div>

              <button type="submit" className="btn btn-primary btn-block mb-3">Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
