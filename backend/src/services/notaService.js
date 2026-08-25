import { Aluno, Nota } from '../models/index.js';
import AppError from '../utils/AppError.js';

const INCLUDE_ALUNO = {
  model: Aluno,
  as: 'aluno',
  attributes: ['id', 'nome', 'email', 'turma_id'],
};

class NotaService {
  async listar(filtros = {}) {
    const where = {};
    if (filtros.aluno_id) where.aluno_id = filtros.aluno_id;
    if (filtros.disciplina) where.disciplina = filtros.disciplina;
    if (filtros.bimestre) where.bimestre = filtros.bimestre;

    return Nota.findAll({
      where,
      include: [INCLUDE_ALUNO],
      order: [['createdAt', 'DESC']],
    });
  }

  async cadastrar(dados) {
    const aluno = await Aluno.findByPk(dados.aluno_id);
    if (!aluno) {
      throw new AppError('Aluno nao encontrado.', 404);
    }

    const existente = await Nota.findOne({
      where: {
        aluno_id: dados.aluno_id,
        disciplina: dados.disciplina,
        bimestre: dados.bimestre,
      },
    });

    if (existente) {
      throw new AppError('Ja existe nota para este aluno nesta disciplina e bimestre.', 409);
    }

    return Nota.create(dados);
  }

  async excluir(id) {
    const nota = await Nota.findByPk(id);
    if (!nota) {
      throw new AppError('Nota nao encontrada.', 404);
    }
    await nota.destroy();
    return nota;
  }

  async boletimAluno(alunoId) {
    const aluno = await Aluno.findByPk(alunoId, {
      include: [
        { model: Nota, as: 'notas', attributes: ['id', 'disciplina', 'bimestre', 'nota'] },
      ],
    });

    if (!aluno) {
      throw new AppError('Aluno nao encontrado.', 404);
    }

    const notas = aluno.notas || [];

    const disciplinas = {};
    for (const nota of notas) {
      if (!disciplinas[nota.disciplina]) {
        disciplinas[nota.disciplina] = [];
      }
      disciplinas[nota.disciplina].push(Number(nota.nota));
    }

    const boletim = [];
    let somaGeral = 0;
    let totalNotasGeral = 0;
    let maiorNotaGeral = 0;
    let menorNotaGeral = 10;

    for (const [disciplina, notasDisciplina] of Object.entries(disciplinas)) {
      const media = notasDisciplina.reduce((a, b) => a + b, 0) / notasDisciplina.length;
      const maior = Math.max(...notasDisciplina);
      const menor = Math.min(...notasDisciplina);

      let situacao;
      if (media >= 7) situacao = 'Aprovado';
      else if (media >= 5) situacao = 'Recuperacao';
      else situacao = 'Reprovado';

      boletim.push({
        disciplina,
        notas: notasDisciplina,
        media: Math.round(media * 100) / 100,
        maiorNota: maior,
        menorNota: menor,
        situacao,
      });

      somaGeral += notasDisciplina.reduce((a, b) => a + b, 0);
      totalNotasGeral += notasDisciplina.length;
      maiorNotaGeral = Math.max(maiorNotaGeral, maior);
      menorNotaGeral = Math.min(menorNotaGeral, menor);
    }

    const mediaGeral = totalNotasGeral > 0
      ? Math.round((somaGeral / totalNotasGeral) * 100) / 100
      : 0;

    let situacaoGeral;
    if (mediaGeral >= 7) situacaoGeral = 'Aprovado';
    else if (mediaGeral >= 5) situacaoGeral = 'Recuperacao';
    else situacaoGeral = 'Reprovado';

    return {
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email,
      },
      boletim,
      resumo: {
        mediaGeral,
        situacaoGeral,
        maiorNotaGeral: totalNotasGeral > 0 ? maiorNotaGeral : 0,
        menorNotaGeral: totalNotasGeral > 0 ? menorNotaGeral : 0,
        totalDisciplinas: boletim.length,
        totalNotas: totalNotasGeral,
      },
    };
  }
}

export default new NotaService();
