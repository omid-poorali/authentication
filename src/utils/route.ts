import { BadRequestError } from '@/application';
import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject, z } from 'zod';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const validateRequest = <T extends AnyZodObject>(
  schema: T,
  req: Request
): z.infer<T> => {
  try {
    return schema.parse(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestError(fromZodError(error).message);
    }
    throw new BadRequestError(JSON.stringify(error));
  }
};

export type MiddleWare = (req: Request, res: Response, next: NextFunction) => void;
export type AppRouteHandler = (req: Request, res: Response) => Promise<void>;
export type Method = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

export type AppRoute = {
  method: Method;
  path: string;
  middleWares: MiddleWare[];
  handler: AppRouteHandler;
};

export const create = (input: MakeOptional<AppRoute, 'middleWares'>): AppRoute => ({
  method: input.method,
  path: input.path,
  middleWares: input.middleWares ?? [],
  handler: input.handler
});
