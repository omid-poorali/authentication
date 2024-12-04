import { z } from 'zod';

const numberRegex = /^\d+$/;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().regex(numberRegex).transform(Number),
  JWT_SECRET: z.string(),
  ORIGIN: z.string(),
  MONGO_URL: z.string(),
  // RATE_LIMIT_TIME_IN_SECONDS: z.string().regex(numberRegex).transform(Number),

  // EMAIL_USER: z.string(),
  // EMAIL_PASS: z.string(),
  // EMAIL_HOST: z.string(),
  // EMAIL_PORT: z.string().regex(numberRegex).transform(Number),
  // EMAIL_FROM: z.string(),

  // MONGO_VERSION: z.string(),
  // MONGO_USER: z.string(),
  // MONGO_PASSWORD: z.string(),
  // MONGO_DB: z.string(),
  // MONGO_PORT: z.string().regex(numberRegex).transform(Number),
  // MONGO_URL: z.string(),

  // REDIS_VERSION: z.string(),
  // REDIS_URL: z.string(),
  // REDIS_PORT: z.string().regex(numberRegex).transform(Number),
  // REDIS_CACHE_EXPIRES: z.string().regex(numberRegex).transform(Number),

  // ACCESS_TOKEN_PRIVATE_KEY: z.string(),
  // ACCESS_TOKEN_PUBLIC_KEY: z.string(),
  // ACCESS_TOKEN_EXPIRES: z.string().regex(numberRegex).transform(Number),
  // REFRESH_TOKEN_PRIVATE_KEY: z.string(),
  // REFRESH_TOKEN_PUBLIC_KEY: z.string(),
  // REFRESH_TOKEN_EXPIRES: z.string().regex(numberRegex).transform(Number),
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
  jwt: {
    secretKey: envs.JWT_SECRET,
    expiresIn: '10m'
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
      sameSite: 'strict',
      secure: true
    },
  }
};

