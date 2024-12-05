import {
  login, logout,refreshToken, register
} from './auth';

import { getMe } from './users';

export const all = [
  register,
  login,
  refreshToken,
  logout,
  getMe
];
