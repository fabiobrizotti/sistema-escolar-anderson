import turmaService from '../services/turmaService.js';

async function listarTurmas(req, res) {
  const turmas = await turmaService.listar();
  res.status(200).json(turmas);
}

async function cadastrarTurma(req, res) {
  const novaTurma = await turmaService.cadastrar(req.body, req.usuario);
  res.status(201).json(novaTurma);
}

async function vincularAluno(req, res) {
  const aluno = await turmaService.vincularAluno(Number(req.params.id), req.body.alunoId, req.usuario);
  res.status(200).json(aluno);
}

async function listarAlunosDaTurma(req, res) {
  const turma = await turmaService.listarAlunos(req.params.id);
  res.status(200).json(turma);
}

export default { cadastrarTurma, listarTurmas, vincularAluno, listarAlunosDaTurma };
