import React from 'react';

type NavBarProps = {
  onNavigate: (page: string) => void;
};

const NavBar: React.FC<NavBarProps> = ({ onNavigate }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">Mercenaria</a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <button className="nav-link btn btn-link" onClick={() => onNavigate('welcome')}><b>Home</b></button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-link" onClick={() => onNavigate('funcionarios')}><b>Funcionarios</b></button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-link" onClick={() => onNavigate('fornecedores')}><b>Fornecedores</b></button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
