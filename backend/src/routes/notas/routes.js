import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { criarNotaSchema, boletimQuerySchema } from '../../validators/notaValidator.js';
import notaController from '../../controllers/notaController.js';
import { autenticar, autorizar } from '../../middleware/auth.js';

const routes = express.Router();

routes.get('/notas', autenticar, autorizar('admin', 'professor'), asyncHandler(notaController.listarNotas));
routes.post('/notas', autenticar, autorizar('admin', 'professor'), validate(criarNotaSchema), asyncHandler(notaController.cadastrarNota));
routes.delete('/notas/:id', autenticar, autorizar('admin', 'professor'), asyncHandler(notaController.excluirNota));
routes.get('/boletim/:alunoId', autenticar, autorizar('admin', 'professor', 'aluno'), asyncHandler(notaController.boletimAluno));

export default routes;
