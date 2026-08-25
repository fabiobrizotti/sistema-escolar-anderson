import express from 'express';
import alunosRoutes from './alunos/routes.js';
import turmasRoutes from './turmas/routes.js';
import notasRoutes from './notas/routes.js';

const routes = express.Router();

routes.use('/api', alunosRoutes);
routes.use('/api', turmasRoutes);
routes.use('/api', notasRoutes);

export default routes;
