import React, { useState, useEffect } from "react";
import { request } from "../../helpers/axios_helper";

interface Fornecedor {
  id: number;
  nome: string;
}

interface Funcionario {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
  fornecedor: { id: number; nome: string };
}

interface Item {
  produto: Produto;
  quantidade: number;
}

interface RemessaFormProps {
  addOrEditRemessa: (remessa: {
    fornecedorId: number;
    funcionarioId: number;
    itens: {
      produtoId: number;
      quantidade: number;
    }[];
  }) => Promise<void>;
  editRemessa: {
    fornecedor: Fornecedor;
    funcionario: Funcionario;
    itens: Item[];
  } | null;
}

const RemessaForm: React.FC<RemessaFormProps> = ({
  addOrEditRemessa,
  editRemessa,
}) => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [remessaForm, setRemessaForm] = useState<{ produtoId: number; quantidade: number }[]>([]);

  const [formState, setFormState] = useState({
    fornecedorId: "",
    funcionarioId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fornecedoresData = await request("GET", "/api/fornecedor", {});
        setFornecedores(fornecedoresData.data);

        const funcionariosData = await request("GET", "/api/funcionario", {});
        setFuncionarios(funcionariosData.data);

        const produtosData = await request("GET", "/api/produto", {});
        setProdutos(produtosData.data);
      } catch (error: any) {
        console.error("Erro ao carregar os dados: ", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editRemessa) {
      setFormState({
        fornecedorId: editRemessa.fornecedor.id.toString(),
        funcionarioId: editRemessa.funcionario.id.toString(),
      });

      setRemessaForm(editRemessa.itens.map(item => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
      })));
    }
  }, [editRemessa]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    produtoId: number
  ) => {
    const { name, value } = e.target;
    setRemessaForm(prevForm =>
      prevForm.map(item =>
        item.produtoId === produtoId ? { ...item, [name]: Number(value) } : item
      )
    );
  };

  const handleAddProduto = (produtoId: number) => {
    if (!remessaForm.some(item => item.produtoId === produtoId)) {
      const produto = produtos.find(p => p.id === produtoId);
      if (produto) {
        setRemessaForm(prev => [
          ...prev,
          { produtoId: produto.id, quantidade: 1 },
        ]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.fornecedorId && formState.funcionarioId && remessaForm.length > 0) {
      addOrEditRemessa({
        fornecedorId: Number(formState.fornecedorId),
        funcionarioId: Number(formState.funcionarioId),
        itens: remessaForm,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Fornecedor</label>
        <select
          className="form-control"
          value={formState.fornecedorId}
          onChange={(e) => setFormState({ ...formState, fornecedorId: e.target.value })}
          required
        >
          <option value="">Selecione um Fornecedor</option>
          {fornecedores.map((fornecedor) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Funcionário</label>
        <select
          className="form-control"
          value={formState.funcionarioId}
          onChange={(e) => setFormState({ ...formState, funcionarioId: e.target.value })}
          required
        >
          <option value="">Selecione um Funcionário</option>
          {funcionarios.map((funcionario) => (
            <option key={funcionario.id} value={funcionario.id}>
              {funcionario.nome}
            </option>
          ))}
        </select>
      </div>
      <h4>Adicionar Produtos</h4>
      {produtos.map((produto) => (
        <div key={produto.id} className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`produto-${produto.id}`}
            onChange={() => handleAddProduto(produto.id)}
            checked={remessaForm.some(item => item.produtoId === produto.id)}
          />
          <label className="form-check-label" htmlFor={`produto-${produto.id}`}>
            {produto.nome}
          </label>
          {remessaForm.some(item => item.produtoId === produto.id) && (
            <input
              type="number"
              className="form-control"
              name="quantidade"
              value={remessaForm.find(item => item.produtoId === produto.id)?.quantidade ?? 1}
              onChange={(e) => handleChange(e, produto.id)}
              min="1"
              max={produto.quantidadeEstoque}
              required
            />
          )}
        </div>
      ))}
      <br />
      <button type="submit" className="btn btn-success">
        Salvar Remessa
      </button>
    </form>
  );
};

export default RemessaForm;
