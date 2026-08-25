import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { criarTurmaSchema, vincularAlunoSchema } from '../../validators/turmaValidator.js';
import turmaController from '../../controllers/turmaController.js';

const routes = express.Router();

routes.get('/turmas', asyncHandler(turmaController.listarTurmas));
routes.post('/turmas', validate(criarTurmaSchema), asyncHandler(turmaController.cadastrarTurma));
routes.get('/turmas/:id/alunos', asyncHandler(turmaController.listarAlunosDaTurma));
routes.post('/turmas/:id/alunos', validate(vincularAlunoSchema), asyncHandler(turmaController.vincularAluno));

export default routes;
