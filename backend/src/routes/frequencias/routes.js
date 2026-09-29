import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { criarFrequenciaSchema, chamadaSchema } from '../../validators/frequenciaValidator.js';
import frequenciaController from '../../controllers/frequenciaController.js';
import { autenticar, autorizar } from '../../middleware/auth.js';

const routes = express.Router();

routes.get('/frequencias', autenticar, autorizar('admin', 'professor'), asyncHandler(frequenciaController.listarFrequencias));
routes.post('/frequencias', autenticar, autorizar('admin', 'professor'), validate(criarFrequenciaSchema), asyncHandler(frequenciaController.cadastrarFrequencia));
routes.post('/frequencias/chamada', autenticar, autorizar('admin', 'professor'), validate(chamadaSchema), asyncHandler(frequenciaController.salvarChamada));
routes.delete('/frequencias/:id', autenticar, autorizar('admin', 'professor'), asyncHandler(frequenciaController.excluirFrequencia));
routes.get('/frequencias/stats/:alunoId', autenticar, autorizar('admin', 'professor', 'aluno'), asyncHandler(frequenciaController.statsAluno));
routes.get('/frequencias/ranking/:turmaId', autenticar, autorizar('admin', 'professor'), asyncHandler(frequenciaController.rankingTurma));
routes.get('/frequencias/risco', autenticar, autorizar('admin', 'professor'), asyncHandler(frequenciaController.alunosEmRisco));

export default routes;
