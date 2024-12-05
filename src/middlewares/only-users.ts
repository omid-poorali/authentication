import type { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import * as Models from '@/models';
import * as Utils from '@/utils';

export const onlyUsers = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const payload = Utils.JWT.verifyAccessToken<AccessTokenPayload>(token);
      req.payload = payload;
    }

    if (req.payload.role !== Models.ROLES.USER) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ message: error.message || "Unauthorized" });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message || "Internal Server Error !" });
    }
  }
};
