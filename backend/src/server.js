import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import sequelize from './config/database.js';
import './models/index.js';
import garantirAdmin from './seed.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { erro: 'Muitas requisicoes. Tente novamente mais tarde.' },
  }),
);

app.use((erro, req, res, next) => {
  if (erro instanceof SyntaxError && 'body' in erro) {
    return res.status(400).json({ erro: 'JSON invalido.' });
  }
  return next(erro);
});

app.use(routes);
app.use(errorHandler);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectDatabaseWithRetry() {
  while (true) {
    try {
      await sequelize.authenticate();
      console.log('Conexao com o banco de dados estabelecida com sucesso!');

      await sequelize.sync({ force: env.DB_SYNC_FORCE });
      console.log('Banco de dados sincronizado com sucesso!');
      await garantirAdmin();
      return;
    } catch (error) {
      console.error('Falha ao conectar no banco. Nova tentativa em alguns segundos.');
      console.error(error.message);
      await delay(env.DB_RETRY_DELAY_MS);
    }
  }
}

async function startServer() {
  await connectDatabaseWithRetry();

  app.listen(env.PORT, () => {
    console.log(`Servidor rodando em http://localhost:${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Erro inesperado ao iniciar o servidor:', error);
});
