import { Aluno, Turma } from '../models/index.js';
import AppError from '../utils/AppError.js';

class AlunoService {
  async listar() {
    return Aluno.findAll({
      include: [{ model: Turma, as: 'turma', attributes: ['id', 'nome', 'serie', 'ano'] }],
      order: [['nome', 'ASC']],
    });
  }

  async cadastrar(dados) {
    const registro = { ...dados };

    if (registro.turma_id) {
      const turma = await Turma.findByPk(registro.turma_id);
      if (!turma) {
        throw new AppError('A turma selecionada nao existe.', 404);
      }
      registro.serie = turma.serie;
    }

    if (!registro.serie) {
      throw new AppError('Selecione uma turma ou informe a serie do aluno.');
    }

    try {
      return await Aluno.create(registro);
    } catch (erro) {
      if (erro.name === 'SequelizeUniqueConstraintError') {
        throw new AppError('Ja existe um aluno cadastrado com este e-mail ou CPF.', 409);
      }
      throw erro;
    }
  }
}

export default new AlunoService();
