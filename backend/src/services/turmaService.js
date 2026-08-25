import { Aluno, Turma } from '../models/index.js';
import AppError from '../utils/AppError.js';

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

  async cadastrar(dados) {
    const existente = await Turma.findOne({ where: dados });
    if (existente) {
      throw new AppError('Esta turma ja esta cadastrada para este ano letivo.', 409);
    }

    try {
      return await Turma.create(dados);
    } catch (erro) {
      if (erro.name === 'SequelizeUniqueConstraintError') {
        throw new AppError('Esta turma ja esta cadastrada para este ano letivo.', 409);
      }
      throw erro;
    }
  }

  async vincularAluno(turmaId, alunoId) {
    const [turma, aluno] = await Promise.all([
      Turma.findByPk(turmaId),
      Aluno.findByPk(alunoId),
    ]);

    if (!turma) throw new AppError('Turma nao encontrada.', 404);
    if (!aluno) throw new AppError('Aluno nao encontrado.', 404);

    aluno.turma_id = turma.id;
    await aluno.save();

    return aluno;
  }

  async listarAlunos(turmaId) {
    const turma = await Turma.findByPk(turmaId, { include: [INCLUDE_ALUNOS] });
    if (!turma) throw new AppError('Turma nao encontrada.', 404);
    return turma;
  }
}

export default new TurmaService();
