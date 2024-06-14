import { useEffect, useReducer, useState } from "react";
import ForncedorForm from "./forms/FornecedorForm";
import { request, setAuthHeader } from "../helpers/axios_helper";
import "./style/modal.css";

interface Fornecedor {
  id: number;
  nome: string;
}

function FornecedorPage() {
  const [forncedores, setFornecedores] = useState<Fornecedor[]>([]);
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

  const addOrEditFornecedor = async (fornecedor: Fornecedor) => {
    if (editFornecedor) {
      try {
        await request("PUT", "/fornecedor/" + fornecedor.id, {
          nome: fornecedor.nome,
        });
        forceUpdate();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await request("POST", "/fornecedor", {
          nome: fornecedor.nome,
        });
        forceUpdate();
      } catch (error) {
        console.log(error);
      }
    }
    setShowForm(false);
    setEditFornecedor(null);
  };

  const deleteFornecedor = async (fornecedor: Fornecedor) => {
    try {
      await request("DELEte", "/fornecedor/" + fornecedor.id, {});
      forceUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddButtonClick = () => {
    setEditFornecedor(null);
    setShowForm(true);
  };

  const handleEditButtonClick = (forncedor: Fornecedor) => {
    setShowForm(true);
    setEditFornecedor(forncedor);
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
      <h2>Listagem de Funcionários</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {forncedores.map((forncedor) => (
            <tr key={forncedor.id}>
              <td>{forncedor.id}</td>
              <td>{forncedor.nome}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleEditButtonClick(forncedor)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteButtonClick(forncedor)}
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
        // <ForncedorForm
        //   addOrEditForncedor={addOrEditFornecedor}
        //   editForncedor={editFornecedor}
        // />
        <div className="my-modal">
          <div className="overlay" onClick={handleCloseButtonClick}></div>
          <div className="my-modal-content">
            <button
              type="button"
              className="btn-close close-modal"
              aria-label="Close"
              onClick={handleCloseButtonClick}
            ></button>
            <ForncedorForm
              addOrEditForncedor={addOrEditFornecedor}
              editForncedor={editFornecedor}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FornecedorPage;
