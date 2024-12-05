import { BadRequestError, UnauthorizedError } from '@/application';
import { AppRoute } from '@/utils/route';
import type { Handler, Request, Response } from 'express';

export const catchErrors = (route: AppRoute): Handler => async (req: Request, res: Response) => {
  const { handler } = route;
  try {
    await handler(req, res);
  } catch (error) {
    console.error(error);
    if (error instanceof BadRequestError) {
      res.status(error.status).json({ message: error.message });
    } else if (error instanceof UnauthorizedError) {
      res.status(error.status).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message || "Internal Server Error !" });
    }
  }
};
