import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { loginSchema } from '../../validators/authValidator.js';
import authController from '../../controllers/authController.js';

const routes = express.Router();

routes.post('/auth/login', validate(loginSchema), asyncHandler(authController.login));

export default routes;
