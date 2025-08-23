import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

import { DEV_SETTING, PROD_SETTING } from '@constants/index';

dotenv.config();

interface OrmconfigType {
  dev: DataSourceOptions;
  prod: DataSourceOptions;
}

export const ormconfig: OrmconfigType = {
  dev: {
    type: 'postgres',
    url: process.env.DEV_DATABASE_URL,
    synchronize: true,
    logging: true,
    entities: ['src/database/entities/**/*.ts'],
    migrations: ['src/database/migration/**/*.ts'],
    subscribers: ['src/database/subscriber/**/*.ts'],
    ssl: false,
  },
  prod: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false, // 프로덕션에서는 false로 설정
    logging: false,
    entities: ['dist/database/entities/**/*.js'], // 빌드된 JS 파일 경로
    migrations: ['dist/database/migration/**/*.js'],
    subscribers: ['dist/database/subscriber/**/*.js'],
    ssl: {
      rejectUnauthorized: false, // Supabase SSL 연결을 위해 필요
    },
  },
};
