import { useEffect, useReducer, useState } from "react";
import ForncedorForm from "./forms/FornecedorForm";
import { request, setAuthHeader } from "../helpers/axios_helper";

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

  const handleAddButtonClick = () => {
    setShowForm(true);
    setEditFornecedor(null);
  };

  const handleEditButtonClick = (forncedor: Fornecedor) => {
    setShowForm(true);
    setEditFornecedor(forncedor);
  };

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
                  className="btn btn-secondary"
                  onClick={() => handleEditButtonClick(forncedor)}
                >
                  Editar
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
        <ForncedorForm
          addOrEditForncedor={addOrEditFornecedor}
          editForncedor={editFornecedor}
        />
      )}
    </div>
  );
}

export default FornecedorPage;
