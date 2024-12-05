import type { Application, Request, Response } from 'express';
import express from 'express';
import cookieParser from 'cookie-parser';
import * as Middlewares from '@/middlewares';
import * as Routes from '@/routes';
export const application = (): Application => {
  const app: Application = express();
  
  app.use(Middlewares.HTTPSecurity);
  app.use(Middlewares.CORSHandler);
  app.use(Middlewares.HTTPLogger);

  // parse requests of content-type - application/json
  app.use(express.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  for (const route of Routes.V1Routes.all) {
    app[route.method](`/api/v1${route.path}`, ...route.middleWares, Middlewares.catchErrors(route));
  }

  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      message: "not found!"
    });
  });
  
  return app;
};
