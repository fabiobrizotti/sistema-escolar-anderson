import notaService from '../services/notaService.js';

async function listarNotas(req, res) {
  const notas = await notaService.listar(req.query);
  res.status(200).json(notas);
}

async function cadastrarNota(req, res) {
  const novaNota = await notaService.cadastrar(req.body, req.usuario);
  res.status(201).json(novaNota);
}

async function excluirNota(req, res) {
  await notaService.excluir(Number(req.params.id), req.usuario);
  res.status(204).send();
}

async function boletimAluno(req, res) {
  const boletim = await notaService.boletimAluno(Number(req.params.alunoId), req.usuario);
  res.status(200).json(boletim);
}

export default { listarNotas, cadastrarNota, excluirNota, boletimAluno };
