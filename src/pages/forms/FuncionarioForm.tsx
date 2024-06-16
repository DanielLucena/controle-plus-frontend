import React, { useState, useEffect } from 'react';

interface Funcionario {
  id: number;
  nome: string;
  funcao: 'gerente' | 'caixa';
}

interface FuncionarioFormProps {
  addOrEditFuncionario: (funcionario: Funcionario) => void;
  editFuncionario: Funcionario | null;
  closeModal: () => void;
}

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({ addOrEditFuncionario, editFuncionario, closeModal }) => {
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState<'gerente' | 'caixa'>('gerente');

  useEffect(() => {
    if (editFuncionario) {
      setNome(editFuncionario.nome);
      setFuncao(editFuncionario.funcao);
    }
  }, [editFuncionario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome && funcao) {
      const novoFuncionario: Funcionario = {
        id: editFuncionario ? editFuncionario.id : 0,
        nome,
        funcao,
      };
      addOrEditFuncionario(novoFuncionario);
      setNome('');
      setFuncao('gerente');
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
        <label>Função</label>
        <select
          className="form-control"
          value={funcao}
          onChange={(e) => setFuncao(e.target.value as 'gerente' | 'caixa')}
          required
        >
          <option value="gerente">Gerente</option>
          <option value="caixa">Caixa</option>
        </select>
      </div><br/>
      <button type="submit" className="btn btn-success">
        {editFuncionario ? 'Salvar' : 'Adicionar'}
      </button>
    </form>
  );
};

export default FuncionarioForm;
