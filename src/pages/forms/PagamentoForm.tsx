import React, { useState } from 'react';
import { request } from '../../helpers/axios_helper';

interface PagamentoFormProps {
  pedido: {
    id: number;
    valorTotal: number;
  };
  closeModal: () => void;
  onPaymentConfirmed: () => void;
}

const PagamentoForm: React.FC<PagamentoFormProps> = ({ pedido, closeModal, onPaymentConfirmed }) => {
  const [formaPagamento, setFormaPagamento] = useState<'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'DINHEIRO' | 'PIX'>('CARTAO_CREDITO');
  const [troco, setTroco] = useState<number>(0);
  const [isUsandoCashback, setIsUsandoCashback] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('POST', `/pagamento`, {
        pedidoId: pedido.id,
        tipoPagamento: formaPagamento,
        valor: pedido.valorTotal,
        troco,
        isUsandoCashback,
      });
      onPaymentConfirmed();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Valor Total</label>
        <input
          type="number"
          className="form-control"
          value={pedido.valorTotal}
          readOnly
        />
      </div>
      <div className="form-group">
        <label>Forma de Pagamento</label>
        <select
          className="form-control"
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value as 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'DINHEIRO' | 'PIX')}
        >
          <option value="CARTAO_CREDITO">Cartão de Crédito</option>
          <option value="CARTAO_DEBITO">Cartão de Débito</option>
          <option value="DINHEIRO">Dinheiro</option>
          <option value="PIX">Pix</option>
        </select>
      </div>
      {formaPagamento === 'DINHEIRO' && (
        <div className="form-group">
          <label>Troco</label>
          <input
            type="number"
            className="form-control"
            value={troco}
            onChange={(e) => setTroco(parseFloat(e.target.value))}
          />
        </div>
      )}
      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={isUsandoCashback}
          onChange={(e) => setIsUsandoCashback(e.target.checked)}
        />
        <label className="form-check-label">Usar Cashback</label>
      </div>
      <button type="submit" className="btn btn-success mt-3">Confirmar Pagamento</button>
    </form>
  );
};

export default PagamentoForm;
