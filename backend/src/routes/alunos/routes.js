import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { criarAlunoSchema } from '../../validators/alunoValidator.js';
import alunoController from '../../controllers/alunoController.js';

const routes = express.Router();

routes.get('/alunos', asyncHandler(alunoController.listarAlunos));
routes.post('/alunos', validate(criarAlunoSchema), asyncHandler(alunoController.cadastrarAluno));

export default routes;
