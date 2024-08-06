import React, { useEffect, useReducer, useState } from "react";
import PedidoForm from "./forms/PedidoForm";
import { request, setAuthHeader } from "../helpers/axios_helper";
import axios from "axios";
import "./style/modal.css";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
  fornecedor: { id: number; nome: string };
}

interface PedidoItem {
  produto: number;
  quantidade: number;
}

interface Pedido {
  id: number;
  cpfCliente: string;
  valorTotal: number;
  status: string;
  produtosPedido: {
    id: { produtoId: number | null; pedidoId: number | null };
    produto: Produto;
    quantidade: number;
  }[];
}

function PedidoPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request("GET", "/pedido", {});
        setPedidos(response.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          setAuthHeader(null);
        } else {
          setPedidos([error.response.code]);
        }
      }
    };

    fetchData();
  }, [reducerValue]);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [alert, setAlert] = useState<string | null>(null);

  const addPedido = async (pedido: PedidoItem[], cpfCliente: string) => {
    setAlert(null);
    try {
      await request("POST", "/pedido", {
        cpfCliente: cpfCliente,
        usandoCashback: false,
        itens: pedido,
      });
      forceUpdate();
    } catch (error) {
      formataAlertErrorMsg(error);
    }
    setShowForm(false);
  };

  const handleAddButtonClick = () => {
    setShowForm(true);
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
          "Erro " +
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
      <h2>Listagem de Pedidos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>CPF Cliente</th>
            <th>Valor Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.cpfCliente}</td>
              <td>{pedido.valorTotal}</td>
              <td>{pedido.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleAddButtonClick}>
        Adicionar Novo Pedido
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
            <PedidoForm addPedido={addPedido} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PedidoPage;
