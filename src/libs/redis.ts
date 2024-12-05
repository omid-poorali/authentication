import { createClient } from "redis";
import config from "config";
import logger from '@/libs/logger';

const redisUrl = config.get<string>('redis.url');

const redisClient = createClient({
  url: redisUrl
});

redisClient.on('error', () => {
  logger.info(`Could not connect to Redis at ${redisUrl}`);
});

redisClient.on('ready', () => {
  logger.info(`Connected to Redis at ${redisUrl}`);
});

export default redisClient;