import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import { autenticar, autorizar } from '../../middleware/auth.js';
import auditoriaController from '../../controllers/auditoriaController.js';

const routes = express.Router();

routes.get('/auditoria', autenticar, autorizar('admin'), asyncHandler(auditoriaController.listar));
routes.get('/auditoria/resumo', autenticar, autorizar('admin'), asyncHandler(auditoriaController.resumo));

export default routes;
