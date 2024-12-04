import type { Application, Request, Response } from 'express';
import express from 'express';
import * as Middlewares from '@/middlewares';
import morgan from 'morgan';

export const application = (): Application => {
  const app: Application = express();
  app.use(Middlewares.HTTPSecurity);
  app.use(Middlewares.CORSHandler);
  app.use(morgan('dev'));


  // parse requests of content-type - application/json
  app.use(express.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

//   app.get('/', (req, res) => res.status(Enums.HTTPStatus.SUCCESS).json(
//     Utils.Api.sendResponse({ status: Enums.HTTPStatus.SUCCESS, data: { message: 'Welcome to app.' } })
//   ));

//   for (const route of Routes.V1Routes.all) {
//     app[route.method](`/api/v1${route.path}`, ...route.middleWares, appRoute(route));
//   }

  // app.use('*', (req: Request, res: Response) => {
  //   res.status(Enums.HTTPStatus.NOT_FOUND).json(
  //     Utils.Api.sendResponse({ status: Enums.HTTPStatus.NOT_FOUND })
  //   );
  // });
  return app;
};
