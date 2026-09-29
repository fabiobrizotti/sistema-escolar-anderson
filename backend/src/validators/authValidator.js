import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Usuario/e-mail e obrigatorio.').trim(),
  senha: z.string().min(1, 'Senha e obrigatoria.'),
});
