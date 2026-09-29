import frequenciaService from '../services/frequenciaService.js';

async function listarFrequencias(req, res) {
  const frequencias = await frequenciaService.listar(req.query);
  res.status(200).json(frequencias);
}

async function cadastrarFrequencia(req, res) {
  const nova = await frequenciaService.cadastrar(req.body, req.usuario);
  res.status(201).json(nova);
}

async function salvarChamada(req, res) {
  const resultado = await frequenciaService.salvarChamada(req.body, req.usuario);
  res.status(201).json(resultado);
}

async function excluirFrequencia(req, res) {
  await frequenciaService.excluir(Number(req.params.id), req.usuario);
  res.status(204).send();
}

async function statsAluno(req, res) {
  const stats = await frequenciaService.statsAluno(Number(req.params.alunoId), req.usuario);
  res.status(200).json(stats);
}

async function rankingTurma(req, res) {
  const ranking = await frequenciaService.rankingTurma(Number(req.params.turmaId));
  res.status(200).json(ranking);
}

async function alunosEmRisco(_req, res) {
  const risco = await frequenciaService.alunosEmRisco();
  res.status(200).json(risco);
}

export default { listarFrequencias, cadastrarFrequencia, salvarChamada, excluirFrequencia, statsAluno, rankingTurma, alunosEmRisco };
