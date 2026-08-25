import { useState, useCallback } from 'react';
import api from '../services/api';

export function useVincular() {
  const [vinculando, setVinculando] = useState(false);
  const [erro, setErro] = useState(null);

  const vincular = useCallback(async (turmaId, alunoId) => {
    try {
      setVinculando(true);
      setErro(null);
      const aluno = await api.post(`/turmas/${turmaId}/alunos`, { alunoId });
      return aluno;
    } catch (error) {
      setErro(error.message);
      throw error;
    } finally {
      setVinculando(false);
    }
  }, []);

  return { vincular, vinculando, erro };
}
