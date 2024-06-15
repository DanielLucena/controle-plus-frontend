import React, { useState, useEffect } from 'react';

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
}

interface ClienteFormProps {
  addOrEditCliente: (cliente: Cliente) => void;
  editCliente: Cliente | null;
  closeModal: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ addOrEditCliente, editCliente, closeModal }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');

  useEffect(() => {
    if (editCliente) {
      setNome(editCliente.nome);
      setCpf(editCliente.cpf);
    }
  }, [editCliente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome && cpf) {
      const novoCliente: Cliente = {
        id: editCliente ? editCliente.id : 0,
        nome,
        cpf,
      };
      addOrEditCliente(novoCliente);
      setNome('');
      setCpf('');
      closeModal();
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
      <div className="form-group">
        <label>CPF</label>
        <input
          type="text"
          className="form-control"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
      </div><br/>
      <button type="submit" className="btn btn-success">
        {editCliente ? 'Salvar' : 'Adicionar'}
      </button>
    </form>
  );
};

export default ClienteForm;
