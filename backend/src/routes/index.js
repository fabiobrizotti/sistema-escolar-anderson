import express from 'express';
import alunosRoutes from './alunos/routes.js';
import turmasRoutes from './turmas/routes.js';
import notasRoutes from './notas/routes.js';
import frequenciasRoutes from './frequencias/routes.js';
import authRoutes from './auth/routes.js';
import auditoriaRoutes from './auditoria/routes.js';
import alunoPortalRoutes from './aluno/routes.js';
import usuariosRoutes from './usuarios/routes.js';

const routes = express.Router();

routes.use('/api', authRoutes);
routes.use('/api', alunosRoutes);
routes.use('/api', turmasRoutes);
routes.use('/api', notasRoutes);
routes.use('/api', frequenciasRoutes);
routes.use('/api', auditoriaRoutes);
routes.use('/api', alunoPortalRoutes);
routes.use('/api', usuariosRoutes);

export default routes;
