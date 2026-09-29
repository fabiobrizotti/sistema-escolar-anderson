import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import { autenticar, autorizar } from '../../middleware/auth.js';
import notaService from '../../services/notaService.js';
import frequenciaService from '../../services/frequenciaService.js';

const routes = express.Router();

routes.get('/aluno/notas', autenticar, autorizar('aluno'), asyncHandler(async (req, res) => {
  const notas = await notaService.listar({ aluno_id: req.usuario.aluno_id });
  res.status(200).json(notas);
}));

routes.get('/aluno/frequencia', autenticar, autorizar('aluno'), asyncHandler(async (req, res) => {
  const frequencias = await frequenciaService.listar({ aluno_id: req.usuario.aluno_id });
  res.status(200).json(frequencias);
}));

routes.get('/aluno/frequencia/resumo', autenticar, autorizar('aluno'), asyncHandler(async (req, res) => {
  const resumo = await frequenciaService.statsAluno(req.usuario.aluno_id);
  res.status(200).json(resumo);
}));

export default routes;
