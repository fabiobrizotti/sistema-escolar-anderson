import { z } from 'zod';

export const criarFrequenciaSchema = z.object({
  aluno_id: z.coerce.number().int().positive('Aluno invalido.'),
  data_aula: z.string().min(1, 'Data da aula e obrigatoria.'),
  presente: z.coerce.boolean(),
});

export const frequenciaQuerySchema = z.object({
  aluno_id: z.coerce.number().int().positive().optional(),
  data_aula: z.string().optional(),
  turma_id: z.coerce.number().int().positive().optional(),
});
