import alunoService from '../services/alunoService.js';

async function listarAlunos(req, res) {
  const alunos = await alunoService.listar();
  res.status(200).json(alunos);
}

async function cadastrarAluno(req, res) {
  const novoAluno = await alunoService.cadastrar(req.body);
  res.status(201).json(novoAluno);
}

export default { cadastrarAluno, listarAlunos };
