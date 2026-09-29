import { Aluno, Turma } from '../models/index.js';
import AppError from '../utils/AppError.js';
import auditoriaService from './auditoriaService.js';

function auditar(usuario, operacao, recurso, recurso_id, detalhes) {
  if (!usuario) return;
  auditoriaService.registrar({
    usuario_id: usuario.id, usuario_nome: usuario.nome, perfil: usuario.perfil,
    operacao, recurso, recurso_id: recurso_id ? String(recurso_id) : null, detalhes,
  });
}

const INCLUDE_ALUNOS = {
  model: Aluno,
  as: 'alunos',
  attributes: ['id', 'nome', 'email', 'serie'],
};

class TurmaService {
  async listar() {
    return Turma.findAll({
      include: [INCLUDE_ALUNOS],
      order: [['nome', 'ASC']],
    });
  }

  async cadastrar(dados, usuario) {
    const existente = await Turma.findOne({ where: dados });
    if (existente) {
      throw new AppError('Esta turma ja esta cadastrada para este ano letivo.', 409);
    }

    try {
      const turma = await Turma.create(dados);
      auditar(usuario, 'TURMA_CRIADA', 'turmas', turma.id, { nome: turma.nome });
      return turma;
    } catch (erro) {
      if (erro.name === 'SequelizeUniqueConstraintError') {
        throw new AppError('Esta turma ja esta cadastrada para este ano letivo.', 409);
      }
      throw erro;
    }
  }

  async vincularAluno(turmaId, alunoId, usuario) {
    const [turma, aluno] = await Promise.all([
      Turma.findByPk(turmaId),
      Aluno.findByPk(alunoId),
    ]);

    if (!turma) throw new AppError('Turma nao encontrada.', 404);
    if (!aluno) throw new AppError('Aluno nao encontrado.', 404);

    aluno.turma_id = turma.id;
    await aluno.save();
    auditar(usuario, 'ALUNO_VINCULADO', 'turmas', turma.id, { aluno_id: aluno.id });

    return aluno;
  }

  async listarAlunos(turmaId) {
    const turma = await Turma.findByPk(turmaId, { include: [INCLUDE_ALUNOS] });
    if (!turma) throw new AppError('Turma nao encontrada.', 404);
    return turma;
  }
}

export default new TurmaService();
