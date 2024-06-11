import React, { useState, useEffect } from 'react';

interface Forncedor {
  id: number;
  nome: string;
}

interface ForncedorFormProps {
  addOrEditForncedor: (forncedor: Forncedor) => void;
  editForncedor: Forncedor | null;
}

const ForncedorForm: React.FC<ForncedorFormProps> = ({ addOrEditForncedor, editForncedor }) => {
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (editForncedor) {
      setNome(editForncedor.nome);
    }
  }, [editForncedor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome ) {
      const novoForncedor: Forncedor = {
        id: editForncedor ? editForncedor.id : 0,
        nome,
      };
      addOrEditForncedor(novoForncedor);
      setNome('');
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
        {editForncedor ? 'Salvar' : 'Adicionar'}
      </button>
    </form>
  );
};

export default ForncedorForm;
