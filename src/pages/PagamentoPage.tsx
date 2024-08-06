import React, { useState, useEffect, useReducer } from 'react';
import { request, setAuthHeader } from '../helpers/axios_helper';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import PagamentoForm from '../pages/forms/PagamentoForm';

interface Pedido {
  id: number;
  cpfCliente: string;
  itens: {
    codigoProduto: number;
    nome: string;
    quantidade: number;
    preco: number;
  }[];
  desconto: number;
  valorTotal: number;
  status: 'PENDENTE' | 'PAGO';
}

const PagamentoPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request('GET', '/api/pedido', {});
        setPedidos(response.data);
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

  const handleViewPedidoClick = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPedido(null);
  };

  const updatePedidoStatus = (pedidoId: number) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, status: 'PAGO' } : pedido
      )
    );
  };

  return (
    <div className="container">
      <h2>Listagem de Pedidos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID do Pedido</th>
            <th>CPF do Cliente</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.cpfCliente}</td>
              <td>{pedido.status}</td>
              <td>
                <button className="btn btn-secondary" onClick={() => handleViewPedidoClick(pedido)}>
                  Ver Pedido
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedPedido && (
        <div className="modal fade show d-block modal-custom" tabIndex={-1} role="dialog" aria-labelledby="pedidoModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="pedidoModalLabel">Detalhes do Pedido</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <h6>Itens do Pedido</h6>
                <ul>
                  {selectedPedido.itens.map((item) => (
                    <li key={item.codigoProduto}>
                      {item.nome} - Quantidade: {item.quantidade} - Preço: R$ {item.preco.toFixed(2)}
                    </li>
                  ))}
                </ul>
                {selectedPedido.status === 'PENDENTE' && (
                  <PagamentoForm 
                    pedido={selectedPedido} 
                    closeModal={closeModal} 
                    onPaymentConfirmed={() => {
                      updatePedidoStatus(selectedPedido.id);
                      closeModal();
                    }} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagamentoPage;
