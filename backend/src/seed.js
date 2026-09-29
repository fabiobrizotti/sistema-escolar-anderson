import bcrypt from 'bcryptjs';
import env from './config/env.js';
import { Usuario } from './models/index.js';

// ponytail: seed simples via ORM; upgrade para migrations versionadas quando o schema estabilizar.
async function garantirAdmin() {
  const existente = await Usuario.findOne({ where: { email: env.SEED_ADMIN_EMAIL } });
  if (existente) return existente;
  return Usuario.create({
    nome: 'Administrador',
    email: env.SEED_ADMIN_EMAIL,
    senha_hash: await bcrypt.hash(env.SEED_ADMIN_SENHA, 10),
    perfil: 'admin',
  });
}

export default garantirAdmin;
