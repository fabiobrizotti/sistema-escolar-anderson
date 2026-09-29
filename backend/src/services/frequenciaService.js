import { Op } from 'sequelize';
import { Aluno, Frequencia, Turma } from '../models/index.js';
import AppError from '../utils/AppError.js';
import auditoriaService from './auditoriaService.js';

const INCLUDE_ALUNO = {
  model: Aluno,
  as: 'aluno',
  attributes: ['id', 'nome', 'email', 'turma_id'],
  include: [{ model: Turma, as: 'turma', attributes: ['id', 'nome'] }],
};

function auditar(usuario, operacao, recurso, recurso_id, detalhes) {
  if (!usuario) return;
  auditoriaService.registrar({
    usuario_id: usuario.id,
    usuario_nome: usuario.nome,
    perfil: usuario.perfil,
    operacao,
    recurso,
    recurso_id: recurso_id ? String(recurso_id) : null,
    detalhes,
  });
}

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

  async cadastrar(dados, usuario) {
    const aluno = await Aluno.findByPk(dados.aluno_id);
    if (!aluno) {
      throw new AppError('Aluno nao encontrado.', 404);
    }

    const existente = await Frequencia.findOne({
      where: { aluno_id: dados.aluno_id, data_aula: dados.data_aula, disciplina: dados.disciplina || null, numero_aula: dados.numero_aula || 1 },
    });

    let registro;
    if (existente) {
      existente.presente = dados.presente;
      await existente.save();
      registro = existente;
    } else {
      registro = await Frequencia.create({ numero_aula: 1, ...dados });
    }
    auditar(usuario, 'FREQUENCIA_CRIADA', 'frequencias', registro.id, { aluno_id: dados.aluno_id });
    return registro;
  }

  // Missao 005: chamada por aula — checkbox de falta por aula lancada.
  async salvarChamada({ turma_id, data_aula, disciplina, quantidade_aulas, plano_aula, faltas }, usuario) {
    if (usuario?.perfil === 'professor' && usuario?.disciplina && disciplina !== usuario.disciplina) {
      throw new AppError('Voce so pode lancar chamada da sua disciplina.', 403);
    }
    const alunos = await Aluno.findAll({ where: { turma_id }, order: [['nome', 'ASC']] });
    if (alunos.length === 0) throw new AppError('Nenhum aluno nesta turma.', 404);

    const mapaFaltas = new Map((faltas || []).map((f) => [Number(f.aluno_id), new Set((f.aulas || []).map(Number))]));
    let registros = 0;

    for (const aluno of alunos) {
      const faltasAluno = mapaFaltas.get(aluno.id) || new Set();
      for (let aula = 1; aula <= quantidade_aulas; aula++) {
        const presente = !faltasAluno.has(aula);
        await Frequencia.upsert({
          aluno_id: aluno.id,
          data_aula,
          disciplina,
          numero_aula: aula,
          presente,
          turma_id,
          quantidade_aulas,
          plano_aula: plano_aula || null,
        });
        registros += 1;
      }
    }
    auditar(usuario, 'CHAMADA_SALVA', 'frequencias', null, { turma_id, disciplina, data_aula, quantidade_aulas });
    return { alunos: alunos.length, registros, quantidade_aulas };
  }

  async excluir(id, usuario) {
    const frequencia = await Frequencia.findByPk(id);
    if (!frequencia) {
      throw new AppError('Registro de frequencia nao encontrado.', 404);
    }
    await frequencia.destroy();
    auditar(usuario, 'FREQUENCIA_EXCLUIDA', 'frequencias', id, { aluno_id: frequencia.aluno_id });
    return frequencia;
  }

  async statsAluno(alunoId, usuario) {
    if (usuario?.perfil === 'aluno' && Number(usuario?.aluno_id) !== Number(alunoId)) {
      throw new AppError('Voce so pode consultar a sua propria frequencia.', 403);
    }
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

    let situacao = 'Sem registros';
    if (totalAulas > 0) situacao = percentual >= 75 ? 'Frequente' : 'Em risco';

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
      situacao,
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
