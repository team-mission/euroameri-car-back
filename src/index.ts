import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { DEV_SETTING, PROD_SETTING } from '@constants/index';
import AppDataSource from '@database/dataSource';
import configurePassport from '@auth/index';
import adminRouter from '@routes/admin';
import postsRouter from '@routes/posts';
import postRouter from '@routes/post';
import errorHandler, { notFoundErrorHandler } from '@errors/errorHandler';

dotenv.config();

const isProdMode: boolean = process.env.NODE_ENV === 'production';
const REAL_SETTING = isProdMode ? PROD_SETTING : DEV_SETTING;

// DB
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
  app.use(hpp() as any);
  app.use(helmet() as any);
  app.enable('trust proxy');
}

// CORS
app.use(
  cors({
    origin: isProdMode ? PROD_SETTING.clientURL : true,
    credentials: true,
  }),
);

// Logger
app.use(morgan(REAL_SETTING.morganMode));

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie & Session
app.use(cookieParser(process.env.COOKIE_SECRET) as any);
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET!,
    proxy: isProdMode,
    cookie: {
      httpOnly: true,
      secure: isProdMode,
      domain: isProdMode ? PROD_SETTING.domain : undefined,
      sameSite: isProdMode ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    },
  }) as any,
);

// Passport
configurePassport();
app.use(passport.initialize() as any);
app.use(passport.session() as any);

// Routers
app.use('/admin', adminRouter);
app.use('/posts', postsRouter);
app.use('/post', postRouter);

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
