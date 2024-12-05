import dotenv from 'dotenv';
import { application } from '@/application';
import SafeMongooseConnection from '@/libs/safe-mongoose-connection';
import logger from '@/libs/logger';
import config from "config";
import redisClient from '@/libs/redis';

export const startTheServer = () => {
  dotenv.config();

  const mongoUrl = config.get<string>("mongo.url");
  const redisUrl = config.get<string>("redis.url");

  const safeMongooseConnection = new SafeMongooseConnection({
    mongoUrl: mongoUrl ?? '',
    onStartConnection: mongoUrl => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
    onConnectionError: (error) => logger.error(error),
    onConnectionRetry: mongoUrl => logger.info(`Retrying to MongoDB at ${mongoUrl}`)
  });

  const port = config.get<number>("host.port") || 8080;
  const app = application();

  app.listen(port, () => {
    logger.info(`Express server started at http://localhost:${port}`);
  });


  if (!mongoUrl) {
    logger.error('mongo url not specified in environment', new Error('mongo url not specified in environment'));
    process.exit(1);
  }
  if (!redisUrl) {
    logger.error('redis url not specified in environment', new Error('redis url not specified in environment'));
    process.exit(1);
  }
  else {
    safeMongooseConnection.connect(mongoUrl => {
      logger.info(`Connected to MongoDB at ${mongoUrl}`);
    });
    redisClient.connect();
  }

  // Close the Mongoose connection, when receiving SIGINT
  process.on('SIGINT', async () => {
    console.log('\n'); /* eslint-disable-line */
    logger.info('Gracefully shutting down');
    logger.info('Closing the MongoDB connection');
    try {
      await safeMongooseConnection.close(true);
      await redisClient.disconnect();
      logger.info('Mongo connection closed successfully');
    } catch (error) {
      logger.error(error);
    }
    process.exit(0);
  });

};

startTheServer();