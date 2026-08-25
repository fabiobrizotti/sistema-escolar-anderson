import { z } from 'zod';

export const criarNotaSchema = z.object({
  aluno_id: z.coerce.number().int().positive('Aluno invalido.'),
  disciplina: z.string().min(1, 'Disciplina e obrigatoria.').trim(),
  bimestre: z.coerce.number().int().min(1, 'Bimestre invalido.').max(4, 'Bimestre invalido.'),
  nota: z.coerce.number().min(0, 'Nota minima e 0.').max(10, 'Nota maxima e 10.'),
});

export const boletimQuerySchema = z.object({
  aluno_id: z.coerce.number().int().positive('Aluno invalido.').optional(),
});
