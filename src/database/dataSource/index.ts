import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import { DEV_SETTING, PROD_SETTING } from '@constants/index';
import { ormconfig } from './ormconfig';

dotenv.config();

const isProdMode: boolean = process.env.NODE_ENV === 'production';
const REAL_SETTING = isProdMode ? PROD_SETTING : DEV_SETTING;

// DataSource
const AppDataSource = new DataSource(ormconfig[REAL_SETTING.mode]);

export default AppDataSource;
