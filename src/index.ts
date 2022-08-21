import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { DEV_SETTING, PROD_SETTING } from '@/constants/index';
import ormconfig from '@/database/config/ormconfig';
import errorHandler, { notFoundErrorHandler } from '@/errors/errorHandler';

dotenv.config();

const isProdMode: boolean = process.env.NODE_ENV === 'production';
const REAL_SETTING = isProdMode ? PROD_SETTING : DEV_SETTING;

// DB
const AppDataSource = new DataSource(ormconfig[REAL_SETTING.mode]);
AppDataSource.initialize()
  .then(() => {
    console.log('DB Connection is Successful!');
  })
  .catch((err) => {
    console.error('Error during DB Connection', err);
  });

// Express
const app = express();

// Security
if (isProdMode) {
  app.use(hpp());
  app.use(helmet());
  app.enable('trust proxy');
}

// Logger
app.use(morgan(REAL_SETTING.morganMode));

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: isProdMode ? PROD_SETTING.clientURL : true,
    credentials: true,
  }),
);

// Routers

// Check
app.get('/', (req, res) => {
  res.status(200).send('Welcome to My Server!');
});

// Error Handler
app.use(notFoundErrorHandler);
app.use(errorHandler);

// Server
app.listen(REAL_SETTING.port, () => {
  console.log(`server is running on ${REAL_SETTING.port}`);
});
