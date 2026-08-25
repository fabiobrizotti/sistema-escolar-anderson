import { z } from 'zod';

export const criarTurmaSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio.').trim(),
  serie: z.string().min(1, 'Serie e obrigatoria.').trim(),
  ano: z.preprocess(
    (val) => String(val),
    z.string().regex(/^\d{4}$/, 'Ano deve ter 4 digitos.'),
  ),
});

export const vincularAlunoSchema = z.object({
  alunoId: z.coerce.number().int().positive('Aluno invalido.'),
});
