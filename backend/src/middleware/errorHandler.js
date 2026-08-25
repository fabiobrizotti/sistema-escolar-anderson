function errorHandler(err, req, res, _next) {
  console.error(`[ERRO] ${req.method} ${req.originalUrl}:`, err.message);

  if (err.isOperational) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  if (err.name === 'SequelizeValidationError') {
    const mensagens = err.errors.map((e) => e.message).join(', ');
    return res.status(400).json({ erro: mensagens });
  }

  return res.status(500).json({ erro: 'Erro interno do servidor.' });
}

export default errorHandler;
