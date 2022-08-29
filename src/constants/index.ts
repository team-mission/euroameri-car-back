export const DEV_SETTING = {
  mode: 'dev',
  port: '4000',
  clientURL: 'http://localhost:3000',

  db: {
    port: '3306',
    database: 'euroameri-car-dev',
  },
  morganMode: 'dev',
} as const;

export const PROD_SETTING = {
  mode: 'prod',
  port: '4000',
  clientURL: 'https://euroamericar.com',

  db: {
    port: '3306',
    database: 'euroamericar',
  },
  morganMode: 'combined',
} as const;
