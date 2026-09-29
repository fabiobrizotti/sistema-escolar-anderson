import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { criarUsuarioSchema } from '../../validators/usuarioValidator.js';
import usuarioController from '../../controllers/usuarioController.js';
import { autenticar, autorizar } from '../../middleware/auth.js';

const routes = express.Router();

routes.get('/usuarios', autenticar, autorizar('admin'), asyncHandler(usuarioController.listar));
routes.post('/usuarios', autenticar, autorizar('admin'), validate(criarUsuarioSchema), asyncHandler(usuarioController.criar));

export default routes;
