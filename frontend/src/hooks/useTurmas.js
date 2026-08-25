import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const data = await api.get('/turmas');
      setTurmas(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const novaTurma = await api.post('/turmas', dados);
    await carregar();
    return novaTurma;
  }, [carregar]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { turmas, carregando, erro, cadastrar, recarregar: carregar };
}
