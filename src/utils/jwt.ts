import jwt from 'jsonwebtoken';
import type * as Models from '@/models';
import config from "config";

const secretKey = config.get<string>('jwt.key');
const expiresIn = config.get<string>('jwt.expiresIn');

export const generateAccessToken = (id: string, role: Models.IUser["role"]) => jwt.sign({ id, role }, secretKey, { expiresIn });
export const verifyAccessToken = <T>(token: string) => jwt.verify(token, secretKey) as T;