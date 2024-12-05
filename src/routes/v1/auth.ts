import type { CookieOptions, Request, Response } from 'express';
import { BadRequestError, ConflictError, UnauthorizedError } from '@/application';
import { z } from 'zod';
import config from "config";
import redisClient from '@/libs/redis';
import crypto from "crypto";
import * as Models from '@/models';
import * as Utils from '@/utils';

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
    };

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
    password: z.string({ required_error: 'password is required' })
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
    };

    const isPasswordCorrect = await targetUser.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new BadRequestError("username or password is wrong!");
    };

    const accessToken = Utils.JWT.generateAccessToken(targetUser.id, targetUser.role);
    const refreshToken = crypto.randomUUID();

    await redisClient.set(`users?id=${targetUser.id}`, refreshToken, { EX: 60 * 60 * 24 * 30 });

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      message: "success",
      data: {
        accessToken
      }
    });
  }
});

const refreshTokenValidation = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'refreshToken is required' }),
    accessToken: z.string({ required_error: 'accessToken is required' }),
  }),
});

export const refreshToken = Utils.Route.create({
  method: "post",
  path: '/auth/refresh-token',
  handler: async (req: Request, res: Response) => {
    const {
      cookies
    } = Utils.Route.validateRequest(refreshTokenValidation, req);

    const decoded = Utils.JWT.decodeAccessToken(cookies.accessToken) as AccessTokenPayload;

    if (!decoded) throw new UnauthorizedError("accessToken is not valid!");

    const refreshToken = await redisClient.get(`users?id=${decoded.id}`);

    if (refreshToken !== cookies.refreshToken) {
      res.clearCookie("refreshToken");
      throw new UnauthorizedError("refreshToken is not valid!");
    }

    const accessToken = Utils.JWT.generateAccessToken(decoded.id, decoded.role);

    res.status(200).json({
      message: "success",
      data: {
        accessToken
      }
    });
  }
});

export const logout = Utils.Route.create({
  method: "post",
  path: '/auth/logout',
  handler: async (_req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "success" });
  }
});
