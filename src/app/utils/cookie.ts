import { CookieOptions, Response } from 'express';

export const setTokenCookie = (
  res: Response,
  name: string,
  token: string,
  options?: CookieOptions
) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    ...options,
  });
};

export const clearTokenCookie = (res: Response, name: string) => {
  res.clearCookie(name);
};