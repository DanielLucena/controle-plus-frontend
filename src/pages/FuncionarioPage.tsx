import React, { useState, useEffect, useReducer } from 'react';
import FuncionarioForm from './forms/FuncionarioForm';
import { request, setAuthHeader } from '../helpers/axios_helper';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

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
    setEditFuncionario(funcionario);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditFuncionario(null);
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
        <div className="modal fade show d-block modal-custom" tabIndex={-1} role="dialog" aria-labelledby="funcionarioModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="funcionarioModalLabel">{editFuncionario ? 'Editar Funcionário' : 'Adicionar Funcionário'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <FuncionarioForm
                  addOrEditFuncionario={addOrEditFuncionario}
                  editFuncionario={editFuncionario}
                  closeModal={closeModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuncionarioPage;
