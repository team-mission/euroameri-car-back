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

// DB 연결 함수 (요청 시 연결)
async function initializeDB() {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log('DB Connection is Successful!');
    } catch (err) {
      console.error('Error during DB Connection', err);
      throw err;
    }
  }
}

// Express
const app = express();

// Security
if (isProdMode) {
  app.use(hpp() as any);
  app.use(helmet());
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
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: isProdMode,
      domain: isProdMode ? PROD_SETTING.domain : undefined,
      sameSite: 'none',
    },
  }) as any,
);

// Passport
configurePassport();
app.use(passport.initialize() as any);
app.use(passport.session() as any);

// DB 연결 미들웨어
app.use(async (req, res, next) => {
  try {
    await initializeDB();
    next();
  } catch (error) {
    console.error('DB initialization failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routers
app.use('/admin', adminRouter);
app.use('/posts', postsRouter);
app.use('/post', postRouter);

// Check
app.get('/', (req, res) => {
  res.status(200).send('Welcome to My Server!');
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    environment: process.env.NODE_ENV,
    database: AppDataSource.isInitialized ? 'Connected' : 'Not Connected',
    timestamp: new Date().toISOString(),
  });
});

// Environment check (개발용 - 프로덕션에서는 제거 권장)
app.get('/env-check', (req, res) => {
  if (isProdMode) {
    return res.status(403).json({ error: 'Access denied in production' });
  }
  res.status(200).json({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not Set',
    COOKIE_SECRET: process.env.COOKIE_SECRET ? 'Set' : 'Not Set',
    SUPABASE_URL: process.env.SUPABASE_URL ? 'Set' : 'Not Set',
  });
});

// Error Handler
app.use(notFoundErrorHandler);
app.use(errorHandler);

// Export the Express app for Vercel
export default app;

// Server (로컬 개발용)
if (process.env.NODE_ENV !== 'production') {
  app.listen(REAL_SETTING.port, () => {
    console.log(`server is running on ${REAL_SETTING.port}`);
  });
}
