import React, { useState, useEffect } from "react";

interface Fornecedor {
  id: number;
  nome: string;
}

interface FornecedorFormProps {
  addOrEditFornecedor: (fornecedor: Fornecedor) => void;
  editFornecedor: Fornecedor | null;
}

const FornecedorForm: React.FC<FornecedorFormProps> = ({
  addOrEditFornecedor,
  editFornecedor,
}) => {
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (editFornecedor) {
      setNome(editFornecedor.nome);
    }
  }, [editFornecedor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome) {
      const novoFornecedor: Fornecedor = {
        id: editFornecedor ? editFornecedor.id : 0,
        nome,
      };
      addOrEditFornecedor(novoFornecedor);
      setNome("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          className="form-control"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-success">
        {editFornecedor ? "Salvar" : "Adicionar"}
      </button>
    </form>
  );
};

export default FornecedorForm;
