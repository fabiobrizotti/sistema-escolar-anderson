import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { Usuario } from '../models/index.js';
import AppError from '../utils/AppError.js';
import auditoriaService from './auditoriaService.js';

function assinar(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil, disciplina: usuario.disciplina || null, aluno_id: usuario.aluno_id || null },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );
}

async function login({ email, senha }) {
  const usuario = await Usuario.findOne({ where: { email: email.toLowerCase().trim() } });
  const valido = usuario ? await bcrypt.compare(senha, usuario.senha_hash) : false;

  await auditoriaService.registrar({
    usuario_id: usuario?.id || null,
    usuario_nome: usuario?.nome || email,
    perfil: usuario?.perfil || null,
    operacao: valido ? 'LOGIN_OK' : 'LOGIN_FALHA',
    recurso: 'auth',
  });

  if (!valido) throw new AppError('Credenciais invalidas.', 401);

  const token = assinar(usuario);
  return {
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, disciplina: usuario.disciplina, aluno_id: usuario.aluno_id },
  };
}

export default { login, assinar };
