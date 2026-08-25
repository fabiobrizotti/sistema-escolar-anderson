import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useFrequencias() {
  const [frequencias, setFrequencias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async (filtros = {}) => {
    try {
      setCarregando(true);
      setErro(null);
      const params = new URLSearchParams();
      if (filtros.aluno_id) params.append('aluno_id', filtros.aluno_id);
      if (filtros.data_aula) params.append('data_aula', filtros.data_aula);
      if (filtros.turma_id) params.append('turma_id', filtros.turma_id);
      const query = params.toString();
      const data = await api.get(`/frequencias${query ? `?${query}` : ''}`);
      setFrequencias(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const nova = await api.post('/frequencias', dados);
    await carregar();
    return nova;
  }, [carregar]);

  const excluir = useCallback(async (id) => {
    await api.delete(`/frequencias/${id}`);
    await carregar();
  }, [carregar]);

  const buscarStats = useCallback(async (alunoId) => {
    return api.get(`/frequencias/stats/${alunoId}`);
  }, []);

  const buscarRanking = useCallback(async (turmaId) => {
    return api.get(`/frequencias/ranking/${turmaId}`);
  }, []);

  const buscarEmRisco = useCallback(async () => {
    return api.get('/frequencias/risco');
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return {
    frequencias,
    carregando,
    erro,
    cadastrar,
    excluir,
    buscarStats,
    buscarRanking,
    buscarEmRisco,
    recarregar: carregar,
  };
}
