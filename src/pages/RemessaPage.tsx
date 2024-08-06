import React, { useEffect, useReducer, useState } from "react";
import RemessaForm from "./forms/RemessaForm";
import { request, setAuthHeader } from "../helpers/axios_helper";
import axios from "axios";
import "./style/modal.css";

interface Fornecedor {
  id: number;
  nome: string;
}

interface Funcionario {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
  fornecedor: { id: number; nome: string };
}

interface Item {
  produto: Produto;
  quantidade: number;
}

interface Remessa {
  id: number;
  fornecedor: Fornecedor;
  funcionario: Funcionario;
  itens: Item[];
}

function RemessaPage() {
  const [remessas, setRemessas] = useState<Remessa[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editRemessa, setEditRemessa] = useState<Remessa | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request("GET", "/api/remessa", {});
        setRemessas(response.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          setAuthHeader(null);
        } else {
          setAlert(`Erro ao carregar remessas: ${error.message}`);
        }
      }
    };

    fetchData();
  }, [reducerValue]);

  const addOrEditRemessa = async (remessa: {
    fornecedorId: number;
    funcionarioId: number;
    itens: {
      produtoId: number;
      quantidade: number;
    }[];
  }) => {
    setAlert(null);
    try {
      if (editRemessa) {
        await request("PUT", `/api/remessa/${editRemessa.id}`, {
          fornecedorId: remessa.fornecedorId,
          funcionarioId: remessa.funcionarioId,
          itens: remessa.itens.map(item => ({
            quantidade: item.quantidade,
            produto: item.produtoId
          }))
        });
      } else {
        await request("POST", "/api/remessa", {
          fornecedorId: remessa.fornecedorId,
          funcionarioId: remessa.funcionarioId,
          itens: remessa.itens.map(item => ({
            quantidade: item.quantidade,
            produto: item.produtoId
          }))
        });
      }
      forceUpdate();
    } catch (error: any) {
      setAlert(`Erro ao salvar remessa: ${error.message}`);
    }
    setShowForm(false);
    setEditRemessa(null);
  };

  const handleAddButtonClick = () => {
    setEditRemessa(null);
    setShowForm(true);
  };

  const handleCloseButtonClick = () => {
    setShowForm(false);
    setEditRemessa(null);
  };

  const handleEditButtonClick = (remessa: Remessa) => {
    setEditRemessa(remessa);
    setShowForm(true);
  };

  const handleDeleteButtonClick = async (id: number) => {
    setAlert(null);
    try {
      await request("DELETE", `/api/remessa/${id}`, {});
      forceUpdate(); 
    } catch (error: any) {
      setAlert(`Erro ao excluir remessa: ${error.message}`);
    }
  };

  const formatAlertErrorMsg = (error: any) => {
    let errorMessage = "Erro desconhecido";
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 403) {
        errorMessage = "Você não tem autorização para realizar essa ação";
      } else {
        errorMessage = `Erro ${error?.response?.status} - ${error.response?.statusText}`;
      }
    }
    setAlert(errorMessage);
  };

  if (showForm) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <div className="container">
      {alert && (
        <div className="alert alert-danger alert-dismissible">
          <button
            type="button"
            className="btn-close close-modal"
            aria-label="Close"
            onClick={() => {
              setAlert(null);
            }}
          />
          {alert}
        </div>
      )}
      <h2>Listagem de Remessas</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fornecedor</th>
            <th>Funcionário</th>
            <th>Itens</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {remessas.map((remessa) => (
            <tr key={remessa.id}>
              <td>{remessa.id}</td>
              <td>{remessa.fornecedor.nome}</td>
              <td>{remessa.funcionario.nome}</td>
              <td>
                {remessa.itens.map((item) => (
                  <div key={item.produto.id}>
                    Produto: {item.produto.nome}, Quantidade: {item.quantidade}
                  </div>
                ))}
              </td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEditButtonClick(remessa)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleDeleteButtonClick(remessa.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleAddButtonClick}>
        Adicionar Nova Remessa
      </button>
      {showForm && (
        <div className="my-modal">
          <div className="overlay" onClick={handleCloseButtonClick}></div>
          <div className="my-modal-content">
            <button
              type="button"
              className="btn-close close-modal"
              aria-label="Close"
              onClick={handleCloseButtonClick}
            ></button>
            <RemessaForm
              addOrEditRemessa={addOrEditRemessa}
              editRemessa={editRemessa}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RemessaPage;
