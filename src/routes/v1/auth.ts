import type { CookieOptions, Request, Response } from 'express';
import * as Models from '@/models';
import * as Utils from '@/utils';
import { z } from 'zod';
import config from "config";
import { BadRequestError, ConflictError } from '@/application';

const refreshTokenCookieOptions = config.get<CookieOptions>('cookie.refreshToken');

const registerValidation = z.object({
  body: z.object({
    username: z.string({ required_error: 'username is required' }),
    password: z.string({ required_error: 'password is required' }),
  }),
});

export const register = Utils.Route.create({
  method: "post",
  path: '/auth/register',
  handler: async (req: Request, res: Response) => {
    const {
      body: { username, password },
    } = Utils.Route.validateRequest(registerValidation, req);

    const targetUser = await Models.User.findOne({ username });

    if (targetUser) {
      throw new ConflictError("You have already registered!");
    }

    const newUser = await Models.User.create({ username, password });

    res.status(201).json({
      message: "success",
      data: newUser
    });
  }
});

const loginValidation = z.object({
  body: z.object({
    username: z.string({ required_error: 'username is required' }),
    password: z.string({ required_error: 'password is required' }),
  }),
});

export const login = Utils.Route.create({
  method: "post",
  path: '/auth/login',
  handler: async (req: Request, res: Response) => {
    const {
      body: {
        username, password
      },
    } = Utils.Route.validateRequest(loginValidation, req);

    const targetUser = await Models.User.findOne({ username });
    if (!targetUser) {
      throw new BadRequestError("username or password is wrong!");
    }

    const isPasswordCorrect = await targetUser.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new BadRequestError("username or password is wrong!");
    }

    // const accessToken = Utils.JWT.generateAccessToken(targetUser.id, targetUser.role);
    // let refreshToken = await Models.RefreshToken.findByUserIndex(targetUser.index);

    // if (!refreshToken) {
    //   refreshToken = await Models.RefreshToken.create({ userIn: targetUser.index, token: Utils.UUID.generate() });
    // }

    // res.cookie(Names.refreshToken, refreshToken.hashedToken, refreshTokenCookieOptions);

    res.status(200).json({
      message: "success",
      data: {
        accessToken: "",
        user: targetUser
      }
    });
  }
});

const refreshTokenValidation = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'refreshToken is required' }),
  }),
});

export const refreshToken = Utils.Route.create({
  method: "post",
  path: '/auth/refresh-token',
  handler: async (req: Request, res: Response) => {
    const {
      cookies
    } = Utils.Route.validateRequest(refreshTokenValidation, req);

    // const targetToken = await Models.RefreshToken.findByToken(cookies[Names.refreshToken]);
    // if (!(targetToken?.user?.index)) throw new Exceptions.AppException(Enums.HTTPStatus.BAD_REQUEST, 'INVALID_REFRESH_TOKEN');

    // if (targetToken?.revoked) {
    //   res.status(Enums.HTTPStatus.BAD_REQUEST).send(Utils.Api.sendResponse({
    //     status: Enums.HTTPStatus.BAD_REQUEST,
    //     data: {
    //       message: 'refresh token is not valid'
    //     }
    //   }));
    // } else {
    //   const accessToken = Utils.JWT.generateAccessToken(targetToken.user.index, targetToken.user.role);

    //   res.status(Enums.HTTPStatus.SUCCESS).send(Utils.Api.sendResponse({
    //     status: Enums.HTTPStatus.SUCCESS,
    //     data: {
    //       accessToken
    //     }
    //   }));
    // }
  }
});

export const logout = Utils.Route.create({
  method: "post",
  path: '/auth/logout',
  handler: async (_req: Request, res: Response) => {
    res.clearCookie("refreshToken", refreshTokenCookieOptions);
    res.status(200).json({ message: "success" });
  }
});
