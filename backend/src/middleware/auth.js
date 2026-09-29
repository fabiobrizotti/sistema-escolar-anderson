import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function autenticar(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ erro: 'Token nao informado.' });
  try {
    req.usuario = jwt.verify(token, env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' });
  }
}

export function autorizar(...perfis) {
  return (req, res, next) => {
    if (!req.usuario || !perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ erro: 'Acesso negado para este perfil.' });
    }
    return next();
  };
}
