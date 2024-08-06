import React, { useState, useEffect } from "react";
import { request } from "../../helpers/axios_helper";

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

interface PedidoFormProps {
  addPedido: (pedido: PedidoItem[], cpfCliente: string) => Promise<void>;
}

const PedidoForm: React.FC<PedidoFormProps> = ({ addPedido }) => {
  const [pedidoForm, setPedidoForm] = useState<PedidoItem[]>([]);
  const [cpfCliente, setCpfCliente] = useState<string>("");
  const [produtos, setProdutos] = useState<Produto[] | null>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request("GET", "/api/produto", {});
        setProdutos(response.data);
      } catch (error: any) {
        if (error.response.status === 403) {
          setProdutos([
            {
              id: 0,
              nome: "Não foi possível carregar os produtos",
              preco: 0,
              quantidadeEstoque: 0,
              fornecedor: { id: 0, nome: "" },
            },
          ]);
        }
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    produtoId: number
  ) => {
    const { name, value } = e.target;
    const newPedidoForm = pedidoForm.map((item) => {
      if (item.produto === produtoId) {
        return { ...item, [name]: Number(value) };
      }
      return item;
    });
    setPedidoForm(newPedidoForm);
  };

  const handleAddProduto = (produtoId: number) => {
    if (!pedidoForm.some((item) => item.produto === produtoId)) {
      setPedidoForm((prev) => [...prev, { produto: produtoId, quantidade: 1 }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpfCliente && pedidoForm.length > 0) {
      addPedido(pedidoForm, cpfCliente);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>CPF Cliente</label>
        <input
          type="text"
          className="form-control"
          value={cpfCliente}
          onChange={(e) => setCpfCliente(e.target.value)}
          required
        />
        <h4>Adicionar Produtos</h4>
        {produtos?.map((produto) => (
          <div key={produto.id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`produto-${produto.id}`}
              onChange={() => handleAddProduto(produto.id)}
              checked={pedidoForm.some((item) => item.produto === produto.id)}
            />
            <label className="form-check-label" htmlFor={`produto-${produto.id}`}>
              {produto.nome} - R$ {produto.preco}
            </label>
            {pedidoForm.some((item) => item.produto === produto.id) && (
              <input
                type="number"
                className="form-control"
                name="quantidade"
                value={
                  pedidoForm.find((item) => item.produto === produto.id)
                    ?.quantidade ?? 1
                }
                onChange={(e) => handleChange(e, produto.id)}
                min="1"
                max={produto.quantidadeEstoque}
                required
              />
            )}
          </div>
        ))}
      </div>
      <br />
      <button type="submit" className="btn btn-success">
        Criar Pedido
      </button>
    </form>
  );
};

export default PedidoForm;
