import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useNotas() {
  const [notas, setNotas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async (filtros = {}) => {
    try {
      setCarregando(true);
      setErro(null);
      const params = new URLSearchParams();
      if (filtros.aluno_id) params.append('aluno_id', filtros.aluno_id);
      if (filtros.disciplina) params.append('disciplina', filtros.disciplina);
      if (filtros.bimestre) params.append('bimestre', filtros.bimestre);
      const query = params.toString();
      const data = await api.get(`/notas${query ? `?${query}` : ''}`);
      setNotas(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const novaNota = await api.post('/notas', dados);
    await carregar();
    return novaNota;
  }, [carregar]);

  const excluir = useCallback(async (id) => {
    await api.delete(`/notas/${id}`);
    await carregar();
  }, [carregar]);

  const buscarBoletim = useCallback(async (alunoId) => {
    return api.get(`/boletim/${alunoId}`);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { notas, carregando, erro, cadastrar, excluir, buscarBoletim, recarregar: carregar };
}
