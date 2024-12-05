import { z } from 'zod';

const numberRegex = /^\d+$/;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().regex(numberRegex).transform(Number),
  JWT_SECRET: z.string(),
  ORIGIN: z.string(),
  MONGO_URL: z.string(),
  REDIS_URL: z.string()
});

const envs = envSchema.parse(process.env);

export default {
  env: envs.NODE_ENV,
  host: {
    port: envs.PORT
  },
  mongo: {
    url: envs.MONGO_URL
  },
  redis: {
    url: envs.REDIS_URL
  },
  jwt: {
    secretKey: envs.JWT_SECRET,
    expiresIn: '5m'
  },
  cors: {
    options: {
      allowedHeaders: [
        'Origin',
        'Content-Type',
        'Authorization'
      ],
      origin: envs.ORIGIN,
      credentials: true
    }
  },
  'http-security': {
    'cross-origin': false
  },
  cookie: {
    refreshToken: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
      sameSite: 'none',
      secure: false
    },
  }
};

