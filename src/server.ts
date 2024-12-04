import dotenv from 'dotenv';
import { application } from '@/application';
import SafeMongooseConnection from '@/libs/safe-mongoose-connection';
import logger from '@/libs/logger';
import config from "config";

export const startTheServer = () => {
  dotenv.config();

  const port = config.get<number>("host.port") || 8080;
  const app = application();
  
  const mongoUrl = config.get<string>("mongo.url");

  const safeMongooseConnection = new SafeMongooseConnection({
    mongoUrl: mongoUrl ?? '',
    onStartConnection: mongoUrl => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
    onConnectionError: (error) => logger.error(error),
    onConnectionRetry: mongoUrl => logger.info(`Retrying to MongoDB at ${mongoUrl}`)
  });

  const serve = () => app.listen(port, () => {
    logger.info(`Express server started at http://localhost:${port}`);
  });


  if (!mongoUrl) {
    logger.error('mongo url not specified in environment', new Error('mongo url not specified in environment'));
    process.exit(1);
  } else {
    safeMongooseConnection.connect(mongoUrl => {
      logger.info(`Connected to MongoDB at ${mongoUrl}`);
      serve();
    });
  }

  // Close the Mongoose connection, when receiving SIGINT
  process.on('SIGINT', async () => {
    console.log('\n'); /* eslint-disable-line */
    logger.info('Gracefully shutting down');
    logger.info('Closing the MongoDB connection');
    try {
      await safeMongooseConnection.close(true);
      logger.info('Mongo connection closed successfully');
    } catch (error) {
      logger.error(error);
    }
    process.exit(0);
  });

};

startTheServer();