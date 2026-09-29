import { z } from 'zod';

export const criarFrequenciaSchema = z.object({
  aluno_id: z.coerce.number().int().positive('Aluno invalido.'),
  data_aula: z.string().min(1, 'Data da aula e obrigatoria.'),
  presente: z.coerce.boolean(),
  disciplina: z.string().trim().optional().nullable(),
  turma_id: z.coerce.number().int().positive().optional().nullable(),
  numero_aula: z.coerce.number().int().min(1).max(10).optional(),
  quantidade_aulas: z.coerce.number().int().min(1).max(10).optional().nullable(),
  plano_aula: z.string().trim().max(255).optional().nullable(),
});

export const chamadaSchema = z.object({
  turma_id: z.coerce.number().int().positive('Turma invalida.'),
  data_aula: z.string().min(1, 'Data da aula e obrigatoria.'),
  disciplina: z.string().min(1, 'Disciplina e obrigatoria.').trim(),
  quantidade_aulas: z.coerce.number().int().min(1, 'Quantidade invalida.').max(10, 'Maximo 10 aulas.'),
  plano_aula: z.string().trim().max(255).optional().nullable(),
  faltas: z.array(
    z.object({
      aluno_id: z.coerce.number().int().positive(),
      aulas: z.array(z.coerce.number().int().min(1).max(10)).default([]),
    }),
  ).default([]),
});

export const frequenciaQuerySchema = z.object({
  aluno_id: z.coerce.number().int().positive().optional(),
  data_aula: z.string().optional(),
  turma_id: z.coerce.number().int().positive().optional(),
});
