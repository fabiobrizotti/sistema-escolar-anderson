import { z } from 'zod';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const TurmaIdSchema = z.preprocess(
  (val) => (val === '' || val === undefined ? null : val),
  z.coerce.number().int().positive('Turma invalida.').nullable().optional(),
);

export const criarAlunoSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio.').trim(),
  email: z.string().email('E-mail invalido.').trim().toLowerCase(),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento invalida.'),
  serie: z.string().min(1, 'Serie e obrigatoria.').trim().optional(),
  turma_id: TurmaIdSchema,
  cpf: z.string().regex(cpfRegex, 'CPF invalido.').optional().nullable(),
  telefone: z.string().min(1).trim().optional().nullable(),
  endereco: z.string().min(1).trim().optional().nullable(),
});
