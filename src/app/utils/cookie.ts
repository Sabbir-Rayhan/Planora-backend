import { CookieOptions, Response } from 'express';

export const setTokenCookie = (
  res: Response,
  name: string,
  token: string,
  options?: CookieOptions
) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',   // https only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ← critical for cross-origin
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    ...options,
  });
};

export const clearTokenCookie = (res: Response, name: string) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};