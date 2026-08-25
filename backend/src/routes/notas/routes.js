import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { criarNotaSchema, boletimQuerySchema } from '../../validators/notaValidator.js';
import notaController from '../../controllers/notaController.js';

const routes = express.Router();

routes.get('/notas', asyncHandler(notaController.listarNotas));
routes.post('/notas', validate(criarNotaSchema), asyncHandler(notaController.cadastrarNota));
routes.delete('/notas/:id', asyncHandler(notaController.excluirNota));
routes.get('/boletim/:alunoId', asyncHandler(notaController.boletimAluno));

export default routes;
