import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

import { DEV_SETTING, PROD_SETTING } from '@constants/index';
import Admin from '@database/entities/admin';
import Post from '@database/entities/post';
import Image from '@database/entities/image';
import Comment from '@database/entities/comment';

dotenv.config();

interface OrmconfigType {
  dev: DataSourceOptions;
  prod: DataSourceOptions;
}

export const ormconfig: OrmconfigType = {
  dev: {
    type: 'mysql',
    host: process.env.DB_HOST || DEV_SETTING.db.host,
    port: Number(process.env.DB_PORT || DEV_SETTING.db.port),
    username: process.env.DB_USERNAME || DEV_SETTING.db.username,
    password: process.env.DB_PASSWORD || DEV_SETTING.db.password,
    database: process.env.DB_NAME || DEV_SETTING.db.database,
    synchronize: true,
    logging: true,
    entities: [Admin, Post, Image, Comment],
    migrations: ['src/database/migration/**/*.ts'],
    subscribers: ['src/database/subscriber/**/*.ts'],
  },
  prod: {
    type: 'mysql',
    host: process.env.DB_HOST || PROD_SETTING.db.host,
    port: Number(process.env.DB_PORT || PROD_SETTING.db.port),
    username: process.env.DB_USERNAME || PROD_SETTING.db.username,
    password: process.env.DB_PASSWORD || PROD_SETTING.db.password,
    database: process.env.DB_NAME || PROD_SETTING.db.database,
    synchronize: true,
    logging: false,
    entities: [Admin, Post, Image, Comment],
    migrations: ['src/database/migration/**/*.ts'],
    subscribers: ['src/database/subscriber/**/*.ts'],
  },
};
