import { useEffect, useReducer, useState } from "react";
import FornecedorForm from "./forms/FornecedorForm";
import { request, setAuthHeader } from "../helpers/axios_helper";
import "./style/modal.css";
import axios from "axios";

interface Fornecedor {
  id: number;
  nome: string;
}

function FornecedorPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request("GET", "/fornecedor", {});
        setFornecedores(response.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          setAuthHeader(null);
        } else {
          setFornecedores([error.response.code]);
        }
      }
    };

    fetchData();
  }, [reducerValue]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editFornecedor, setEditFornecedor] = useState<Fornecedor | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const addOrEditFornecedor = async (fornecedor: Fornecedor) => {
    setAlert(null);
    if (editFornecedor) {
      try {
        await request("PUT", "/fornecedor/" + fornecedor.id, {
          nome: fornecedor.nome,
        });
        forceUpdate();
      } catch (error) {
        let errorMessage = "not axios error";
        if (axios.isAxiosError(error)) {
          errorMessage = error.message + ": " + error.code;
        }
        setAlert(errorMessage);
      }
    } else {
      try {
        await request("POST", "/fornecedor", {
          nome: fornecedor.nome,
        });
        forceUpdate();
      } catch (error) {
        let errorMessage = "not axios error";
        if (axios.isAxiosError(error)) {
          errorMessage = error.message + ": " + error.code;
        }
        setAlert(errorMessage);
      }
    }
    setShowForm(false);
    setEditFornecedor(null);
  };

  const deleteFornecedor = async (fornecedor: Fornecedor) => {
    setAlert(null);
    try {
      await request("DELETE", "/fornecedor/" + fornecedor.id, {});
      forceUpdate();
    } catch (error) {
      let errorMessage = "not axios error";
      if (axios.isAxiosError(error)) {
        errorMessage = error.message + ": " + error.code;
      }
      setAlert(errorMessage);
    }
  };

  const handleAddButtonClick = () => {
    setEditFornecedor(null);
    setShowForm(true);
  };

  const handleEditButtonClick = (fornecedor: Fornecedor) => {
    setShowForm(true);
    setEditFornecedor(fornecedor);
  };

  const handleDeleteButtonClick = (fornecedor: Fornecedor) => {
    deleteFornecedor(fornecedor);
  };

  const handleCloseButtonClick = () => {
    setShowForm(false);
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
      <h2>Listagem de Fornecedores</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((fornecedor) => (
            <tr key={fornecedor.id}>
              <td>{fornecedor.id}</td>
              <td>{fornecedor.nome}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleEditButtonClick(fornecedor)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteButtonClick(fornecedor)}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleAddButtonClick}>
        Adicionar Novo Fornecedor
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
            <FornecedorForm
              addOrEditFornecedor={addOrEditFornecedor}
              editFornecedor={editFornecedor}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FornecedorPage;
