import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const data = await api.get('/alunos');
      setAlunos(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const novoAluno = await api.post('/alunos', dados);
    await carregar();
    return novoAluno;
  }, [carregar]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const alunosSemTurma = alunos.filter((aluno) => !aluno.turma_id);

  return { alunos, alunosSemTurma, carregando, erro, cadastrar, recarregar: carregar };
}
