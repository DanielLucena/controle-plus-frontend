import React, { useState } from 'react';
import FuncionarioForm from './FuncionarioForm';

interface Funcionario {
  id: number;
  nome: string;
  funcao: 'gerente' | 'caixa';
}

const FuncionarioList: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    { id: 1, nome: 'João Silva', funcao: 'gerente' },
    { id: 2, nome: 'Maria Souza', funcao: 'caixa' },
  ]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editFuncionario, setEditFuncionario] = useState<Funcionario | null>(null);

  const addOrEditFuncionario = (funcionario: Funcionario) => {
    if (editFuncionario) {
      setFuncionarios(funcionarios.map((f) => (f.id === funcionario.id ? funcionario : f)));
    } else {
      setFuncionarios([...funcionarios, { ...funcionario, id: funcionarios.length + 1 }]);
    }
    setShowForm(false);
    setEditFuncionario(null);
  };

  const handleAddButtonClick = () => {
    setShowForm(true);
    setEditFuncionario(null);
  };

  const handleEditButtonClick = (funcionario: Funcionario) => {
    setShowForm(true);
    setEditFuncionario(funcionario);
  };

  return (
    <div className="container">
      <h2>Listagem de Funcionários</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Função</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((funcionario) => (
            <tr key={funcionario.id}>
              <td>{funcionario.id}</td>
              <td>{funcionario.nome}</td>
              <td>{funcionario.funcao}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditButtonClick(funcionario)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-primary" onClick={handleAddButtonClick}>
        Adicionar Novo Funcionário
      </button>

      {showForm && (
        <FuncionarioForm
          addOrEditFuncionario={addOrEditFuncionario}
          editFuncionario={editFuncionario}
        />
      )}
    </div>
  );
};

export default FuncionarioList;
