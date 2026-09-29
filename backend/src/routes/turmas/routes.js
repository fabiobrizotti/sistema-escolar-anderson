import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { criarTurmaSchema, vincularAlunoSchema } from '../../validators/turmaValidator.js';
import turmaController from '../../controllers/turmaController.js';
import { autenticar, autorizar } from '../../middleware/auth.js';

const routes = express.Router();

routes.get('/turmas', autenticar, autorizar('admin', 'professor'), asyncHandler(turmaController.listarTurmas));
routes.post('/turmas', autenticar, autorizar('admin'), validate(criarTurmaSchema), asyncHandler(turmaController.cadastrarTurma));
routes.get('/turmas/:id/alunos', autenticar, autorizar('admin', 'professor'), asyncHandler(turmaController.listarAlunosDaTurma));
routes.post('/turmas/:id/alunos', autenticar, autorizar('admin'), validate(vincularAlunoSchema), asyncHandler(turmaController.vincularAluno));

export default routes;
