import { Request, Response } from 'express';
import { sendResponse } from '../../shared/sendResponse.js';
import catchAsync from '../../shared/catchAsync.js';
import { clearTokenCookie, setTokenCookie } from '../../utils/cookie.js';
import { AuthService } from './auth.service.js';


const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  setTokenCookie(res, 'refreshToken', result.refreshToken);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Login successful',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  clearTokenCookie(res, 'refreshToken');

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

export const AuthController = { register, login, logout };
