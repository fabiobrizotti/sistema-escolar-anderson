import authService from '../services/authService.js';

async function login(req, res) {
  const resultado = await authService.login(req.body);
  res.status(200).json(resultado);
}

export default { login };
