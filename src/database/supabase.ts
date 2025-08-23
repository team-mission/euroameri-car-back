import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { DEV_SETTING, PROD_SETTING } from '@constants/index';

dotenv.config();

const isProdMode: boolean = process.env.NODE_ENV === 'production';
const REAL_SETTING = isProdMode ? PROD_SETTING : DEV_SETTING;

// Supabase 설정
const supabaseUrl = REAL_SETTING.supabase.url;
const supabaseAnonKey = REAL_SETTING.supabase.anonKey;
const supabaseServiceKey = REAL_SETTING.supabase.serviceKey;

// 클라이언트용 (anon key 사용)
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// 서버용 (service key 사용 - 관리자 권한)
const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

export default supabase;
export { supabaseAdmin };
