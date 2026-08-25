import express from 'express';
import alunosRoutes from './alunos/routes.js';
import turmasRoutes from './turmas/routes.js';

const routes = express.Router();

routes.use('/api', alunosRoutes);
routes.use('/api', turmasRoutes);

export default routes;
