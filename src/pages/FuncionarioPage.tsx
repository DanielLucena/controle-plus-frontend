import React, { useState, useEffect, useReducer } from 'react';
import FuncionarioForm from './forms/FuncionarioForm';
import { request, setAuthHeader } from '../helpers/axios_helper';

interface Funcionario {
  id: number;
  nome: string;
  funcao: 'gerente' | 'caixa';
}

const FuncionarioPage: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editFuncionario, setEditFuncionario] = useState<Funcionario | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request('GET', '/funcionario', {});
        setFuncionarios(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setAuthHeader(null);
        } else {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [reducerValue]);

  const addOrEditFuncionario = async (funcionario: Funcionario) => {
    if (editFuncionario) {
      try {
        await request('PUT', "/funcionario/" + funcionario.id, {
          nome: funcionario.nome,
          funcao: funcionario.funcao
        });
        forceUpdate();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await request('POST', '/funcionario', {
          nome: funcionario.nome,
          funcao: funcionario.funcao
        });
        forceUpdate();
      } catch (error) {
        console.error(error);
      }
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
                <button className="btn btn-secondary" onClick={() => handleEditButtonClick(funcionario)}>
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

export default FuncionarioPage;
