import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { criarFrequenciaSchema } from '../../validators/frequenciaValidator.js';
import frequenciaController from '../../controllers/frequenciaController.js';

const routes = express.Router();

routes.get('/frequencias', asyncHandler(frequenciaController.listarFrequencias));
routes.post('/frequencias', validate(criarFrequenciaSchema), asyncHandler(frequenciaController.cadastrarFrequencia));
routes.delete('/frequencias/:id', asyncHandler(frequenciaController.excluirFrequencia));
routes.get('/frequencias/stats/:alunoId', asyncHandler(frequenciaController.statsAluno));
routes.get('/frequencias/ranking/:turmaId', asyncHandler(frequenciaController.rankingTurma));
routes.get('/frequencias/risco', asyncHandler(frequenciaController.alunosEmRisco));

export default routes;
