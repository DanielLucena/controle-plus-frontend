import React from "react";
import { capitalize, rolesDictionary } from "../helpers/roles_helper";

type NavBarProps = {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  userRole: string | null;
};

const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a
        className="navbar-brand btn btn-link"
        onClick={() =>
          props.onNavigate(props.isLoggedIn ? "loggedInWelcome" : "welcome")
        }
      >
        Mercenaria
      </a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          {rolesDictionary[props.userRole!].map((nomeAba) => (
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => props.onNavigate(nomeAba)}
              >
                {/* deixa primeira letra maiuscula */}
                <b>{capitalize(nomeAba)}</b>
              </button>
            </li>
          ))}
          {/* <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => onNavigate("funcionarios")}
            >
              <b>Funcionarios</b>
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => onNavigate("fornecedores")}
            >
              <b>Fornecedores</b>
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => onNavigate("clientes")}
            >
              <b>Clientes</b>
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => onNavigate("clientes")}
            >
              <b>Clientes</b>
            </button>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
