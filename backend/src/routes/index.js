import express from 'express';
import alunosRoutes from './alunos/routes.js';
import turmasRoutes from './turmas/routes.js';
import notasRoutes from './notas/routes.js';
import frequenciasRoutes from './frequencias/routes.js';

const routes = express.Router();

routes.use('/api', alunosRoutes);
routes.use('/api', turmasRoutes);
routes.use('/api', notasRoutes);
routes.use('/api', frequenciasRoutes);

export default routes;
