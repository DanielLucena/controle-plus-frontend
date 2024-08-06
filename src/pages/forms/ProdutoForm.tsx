import React, { useState, useEffect } from "react";
import { request } from "../../helpers/axios_helper";

interface Fornecedor {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: string;
  quantidadeEstoque: string;
  fornecedor: { id: number; nome: string };
}

interface ProdutoForm {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  fornecedorId: number;
}

interface ProdutoFormProps {
  addOrEditProduto: (produto: ProdutoForm) => Promise<void>;
  editProduto: Produto | null;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({
  addOrEditProduto,
  editProduto,
}) => {
  const [produtoForm, setProdutoForm] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    fornecedorId: "",
  });

  const [fornecedores, setFornecedores] = useState<Fornecedor[] | null>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request("GET", "/api/fornecedor", {});
        setFornecedores(response.data);
      } catch (error: any) {
        if (error.response.status === 403) {
          if (editProduto !== null) {
            setFornecedores([editProduto!.fornecedor]);
          } else {
            setFornecedores([
              { id: 0, nome: "Não foi possivel carregar os fornecedores" },
            ]);
          }
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editProduto) {
      setProdutoForm({
        ...produtoForm,
        nome: editProduto.nome,
        preco: editProduto.preco,
        quantidade: editProduto.quantidadeEstoque,
        fornecedorId: editProduto.fornecedor.id.toString(),
      });
    }
  }, [editProduto]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProdutoForm({
      ...produtoForm,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      produtoForm.nome &&
      produtoForm.preco &&
      produtoForm.quantidade &&
      produtoForm.fornecedorId
    ) {
      const novoProduto: ProdutoForm = {
        id: editProduto ? editProduto.id : 0,
        nome: produtoForm.nome,
        preco: +produtoForm.preco,
        quantidade: +produtoForm.quantidade,
        fornecedorId: +produtoForm.fornecedorId,
      };
      addOrEditProduto(novoProduto);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          className="form-control"
          value={produtoForm.nome}
          name="nome"
          onChange={handleChange}
          required
        />
        <label>Preço</label>
        <input
          type="number"
          className="form-control"
          value={produtoForm.preco}
          name="preco"
          onChange={handleChange}
          required
        />
        <label>Quantidade em estoque</label>
        <input
          type="number"
          className="form-control"
          value={produtoForm.quantidade}
          name="quantidade"
          onChange={handleChange}
          required
        />
        <div>
          <label>Escolha uma opção: </label>
          <select
            className="form-control"
            value={produtoForm.fornecedorId}
            onChange={(e) =>
              setProdutoForm({
                ...produtoForm,
                fornecedorId: e.target.value,
              })
            }
            required
          >
            <option value="">Selecione</option>
            {fornecedores?.map((opcao) => (
              <option key={opcao.id} value={opcao.id}>
                {opcao.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
      <br />
      <button type="submit" className="btn btn-success">
        {editProduto ? "Salvar" : "Adicionar"}
      </button>
    </form>
  );
};

export default ProdutoForm;
