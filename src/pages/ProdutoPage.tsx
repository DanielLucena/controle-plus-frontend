import { useEffect, useReducer, useState } from "react";
import ForncedorForm from "./forms/ProdutoForm.tsx";
import { request, setAuthHeader } from "../helpers/axios_helper";
import "./style/modal.css";
import axios from "axios";
import ProdutoForm from "./forms/ProdutoForm.tsx";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  quantidadeEstoque: string;
  fornecedor: { id: number; nome: string };
}

function ProdutoPage() {
  const [produtos, setProdutoes] = useState<Produto[]>([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request("GET", "/api/produto", {});
        setProdutoes(response.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          setAuthHeader(null);
        } else {
          setProdutoes([error.response.code]);
        }
      }
    };

    fetchData();
  }, [reducerValue]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const addOrEditProduto = async (produto: ProdutoForm) => {
    setAlert(null);
    if (editProduto) {
      try {
        await request("PUT", "/api/produto/" + produto.id, {
          nome: produto.nome,
          preco: produto.preco,
          quantidadeEstoque: produto.quantidade,
          fornecedorId: produto.fornecedorId,
        });
        forceUpdate();
      } catch (error) {
        formataAlertErrorMsg(error);
      }
    } else {
      try {
        await request("POST", "/api/produto", {
          nome: produto.nome,
          preco: produto.preco,
          quantidadeEstoque: produto.quantidade,
          fornecedorId: produto.fornecedorId,
        });
        forceUpdate();
      } catch (error) {
        formataAlertErrorMsg(error);
      }
    }
    setShowForm(false);
    setEditProduto(null);
  };

  const deleteProduto = async (produto: Produto) => {
    setAlert(null);
    try {
      await request("DELETE", "/api/produto/" + produto.id, {});
      forceUpdate();
    } catch (error) {
      formataAlertErrorMsg(error);
    }
  };

  const handleAddButtonClick = () => {
    setEditProduto(null);
    setShowForm(true);
  };

  const handleEditButtonClick = (produto: Produto) => {
    setShowForm(true);
    setEditProduto(produto);
  };

  const handleDeleteButtonClick = (produto: Produto) => {
    deleteProduto(produto);
  };

  const handleCloseButtonClick = () => {
    setShowForm(false);
  };

  const formataAlertErrorMsg = (error: any) => {
    let errorMessage = "not axios error";
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 403) {
        errorMessage = "Você não tem autorização para realizar essa ação";
      } else {
        errorMessage =
          "Ocorreu um erro ao tentar realizar essa ação: " +
          error?.response?.status +
          " - " +
          error.response?.statusText;
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
      <h2>Listagem de Produtos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Fornecedor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.id}</td>
              <td>{produto.nome}</td>
              <td>{produto.preco}</td>
              <td>{produto.quantidadeEstoque}</td>
              <td>{produto.fornecedor.nome}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleEditButtonClick(produto)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteButtonClick(produto)}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleAddButtonClick}>
        Adicionar Novo Produto
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
            <ForncedorForm
              addOrEditProduto={addOrEditProduto}
              editProduto={editProduto}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProdutoPage;
