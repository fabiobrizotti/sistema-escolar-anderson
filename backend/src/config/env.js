import 'dotenv/config';

const required = ['DB_NAME', 'DB_USER'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${key}`);
  }
}

const env = {
  PORT: Number(process.env.PORT) || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_DIALECT: process.env.DB_DIALECT || 'mysql',
  DB_SYNC_FORCE: String(process.env.DB_SYNC_FORCE || 'false').toLowerCase() === 'true',
  DB_RETRY_DELAY_MS: Number(process.env.DB_RETRY_DELAY_MS) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-trocar-em-producao',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL || 'admin@escola.com',
  SEED_ADMIN_SENHA: process.env.SEED_ADMIN_SENHA || 'admin123',
};

if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'dev-secret-trocar-em-producao') {
  throw new Error('JWT_SECRET deve ser definido em producao.');
}

export default env;
