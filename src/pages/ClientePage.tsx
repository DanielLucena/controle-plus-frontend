import React, { useState, useEffect, useReducer } from 'react';
import ClienteForm from "./forms/ClienteForm";
import { request, setAuthHeader } from '../helpers/axios_helper';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
}

const ClientePage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editCliente, setEditCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request('GET', '/api/cliente', {});
        setClientes(response.data);
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

  const addOrEditCliente = async (cliente: Cliente) => {
    if (editCliente) {
      try {
        await request('PUT', "/api/cliente/" + cliente.id, {
          nome: cliente.nome,
          cpf: cliente.cpf
        });
        forceUpdate();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await request('POST', '/api/cliente', {
          nome: cliente.nome,
          cpf: cliente.cpf
        });
        forceUpdate();
      } catch (error) {
        console.error(error);
      }
    }
    setShowForm(false);
    setEditCliente(null);
  };

  const handleAddButtonClick = () => {
    setShowForm(true);
    setEditCliente(null);
  };

  const handleEditButtonClick = (cliente: Cliente) => {
    setEditCliente(cliente);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditCliente(null);
  };

  return (
    <div className="container">
      <h2>Listagem de Clientes</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.cpf}</td>
              <td>
                <button className="btn btn-secondary" onClick={() => handleEditButtonClick(cliente)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-primary" onClick={handleAddButtonClick}>
        Adicionar Novo Cliente
      </button>

      {showForm && (
        <div className="modal fade show d-block modal-custom" tabIndex={-1} role="dialog" aria-labelledby="clienteModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="clienteModalLabel">{editCliente ? 'Editar Cliente' : 'Adicionar Cliente'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <ClienteForm
                  addOrEditCliente={addOrEditCliente}
                  editCliente={editCliente}
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

export default ClientePage;
