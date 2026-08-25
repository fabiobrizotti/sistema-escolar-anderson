import { Op } from 'sequelize';
import { Aluno, Frequencia, Turma } from '../models/index.js';
import AppError from '../utils/AppError.js';

const INCLUDE_ALUNO = {
  model: Aluno,
  as: 'aluno',
  attributes: ['id', 'nome', 'email', 'turma_id'],
  include: [{ model: Turma, as: 'turma', attributes: ['id', 'nome'] }],
};

class FrequenciaService {
  async listar(filtros = {}) {
    const where = {};
    if (filtros.aluno_id) where.aluno_id = filtros.aluno_id;
    if (filtros.data_aula) where.data_aula = filtros.data_aula;

    const include = [INCLUDE_ALUNO];
    if (filtros.turma_id) {
      include[0].where = {};
      include[0].include = [{ model: Turma, as: 'turma', where: { id: filtros.turma_id }, attributes: ['id', 'nome'] }];
    }

    return Frequencia.findAll({
      where,
      include,
      order: [['data_aula', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  async cadastrar(dados) {
    const aluno = await Aluno.findByPk(dados.aluno_id);
    if (!aluno) {
      throw new AppError('Aluno nao encontrado.', 404);
    }

    const existente = await Frequencia.findOne({
      where: { aluno_id: dados.aluno_id, data_aula: dados.data_aula },
    });

    if (existente) {
      existente.presente = dados.presente;
      await existente.save();
      return existente;
    }

    return Frequencia.create(dados);
  }

  async excluir(id) {
    const frequencia = await Frequencia.findByPk(id);
    if (!frequencia) {
      throw new AppError('Registro de frequencia nao encontrado.', 404);
    }
    await frequencia.destroy();
    return frequencia;
  }

  async statsAluno(alunoId) {
    const aluno = await Aluno.findByPk(alunoId, {
      include: [
        { model: Frequencia, as: 'frequencias', attributes: ['id', 'data_aula', 'presente'] },
        { model: Turma, as: 'turma', attributes: ['id', 'nome'] },
      ],
    });

    if (!aluno) {
      throw new AppError('Aluno nao encontrado.', 404);
    }

    const frequencias = aluno.frequencias || [];
    const totalAulas = frequencias.length;
    const presencas = frequencias.filter((f) => f.presente).length;
    const faltas = totalAulas - presencas;
    const percentual = totalAulas > 0 ? Math.round((presencas / totalAulas) * 10000) / 100 : 0;

    let classificacao;
    if (percentual >= 75) classificacao = 'Boa';
    else if (percentual >= 50) classificacao = 'Atencao';
    else classificacao = 'Risco';

    return {
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        turma: aluno.turma?.nome || 'Sem turma',
      },
      totalAulas,
      presencas,
      faltas,
      percentual,
      classificacao,
    };
  }

  async rankingTurma(turmaId) {
    const alunos = await Aluno.findAll({
      where: { turma_id: turmaId },
      include: [
        { model: Frequencia, as: 'frequencias', attributes: ['id', 'presente'] },
        { model: Turma, as: 'turma', attributes: ['id', 'nome'] },
      ],
    });

    const ranking = alunos.map((aluno) => {
      const frequencias = aluno.frequencias || [];
      const totalAulas = frequencias.length;
      const presencas = frequencias.filter((f) => f.presente).length;
      const percentual = totalAulas > 0 ? Math.round((presencas / totalAulas) * 10000) / 100 : 0;

      let classificacao;
      if (percentual >= 75) classificacao = 'Boa';
      else if (percentual >= 50) classificacao = 'Atencao';
      else classificacao = 'Risco';

      return {
        id: aluno.id,
        nome: aluno.nome,
        totalAulas,
        presencas,
        faltas: totalAulas - presencas,
        percentual,
        classificacao,
      };
    });

    ranking.sort((a, b) => b.percentual - a.percentual);

    return {
      turma: alunos[0]?.turma?.nome || 'Desconhecida',
      ranking,
    };
  }

  async alunosEmRisco() {
    const alunos = await Aluno.findAll({
      include: [
        { model: Frequencia, as: 'frequencias', attributes: ['id', 'presente'] },
        { model: Turma, as: 'turma', attributes: ['id', 'nome'] },
      ],
    });

    const emRisco = [];

    for (const aluno of alunos) {
      const frequencias = aluno.frequencias || [];
      const totalAulas = frequencias.length;
      if (totalAulas === 0) continue;

      const presencas = frequencias.filter((f) => f.presente).length;
      const percentual = Math.round((presencas / totalAulas) * 10000) / 100;

      if (percentual < 75) {
        let classificacao;
        if (percentual >= 50) classificacao = 'Atencao';
        else classificacao = 'Risco';

        emRisco.push({
          id: aluno.id,
          nome: aluno.nome,
          turma: aluno.turma?.nome || 'Sem turma',
          totalAulas,
          presencas,
          faltas: totalAulas - presencas,
          percentual,
          classificacao,
        });
      }
    }

    emRisco.sort((a, b) => a.percentual - b.percentual);
    return emRisco;
  }
}

export default new FrequenciaService();
