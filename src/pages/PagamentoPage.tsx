import React, { useState, useEffect } from 'react';
import { request, setAuthHeader } from '../helpers/axios_helper';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import PagamentoForm from "../pages/forms/PagamentoForm";

interface Pedido {
  id: number;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  itens: string[];
  valorTotal: number;
}

const PagamentoPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [showPedido, setShowPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request('GET', '/pedido', {});
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
  }, []);

  const closeModal = () => {
    setShowPedido(null);
  };

  return (
    <div className="container">
      <h2>Listagem de Pedidos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Pedidos</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>
                <button className="btn btn-info" onClick={() => setShowPedido(pedido)}>Ver Pedido</button>
              </td>
              <td>{pedido.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPedido && (
        <div className="modal fade show d-block modal-custom" tabIndex={-1} role="dialog" aria-labelledby="pedidoModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="pedidoModalLabel">Itens do Pedido</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <ul>
                  {showPedido.itens.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                {showPedido.status === 'PENDENTE' && (
                  <>
                    <hr />
                    <PagamentoForm pedido={showPedido} closeModal={closeModal} />
                  </>
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
