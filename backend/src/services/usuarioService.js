import bcrypt from 'bcryptjs';
import { Aluno, Usuario } from '../models/index.js';
import AppError from '../utils/AppError.js';
import auditoriaService from './auditoriaService.js';

class UsuarioService {
  async listar() {
    return Usuario.findAll({
      attributes: ['id', 'nome', 'email', 'perfil', 'disciplina', 'aluno_id', 'createdAt'],
      order: [['nome', 'ASC']],
    });
  }

  async criar({ nome, email, senha, perfil, disciplina, aluno_id }, usuarioLogado) {
    if (aluno_id) {
      const aluno = await Aluno.findByPk(aluno_id);
      if (!aluno) throw new AppError('Aluno nao encontrado.', 404);
    }
    try {
      const novo = await Usuario.create({
        nome,
        email,
        senha_hash: await bcrypt.hash(senha, 10),
        perfil,
        disciplina: disciplina || null,
        aluno_id: aluno_id || null,
      });
      if (usuarioLogado) {
        auditoriaService.registrar({
          usuario_id: usuarioLogado.id, usuario_nome: usuarioLogado.nome, perfil: usuarioLogado.perfil,
          operacao: 'USUARIO_CRIADO', recurso: 'usuarios', recurso_id: String(novo.id),
          detalhes: { email: novo.email, perfil: novo.perfil },
        });
      }
      return novo;
    } catch (erro) {
      if (erro.name === 'SequelizeUniqueConstraintError') {
        throw new AppError('E-mail ou aluno ja possui conta.', 409);
      }
      throw erro;
    }
  }
}

export default new UsuarioService();
