import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { criarAlunoSchema } from '../../validators/alunoValidator.js';
import alunoController from '../../controllers/alunoController.js';
import { autenticar, autorizar } from '../../middleware/auth.js';

const routes = express.Router();

routes.get('/alunos', autenticar, autorizar('admin', 'professor'), asyncHandler(alunoController.listarAlunos));
routes.post('/alunos', autenticar, autorizar('admin'), validate(criarAlunoSchema), asyncHandler(alunoController.cadastrarAluno));

export default routes;
