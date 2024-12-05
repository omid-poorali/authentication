import type * as Models from 'models';

declare global {
  type AccessTokenPayload = {
    id: string;
    role: Models.User.Role;
  };
  namespace Express {
    interface Request {
      payload: AccessTokenPayload
    }
  }

  type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Pick<Type, Key>>;

}

export { };
