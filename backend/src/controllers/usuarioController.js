import usuarioService from '../services/usuarioService.js';

async function listar(req, res) {
  const usuarios = await usuarioService.listar();
  res.status(200).json(usuarios.map((u) => ({
    id: u.id, nome: u.nome, email: u.email, perfil: u.perfil,
    disciplina: u.disciplina, aluno_id: u.aluno_id, criado_em: u.createdAt,
  })));
}

async function criar(req, res) {
  const usuario = await usuarioService.criar(req.body, req.usuario);
  res.status(201).json({
    id: usuario.id, nome: usuario.nome, email: usuario.email,
    perfil: usuario.perfil, disciplina: usuario.disciplina, aluno_id: usuario.aluno_id,
  });
}

export default { listar, criar };
