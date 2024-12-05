
import type { Request, Response } from 'express';
import * as Models from '@/models';
import * as Utils from '@/utils';

export const getMe = Utils.Route.create({
  method: "get",
  path: '/me',
  middleWares: [],
  handler: async (req: Request, res: Response) => {
    const user = await Models.User.findById(req.payload.id);
    res.status(200).json({
      message:"success",
      data: user
    });
  }
});