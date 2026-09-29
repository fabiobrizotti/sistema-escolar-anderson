import { z } from 'zod';

export const criarUsuarioSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio.').trim(),
  email: z.string().email('E-mail invalido.').trim().toLowerCase(),
  senha: z.string().min(4, 'Senha deve ter ao menos 4 caracteres.'),
  perfil: z.enum(['admin', 'professor', 'aluno']).default('professor'),
  disciplina: z.string().trim().optional().nullable(),
  aluno_id: z.coerce.number().int().positive().optional().nullable(),
});
