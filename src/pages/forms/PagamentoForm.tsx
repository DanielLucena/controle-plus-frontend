import React, { useState } from 'react';
import { request } from '../../helpers/axios_helper';

interface PagamentoFormProps {
  pedido: {
    id: number;
    valorTotal: number;
  };
  closeModal: () => void;
}

const PagamentoForm: React.FC<PagamentoFormProps> = ({ pedido, closeModal }) => {
  const [formaPagamento, setFormaPagamento] = useState<'cartaoCredito' | 'cartaoDebito' | 'dinheiro' | 'pix'>('cartaoCredito');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('POST', `/pagamento`, {
        formaPagamento,
      });
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Valor Total</label>
        <input type="text" className="form-control" value={pedido.valorTotal.toFixed(2)} readOnly />
      </div>
      <div className="form-group">
        <label>Forma de Pagamento</label>
        <select className="form-control" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as any)} required>
          <option value="cartaoCredito">Cartão de Crédito</option>
          <option value="cartaoDebito">Cartão de Débito</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="pix">Pix</option>
        </select>
      </div>
      <button type="submit" className="btn btn-success">Confirmar Pagamento</button>
    </form>
  );
};

export default PagamentoForm;
