import { AppConfig } from '../types';

const config: AppConfig = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export default config;
