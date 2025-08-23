export const DEV_SETTING = {
  mode: 'dev',
  port: process.env.PORT || '4000',
  clientURL: 'http://localhost:3000',
  morganMode: 'dev',
  supabase: {
    url: process.env.SUPABASE_URL || 'https://rlecgghggceoslgjjzaa.supabase.co',
    anonKey:
      process.env.SUPABASE_ANON_KEY ||
      'sb_publishable_8L3Q-zAbJbNsvcUHkhPg9A_DKjyDC-Z',
    serviceKey:
      process.env.SUPABASE_SERVICE_KEY ||
      'sb_secret_q4gDth2tWoB8poHD8ryZWw_Qp30RT18',
  },
} as const;

export const PROD_SETTING = {
  mode: 'prod',
  port: process.env.PORT || '4000',
  clientURL: process.env.CLIENT_URL || 'https://euroamericar.com',
  domain: process.env.COOKIE_DOMAIN || '.vercel.app',
  morganMode: 'combined',
  supabase: {
    url: 'https://rlecgghggceoslgjjzaa.supabase.co',
    anonKey: 'sb_publishable_8L3Q-zAbJbNsvcUHkhPg9A_DKjyDC-Z',
    serviceKey:
      process.env.SUPABASE_SERVICE_KEY ||
      'sb_secret_q4gDth2tWoB8poHD8ryZWw_Qp30RT18',
  },
} as const;
