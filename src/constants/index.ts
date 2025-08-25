export const DEV_SETTING = {
  mode: 'dev',
  port: '4000',
  clientURL: 'http://localhost:3000',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'euroameri-car-dev',
  },
  morganMode: 'dev',
} as const;

export const PROD_SETTING = {
  mode: 'prod',
  port: '4000',
  clientURL: process.env.CLIENT_URL || 'https://euroamericar.com',
  domain: process.env.DOMAIN || '.euamserver.cafe24.com',

  db: {
    host: process.env.DB_HOST || 'mysql',
    port: process.env.DB_PORT || '3306',
    username: process.env.DB_USERNAME || 'euroameri',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'euroamericar',
  },
  morganMode: 'combined',
} as const;
