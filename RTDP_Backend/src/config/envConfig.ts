import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV as string;
const LOCAL_ORIGIN = process.env.LOCAL_ORIGIN as string;
const PRODUCTION_ORIGIN = process.env.PRODUCTION_ORIGIN as string;
const LOCAL_DB_URL = process.env.LOCAL_DB_URL as string;
const PRODUCTION_DB_URL = process.env.PRODUCTION_DB_URL as string;
const PRODUCTION_ENV = NODE_ENV === 'production';

export const PORT = process.env.PORT as string;
export const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS as string);
export const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS as string);
export const DATABASE_URL = PRODUCTION_ENV ? PRODUCTION_DB_URL : LOCAL_DB_URL;
export const ALLOWED_ORIGIN = PRODUCTION_ENV ? PRODUCTION_ORIGIN : LOCAL_ORIGIN;